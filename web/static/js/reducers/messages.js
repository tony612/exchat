import { RECEIVED_MESSAGE } from '../constants/ActionTypes'

const initialState = []

export default function messages(state = initialState, action) {
  switch (action.type) {
  case RECEIVED_MESSAGE:
    return [...state, {
      ts: (new Date).toLocaleString(),
      text: action.text
    }]
    break;
  default:
    return state
  }
}
