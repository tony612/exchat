defmodule Exchat.DirectChannelController do
  use Exchat.Web, :controller

  alias Exchat.{ChannelUserService}

  def index(conn, _params) do
    channels = ChannelUserService.direct_channels(conn.assigns.current_user)
    direct_user_ids = ChannelUserService.direct_user_ids(conn.assigns.current_user, channels)
    render(conn, "index.json", channels: channels, user_ids: direct_user_ids)
  end
end
