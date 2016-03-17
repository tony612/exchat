defmodule Exchat.UnreadService do
  use Exchat.Web, :service

  alias Exchat.{Channel, UserReadMessage}

  def unread_count(channel, latest_read_ts) when is_integer(latest_read_ts) do
    Channel.messages_count_after(channel, latest_read_ts) |> Repo.one
  end
  def unread_count(user, channel) do
    latest_ts = fetch_latest_ts(user, channel)
    if latest_ts, do: unread_count(channel, latest_ts), else: 0
  end

  defp fetch_latest_ts(user, channel) do
    struct = UserReadMessage.latest_ts_of(user, channel) |> Repo.one
    if struct, do: Extime.to_timestamp(struct.latest_ts)
  end

end
