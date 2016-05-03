defmodule Exchat.DirectChannelView do
  use Exchat.Web, :view

  def render("index.json", %{channels: channels, user_ids: user_ids}) do
    Enum.map(channels, fn channel ->
      # TODO: joined should be fetched
      render(__MODULE__, "channel.json", channel: channel, joined: true, user_id: user_ids[channel.id])
    end)
  end

  def render("channel.json", %{channel: channel, joined: joined, user_id: user_id}) do
    %{id: channel.id,
      name: channel.name,
      joined: !!joined,
      user_id: user_id}
  end
end
