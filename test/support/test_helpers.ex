defmodule Exchat.TestHelpers do
  alias Exchat.{Repo, User, Channel, Message}

  def insert_user(attrs \\ %{}) do
    changes = Map.merge(%{
      email: "tony@ex.chat",
      password: "password"
    }, attrs)

    %User{}
    |> User.changeset(changes)
    |> Repo.insert!
  end

  def insert_channel(attrs \\ %{}) do
    changes = Map.merge(%{
      name: "general"
    }, attrs)

    %Channel{}
    |> Channel.changeset(changes)
    |> Repo.insert!
  end

  def insert_message(attrs \\ %{}) do
    changes = Map.merge(%{
      text: "Hello, Exchat!"
    }, attrs)

    %Message{}
    |> Message.changeset(changes)
    |> Repo.insert!
  end

  def insert_read_message(attrs = %{}) do
    %Exchat.UserReadMessage{}
    |> Exchat.UserReadMessage.changeset(attrs)
    |> Repo.insert!
  end

end
