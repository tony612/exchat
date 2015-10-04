defmodule Exchat.Repo.Migrations.CreateMessage do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :text, :text, null: false
      add :channel_id, references(:channels), null: false

      timestamps
    end
    create index(:messages, [:channel_id])

  end
end
