import _ from 'lodash'

import { Socket as PhoenixSocket } from 'phoenix'

const ExSocket = new PhoenixSocket('/socket')
ExSocket.connect()

if (ExSocket.findChannel) {
  console.log('findChannel of ExSocket is defined!')
} else {
  ExSocket.findChannel = function(name, callback) {
    let topicName = `channel:#${name}`
    let foundChannel = _.find(this.channels, (ch)=> ch.topic === topicName)
    if (!foundChannel) {
      foundChannel = ExSocket.channel(topicName, {})
    }
    if (foundChannel.state === 'closed') {
      foundChannel.join().receive('ok', chan => {
        console.log(`Joined ${foundChannel.topic}`)
        if (_.isFunction(callback)) {
          callback()
        }
      })
    }
    return foundChannel
  }
}

export default ExSocket
