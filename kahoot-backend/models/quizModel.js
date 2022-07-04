const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  questions: {
    type: [{
      question: { type: String, required: true },
      image: { type: String, required: true },
      timeout: { type: Number, required: true },
      options: {
        type: [
          { text: { type: String, required: true }, correct: { type: Boolean, required: true } }
        ]
      }
    }],
    required: true
  }
})

const Quiz = mongoose.model('quiz', QuizSchema)

module.exports = Quiz
