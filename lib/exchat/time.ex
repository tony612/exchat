defmodule Exchat.Time do
  @second_ms 1_000_000

  @doc """
  Examples

    iex> Exchat.Time.to_timestamp(%DateTime{calendar: Calendar.ISO, day: 7, hour: 16, microsecond: {321, 6}, minute: 13, month: 11, second: 19, std_offset: 0, time_zone: "Etc/UTC", utc_offset: 0, year: 2015, zone_abbr: "UTC"})
    1446912799.000321
  """
  def to_timestamp(%{__struct__: NaiveDateTime} = datetime) do
    to_timestamp(DateTime.from_naive!(datetime, "Etc/UTC"))
  end
  def to_timestamp(%{__struct__: DateTime} = datetime) do
    ms = DateTime.to_unix(datetime, :microsecond)
    ms / @second_ms
  end

  @doc """
  Examples

    iex> Exchat.Time.to_datetime(1446912799.000321)
    %DateTime{calendar: Calendar.ISO, day: 7, hour: 16, microsecond: {321, 6},
    minute: 13, month: 11, second: 19, std_offset: 0, time_zone: "Etc/UTC",
    utc_offset: 0, year: 2015, zone_abbr: "UTC"}

    iex> Exchat.Time.to_datetime(1446912799)
    %DateTime{calendar: Calendar.ISO, day: 7, hour: 16, microsecond: {0, 0},
    minute: 13, month: 11, second: 19, std_offset: 0, time_zone: "Etc/UTC",
    utc_offset: 0, year: 2015, zone_abbr: "UTC"}
  """
  def to_datetime(timestamp) when is_binary(timestamp) do
    {timestamp, _} = Float.parse(timestamp)
    to_datetime(timestamp)
  end
  def to_datetime(timestamp) when is_integer(timestamp) do
    DateTime.from_unix!(timestamp)
  end
  def to_datetime(timestamp) when is_float(timestamp) do
    DateTime.from_unix!(round(timestamp * @second_ms), :microsecond)
  end

  # iex> Exchat.Time.to_naive_datetime(1446912799.000321)
  # ~N[2015-11-07 16:13:19.000321]
  def to_naive_datetime(timestamp) do
    timestamp
    |> to_datetime
    |> DateTime.to_naive
  end

  def now_ts do
    System.system_time(:seconds)
  end

  def now_datetime do
    now_ts() |> to_datetime
  end
end
