const mongoose = require('mongoose')

const connect = async (dburl) => {
  mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection
  db.on('error', () => {
    console.log('could not connect')
  })
  db.once('open', () => {
    console.log('> Successfully connected to database')
  })
}

module.exports = { connect }
