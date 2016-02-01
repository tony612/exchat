defmodule Exchat.Message do
  use Exchat.Web, :model

  schema "messages" do
    field :text, :string
    belongs_to :channel, Exchat.Channel
    belongs_to :user, Exchat.User

    timestamps usec: true
  end

  @required_fields ~w(text channel_id user_id)
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
    model.inserted_at |> to_timestamp
  end

  @doc """
  Examples

    iex> Exchat.Message.to_timestamp(%Ecto.DateTime{year: 2015, month: 11, day: 7, hour: 16, min: 13, sec: 19, usec: 321})
    1446912799.000321
  """
  def to_timestamp(datetime) do
    datetime
    |> Ecto.DateTime.to_erl
    |> :calendar.datetime_to_gregorian_seconds
    |> -(@epoch)
    |> +(datetime.usec / 1_000_000)
  end

  @doc """
  Examples

    iex> Exchat.Message.to_datetime(1446912799.000321)
    %Ecto.DateTime{year: 2015, month: 11, day: 7, hour: 16, min: 13, sec: 19, usec: 321}
  """
  def to_datetime(timestamp) do
    datetime = timestamp
                |> +(@epoch)
                |> trunc
                |> :calendar.gregorian_seconds_to_datetime
                |> Ecto.DateTime.from_erl
    %Ecto.DateTime{datetime | usec: get_usec(timestamp)}
  end

  defp get_usec(timestamp) do
    timestamp * 1000_000 |> trunc |> rem(1000000)
  end
end
