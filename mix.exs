defmodule Exchat.Mixfile do
  use Mix.Project

  def project do
    [app: :exchat,
     version: "0.3.1",
     elixir: "~> 1.4",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     test_coverage: [tool: ExCoveralls],
     preferred_cli_env: preferred_cli_env(),
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {Exchat, []},
     applications: [:phoenix, :phoenix_html, :phoenix_pubsub, :cowboy, :logger, :gettext,
                    :phoenix_ecto, :postgrex, :comeonin, :joken]]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  defp aliases do
    [test: ["ecto.create --quiet", "ecto.migrate", "test"]]
  end

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [{:phoenix, "~> 1.2.1"},
     {:phoenix_ecto, "~> 3.2.1"},
     {:phoenix_html, "~> 2.9"},
     {:phoenix_live_reload, "~> 1.0.8", only: :dev},
     {:phoenix_pubsub, "~> 1.0.1"},
     {:postgrex, "~> 0.13.0"},
     {:gettext, "~> 0.13.1"},
     {:ecto, "~> 2.1.3"},
     {:cowboy, "~> 1.0"},
     {:comeonin, "~> 2.6.0"},
     {:excoveralls, "~> 0.6.2", only: :test},
     {:joken, "~> 1.4.1"}]
  end

  defp preferred_cli_env do
    ["coveralls": :test, "coveralls.detail": :test, "coveralls.html": :test]
  end
end
