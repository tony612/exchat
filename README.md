# Exchat

To start your Phoenix app:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

# TODO

- [x] Save messages sent for each channel
- [x] Fetch past messages on loaded
- [x] Join channel before fetching messages to avoid missing new messages
- [x] Use channel id instead of name in frontend
- [ ] Use timestamp as keys of messages
- [ ] Highlight the active Channel
- [ ] Show channel info in the channel page
- [ ] Make the channel creating better
- [ ] Each channel post input should be different
- [ ] Format the message sent
- [ ] Load past messages when user scroll to the top
- [ ] Build user system
