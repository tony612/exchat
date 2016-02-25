defmodule Exchat.SessionView do
  use Exchat.Web, :view

  def render("create.json", %{token: token, user: user}) do
    %{token: token,
      user: %{id: user.id, email: user.email, username: Exchat.User.username(user)}}
  end
end
