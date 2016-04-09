defmodule Exchat.ChannelControllerTest do
  use Exchat.ConnCase

  alias Exchat.{Channel, User, UserReadMessage}
  @valid_attrs %{name: "general"}
  @invalid_attrs %{}

  setup do
    {:ok, user} = Repo.insert(%User{email: "tony@ex.chat", password: "password"})
    conn = conn
    |> put_req_header("accept", "application/json")
    |> assign(:current_user, user)
    {:ok, conn: conn}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, channel_path(conn, :index)
    assert json_response(conn, 200) == []
  end

  test "creates and renders resource with ChannelUser and UserReadMessage when data is valid", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @valid_attrs
    assert json_response(conn, 201)["id"]
    %{id: channel_id} = channel = Repo.one(from Channel, where: [name: "general"], preload: :users)
    assert channel
    assert [%User{email: "tony@ex.chat"}] = channel.users
    read = Repo.one(from UserReadMessage, limit: 1)
    user_id = conn.assigns.current_user.id
    assert %{user_id: ^user_id, channel_id: ^channel_id} = read
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, channel_path(conn, :create), channel: @invalid_attrs
    assert json_response(conn, 400)["errors"] != %{}
  end
end
