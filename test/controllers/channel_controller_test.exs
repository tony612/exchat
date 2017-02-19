defmodule Exchat.ChannelControllerTest do
  use Exchat.ConnCase, async: true

  alias Exchat.{Channel, User, UserReadMessage}
  @channel_name "channel-#{System.unique_integer([:positive])}"
  @valid_attrs %{name: @channel_name}
  @invalid_attrs %{}

  setup %{conn: conn} do
    user = insert_user()
    conn = conn
    |> assign(:current_user, user)
    {:ok, conn: conn}
  end

  test "index/2 returns empty channels", %{conn: conn} do
    conn = get conn, channel_path(conn, :index)
    assert json_response(conn, 200) == []
  end

  test "index/2 returns channels of user", %{conn: conn} do
    channel1 = insert_channel(%{name: "foo"})
    channel2 = insert_channel(%{name: "bar"})
    insert_channel_user(channel1, conn.assigns.current_user)
    conn = get conn, channel_path(conn, :index)
    result = [
      %{"id" => channel1.id, "name" => "foo", "joined" => true},
      %{"id" => channel2.id, "name" => "bar", "joined" => false}
    ]
    assert json_response(conn, 200) == result
  end

  test "create/2 creates channel and render right data when data is valid", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @valid_attrs
    %{id: channel_id} = Repo.one(from Channel, where: [name: @channel_name])
    assert json_response(conn, 201) == %{"id" => channel_id, "name" => @channel_name, "joined" => true}
  end

  test "create/2 creates ChannelUser", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @valid_attrs
    channel = Repo.one(from Channel, where: [name: @channel_name], preload: :users)
    user_email = conn.assigns.current_user.email
    assert [%User{email: ^user_email}] = channel.users
  end

  test "create/2 creates UserReadMessage", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @valid_attrs
    %{id: channel_id} = Repo.one(from Channel, where: [name: @channel_name])
    read = Repo.one(from UserReadMessage, limit: 1)
    user_id = conn.assigns.current_user.id
    assert %{user_id: ^user_id, channel_id: ^channel_id} = read
  end

  test "create/2 broadcasts to channel_created topic", %{conn: conn} do
    Exchat.Endpoint.subscribe("event:general")
    post conn, channel_path(conn, :create), channel: @valid_attrs
    %{id: channel_id} = Repo.one(from Channel, where: [name: @channel_name])
    assert_broadcast "channel_created", %{id: ^channel_id, joined: false, name: @channel_name}
  end

  test "create/2 does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @invalid_attrs
    assert json_response(conn, 400)["errors"] != %{}
  end
end
