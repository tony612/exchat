defmodule Exchat.DirectChannelView do
  use Exchat.Web, :view

  alias Exchat.Channel

  def render("index.json", %{channels: channels, channel_users: channel_users}) do
    indexed = Enum.reduce(channel_users, %{}, fn(cu, acc) -> Map.put(acc, cu.channel_id, cu) end)
    Enum.map(channels, fn channel ->
      channel_user = indexed[channel.id]
      other_id = Channel.opposite_direct_user_id(channel, channel_user.user_id)
      render(__MODULE__, "channel.json", channel: channel, joined: channel_user.joined_at, user_id: other_id)
    end)
  end

  def render("channel.json", %{channel: channel, joined: joined, user_id: user_id}) do
    %{id: channel.id,
      name: channel.name,
      joined: !!joined,
      user_id: user_id}
  end
end
