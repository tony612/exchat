defmodule Exchat.MessageView do
  use Exchat.Web, :view

  alias Exchat.Message

  # should use `count + 1` to get messages, length of messages and count will
  # be compared to get `has_more`
  def render("index.json", %{messages: messages, count: count}) do
    %{has_more: length(messages) > count,
      messages: render_many(Enum.take(messages, count), Exchat.MessageView, "message.json")}
  end

  def render(type = "message.json", %{message: message}) do
    build(type, message, user: message.user)
  end

  def build("message.json", message, user: user) do
    %{text: message.text,
      channel_id: message.channel_id,
      ts: Message.ts(message),
      user: %{
        id: user.id,
        username: Exchat.User.username(user),
        email: user.email
      }
    }
  end
end
