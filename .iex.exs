import_file_if_available "~/.iex.exs"

IO.puts "Welcome to Exchat!"

alias Exchat.{User, Channel, Message, Repo, UserReadMessage, ChannelUser}
alias Exchat.Time, as: Extime

import_if_available Ecto.Query, only: [from: 1, from: 2]
