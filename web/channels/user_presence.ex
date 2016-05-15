defmodule Exchat.UserPresence do
  use Phoenix.Presence, otp_app: :exchat,
                        pubsub_server: Exchat.PubSub
end
