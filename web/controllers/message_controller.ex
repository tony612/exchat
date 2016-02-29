defmodule Exchat.MessageController do
  use Exchat.Web, :controller

  alias Exchat.Channel

  def index(conn, params) do
    channel = Repo.get_by Channel, id: params["channel_id"]
    count = 100
    messages = Channel.messages_before(channel, params["ts"] || Extime.now_ts, count + 1)
                |> Repo.all
                |> Repo.preload(:user)
                |> Enum.reverse

    render(conn, "index.json", messages: messages, count: count)
  end
end
