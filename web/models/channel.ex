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
    |> validate_format(:name, ~r/\A[\w\-]+\z/)
  end

  def direct_changeset(model, params \\ %{}) do
    changeset(model, params)
    |> put_change(:type, @type_direct)
    |> validate_required([:type])
  end

  defp changeset(model, params) do
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

  # Messages
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

  # User
  def direct_name(user_id1, user_id2) do
    [user_id1, user_id2] |> Enum.sort |> Enum.join(",")
  end

  def direct_user_ids(channel) do
    case channel.type do
      @type_direct -> channel.name |> String.split(",") |> Enum.map(&String.to_integer/1)
      _            -> raise ArgumentError, message: "#{inspect channel} is not a direct channel!"
    end
  end

  def opposite_direct_user_id(channel, user_id) when is_integer(user_id) do
    channel
      |> direct_user_ids
      |> List.delete(user_id)
      |> List.first
  end

  def is_direct?(channel) do
    channel.type == @type_direct
  end
end
