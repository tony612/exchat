defmodule Exchat.Time do
  epoch = {{1970, 1, 1}, {0, 0, 0}}
  @epoch :calendar.datetime_to_gregorian_seconds(epoch)

  @doc """
  Examples

    iex> Exchat.Time.to_timestamp(%Ecto.DateTime{year: 2015, month: 11, day: 7, hour: 16, min: 13, sec: 19, usec: 321})
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

    iex> Exchat.Time.to_datetime(1446912799.000321)
    %Ecto.DateTime{year: 2015, month: 11, day: 7, hour: 16, min: 13, sec: 19, usec: 321}

    iex> Exchat.Time.to_datetime("1446912799.000321")
    %Ecto.DateTime{year: 2015, month: 11, day: 7, hour: 16, min: 13, sec: 19, usec: 321}
  """
  def to_datetime(timestamp) when is_binary(timestamp) do
    {timestamp, _} = Float.parse(timestamp)
    to_datetime(timestamp)
  end
  def to_datetime(timestamp) when is_number(timestamp) do
    datetime = timestamp
                |> +(@epoch)
                |> trunc
                |> :calendar.gregorian_seconds_to_datetime
                |> Ecto.DateTime.from_erl
    %Ecto.DateTime{datetime | usec: get_usec(timestamp)}
  end

  def now_ts do
    {megasec, sec, microsec} = :os.timestamp
    megasec * 1_000_000 + sec + microsec * 0.000_001
  end

  def now_datetime do
    now_ts |> to_datetime
  end

  defp get_usec(timestamp) do
    timestamp * 1000_000 |> trunc |> rem(1000000)
  end
end
