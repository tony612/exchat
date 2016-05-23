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

  def create_channel_user(channel, user, options \\ []) do
    joined_at = Keyword.get(options, :joined_at, Extime.now_datetime)
    Repo.transaction(fn ->
      params = %{channel_id: channel.id, user_id: user.id}
      Repo.insert!(ChannelUser.changeset(%ChannelUser{}, Map.put(params, :joined_at, joined_at)))
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

  def rejoin_channel(%User{} = user, channel) do
    rejoin_channel(user.id, channel)
  end
  def rejoin_channel(user_id, channel) when is_integer(user_id) do
    channel_user = Repo.get_by ChannelUser, user_id: user_id, channel_id: channel.id
    cond do
      channel_user && !channel_user.joined_at ->
        changeset = Ecto.Changeset.change(channel_user, joined_at: Extime.now_datetime)
        Repo.update changeset
      channel_user && channel_user.joined_at ->
        {:ok, channel_user}
      !channel_user ->
        raise "There's no relationship between #{inspect channel} user##{user_id}"
    end
  end

  def direct_channels_users(%User{id: user_id}) do
    result = Repo.all(from ch in Channel.direct, join: cu in ChannelUser, on: ch.id == cu.channel_id,
                                        where: cu.user_id == ^user_id, select: {ch, cu})
    Enum.unzip(result)
  end

  def join_direct_channel(user, other_user) do
    name = Channel.direct_name(user.id, other_user.id)
    channel = Repo.get_by(Channel, name: name)
    # TODO: refactor
    if channel do
      case rejoin_channel(user, channel) do
        {:ok, _} -> {:ok, channel, :rejoin}
        other    -> other
      end
    else
      case create_direct_channel_for(user, other_user) do
        {:ok, channel} -> {:ok, channel, :new}
        other          -> other
      end
    end
  end

  def create_direct_channel_for(user, other_user) do
    channel_changeset = Channel.direct_changeset %Channel{}, %{name: Channel.direct_name(user.id, other_user.id)}
    Repo.transaction(fn ->
      channel = Repo.insert!(channel_changeset)
      create_channel_user(channel, user)
      create_channel_user(channel, other_user, joined_at: nil)
      channel
    end)
  end

end
