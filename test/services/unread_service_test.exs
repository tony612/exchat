defmodule Exchat.UnreadServiceTest do
  use Exchat.ModelCase

  alias Exchat.{UnreadService, UserReadMessage}

  test "unread_count/2 works for channel and latest_ts" do
    channel = insert_channel
    user = insert_user
    assert UnreadService.unread_count(user, channel) == 0

    insert_message(%{channel_id: channel.id, user_id: user.id, inserted_at: 1458231490})
    insert_message(%{channel_id: channel.id, user_id: user.id, inserted_at: 1458231491})
    insert_read_message(%{latest_ts: Extime.to_datetime(1458231489), channel_id: channel.id, user_id: user.id})
    assert UnreadService.unread_count(user, channel) == 2
  end
end
