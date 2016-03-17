defmodule Exchat.UserReadMessageRepoTest do
  use Exchat.ModelCase

  alias Exchat.UserReadMessage

  def insert_item(attrs = %{}) do
    %UserReadMessage{}
    |> UserReadMessage.changeset(attrs)
    |> Repo.insert!
  end

  test "get latest timestamp of user for a channel" do
    channel = insert_channel
    user = insert_user
    insert_item(%{latest_ts: Extime.to_datetime(1458231490), channel_id: channel.id, user_id: user.id})
    struct = UserReadMessage.latest_ts_of(user, channel) |> Repo.one
    ts = struct.latest_ts |> Extime.to_timestamp
    assert ts == 1458231490
  end
end
