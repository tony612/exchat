defmodule Exchat.ChannelRepoTest do
  use Exchat.ModelCase, async: true

  alias Exchat.{Channel, Repo, Message}

  test "messages_before returns channels's messages before time" do
    channel = insert_channel()

    assert Channel.messages_before(channel, DateTime.utc_now()) |> Repo.all == []

    user = insert_user()
    message = %Message{text: "Hello", channel_id: channel.id, user_id: user.id}
    {:ok, message1} = Repo.insert(message)

    time1 = message1.inserted_at

    assert_func = fn (channel, time, num) ->
      msgs = Channel.messages_before(channel, Extime.to_timestamp(time)) |> Repo.all
      assert length(msgs) == num
    end

    assert_func.(channel, time1, 0)

    later = %NaiveDateTime{time1 | second: time1.second + 1}
    assert_func.(channel, later, 1)
  end

  test "the result of messages_before is ordered by desc inserted_at" do
    channel = insert_channel()
    user = insert_user()
    Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590686)})
    %{id: id2} = Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590687)})
    %{id: id3} = Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590688)})
    msgs = Channel.messages_before(channel, 1456590689, 2) |> Repo.all
    assert [%Message{id: ^id3}, %Message{id: ^id2}] = msgs
  end

  test "messages_count_after/2 returns messages count after the time" do
    channel = insert_channel()
    user = insert_user()
    assert Repo.one(Channel.messages_count_after(channel, 0)) == 0

    insert_message(%{channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1458231490)})
    insert_message(%{channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1458231491)})
    assert Repo.one(Channel.messages_count_after(channel, 1458231489)) == 2
    assert Repo.one(Channel.messages_count_after(channel, 1458231490)) == 1
    assert Repo.one(Channel.messages_count_after(channel, 1458231491)) == 0
  end
end
