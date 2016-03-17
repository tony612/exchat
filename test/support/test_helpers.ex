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

    super_changeset = fn model, params ->
      required_fields = ~w(text channel_id user_id)a
      allowed_fields = Enum.concat [required_fields, [:inserted_at]]
      model
      |> Ecto.Changeset.cast(params, allowed_fields)
      |> Ecto.Changeset.validate_required(required_fields)
    end

    super_changeset.(%Message{}, changes) |> Repo.insert!
  end

  def insert_read_message(attrs = %{}) do
    %Exchat.UserReadMessage{}
    |> Exchat.UserReadMessage.changeset(attrs)
    |> Repo.insert!
  end

end
