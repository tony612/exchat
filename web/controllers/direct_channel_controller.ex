defmodule Exchat.DirectChannelController do
  use Exchat.Web, :controller

  alias Exchat.{ChannelUserService, User}

  def index(conn, _params) do
    channels = ChannelUserService.direct_channels(conn.assigns.current_user)
    direct_user_ids = ChannelUserService.direct_user_ids(conn.assigns.current_user, channels)
    render(conn, "index.json", channels: channels, user_ids: direct_user_ids)
  end

  def create(conn, %{"user_id" => user_id}) do
    other_user = Repo.get_by(User, id: user_id)
    case ChannelUserService.create_direct_channel_for(conn.assigns.current_user, other_user) do
      {:ok, channel} ->
        conn
        |> put_status(:created)
        |> render("channel.json", channel: channel, joined: true, user_id: user_id)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end
end
