defmodule Exchat.MessageChannel do
  use Phoenix.Channel
  alias Exchat.{Message, Repo, Channel}

  def join("channel:" <> _public_channel_id, _auth_msg, socket) do
    channel_id = channel_from_topic(socket.topic)
    channel = Repo.get_by Channel, id: channel_id
    count = 100
    messages = Channel.messages_before(channel, now, count + 1)
                |> Repo.all
                |> Repo.preload(:user)
                |> Enum.reverse
    resp = Exchat.MessageView.render("index.json", %{messages: messages, count: count})

    {:ok, resp, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in(event, params, socket) do
    user = Repo.get(Exchat.User, socket.assigns.user_id)
    if user do
      handle_in(event, params, user, socket)
    else
      {:reply, :error, socket}
    end
  end

  def handle_in("new_message", %{"text" => _text} = params, user, socket) do
    channel_id = channel_from_topic(socket.topic)
    channel = Repo.get_by(Exchat.Channel, id: channel_id)
    if channel do
      changeset = Message.changeset(%Message{}, message_params(params, channel, user))
      case Repo.insert(changeset) do
        {:ok, message} ->
          data = Exchat.MessageView.build("message.json", message, user: user)
          broadcast! socket, "new_message", data
          {:reply, :ok, socket}
        {:error, _changeset} ->
          {:reply, :error, socket}
      end
    else
      {:reply, :error, socket}
    end
  end

  defp channel_from_topic(topic) do
    String.replace(topic, ~r/.*:#?/, "")
  end

  defp now, do: Extime.to_timestamp(Ecto.DateTime.utc)

  defp message_params(%{"text" => text}, channel, user) do
    Map.merge(%{text: text}, %{channel_id: channel.id, user_id: user.id})
  end

end
