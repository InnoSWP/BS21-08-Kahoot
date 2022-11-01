const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw new Error(error)
  }
}

UserSchema.pre('save', async function (next) {
  try {
    const user = this
    if (!user.isModified('password')) next()

    const hashedPassword = await bcrypt.hash(
      this.password,
      await bcrypt.genSalt(10)
    )
    this.password = hashedPassword
    next()
  } catch (err) {
    return next(err)
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User
