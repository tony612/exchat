defmodule Exchat.MessageChannel do
  use Phoenix.Channel

  def join("channel:#" <> public_channel_id, auth_msg, socket) do
    {:ok, socket}
  end
  def join("channel:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", %{"text" => text}, socket) do
    message = %{
      text: text,
      channel: channel_from_topic(socket.topic),
      ts: Float.to_string(unix_timestamp, decimals: 6)
    }
    broadcast! socket, "new_message", message
    {:noreply, socket}
  end

  def handle_out("new_message", payload, socket) do
    push socket, "new_message", payload
    {:noreply, socket}
  end

  defp channel_from_topic(topic) do
    String.replace(topic, ~r/.*:#?/, "")
  end

  def unix_timestamp do
    {megasec, sec, microsec} = :os.timestamp
    megasec * 1_000_000 + sec + microsec * 0.000_001
  end

end
