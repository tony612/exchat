defmodule Exchat.MessageController do
  use Exchat.Web, :controller

  alias Exchat.Channel
  alias Exchat.Message

  def index(conn, params) do
    channel = Repo.get_by Channel, id: params["channel_id"]
    count = 100
    messages = Channel.messages_before(channel, params["ts"] || now, count + 1)
                |> Repo.all
                |> Repo.preload(:user)
                |> Enum.reverse

    render(conn, "index.json", messages: messages, count: count)
  end

  defp now, do: Extime.to_timestamp(Ecto.DateTime.utc)
end
