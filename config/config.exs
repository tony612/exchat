# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :exchat, Exchat.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "smY42q0EU5mhdBDG5CL4D+f1enl1q+MrI8OZRG589Ep5+6FwEtvZCKwq/Xvy9g0N",
  debug_errors: false,
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Exchat.PubSub,
           adapter: Phoenix.PubSub.PG2]

config :exchat, ecto_repos: [Exchat.Repo]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :exchat, Exchat.Channel, default_channels: ["general", "random"]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
