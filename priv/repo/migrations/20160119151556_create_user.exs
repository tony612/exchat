defmodule Exchat.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :password_hash, :string

      timestamps
    end

    create index(:users, [:email], unique: true)

  end
end
