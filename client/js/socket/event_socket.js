import { Presence } from 'phoenix'
import { camelizeKeys } from 'humps'

import { syncPresences } from '../actions/users'
import ExSocket from './ex_socket'
import Auth from '../auth'
import { addDirectChannel, openDirectChannel } from '../actions/directChannels'
import { addUser } from '../actions/users'
import { addChannel } from '../actions/channels'

const EventSocket = {
  initEventChannel(dispatch, options) {
    let channel = ExSocket.findChannel('general', null, 'event')
    EventSocket.initGlobalCallbacks(channel, dispatch)
    let userChannel = ExSocket.findChannel(`general:${Auth.currentUser('userId')}`, null, 'event')
    EventSocket.initUserCallbacks(userChannel, dispatch, options)
  },

  initGlobalCallbacks(channel, dispatch) {
    let presences = {}
    channel.on("presence_state", state => {
      Presence.syncState(presences, state)
      dispatch(syncPresences(presences))
    })
    channel.on("presence_diff", diff => {
      Presence.syncDiff(presences, diff)
      dispatch(syncPresences(presences))
    })
    channel.on("user_created", payload => {
      dispatch(addUser(payload))
    })
    channel.on("channel_created", payload => {
      dispatch(addChannel(payload, dispatch))
    })
  },

  initUserCallbacks(channel, dispatch, options) {
    channel.on("dm_created", payload => {
      dispatch(addDirectChannel(camelizeKeys(payload), options.users, dispatch))
    })
    channel.on("dm_open", payload => {
      dispatch(openDirectChannel(camelizeKeys(payload), options.users))
    })
  },

  handleEvent(event, data) {

  }
}

export default EventSocket
