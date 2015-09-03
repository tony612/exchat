defmodule Exchat.MessageChannel do
  use Phoenix.Channel

  def join("channel:#random", auth_msg, socket) do
    {:ok, socket}
  end
  def join("channel:" <> _private_room_id, _auth_msg, socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", %{"body" => body}, socket) do
    broadcast! socket, "new_message", %{body: body}
    {:noreply, socket}
  end

  def handle_out("new_message", payload, socket) do
    push socket, "new_message", payload
    {:noreply, socket}
  end

end
