defmodule Exchat.DirectChannelController do
  use Exchat.Web, :controller

  alias Exchat.{ChannelUserService, User}

  def index(conn, _params) do
    {channels, channel_users} = ChannelUserService.direct_channels_users(conn.assigns.current_user)
    render(conn, "index.json", channels: channels, channel_users: channel_users)
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
