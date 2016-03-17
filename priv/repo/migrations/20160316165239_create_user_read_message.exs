defmodule Exchat.Repo.Migrations.CreateUserReadMessage do
  use Ecto.Migration

  def change do
    create table(:user_read_messages) do
      add :message_id, :integer
      add :latest_ts, :datetime
      add :user_id, references(:users, on_delete: :nilify_all)
      add :channel_id, references(:channels, on_delete: :nilify_all)

      timestamps
    end
    create unique_index(:user_read_messages, [:user_id, :channel_id])

  end
end
