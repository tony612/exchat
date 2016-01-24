defmodule Exchat.ApiAuthTest do
  use Exchat.ConnCase

  alias Exchat.{ApiAuth, User}

  setup do
    {:ok, conn: conn}
  end

  test "login/2 assigns :current_user and :auth_token to conn", %{conn: conn} do
    user = %User{id: 1}
    conn = ApiAuth.login(conn, user)
    assert user == conn.assigns[:current_user]
    assert conn.assigns[:auth_token]
  end

  test "generate_token/1 generate a token" do
    user = %User{id: 1}
    token = ApiAuth.generate_token(user)
    parsed = ApiAuth.parse_token(token)
    assert %{"exp" => _exp, "user_id" => 1} = parsed.claims
  end

  test "generate_token/2 uses custom expires" do
    user = %User{id: 1}
    token = ApiAuth.generate_token(user, 1453644008)
    assert token == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE0NTM2NDQwMDh9" <>
                      ".98ZXWW3UQ6CeuYi9YSzJI3orKB5b96-gFelCJ2c-TG0"
    parsed = ApiAuth.parse_token(token)
    assert %{"exp" => 1453644008, "user_id" => 1} = parsed.claims
  end

  test "generate_token/3 uses custom secret" do
    user = %User{id: 1}
    token1 = ApiAuth.generate_token(user, 1453644008)
    token2 = ApiAuth.generate_token(user, 1453644008, "secret")
    refute token1 == token2
    assert token2 == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE0NTM2NDQwMDh9" <>
                      ".tgQpy-MImnAR0-UyaRPeAGqRjVBM721ZSLyKbikTrJQ"
  end

  test "login_by_email_pass/4 return :ok for right email and password pair", %{conn: conn} do
    Repo.insert!(User.changeset(%User{}, %{email: "tony@ex.chat", password: "password"}))
    assert {:ok, _} = ApiAuth.login_by_email_pass(conn, "tony@ex.chat", "password", repo: Repo)
  end

end
