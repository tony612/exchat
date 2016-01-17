defmodule Exchat.ChannelRepoTest do
  use Exchat.ModelCase

  alias Exchat.Channel
  alias Exchat.Repo
  alias Exchat.Message
  alias Ecto.DateTime

  test "messages_before returns channels's messages before time" do
    channel = %Channel{name: "abc"}
    channel = Repo.insert!(channel)

    assert Channel.messages_before(channel, Message.to_timestamp(DateTime.utc)) |> Repo.all == []

    message = %Message{text: "Hello", channel_id: channel.id}
    {:ok, message1} = Repo.insert(message)

    now = message1.inserted_at

    assert_func = fn channel ->
      msgs = Channel.messages_before(channel, Message.to_timestamp(now)) |> Repo.all
      assert length(msgs) == 1
    end

    assert_func.(channel)

    later = %DateTime{now | sec: now.sec + 1}
    Repo.insert(%{message | inserted_at: later})
    assert_func.(channel)
  end
end
