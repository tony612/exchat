defmodule Exchat.ChannelTest do
  use Exchat.ModelCase, async: true

  alias Exchat.Channel

  @valid_attrs %{name: "foo-bar"}
  @invalid_attrs %{}

  test "public_changeset with valid attributes" do
    changeset = Channel.public_changeset(%Channel{}, @valid_attrs)
    assert changeset.valid?
    assert %{type: 1} = changeset.changes
  end

  test "direct_changeset with valid attributes" do
    changeset = Channel.direct_changeset(%Channel{}, @valid_attrs)
    assert changeset.valid?
    assert %{type: 2} = changeset.changes
  end

  test "changeset with invalid attributes" do
    changeset = Channel.public_changeset(%Channel{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "changeset with invalid name format" do
    changeset = Channel.public_changeset(%Channel{}, %{name: "foo bar"})
    refute changeset.valid?
    changeset = Channel.public_changeset(%Channel{}, %{name: "foo,bar"})
    refute changeset.valid?
    changeset = Channel.public_changeset(%Channel{}, %{name: "foo_bar "})
    refute changeset.valid?
  end

  test "direct_name/2 return name like 1,2" do
    assert Channel.direct_name(1, 2) == "1,2"
    assert Channel.direct_name(2, 1) == "1,2"
  end

  test "direct_user_ids/1 return user ids list" do
    channel = %Channel{name: "1,2", type: 2}
    assert Channel.direct_user_ids(channel) == [1, 2]
  end

  test "direct_user_ids/1 raise error for not-direct channels" do
    channel = %Channel{name: "1,2", type: 1}
    assert_raise ArgumentError, ~r/Exchat\.Channel.*is not a direct channel/, fn -> Channel.direct_user_ids(channel) end
  end

  test "opposite_direct_user_id/2 works" do
    channel = %Channel{name: "1,2", type: 2}
    assert Channel.opposite_direct_user_id(channel, 1) == 2
    assert Channel.opposite_direct_user_id(channel, 2) == 1
  end

  test "is_direct?/1 works" do
    assert Channel.is_direct?(%Channel{name: "1,2", type: 2})
    refute Channel.is_direct?(%Channel{name: "1,2", type: 1})
  end
end
