import { Schema, arrayOf } from 'normalizr'

const channelSchema = new Schema('channels', {idAttribute: 'id'})
const messageSchema = new Schema('messages', {idAttribute: 'ts'})
const userSchema    = new Schema('users', {idAttribute: 'id'})

messageSchema.define({
  channel: channelSchema
})

const Schemas = {
  channel: channelSchema,
  channelArray: arrayOf(channelSchema),
  message: messageSchema,
  messageArray: arrayOf(messageSchema),
  userArray: arrayOf(userSchema)
}
export default Schemas
