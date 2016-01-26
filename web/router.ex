defmodule Exchat.Router do
  use Exchat.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Exchat do
    pipe_through :api

    resources "channels", ChannelController, only: [:create, :index] do
      resources "messages", MessageController, only: [:index]
    end

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
