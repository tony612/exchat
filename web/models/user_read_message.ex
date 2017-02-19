defmodule Exchat.UserReadMessage do
  use Exchat.Web, :model

  schema "user_read_messages" do
    field :message_id, :integer
    field :latest_ts, :naive_datetime
    belongs_to :user, Exchat.User
    belongs_to :channel, Exchat.Channel

    timestamps()
  end

  @required_fields ~w(latest_ts channel_id user_id)a
  @optional_fields ~w(message_id)a
  @allowed_fields Enum.concat([@required_fields, @optional_fields])

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
  end

  def latest_ts_of(user, channel) do
    from __MODULE__, where: [user_id: ^user.id, channel_id: ^channel.id], select: [:latest_ts]
  end
end
