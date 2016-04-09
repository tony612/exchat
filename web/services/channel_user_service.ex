defmodule ChannelUserService do
  use Exchat.Web, :service

  alias Exchat.{Channel, ChannelUser, UserReadMessage}

  def insert_channel(params, user) do
    Repo.transaction(fn ->
      changeset = Channel.changeset(%Channel{}, params)
      case Repo.insert(changeset) do
        {:ok, channel} ->
          params = %{channel_id: channel.id, user_id: user.id}
          Repo.insert!(ChannelUser.changeset(%ChannelUser{}, Map.put(params, :joined_at, Extime.now_datetime)))
          Repo.insert!(UserReadMessage.changeset(%UserReadMessage{}, Map.put(params, :latest_ts, Extime.now_datetime)))
          channel
        {:error, changeset} ->
          Repo.rollback(changeset)
      end
    end)
  end
end
