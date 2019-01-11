const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Now creating Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
})

module.exports = mongoose.model('User', UserSchema);