defmodule Exchat.UserController do
  use Exchat.Web, :controller

  alias Exchat.User

  def create(conn, params = %{"email" => email, "password" => _}) do
    changeset = User.changeset(%User{}, params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn = Exchat.ApiAuth.login(conn, user)
        render(conn, Exchat.SessionView, :create, token: conn.assigns[:auth_token], user: user)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :error, changeset: changeset)
    end

  end

end
