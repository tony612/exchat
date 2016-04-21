defmodule Exchat.ChannelUserServiceTest do
  use Exchat.ModelCase, async: true

  alias Exchat.{ChannelUserService, User, ChannelUser, UserReadMessage}

  test "joined_channels_status returns joined channels as bool hash" do
    channel1 = insert_channel(%{name: "foo"})
    insert_channel(%{name: "bar"})
    user = Repo.insert!(%User{email: "tony@ex.chat", password: "password"})
    insert_channel_user(channel1, user)
    assert ChannelUserService.joined_channels_status(user) == %{channel1.id => true}
  end

  test "create_channel_user create channel_user and user_read_message" do
    %{id: channel_id} = channel = insert_channel(%{name: "foo"})
    %{id: user_id} = user = Repo.insert!(%User{email: "tony@ex.chat", password: "password"})
    result = ChannelUserService.create_channel_user(channel, user)
    assert {:ok, _} = result
    channel_user = Repo.one(from ChannelUser, limit: 1)
    user_read_message = Repo.one(from UserReadMessage, limit: 1)
    assert %{user_id: ^user_id, channel_id: ^channel_id} = channel_user
    assert %{user_id: ^user_id, channel_id: ^channel_id} = user_read_message
  end
end
