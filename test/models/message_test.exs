defmodule Exchat.MessageTest do
  use Exchat.ModelCase, async: true

  alias Exchat.Message

  @valid_attrs %{text: "some content", channel_id: 123, user_id: 321}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Message.changeset(%Message{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Message.changeset(%Message{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "ts returns timestamp of inserted_at" do
    ts = 1446912799.000321
    message = %Message{inserted_at: Extime.to_datetime(ts)}
    assert Message.ts(message) == ts
  end
end
