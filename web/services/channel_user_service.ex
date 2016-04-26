defmodule Exchat.ChannelUserService do
  use Exchat.Web, :service

  alias Exchat.{Channel, ChannelUser, UserReadMessage, User}

  def insert_channel(params, user) do
    Repo.transaction(fn ->
      changeset = Channel.public_changeset(%Channel{}, params)
      case Repo.insert(changeset) do
        {:ok, channel} ->
          create_channel_user(channel, user)
          channel
        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end

  def joined_channels_status(user) do
    # TODO: only channel_users of joined channels are needed
    channel_users = Repo.all assoc(user, :channel_users)
    Enum.reduce(channel_users, %{}, fn(x, acc) -> Map.put(acc, x.channel_id, true) end)
  end

  def create_channel_user(channel, user) do
    Repo.transaction(fn ->
      params = %{channel_id: channel.id, user_id: user.id}
      Repo.insert!(ChannelUser.changeset(%ChannelUser{}, Map.put(params, :joined_at, Extime.now_datetime)))
      # Use now datetime is OK, not necessary to use datetime of channel's latest message
      Repo.insert!(UserReadMessage.changeset(%UserReadMessage{}, Map.put(params, :latest_ts, Extime.now_datetime)))
    end)
  end

  def join_default_channels(user) do
    names = Application.get_env(:exchat, Channel)[:default_channels]
    channels = Repo.all(from ch in Channel, where: ch.name in ^names)
    Enum.each channels, fn (channel) ->
      create_channel_user(channel, user)
    end
  end

  def direct_user_ids(%{id: user_id}, channels) do
    channel_ids = Enum.map(channels, &(&1.id))
    channel_users = Repo.all(from cu in ChannelUser, where: cu.channel_id in ^channel_ids and not(cu.user_id == ^user_id))
    Enum.reduce(channel_users, %{}, fn(cu, acc) -> Map.put(acc, cu.channel_id, cu.user_id) end)
  end

  def direct_channels(%User{id: user_id}) do
    Repo.all(from ch in Channel.direct, join: cu in ChannelUser, on: ch.id == cu.channel_id,
                                        where: cu.user_id == ^user_id, select: ch)
  end

end
