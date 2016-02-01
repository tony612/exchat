defmodule Exchat.TestHelpers do
  alias Exchat.{Repo, User}

  def insert_user(attrs \\ %{}) do
    changes = Map.merge(%{
      email: "tony@ex.chat",
      password: "password"
    }, attrs)

    %User{}
    |> User.changeset(changes)
    |> Repo.insert!
  end
end
