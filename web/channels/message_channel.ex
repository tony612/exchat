defmodule Exchat.MessageChannel do
  use Phoenix.Channel
  alias Exchat.Message
  alias Exchat.Repo

  def join("channel:" <> _public_channel_id, _auth_msg, socket) do
    {:ok, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", %{"text" => _text} = params, socket) do
    channel_id = channel_from_topic(socket.topic)
    IO.inspect channel_id
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

  defp channel_from_topic(topic) do
    String.replace(topic, ~r/.*:#?/, "")
  end

  def unix_timestamp do
    {megasec, sec, microsec} = :os.timestamp
    megasec * 1_000_000 + sec + microsec * 0.000_001
  end

end
