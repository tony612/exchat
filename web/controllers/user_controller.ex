defmodule Exchat.UserController do
  use Exchat.Web, :controller

  alias Exchat.User

  def create(conn, params = %{"email" => _, "password" => _}) do
    changeset = User.changeset(%User{}, params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        notify_user_created(user)
        Exchat.ChannelUserService.join_default_channels(user)
        conn = Exchat.ApiAuth.login(conn, user)
        render(conn, Exchat.SessionView, :create, token: conn.assigns[:auth_token])
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end

  def index(conn, %{}) do
    current_id = conn.assigns.current_user.id
    users = Repo.all(from u in User, where: u.id != ^current_id)
    render conn, "index.json", users: users
  end

  defp notify_user_created(user) do
    payload = Exchat.UserView.render "user.json", user: user
    EventChannel.push_out "user_created", payload
  end

end
