defmodule Exchat.UserTest do
  use Exchat.ModelCase, async: true

  alias Exchat.User

  @valid_attrs %{email: "tony@ex.chat", password: "some content"}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset1 = User.changeset(%User{}, %{})
    refute changeset1.valid?
    changeset2 = User.changeset(%User{}, %{email: "wrong email"})
    refute changeset2.valid?
    changeset3 = User.changeset(%User{}, %{email: "wrong @email"})
    refute changeset3.valid?
  end

  test "test invalid email" do
    refute User.changeset(%User{}, %{email: "a@wrong@email"}).valid?
    refute User.changeset(%User{}, %{email: "wrong@email."}).valid?
    refute User.changeset(%User{}, %{email: "wrong@email. "}).valid?
  end

  test "put_pass_hash will be set" do
    changeset = User.changeset(%User{}, @valid_attrs)
    %{password: password, password_hash: pass_hash} = changeset.changes

    assert changeset.valid?
    assert pass_hash
    assert Comeonin.Bcrypt.checkpw(password, pass_hash)
  end
end
