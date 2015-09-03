import { Socket } from 'deps/phoenix/web/static/js/phoenix'

let socket = new Socket('/socket');
socket.connect();
let channel = socket.channel('channel:#random', {})

channel.join().receive('ok', channel =>
  console.log('Welcome to Exchat!')
)

const initialState = channel

export default function channel(state = initialState, action) {
  switch (action.type) {
  default:
    return state
  }
}
