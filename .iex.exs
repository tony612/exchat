import_file "~/.iex.exs", optional: true

IO.puts "Welcome to Exchat!"

alias Exchat.{User, Channel, Message, Repo}
alias Exchat.Time, as: Extime
