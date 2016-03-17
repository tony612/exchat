defmodule Exchat.Message do
  use Exchat.Web, :model

  schema "messages" do
    field :text, :string
    belongs_to :channel, Exchat.Channel
    belongs_to :user, Exchat.User

    timestamps usec: true
  end

  @required_fields ~w(text channel_id user_id)a
  @allowed_fields @required_fields

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
  end

  def ts(model) do
    model.inserted_at |> Extime.to_timestamp
  end
end
