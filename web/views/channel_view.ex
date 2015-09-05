defmodule Exchat.ChannelView do
  use Exchat.Web, :view

  def render("index.json", %{channels: channels}) do
    %{data: render_many(channels, Exchat.ChannelView, "channel.json")}
  end

  def render("show.json", %{channel: channel}) do
    %{data: render_one(channel, Exchat.ChannelView, "channel.json")}
  end

  def render("channel.json", %{channel: channel}) do
    %{id: channel.id,
      name: channel.name}
  end
end
