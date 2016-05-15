defmodule Exchat.MessageChannel do
  use Exchat.Web, :channel
  alias Exchat.{Message, Repo, Channel, MessageService, UnreadService, UserPresence}

  @default_history_count 100
  @default_channel_name "general"

  def join("channel:" <> _channel_id, _auth_msg, socket) do
    channel = channel_from_topic(socket.topic)
    messages = MessageService.load_messages(channel, Extime.now_ts) |> Repo.preload(:user)
    unread_count = UnreadService.unread_count(socket.assigns.user, channel)

    resp = Exchat.MessageView.render("index.json", %{messages: messages, count: @default_history_count})
            |> Map.put(:unread_count, unread_count)

    if channel.name == @default_channel_name, do: send(self, :after_join)

    {:ok, resp, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in(event, params, socket) do
    user = socket.assigns.user
    if user do
      handle_in(event, params, user, socket)
    else
      {:reply, :error, socket}
    end
  end

  def handle_in("new_message", %{"text" => _text} = params, user, socket) do
    channel = channel_from_topic(socket.topic)
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

  def handle_info(:after_join, socket) do
    push socket, "presence_state", UserPresence.list(socket)
    {:ok, _} = UserPresence.track(socket, to_string(socket.assigns.user.id), %{
      online_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end

  defp channel_from_topic(topic) do
    channel_id = String.replace(topic, ~r/.*:#?/, "")
    Repo.get_by Channel, id: channel_id
  end

  defp message_params(%{"text" => text}, channel, user) do
    Map.merge(%{text: text}, %{channel_id: channel.id, user_id: user.id})
  end

end
