defmodule Exchat.ChannelUserServiceTest do
  use Exchat.ModelCase, async: true

  alias Exchat.{ChannelUserService, ChannelUser, UserReadMessage, Channel}

  test "joined_channels_status/1 returns joined channels as bool hash" do
    channel1 = insert_channel(%{name: "foo"})
    insert_channel(%{name: "bar"})
    user = insert_user
    insert_channel_user(channel1, user)
    assert ChannelUserService.joined_channels_status(user) == %{channel1.id => true}
  end

  test "create_channel_user/2 create channel_user and user_read_message" do
    %{id: channel_id} = channel = insert_channel(%{name: "foo"})
    %{id: user_id} = user = insert_user
    result = ChannelUserService.create_channel_user(channel, user)
    assert {:ok, _} = result
    channel_user = Repo.one(from ChannelUser, limit: 1)
    user_read_message = Repo.one(from UserReadMessage, limit: 1)
    assert %{user_id: ^user_id, channel_id: ^channel_id} = channel_user
    assert %{user_id: ^user_id, channel_id: ^channel_id} = user_read_message
  end

  test "create_channel_user/2 support :joined_at option" do
    channel = insert_channel(%{name: "foo"})
    user = insert_user
    ChannelUserService.create_channel_user(channel, user, joined_at: nil)
    channel_user = Repo.one(from ChannelUser, limit: 1)
    refute channel_user.joined_at
  end

  test "direct_user_ids/2 returns channel_users of channels but not for current user" do
    channel1 = insert_direct_channel
    channel2 = insert_direct_channel
    user1 = insert_user
    user2 = insert_user
    user3 = insert_user
    insert_channel_user(channel1, user1)
    insert_channel_user(channel1, user2)
    insert_channel_user(channel2, user1)
    insert_channel_user(channel2, user3)
    user_ids = ChannelUserService.direct_user_ids(user1, [channel1, channel2])
    assert user_ids == %{channel1.id => user2.id, channel2.id => user3.id}
  end

  test "direct_channels/1 returns direct channels of the user" do
    %{id: channel_id1} = channel1 = insert_direct_channel
    %{id: channel_id2} = channel2 = insert_direct_channel
    insert_channel
    user = insert_user
    insert_channel_user(channel1, user)
    insert_channel_user(channel2, user, nil)
    channels = ChannelUserService.direct_channels(user)
    assert [%Channel{id: ^channel_id1}, %Channel{id: ^channel_id2}] = channels
  end

  test "create_direct_channel_for/2 inserts channel, channels_users" do
    user1 = insert_user
    user2 = insert_user
    {:ok, channel} = ChannelUserService.create_direct_channel_for(user1, user2)
    assert channel.name == "#{user1.id},#{user2.id}"
    assert Repo.one(from cu in ChannelUser, select: count(cu.id)) == 2
    assert Repo.one(from urm in UserReadMessage, select: count(urm.id)) == 2
    channel_user = Repo.one(from cu in ChannelUser, order_by: [desc: cu.id], limit: 1)
    refute channel_user.joined_at
  end

  test "create_direct_channel_for/2 fails when channels exists" do
    user1 = insert_user
    user2 = insert_user
    insert_direct_channel(%{name: "#{user1.id},#{user2.id}"})
    assert_raise Ecto.InvalidChangesetError, ~r/name.*has already been taken/, fn -> ChannelUserService.create_direct_channel_for(user1, user2) end
  end

end
