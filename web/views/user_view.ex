defmodule Exchat.UserView do
  use Exchat.Web, :view

  alias Exchat.User

  def render("index.json", %{users: users}) do
    Enum.map(users, fn user ->
      render(__MODULE__, "user.json", user: user)
    end)
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      username: User.username(user),
      email: user.email}
  end
end
