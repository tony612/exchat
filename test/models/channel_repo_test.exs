defmodule Exchat.ChannelRepoTest do
  use Exchat.ModelCase

  alias Exchat.{Channel, Repo, Message}
  alias Ecto.DateTime

  test "messages_before returns channels's messages before time" do
    channel = insert_channel

    assert Channel.messages_before(channel, Extime.to_timestamp(DateTime.utc)) |> Repo.all == []

    user = insert_user
    message = %Message{text: "Hello", channel_id: channel.id, user_id: user.id}
    {:ok, message1} = Repo.insert(message)

    time1 = message1.inserted_at

    assert_func = fn (channel, time, num) ->
      msgs = Channel.messages_before(channel, Extime.to_timestamp(time)) |> Repo.all
      assert length(msgs) == num
    end

    assert_func.(channel, time1, 0)

    later = %DateTime{time1 | sec: time1.sec + 1}
    assert_func.(channel, later, 1)
  end

  test "the result of messages_before is ordered by desc inserted_at" do
    channel = insert_channel
    user = insert_user
    Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590686)})
    %{id: id2} = Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590687)})
    %{id: id3} = Repo.insert!(%Message{text: "Hello", channel_id: channel.id, user_id: user.id, inserted_at: Extime.to_datetime(1456590688)})
    msgs = Channel.messages_before(channel, 1456590689, 2) |> Repo.all
    assert [%Message{id: ^id3}, %Message{id: ^id2}] = msgs
  end
end
