defmodule Exchat.ChannelTest do
  use Exchat.ModelCase

  alias Exchat.Channel
  alias Exchat.Repo
  alias Exchat.Message
  alias Ecto.DateTime

  @valid_attrs %{name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Channel.changeset(%Channel{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Channel.changeset(%Channel{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "messages_before returns channels's messages before time" do
    channel = %Channel{name: "abc"}
    channel = Repo.insert!(channel)

    assert Channel.messages_before(channel, Message.to_timestamp(DateTime.utc)) == []

    message = %Message{text: "Hello", channel_id: channel.id}
    Repo.insert(message)

    now = DateTime.utc

    assert_func = fn channel ->
      msgs = Channel.messages_before(channel, Message.to_timestamp(now))
      assert length(msgs) == 1
    end

    assert_func.(channel)

    later = %DateTime{now | sec: now.sec + 1}
    Repo.insert(%{message | inserted_at: later})
    assert_func.(channel)

    channel = Repo.insert!(%Channel{name: "def"})
    Repo.insert(%Message{text: "Foo", channel_id: channel.id})
    assert_func.(channel)
  end
end
