import_file "~/.iex.exs", optional: true

IO.puts "Welcome to Exchat!"

alias Exchat.{User, Channel, Message, Repo, UserReadMessage}
alias Exchat.Time, as: Extime

import Ecto.Query, only: [from: 1, from: 2]
