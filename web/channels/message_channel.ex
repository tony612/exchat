defmodule Exchat.MessageChannel do
  use Phoenix.Channel
  alias Exchat.Message
  alias Exchat.Repo
  alias Exchat.Channel

  def join("channel:" <> _public_channel_id, _auth_msg, socket) do
    channel_id = channel_from_topic(socket.topic)
    channel = Repo.get_by Channel, id: channel_id
    messages = Channel.messages_before(channel, now) |> Repo.all
    resp = %{messages: Phoenix.View.render_many(messages, Exchat.MessageView, "message.json")}

    {:ok, resp, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", %{"text" => _text} = params, socket) do
    channel_id = channel_from_topic(socket.topic)
    channel = Repo.get_by(Exchat.Channel, id: channel_id)
    if channel do
      changeset = Message.changeset(%Message{}, Dict.put(params, "channel_id", channel.id))
      case Repo.insert(changeset) do
        {:ok, message} ->
          data = %{
            text: message.text,
            channelId: channel_id,
            ts: Message.ts(message)
          }
          broadcast! socket, "new_message", data
          {:noreply, socket}
        {:error, _changeset} ->
          {:reply, :error, socket}
      end
    else
      {:reply, :error, socket}
    end
  end

  def unix_timestamp do
    {megasec, sec, microsec} = :os.timestamp
    megasec * 1_000_000 + sec + microsec * 0.000_001
  end

  defp channel_from_topic(topic) do
    String.replace(topic, ~r/.*:#?/, "")
  end

  defp now, do: Message.to_timestamp(Ecto.DateTime.utc)

end
