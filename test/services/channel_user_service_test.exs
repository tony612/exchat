defmodule Exchat.ChannelUserServiceTest do
  use Exchat.ModelCase, async: true

  alias Exchat.{ChannelUserService, ChannelUser, UserReadMessage, Channel}

  test "joined_channels_status/1 returns joined channels as bool hash" do
    channel1 = insert_channel(%{name: "foo"})
    insert_channel(%{name: "bar"})
    user = insert_user()
    insert_channel_user(channel1, user)
    assert ChannelUserService.joined_channels_status(user) == %{channel1.id => true}
  end

  test "create_channel_user/2 create channel_user and user_read_message" do
    %{id: channel_id} = channel = insert_channel(%{name: "foo"})
    %{id: user_id} = user = insert_user()
    result = ChannelUserService.create_channel_user(channel, user)
    assert {:ok, _} = result
    channel_user = Repo.one(from ChannelUser, limit: 1)
    user_read_message = Repo.one(from UserReadMessage, limit: 1)
    assert %{user_id: ^user_id, channel_id: ^channel_id} = channel_user
    assert %{user_id: ^user_id, channel_id: ^channel_id} = user_read_message
  end

  test "create_channel_user/2 support :joined_at option" do
    channel = insert_channel(%{name: "foo"})
    user = insert_user()
    ChannelUserService.create_channel_user(channel, user, joined_at: nil)
    channel_user = Repo.one(from ChannelUser, limit: 1)
    refute channel_user.joined_at
  end

  test "rejoin_channel/2 changes joined_at of channel_user" do
    channel = insert_channel(%{name: "foo"})
    user = insert_user()
    insert_channel_user(channel, user, nil)
    ChannelUserService.rejoin_channel(user, channel)
    channel_user = Repo.one(from ChannelUser, limit: 1)
    assert channel_user.joined_at
  end

  test "rejoin_channel/2 does nothing when channel_user has joined_at" do
    channel = insert_channel(%{name: "foo"})
    user = insert_user()
    joined_at = ~N[2016-05-24 00:00:00.000000]
    insert_channel_user(channel, user, joined_at)
    ChannelUserService.rejoin_channel(user, channel)
    channel_user = Repo.one(from ChannelUser, limit: 1)
    assert channel_user.joined_at == joined_at
  end

  test "rejoin_channel/2 raises error when there's no channel_user" do
    channel = insert_channel(%{name: "foo"})
    user = insert_user()
    assert_raise RuntimeError, ~r/There's no relationship between %Exchat.Channel.*user##{user.id}/, fn -> ChannelUserService.rejoin_channel(user, channel) end
  end

  test "direct_channels_users/1 returns direct channels and channel_users of the user" do
    %{id: channel_id1} = channel1 = insert_direct_channel()
    %{id: channel_id2} = channel2 = insert_direct_channel()
    insert_channel()
    user = insert_user()
    %{id: cu_id1} = insert_channel_user(channel1, user)
    %{id: cu_id2} = insert_channel_user(channel2, user, nil)
    {channels, channel_users} = ChannelUserService.direct_channels_users(user)
    assert [%Channel{id: ^channel_id1}, %Channel{id: ^channel_id2}] = channels
    assert [%ChannelUser{id: ^cu_id1}, %ChannelUser{id: ^cu_id2}] = channel_users
  end

  test "join_direct_channel/2 update joined_at of channel_user" do
    user1 = insert_user()
    user2 = insert_user()
    channel = insert_direct_channel(%{name: "#{user1.id},#{user2.id}"})
    insert_channel_user(channel, user1, nil)
    {:ok, returned_channel, :rejoin} = ChannelUserService.join_direct_channel(user1, user2)
    assert returned_channel.id == channel.id
    channel_user = Repo.one(from ChannelUser, limit: 1)
    assert channel_user.joined_at
  end

  test "join_direct_channel/2 inserts channel, channels_users" do
    user1 = insert_user()
    user2 = insert_user()
    {:ok, channel, :new} = ChannelUserService.join_direct_channel(user1, user2)
    assert channel.name == "#{user1.id},#{user2.id}"
  end

  test "create_direct_channel_for/2 inserts channel, channels_users" do
    user1 = insert_user()
    user2 = insert_user()
    {:ok, channel} = ChannelUserService.create_direct_channel_for(user1, user2)
    assert channel.name == "#{user1.id},#{user2.id}"
    assert Repo.one(from cu in ChannelUser, select: count(cu.id)) == 2
    assert Repo.one(from urm in UserReadMessage, select: count(urm.id)) == 2
    channel_user = Repo.one(from cu in ChannelUser, order_by: [desc: cu.id], limit: 1)
    refute channel_user.joined_at
  end

  test "create_direct_channel_for/2 fails when channels exists" do
    user1 = insert_user()
    user2 = insert_user()
    insert_direct_channel(%{name: "#{user1.id},#{user2.id}"})
    assert_raise Ecto.InvalidChangesetError, ~r/name.*has already been taken/, fn -> ChannelUserService.create_direct_channel_for(user1, user2) end
  end

end
