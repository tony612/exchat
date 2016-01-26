defmodule Exchat.ApiAuth do
  import Plug.Conn
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]
  import Joken, only: [token: 1, with_exp: 2, with_signer: 2, sign: 1, get_compact: 1, verify: 1, hs256: 1]

  alias Exchat.User

  @default_jwt_secret Application.get_env(:exchat, User)[:jwt_secret]
  @default_expires_in 7 * 24 * 60 * 60 # 7 day

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

  def generate_token(user, expires \\ :os.system_time(:seconds) + @default_expires_in, jwt_secret \\ @default_jwt_secret)
      when is_binary(jwt_secret) and is_integer(expires) do
    %{user_id: user.id}
    |> token
    |> with_exp(expires)
    |> with_signer(hs256(jwt_secret))
    |> sign
    |> get_compact
  end

  def parse_token(token, jwt_secret \\ @default_jwt_secret) do
    token
    |> token
    |> with_signer(hs256(jwt_secret))
  end

end
