defmodule Exchat.Channel do
  use Exchat.Web, :model

  alias Exchat.Message

  schema "channels" do
    field :name, :string
    field :type, :integer
    has_many :messages, Message
    many_to_many :users, Exchat.User, join_through: Exchat.ChannelUser

    timestamps usec: true
  end

  @type_public 1
  @type_direct 2

  @allowed_fields ~w(name type)a

  def public_changeset(model, params \\ %{}) do
    changeset(model, params)
    |> put_change(:type, @type_public)
    |> validate_required([:type])
  end

  def direct_changeset(model, params \\ %{}) do
    changeset(model, params)
    |> put_change(:type, @type_direct)
    |> validate_required([:type])
  end

  defp changeset(model, params \\ %{}) do
    model
    |> cast(params, @allowed_fields)
    |> validate_required([:name])
    |> unique_constraint(:name)
  end

  def public(query \\ __MODULE__) do
    from query, where: [type: @type_public]
  end

  def direct(query \\ __MODULE__) do
    from query, where: [type: @type_direct]
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
