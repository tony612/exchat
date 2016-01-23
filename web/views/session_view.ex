defmodule Exchat.SessionView do
  use Exchat.Web, :view

  def render("create.json", %{token: token}) do
    %{token: token}
  end
end
