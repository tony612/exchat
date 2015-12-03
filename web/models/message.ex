defmodule Exchat.Message do
  use Exchat.Web, :model

  schema "messages" do
    field :text, :string
    belongs_to :channel, Exchat.Channel

    timestamps
  end

  @required_fields ~w(text channel_id)
  @optional_fields ~w()

  epoch = {{1970, 1, 1}, {0, 0, 0}}
  @epoch :calendar.datetime_to_gregorian_seconds(epoch)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def ts(model) do
    model.inserted_at |> Ecto.DateTime.to_iso8601
  end

  @doc """
  Examples

    iex> Exchat.Message.to_timestamp(Ecto.DateTime.from_erl({{2015, 11, 7}, {16, 13, 19}}))
    1446912799
  """
  def to_timestamp(datetime) do
    datetime
    |> Ecto.DateTime.to_erl
    |> :calendar.datetime_to_gregorian_seconds
    |> -(@epoch)
  end

  @doc """
  Examples

    iex> Exchat.Message.to_datetime(1446912799)
    Ecto.DateTime.from_erl({{2015, 11, 7}, {16, 13, 19}})
  """
  def to_datetime(timestamp) do
    timestamp
    |> +(@epoch)
    |> :calendar.gregorian_seconds_to_datetime
    |> Ecto.DateTime.from_erl
  end
end
