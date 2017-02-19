defmodule Exchat.ApiAuthTest do
  use Exchat.ConnCase, async: true

  alias Exchat.{ApiAuth, User}

  test "login/2 assigns :current_user and :auth_token to conn", %{conn: conn} do
    user = %User{id: 1, email: "tony@e.x"}
    conn = ApiAuth.login(conn, user)
    assert user == conn.assigns[:current_user]
    assert conn.assigns[:auth_token]
  end

  test "generate_token_from_user/1 generate a token" do
    user = %User{id: 1, email: "tony@e.x"}
    token = ApiAuth.generate_token_from_user(user)
    parsed = ApiAuth.parse_token(token) |> Joken.verify
    assert %{"exp" => _exp, "user_id" => 1} = parsed.claims
  end

  test "generate_token_from_user/2 uses custom expires" do
    user = %User{id: 1, email: "tony@e.x"}
    token = ApiAuth.generate_token_from_user(user, fn -> 1453644008 end)
    assert token == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRvbnkiLCJleHAiOjE0NTM2NDQwMDh9" <>
                      ".Am9JyXCj2o23hnWsO3zLlOshlDI8k5yeW2JPTUCheBw"
    parsed = ApiAuth.parse_token(token) |> Joken.verify
    assert %{"exp" => 1453644008, "user_id" => 1} = parsed.claims
  end

  test "generate_token_from_user/3 uses custom secret" do
    user = %User{id: 1, email: "tony@e.x"}
    token1 = ApiAuth.generate_token_from_user(user, fn -> 1453644008 end)
    token2 = ApiAuth.generate_token_from_user(user, fn -> 1453644008 end, "secret")
    refute token1 == token2
    assert token2 == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InRvbnkiLCJleHAiOjE0NTM2NDQwMDh9" <>
                      ".Hy-Ux5ZY1q76lCxLD9LCexEr9TQUNDKFbjfNZ5nuXkY"
  end

  test "login_by_email_pass/4 return :ok for right email and password pair", %{conn: conn} do
    %{email: email} = insert_user(%{password: "password"})
    assert {:ok, _} = ApiAuth.login_by_email_pass(conn, email, "password", repo: Repo)
  end

  test "parse_token/2 can parse token in header" do
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE0NTM2NDQwMDh9" <>
                      ".98ZXWW3UQ6CeuYi9YSzJI3orKB5b96-gFelCJ2c-TG0"
    parsed = ApiAuth.parse_token(token) |> Joken.verify
    assert %{"exp" => 1453644008, "user_id" => 1} = parsed.claims
  end

  test "call/2 returns conn when current_user is set", %{conn: conn} do
    conn = conn
            |> assign(:current_user, "fake_user")
            |> ApiAuth.call("repo")
    assert conn.assigns.current_user == "fake_user"
  end

  test "call/2 set current_user from token in header", %{conn: conn} do
    user = %User{id: user_id} = insert_user()
    token = ApiAuth.generate_token_from_user(user)
    conn = conn
            |> put_req_header("authorization", token)
            |> ApiAuth.call(Repo)
    assert %User{id: ^user_id} = conn.assigns.current_user
  end

  @tag capture_log: true
  test "call/2 not set current_user from expired token in header", %{conn: conn} do
    user = insert_user()
    token = ApiAuth.generate_token_from_user(user, fn -> 1453644008 end)
    conn = conn
            |> put_req_header("authorization", token)
            |> ApiAuth.call(Repo)
    assert conn.assigns.current_user == nil
  end

  test "call/2 set current_user to nil when no header", %{conn: conn} do
    conn = conn |> ApiAuth.call(Repo)
    assert conn.assigns.current_user == nil
  end

  @tag capture_log: true
  test "call/2 set current_user to nil when token is bad", %{conn: conn} do
    conn = conn
            |> put_req_header("authorization", "test.token")
            |> ApiAuth.call(Repo)
    assert conn.assigns.current_user == nil
  end

  test "call/2 set current_user to nil when no user_id in token", %{conn: conn} do
    token = ApiAuth.generate_token(%{id: 1}, :os.system_time(:seconds) + 100, "super_secret")
    conn = conn
            |> put_req_header("authorization", token)
            |> ApiAuth.call(Repo)
    assert conn.assigns.current_user == nil
  end

  test "call/2 set current_user to nil when user_id is wrong in token", %{conn: conn} do
    user = insert_user()
    token = ApiAuth.generate_token_from_user(%User{id: user.id + 1, email: "tony@e.x"})
    conn = conn
            |> put_req_header("authorization", token)
            |> ApiAuth.call(Repo)
    assert conn.assigns.current_user == nil
  end

end
