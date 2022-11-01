const { default: mongoose } = require('mongoose')

const testQuiz = {
  name: 'So4',
  owner: mongoose.Types.ObjectId('62b312a242292d3506cb6c30'),
  questions: [
    {
      _id: 0,
      question: 'Question 0',
      image: '/files/pix/clueless.jpg',
      timeout: 5000,
      options: [
        { text: 'Option 00', correct: true },
        { text: 'Option 01', correct: false },
        { text: 'Option 02', correct: true },
        { text: 'Option 03', correct: false }
      ]
    },
    {
      _id: 1,
      question: 'Question 1',
      image: '/files/pix/quiz.jpg',
      timeout: 5000,
      options: [
        { text: 'Option 10', correct: false },
        { text: 'Option 11', correct: true },
        { text: 'Option 12', correct: false },
        { text: 'Option 13', correct: false }
      ]
    },
    {
      _id: 2,
      question: 'Question 2',
      image: '/files/pix/avatar.jpg',
      timeout: 5000,
      options: [
        { text: 'Option 20', correct: false },
        { text: 'Option 21', correct: false },
        { text: 'Option 22', correct: true },
        { text: 'Option 23', correct: false }
      ]
    }
  ]
}

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

class Game {
  constructor (quiz, id) {
    this.quiz = quiz
    this.gameId = id
    this.gameState = {
      state: 'Waiting',
      stateId: 0,
      subState: '',
      timeStarted: 0
    }
    this.players = []
    this.choices = []
  }

  finishGame () {
    this.gameState.state = 'Finished'
    console.log('Game finished')
  }

  async startGame () {
    console.log(this.gameState)
    for (let i = 0; i < this.quiz.questions.length; ++i) {
      this.choices.splice(0, this.choices.length)
      await this.runQuestion(i)
    }
    this.finishGame()
  }

  async runQuestion (questionId) {
    const question = this.quiz.questions[questionId]
    this.gameState = {
      state: 'Question',
      stateId: questionId,
      subState: 'Show',
      timeStarted: Date.now()
    }
    await sleep(question.timeout)
    this.choices.forEach((choice) => {
      if (question.options[choice.choice].correct === true) {
        const playerId = this.players.findIndex(e => e.id === choice.id)
        if (playerId !== -1) {
          this.players[playerId].score += Math.round(1000 - (choice.timeSubmitted - this.gameState.timeStarted) / question.timeout * 1000)
        }
      }
    })
    this.gameState.subState = 'Answers'
    console.log(this.gameState)
    await sleep(3000)
    this.gameState.subState = 'Leaderboard'
    await sleep(3000)
  }
}

module.exports = [Game, testQuiz]
