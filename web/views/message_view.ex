defmodule Exchat.MessageView do
  use Exchat.Web, :view

  alias Exchat.Message

  def render("index.json", %{messages: messages}) do
    render_many(messages, Exchat.MessageView, "message.json")
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
        username: Exchat.User.username(user)
      }
    }
  end
end
