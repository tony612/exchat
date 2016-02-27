use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.

webpack_args = ["node_modules/webpack/bin/webpack.js", "--watch", "--colors", "--progress", "--devtool", "eval-cheap-module-source-map"]
# Remove progress argument to make iex display log normally
if IEx.started?, do: webpack_args = List.delete(webpack_args, "--progress")

config :exchat, Exchat.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  cache_static_lookup: false,
  check_origin: false,
  watchers: [node: webpack_args]

# Watch static and templates for browser reloading.
config :exchat, Exchat.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$},
      ~r{webpack\.config\.js$},
      ~r{.bootstraprc}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :exchat, Exchat.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "exchat_dev",
  pool_size: 10

# DO NOT use this in prod
config :exchat, Exchat.User, jwt_secret: "super_secret"
