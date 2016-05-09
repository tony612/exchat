defmodule Exchat.Router do
  use Exchat.Web, :router

  import Exchat.ApiAuth, only: [authenticate_user: 2]

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Exchat.ApiAuth, repo: Exchat.Repo
  end

  scope "/api", Exchat do
    pipe_through [:api, :authenticate_user]

    resources "/channels", ChannelController, only: [:create, :index] do
      resources "/messages", MessageController, only: [:index]
      resources "/messages", MessageController, only: [], singleton: true do
        post "/read", ChannelController, :read, singleton: true
      end
    end

    resources "/direct_channels", DirectChannelController, only: [:index]
    post "/direct_channels/join", DirectChannelController, :join

    resources "/channel_users", ChannelUserController, only: [:create]
    resources "/users", UserController, only: [:index] do
    end
  end

  scope "/api", Exchat do
    pipe_through :api

    post "/sign_in", SessionController, :create
    post "/sign_up", UserController, :create
  end

  scope "/", Exchat do
    pipe_through :browser # Use the default browser stack

    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Exchat do
  #   pipe_through :api
  # end
end
