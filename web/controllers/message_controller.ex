defmodule Exchat.MessageController do
  use Exchat.Web, :controller

  alias Exchat.Channel
  alias Exchat.Message

  def index(conn, params) do
    channel = Repo.get_by Channel, name: params["channel_id"]

    messages = Channel.messages_before(channel, params["ts"] || now)

    render(conn, "index.json", messages: messages)
  end

  defp now, do: Message.to_timestamp(Ecto.DateTime.utc)
end
