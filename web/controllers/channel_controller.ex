defmodule Exchat.ChannelController do
  use Exchat.Web, :controller

  alias Exchat.{Channel, ChannelUserService}

  plug :scrub_params, "channel" when action in [:create, :update]

  def index(conn, _params) do
    channels = Repo.all(Channel.public)
    joined_status = ChannelUserService.joined_channels_status(conn.assigns.current_user)
    render(conn, "index.json", channels: channels, joined_status: joined_status)
  end

  def create(conn, %{"channel" => channel_params}) do
    current_user = conn.assigns.current_user
    case ChannelUserService.insert_channel(channel_params, current_user) do
      {:ok, channel} ->
        payload = Exchat.ChannelView.render("show.json", channel: channel, joined: false)
        notify_channel_created(payload)
        conn
        |> put_status(:created)
        |> json(Map.put(payload, :joined, true))
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
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

  defp notify_channel_created(payload) do
    EventChannel.push_out("channel_created", payload)
  end

end
