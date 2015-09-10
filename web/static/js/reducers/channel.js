import { Socket } from 'deps/phoenix/web/static/js/phoenix'
import * as types from '../constants/ActionTypes'

let socket = new Socket('/socket');
socket.connect();
let channel = socket.channel('channel:#random', {})

channel.join().receive('ok', channel =>
  console.log('Welcome to Exchat!')
)

const initialState = channel

export default function channel(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_CHANNEL_SUCCESS:
      return state
    break
    default:
      return state
  }
}
