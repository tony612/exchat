defmodule Exchat.ChangesetView do
  use Exchat.Web, :view

  @doc """
  Traverses and translates changeset errors.

  See `Ecto.Changeset.traverse_errors/2` and
  `MyApp.ErrorHelpers.translate_error/1` for more details.

      %{title: ["should be at least 3 characters"]}
  """
  def translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end

  def render("error.json", %{changeset: changeset}) do
    # When encoded, the changeset returns its errors
    # as a JSON object. So we just pass it forward.
    %{errors: translate_errors(changeset)}
  end

  def render("message.json", %{changeset: changeset}) do
    %{message: errors_message(changeset)}
  end

  defp errors_message(changeset) do
    errors = translate_errors(changeset)
    Enum.reduce(errors, "", fn({field, msgs}, acc) ->
      field = field |> to_string |> String.capitalize
      msg = Enum.join(msgs)
      acc <> field <> " #{msg}\n"
    end)
  end
end
