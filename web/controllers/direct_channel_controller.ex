defmodule Exchat.DirectChannelController do
  use Exchat.Web, :controller

  alias Exchat.{ChannelUserService, User, DirectChannelView}

  def index(conn, _params) do
    {channels, channel_users} = ChannelUserService.direct_channels_users(conn.assigns.current_user)
    render(conn, "index.json", channels: channels, channel_users: channel_users)
  end

  def join(conn, %{"user_id" => user_id}) do
    other_user = Repo.get_by(User, id: user_id)
    current_user = conn.assigns.current_user
    case ChannelUserService.join_direct_channel(current_user, other_user) do
      {:ok, channel, state} ->
        push_to_other_user(state, current_user, other_user, channel)
        conn
        |> put_status(:created)
        |> render("channel.json", channel: channel, joined: true, user_id: user_id)
      {:error, changeset} ->
        conn
        |> put_status(:bad_request)
        |> render(ChangesetView, :message, changeset: changeset)
    end
  end

  defp push_to_other_user(:new, current_user, other_user, channel) do
    result = DirectChannelView.render("channel.json", %{channel: channel, joined: false, user_id: current_user.id})
    EventChannel.push_out(other_user.id, "dm_created", result)
  end
  defp push_to_other_user(_, _, _, _)

end
