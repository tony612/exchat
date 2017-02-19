defmodule Exchat.UserControllerTest do
  use Exchat.ConnCase, async: true

  alias Exchat.User

  setup tags = %{conn: conn} do
    conn = if tags[:noauth], do: conn, else: assign(conn, :current_user, %User{id: 42})
    {:ok, conn: conn}
  end

  @tag noauth: false
  test "create/2 inserts user", %{conn: conn} do
    conn = post conn, user_path(conn, :create), email: "new@example.com", password: "password"
    assert Repo.get_by(User, email: "new@example.com")
    assert %{"token" => _token} = json_response(conn, 200)
    assert %{email: "new@example.com"} = conn.assigns.current_user
  end

  @tag noauth: false
  test "create/2 set token in returning data", %{conn: conn} do
    conn = post conn, user_path(conn, :create), email: "new@example.com", password: "password"
    assert %{"token" => _token} = json_response(conn, 200)
  end

  @tag noauth: false
  test "create/2 broadcasts event", %{conn: conn} do
    Exchat.Endpoint.subscribe("event:general")
    conn = post conn, user_path(conn, :create), email: "new@example.com", password: "password"
    %{id: user_id} = conn.assigns.current_user
    assert_broadcast("user_created", %{id: ^user_id, email: "new@example.com", username: "new"})
  end

  test "index/2 returns empty users", %{conn: conn} do
    conn = get conn, user_path(conn, :index)
    assert json_response(conn, 200) == []
  end

  test "index/2 returns users of user", %{conn: conn} do
    %{id: id1} = insert_user()
    %{id: id2} = insert_user()
    conn = get conn, user_path(conn, :index)
    assert [%{"id" => ^id1}, %{"id" => ^id2}] = json_response(conn, 200)
  end

end
