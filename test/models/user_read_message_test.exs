defmodule Exchat.UserReadMessageTest do
  use Exchat.ModelCase, async: true

  alias Exchat.UserReadMessage

  @valid_attrs %{latest_ts: "2010-04-17 14:00:00", channel_id: 1, user_id: 2}
  @invalid_attrs %{message_id: 42}

  test "changeset with valid attributes" do
    changeset = UserReadMessage.changeset(%UserReadMessage{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = UserReadMessage.changeset(%UserReadMessage{}, @invalid_attrs)
    refute changeset.valid?
  end
end
