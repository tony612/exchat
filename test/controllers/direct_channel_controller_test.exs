defmodule Exchat.DirectChannelControllerTest do
  use Exchat.ConnCase, async: true

  alias Exchat.Channel

  setup %{conn: conn} do
    user = insert_user
    conn = conn
    |> put_req_header("accept", "application/json")
    |> assign(:current_user, user)
    {:ok, conn: conn}
  end

  test "index returns empty channels", %{conn: conn} do
    conn = get conn, channel_path(conn, :index)
    assert json_response(conn, 200) == []
  end

  test "index returns direct channels of user", %{conn: conn} do
    user = conn.assigns.current_user
    user1 = insert_user
    user2 = insert_user
    %{name: name1} = channel1 = insert_direct_channel(%{name: Channel.direct_name(user.id, user1.id)})
    %{name: name2} = channel2 = insert_direct_channel(%{name: Channel.direct_name(user.id, user2.id)})
    insert_channel_user(channel1, user)
    insert_channel_user(channel1, user1)
    insert_channel_user(channel2, user)
    insert_channel_user(channel2, user2)
    conn = get conn, direct_channel_path(conn, :index)
    result = [
      %{"id" => channel1.id, "name" => name1, "joined" => true, "user_id" => user1.id},
      %{"id" => channel2.id, "name" => name2, "joined" => true, "user_id" => user2.id}
    ]
    assert json_response(conn, 200) == result
  end

  test "create/2 creates channel for user and ther other one", %{conn: conn} do
    user = conn.assigns.current_user
    user1 = insert_user
    conn = post conn, direct_channel_path(conn, :join), user_id: user1.id
    %{id: channel_id} = Repo.one(from Channel, limit: 1)
    assert json_response(conn, 201) == %{"id" => channel_id, "name" => "#{user.id},#{user1.id}", "joined" => true, "user_id" => user1.id}
  end
end
