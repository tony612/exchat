defmodule Exchat.MessageController do
  use Exchat.Web, :controller

  alias Exchat.{Channel, MessageService}

  @default_history_count 100

  def index(conn, params = %{"channel_id" => channel_id}) do
    channel = Repo.get_by Channel, id: channel_id
    messages = MessageService.load_messages(channel, params["ts"] || Extime.now_ts) |> Repo.preload(:user)

    render(conn, "index.json", messages: messages, count: @default_history_count)
  end
end
