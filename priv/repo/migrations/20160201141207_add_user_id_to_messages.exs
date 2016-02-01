defmodule Exchat.Repo.Migrations.AddUserIdToMessages do
  use Ecto.Migration

  def change do
    alter table(:messages) do
      add :user_id, references(:users), null: false
    end
    create index(:messages, [:user_id])
  end
end
