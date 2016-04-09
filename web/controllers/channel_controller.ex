defmodule Exchat.ChannelController do
  use Exchat.Web, :controller

  alias Exchat.{Channel}

  plug :scrub_params, "channel" when action in [:create, :update]

  def index(conn, _params) do
    channels = Repo.all(Channel)
    render(conn, "index.json", channels: channels)
  end

  def create(conn, %{"channel" => channel_params}) do
    case ChannelUserService.insert_channel(channel_params, conn.assigns.current_user) do
      {:ok, channel} ->
        conn
        |> put_status(:created)
        |> render("show.json", channel: channel)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :error, changeset: changeset)
    end
  end

  def read(conn, %{"channel_id" => channel_id, "ts" => ts}) do
    channel = Repo.get(Channel, channel_id)
    case Exchat.UnreadService.mark_read(conn.assigns.current_user, channel, ts) do
      {:ok, _struct} ->
        conn
        |> put_status(:ok)
        |> json(%{})
      {:error, message} ->
        conn
        |> put_status(:bad_request)
        |> json(%{message: message})
    end
  end

end
