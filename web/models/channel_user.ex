defmodule Exchat.ChannelUser do
  use Exchat.Web, :model

  schema "channels_users" do
    field :joined_at, :naive_datetime
    belongs_to :channel, Exchat.Channel
    belongs_to :user, Exchat.User

    timestamps()
  end

  @allowed_fields ~w(joined_at channel_id user_id)a
  @required_fields ~w(channel_id user_id)a

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
  end
end
