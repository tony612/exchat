defmodule Exchat.ChannelUserTest do
  use Exchat.ModelCase, async: true

  alias Exchat.ChannelUser

  @valid_attrs %{joined_at: "2010-04-17 14:00:00", user_id: 1, channel_id: 1}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ChannelUser.changeset(%ChannelUser{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ChannelUser.changeset(%ChannelUser{}, @invalid_attrs)
    refute changeset.valid?
  end
end
