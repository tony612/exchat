defmodule Exchat.MessageChannel do
  use Phoenix.Channel
  alias Exchat.Message
  alias Exchat.Repo

  def join("channel:#" <> public_channel_id, auth_msg, socket) do
    {:ok, socket}
  end
  def join("channel:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", %{"text" => text} = params, socket) do
    channel_name = channel_from_topic(socket.topic)
    channel = Repo.get_by(Exchat.Channel, name: channel_name)
    if channel do
      changeset = Message.changeset(%Message{}, Dict.put(params, "channel_id", channel.id))
      IO.puts changeset
      case Repo.insert(changeset) do
        {:ok, message} ->
          data = %{
            text: message.text,
            channel: channel_name,
            ts: Message.ts(message)
          }
          broadcast! socket, "new_message", data
          {:noreply, socket}
        {:error, changeset} ->
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
