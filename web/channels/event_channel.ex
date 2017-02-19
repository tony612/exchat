defmodule Exchat.EventChannel do
  use Exchat.Web, :channel
  alias Exchat.UserPresence

  def join("event:general", _payload, socket) do
    send(self(), :after_join_general)
    {:ok, socket}
  end
  def join("event:general:" <> user_id, _payload, socket) do
    if socket.assigns.user.id == String.to_integer(user_id) do
      {:ok, socket}
    else
      {:error, %{reason: "Unauthorized!"}}
    end
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "Wrong topic!"}}
  end

  def handle_info(:after_join_general, socket) do
    push socket, "presence_state", UserPresence.list(socket)
    {:ok, _} = UserPresence.track(socket, to_string(socket.assigns.user.id), %{
      online_at: inspect(System.system_time(:seconds))
    })
    {:noreply, socket}
  end

  def push_out(topic, payload) do
    Exchat.Endpoint.broadcast("event:general", topic, payload)
  end
  def push_out(user_id, topic, payload) do
    Exchat.Endpoint.broadcast("event:general:#{user_id}", topic, payload)
  end
end
