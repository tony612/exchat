# Exchat

To start your Exchat:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Install npm dependencies with `npm install .`
  4. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

# TODO

- [x] Save messages sent for each channel
- [x] Fetch past messages on loaded
- [x] Join channel before fetching messages to avoid missing new messages
- [x] Use channel id instead of name in frontend
- [x] Use timestamp as keys of messages
- [x] Highlight the active Channel
- [x] Use rscss for css code
- [x] Each channel post input should be different
- [x] Build user system
- [x] Load past messages when user scroll to the top
- [x] Format the message sent
- [x] Make the channel creating better
- [ ] Display the error message properly
- [x] Refactor time in message
