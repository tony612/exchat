defmodule Exchat.User do
  use Exchat.Web, :model

  schema "users" do
    field :email, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    many_to_many :channels, Exchat.Channel, join_through: Exchat.ChannelUser
    has_many :channel_users, Exchat.ChannelUser

    timestamps()
  end

  @required_fields ~w(email password)a
  @allowed_fields @required_fields

  @email_regex ~r/\A[^@\s]+@([^@\s]+\.)+[^@\W]+\z/i

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
    |> validate_format(:email, @email_regex)
    |> validate_length(:password, min: 6)
    |> unique_constraint(:email)
    |> put_pass_hash()
  end

  defp put_pass_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: pass}} ->
        put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(pass))
      _ ->
        changeset
    end
  end

  def username(%{email: email} = _user) do
    String.split(email, "@") |> List.first
  end
end
