defmodule Exchat.ChannelUserServiceTest do
  use Exchat.ModelCase

  alias Exchat.{ChannelUserService, User}

  test "joined_channels_status returns joined channels as bool hash" do
    channel1 = insert_channel(%{name: "foo"})
    insert_channel(%{name: "bar"})
    user = Repo.insert!(%User{email: "tony@ex.chat", password: "password"})
    insert_channel_user(channel1, user)
    assert ChannelUserService.joined_channels_status(user) == %{channel1.id => true}
  end
end
