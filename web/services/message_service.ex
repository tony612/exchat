defmodule Exchat.MessageService do
  use Exchat.Web, :service
  alias Exchat.Channel

  @default_history_count 100

  def load_messages(channel, max_ts, count \\ @default_history_count) do
    channel
      |> Channel.messages_before(max_ts, count + 1)
      |> Repo.all
      |> Enum.reverse
  end
end
