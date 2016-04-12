defmodule Exchat.Repo.Migrations.CreateChannelUser do
  use Ecto.Migration

  def change do
    create table(:channels_users) do
      add :joined_at, :datetime
      add :channel_id, references(:channels, on_delete: :nilify_all)
      add :user_id, references(:users, on_delete: :nilify_all)

      timestamps
    end
    create index(:channels_users, [:user_id])
    create index(:channels_users, [:channel_id, :user_id], unique: true)

  end
end
