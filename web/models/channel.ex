defmodule Exchat.Channel do
  use Exchat.Web, :model

  alias Exchat.Message

  schema "channels" do
    field :name, :string
    has_many :messages, Message
    many_to_many :users, Exchat.User, join_through: Exchat.ChannelUser

    timestamps usec: true
  end

  @required_fields ~w(name)a
  @allowed_fields @required_fields

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:name)
  end

  def messages_before(channel, ts, limit \\ 100)
  def messages_before(channel, ts, limit) when is_number(ts) do
    time = Extime.to_datetime(ts)
    messages_before(channel, time, limit)
  end
  def messages_before(channel, time, limit) do
    from m in Message,
      where: m.channel_id == ^channel.id and m.inserted_at < ^time,
      limit: ^limit,
      order_by: [desc: m.inserted_at]
  end

  def messages_count_after(channel, ts) when is_number(ts) do
    time = Extime.to_datetime(ts)
    messages_count_after(channel, time)
  end
  def messages_count_after(channel, time) do
    from m in Message,
      where: m.channel_id == ^channel.id and m.inserted_at > ^time,
      select: count(m.id)
  end
end
