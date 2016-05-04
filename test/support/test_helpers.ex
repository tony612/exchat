defmodule Exchat.TestHelpers do
  alias Exchat.{Repo, User, Channel, Message, ChannelUser}

  def insert_user(attrs \\ %{}) do
    changes = Map.merge(%{
      email: "user#{System.unique_integer([:positive])}@ex.chat",
      password: "password"
    }, attrs)

    %User{}
    |> User.changeset(changes)
    |> Repo.insert!
  end

  def insert_channel(attrs \\ %{}) do
    changes = Map.merge(%{
      name: "channel-#{System.unique_integer([:positive])}"
    }, attrs)

    %Channel{}
    |> Channel.public_changeset(changes)
    |> Repo.insert!
  end

  def insert_direct_channel(attrs \\ %{}) do
    changes = Map.merge(%{
      name: "#{System.unique_integer([:positive])},#{System.unique_integer([:positive])}"
    }, attrs)

    %Channel{}
    |> Channel.direct_changeset(changes)
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

  def insert_channel_user(channel, user, joined_at \\ Exchat.Time.now_datetime) do
    Repo.insert!(%ChannelUser{channel_id: channel.id, user_id: user.id, joined_at: joined_at})
  end

end
