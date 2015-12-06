import { Schema, arrayOf } from 'normalizr'

const channelSchema = new Schema('channels', {idAttribute: 'id'})
const messageSchema = new Schema('messages')

messageSchema.define({
  channel: channelSchema
})

const Schemas = {
  CHANNEL: channelSchema,
  CHANNEL_ARRAY: arrayOf(channelSchema),
  MESSAGE: messageSchema,
  MESSAGE_ARRAY: arrayOf(messageSchema)
};
export default Schemas
