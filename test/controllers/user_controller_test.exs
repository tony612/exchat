defmodule Exchat.UserControllerTest do
  use Exchat.ConnCase, async: true

  setup do
    user = insert_user
    conn = conn
    |> put_req_header("accept", "application/json")
    |> assign(:current_user, user)
    {:ok, conn: conn}
  end

  test "index returns empty users", %{conn: conn} do
    conn = get conn, user_path(conn, :index)
    assert json_response(conn, 200) == []
  end

  test "index returns users of user", %{conn: conn} do
    %{id: id1} = insert_user
    %{id: id2} = insert_user
    conn = get conn, user_path(conn, :index)
    assert [%{"id" => ^id1}, %{"id" => ^id2}] = json_response(conn, 200)
  end

end
