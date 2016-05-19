import _ from 'lodash'
import { Socket as PhoenixSocket } from 'phoenix'

const ExSocket = {
  socket: null,

  connect(token, silent = false) {
    if (!this.socket) {
      this.socket = new PhoenixSocket('/socket', {
        params: {token: token}
      })
      this.socket.connect()
      console.log("Socket connected!")
    } else if (!this.connAvaiable()) {
      this.socket.connect()
      console.log("Socket reconnected!")
    } else if (!silent) {
      console.warn("Try to connect a connected socket.")
    }
  },

  connAvaiable() {
    return this.socket && (this.socket.connectionState() === 'open' ||
                           this.socket.connectionState() === 'connecting')
  },

  disconnect() {
    if (!this.socket) { return }
    this.socket.disconnect(()=> {
      this.socket.reconnectTimer.reset()
      this.socket = null
      console.log('Socket disconnected!')
    })
  },

  socketAvaiable() {
    this.socket && this.socket.connectionState() === 'closing'
  },

  findChannel(id, callback, prefix = 'channel') {
    if (!this.socket) {
      console.error("No socket connection, please connect first")
      return false
    }
    let topicName = `${prefix}:${id}`
    let foundChannel = _.find(this.socket.channels, (ch)=> ch.topic === topicName)
    if (!foundChannel) {
      foundChannel = this.socket.channel(topicName, {})
    }
    if (foundChannel.state === 'closed') {
      foundChannel.join().receive('ok', data => {
        console.log(`Joined ${foundChannel.topic}`)
        if (_.isFunction(callback)) {
          callback(data)
        }
      })
    }
    return foundChannel
  }

}

export default ExSocket
