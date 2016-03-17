defmodule Exchat.UnreadService do
  use Exchat.Web, :service

  alias Exchat.{Channel, UserReadMessage}

  def unread_count(user, channel) do
    latest_read_time = fetch_latest_time(user, channel)
    if latest_read_time do
      Channel.messages_count_after(channel, latest_read_time) |> Repo.one
    else
      # to prevent no UserReadMessage created for user and channel
      0
    end
  end

  defp fetch_latest_time(user, channel) do
    struct = UserReadMessage.latest_ts_of(user, channel) |> Repo.one
    if struct, do: struct.latest_ts
  end

end
