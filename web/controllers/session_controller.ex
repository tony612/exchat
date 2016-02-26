defmodule Exchat.SessionController do
  use Exchat.Web, :controller

  alias Exchat.ApiAuth

  def create(conn, %{"email" => email, "password" => password}) do
    case ApiAuth.login_by_email_pass(conn, email, password, repo: Repo) do
      {:ok, conn} ->
        render(conn, token: conn.assigns[:auth_token])
      {:error, _reason, conn} ->
        conn
        |> put_status(:unauthorized)
        |> render(ErrorView, :error, message: "Invalid email or password!")
    end

  end
end
