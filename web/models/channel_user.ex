defmodule Exchat.ChannelUser do
  use Exchat.Web, :model

  schema "channels_users" do
    field :joined_at, Ecto.DateTime
    belongs_to :channel, Exchat.Channel
    belongs_to :user, Exchat.User

    timestamps
  end

  @required_fields ~w(joined_at channel_id user_id)
  @optional_fields ~w()

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
