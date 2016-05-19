defmodule Exchat.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "channel:*", Exchat.MessageChannel
  channel "event:*", Exchat.EventChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket) do
    case Exchat.ApiAuth.parse_token(token) |> Joken.verify! do
      {:ok, %{"user_id" => user_id}} ->
        connect(user_id, socket)
      {:error, _reason} ->
        :error
    end
  end
  def connect(user_id, socket) when is_integer(user_id) do
    case Exchat.Repo.get(Exchat.User, user_id) do
      nil  -> :error
      user -> {:ok, assign(socket, :user, user)}
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "users_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     Exchat.Endpoint.broadcast("users_socket:" <> user.id, "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(socket), do: "user_socket:#{socket.assigns.user.id}"
end
