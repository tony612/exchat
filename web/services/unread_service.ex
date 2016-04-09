defmodule Exchat.UnreadService do
  use Exchat.Web, :service

  alias Exchat.{Channel, UserReadMessage, Message}

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

  def mark_read(user, channel, ts) do
    time = Extime.to_datetime(ts)
    message = Repo.one(from Message, where: [inserted_at: ^time])

    read_message = case Repo.get_by(UserReadMessage, user_id: user.id, channel_id: channel.id) do
      nil -> %UserReadMessage{user_id: user.id, channel_id: channel.id}
      user_read_message -> user_read_message
    end
    if !read_message.id || ts > Extime.to_timestamp(read_message.latest_ts) do
      read_message
      |> UserReadMessage.changeset(%{latest_ts: time, message_id: message.id})
      |> Repo.insert_or_update
    else
      {:error, "You've read the message"}
    end
  end

end
