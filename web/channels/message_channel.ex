defmodule Exchat.MessageChannel do
  use Exchat.Web, :channel
  alias Exchat.{Message, Repo, Channel, MessageService, UnreadService, EventChannel}

  @default_history_count 100

  # TODO: Authorization should be added, users can only join some channels
  def join("channel:" <> _channel_id, _auth_msg, socket) do
    channel = channel_from_topic(socket.topic)
    messages = MessageService.load_messages(channel, Extime.now_ts) |> Repo.preload(:user)
    unread_count = UnreadService.unread_count(socket.assigns.user, channel)

    resp = Exchat.MessageView.render("index.json", %{messages: messages, count: @default_history_count})
            |> Map.put(:unread_count, unread_count)

    {:ok, resp, socket}
  end
  def join(_, _auth_msg, _socket) do
    {:error, %{reason: "Unauthorized!"}}
  end

  def handle_in(event, params, socket) do
    user = socket.assigns.user
    if user do
      handle_in(event, params, user, socket)
    else
      {:reply, :error, socket}
    end
  end
  def handle_in("new_message", %{"text" => _text} = params, user, socket) do
    channel = channel_from_topic(socket.topic)
    if channel do
      changeset = Message.changeset(%Message{}, message_params(params, channel, user))
      case Repo.insert(changeset) do
        {:ok, message} ->
          data = Exchat.MessageView.build("message.json", message, user: user)
          notify_dm_open(user, channel)
          broadcast! socket, "new_message", data
          {:reply, :ok, socket}
        {:error, _changeset} ->
          {:reply, :error, socket}
      end
    else
      {:reply, :error, socket}
    end
  end

  defp channel_from_topic(topic) do
    channel_id = String.replace(topic, ~r/.*:#?/, "")
    Repo.get_by Channel, id: channel_id
  end

  defp message_params(%{"text" => text}, channel, user) do
    Map.merge(%{text: text}, %{channel_id: channel.id, user_id: user.id})
  end

  defp notify_dm_open(user, channel) do
    if Channel.is_direct?(channel) do
      channel_user = ensure_opposite_user_joined(user, channel)
      if Extime.now_ts - Extime.to_timestamp(channel_user.joined_at) < 1 do
        EventChannel.push_out(channel_user.user_id, "dm_open", %{channel_id: channel.id})
      end
    end
  end

  defp ensure_opposite_user_joined(user, channel) do
    opposite_id = Channel.opposite_direct_user_id(channel, user.id)
    {:ok, channel_user} = Exchat.ChannelUserService.rejoin_channel(opposite_id, channel)
    channel_user
  end

end
