/**
 * Mongoose model User.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'The Username must be between 3-16 characters long'],
    maxlength: [16, 'The Username must be between 3-16 characters long'],
    validate: {
      validator: function (v) {
        return /^[a-z0-9_-]{3,16}$/ig.test(v)
      },
      message: 'Username must only contain alphanumeric characters underscore and dash'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'The password must be of the minimum length of 10 characters']
  }
}, {
  timestamps: true,
  versionKey: false
})

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

userSchema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid Login Attempt.')
  }

  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
