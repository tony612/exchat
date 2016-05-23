defmodule Exchat.EventChannelTest do
  use Exchat.ChannelCase

  alias Exchat.{EventChannel, User}

  setup do
    {:ok, _, socket} =
      socket("user_id", %{user: %User{id: 42}})
      |> subscribe_and_join(EventChannel, "event:general")

    {:ok, socket: socket}
  end

  test "broadcasts are pushed to the client", %{socket: socket} do
    broadcast_from! socket, "broadcast", %{"some" => "data"}
    assert_push "broadcast", %{"some" => "data"}
  end
end
