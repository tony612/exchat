defmodule Exchat.Mixfile do
  use Mix.Project

  def project do
    [app: :exchat,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {Exchat, []},
     applications: [:phoenix, :phoenix_html, :cowboy, :logger, :gettext,
                    :phoenix_ecto, :postgrex, :comeonin]]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [{:phoenix, "~> 1.1.4"},
     {:phoenix_ecto, "~> 3.0.0-beta"},
     {:postgrex, "~> 0.11.1"},
     {:phoenix_html, "~> 2.5.0"},
     {:phoenix_live_reload, "~> 1.0.3", only: :dev},
     {:gettext, "~> 0.10.0"},
     {:ecto, "~> 2.0.0-beta.1"},
     {:cowboy, "~> 1.0.4"},
     {:comeonin, "~> 2.1.0"},
     {:joken, "~> 1.1.0"}]
  end
end
