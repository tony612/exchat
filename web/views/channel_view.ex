defmodule Exchat.ChannelView do
  use Exchat.Web, :view

  def render("index.json", %{channels: channels, joined_status: joined_status}) do
    Enum.map(channels, fn channel ->
      render(__MODULE__, "channel.json", channel: channel, joined: joined_status[channel.id])
    end)
  end

  def render("show.json", %{channel: channel, joined: joined}) do
    render(__MODULE__, "channel.json", channel: channel, joined: joined)
  end

  def render("channel.json", %{channel: channel, joined: joined}) do
    %{id: channel.id,
      name: channel.name,
      joined: !!joined}
  end
end
