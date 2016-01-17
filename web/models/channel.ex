defmodule Exchat.Channel do
  use Exchat.Web, :model

  alias Exchat.Message
  alias Exchat.Repo

  schema "channels" do
    field :name, :string
    has_many :messages, Message

    timestamps usec: true
  end

  @required_fields ~w(name)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def messages_before(model, ts, limit \\ 100) do
    time = Message.to_datetime(ts)
    from m in Message,
      where: m.channel_id == ^model.id and m.inserted_at <= ^time,
      limit: ^limit
  end
end
