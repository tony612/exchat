defmodule Exchat.MessageView do
  use Exchat.Web, :view

  alias Exchat.Message

  def render("index.json", %{messages: messages}) do
    render_many(messages, Exchat.MessageView, "message.json")
  end

  def render("message.json", %{message: message}) do
    %{id: message.id,
      text: message.text,
      channel_id: message.channel_id,
      ts: Message.ts(message)}
  end
end
