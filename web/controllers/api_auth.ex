defmodule Exchat.ApiAuth do
  import Plug.Conn
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  alias Exchat.User

  @default_jwt_secret Application.get_env(:exchat, User)[:jwt_secret]
  @default_expires_in 24 * 60 * 60 # 1 day

  def login(conn, user) do
    conn
    |> assign(:current_user, user)
    |> assign(:auth_token, generate_token(user))
  end

  def login_by_email_pass(conn, email, pass, opts) do
    repo = Keyword.fetch!(opts, :repo)
    user = repo.get_by(User, email: email)

    cond do
      user && checkpw(pass, user.password_hash) ->
        {:ok, login(conn, user)}
      user ->
        {:error, :unauthorized, conn}
      true ->
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

  def generate_token(user, expires_in \\ current_time + @default_expires_in, jwt_secret \\ @default_jwt_secret)
      when is_binary(jwt_secret) and is_integer(expires_in) do
    %{user_id: user.id}
    |> Joken.token
    |> Joken.with_exp(expires_in)
    |> Joken.with_signer(Joken.hs256(jwt_secret))
    |> Joken.sign
    |> Joken.get_compact
  end

  defp current_time() do
    {mega, secs, _} = :os.timestamp()
    mega * 1000000 + secs
  end

end
