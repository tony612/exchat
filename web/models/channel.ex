defmodule Exchat.Channel do
  use Exchat.Web, :model

  alias Exchat.Message

  schema "channels" do
    field :name, :string
    has_many :messages, Message

    timestamps usec: true
  end

  @required_fields ~w(name)a
  @allowed_fields @required_fields

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
  end

  def messages_before(model, ts, limit \\ 100) do
    time = Extime.to_datetime(ts)
    from m in Message,
      where: m.channel_id == ^model.id and m.inserted_at < ^time,
      limit: ^limit,
      order_by: [desc: m.inserted_at]
  end
end
