const express = require('express')
const session = require('express-session')
const dotenv = require('dotenv')
const db = require('./db')
const bodyParser = require('body-parser')
const passport = require('passport')
const passportConfig = require('./passportConfig')
const connectEnsureLogin = require('connect-ensure-login')
const multer = require('multer')
const [Game, testQuiz] = require('./game')
const Quiz = require('./models/quizModel')
const app = express()
const PORT = 5000

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  })
)
app.use(passport.initialize())
app.use(passport.session())

db.connect(process.env.DBURL)
passportConfig(passport)

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, '/var/www/files/pix')
  },
  filename: (req, file, next) => {
    next(null, `${Date.now()}-${file.originalname}`)
  }
})

const imageFilter = (req, file, next) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    next(null, true)
  } else {
    next(null, false)
  }
}

const uploadImage = multer({
  storage,
  fileFilter: imageFilter
})

app.post('/api/v1/uploadImage', connectEnsureLogin.ensureLoggedIn(), uploadImage.single('file'), async (req, res, next) => {
  if (req.file) {
    res.send({
      status: 'OK',
      path: req.file.filename
    })
  } else {
    res.status(500)
    res.send({
      status: 'File is empty!'
    })
  }
})

app.post(
  '/api/v1/signup',
  passport.authenticate('local-signup'),
  (req, res) => {
    res.json({
      status: 'OK',
      user: req.user
    })
  }
)

app.post(
  '/api/v1/signin',
  passport.authenticate('local-signin', {
    failureRedirect: '/error'
  }),
  (req, res) => {
    res.json({
      status: 'OK'
    })
  }
)

app.post('/api/v1/logout', (req, res, next) => {
  req.logout((err) => {
    res.json({
      status: 'OK'
    })
    if (err) { return next(err) }
  })
})

app.post(
  '/api/v1/getUser',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    res.json({
      status: 'OK',
      name: req.user.name
    })
  }
)

app.post(
  '/api/v1/getUserId',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    res.json({
      status: 'OK',
      name: req.user._id
    })
  }
)

const games = []
games.push(new Game(testQuiz, 123))
console.log(games)

app.post('/api/v1/joinGame', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    let name = req.user.name
    let playerIndex = games[index].players.findIndex(e => e.name === name)
    for (let i = 1; playerIndex !== -1; ++i) {
      name = `${name} (${i.toString()})`
      playerIndex = games[index].players.findIndex(e => e.name === name)
    }

    games[index].players.push({ id: req.user._id.toString(), name, score: 0 })
    res.json({
      status: 'Successfully connected to the game!'
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/createGame', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  let gameId = Math.floor(100000 + Math.random() * 900000)
  while (games.findIndex(e => e.gameId === gameId) !== -1) {
    gameId = Math.floor(100000 + Math.random() * 900000)
  }

  Quiz.findOne({ _id: req.body._id, owner: req.user.id }, (err, quiz) => {
    if (err) {
      console.log(err)
      res.status(404)
      res.json({
        status: 'Not found!'
      })
      return
    }
    if (games.findIndex(e => e.quiz._id === quiz._id) === -1) {
      games.push(new Game(quiz, gameId))
      console.log(games)
      res.send({
        status: 'OK',
        gameId
      })
    } else {
      res.status(500)
      res.send({
        status: 'Game already exists'
      })
    }
  })
})

app.post('/api/v1/startGame', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    games[index].startGame()
    res.json({
      status: 'Successfully started the game!'
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/stopGame', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    games.splice(index, 1)

    res.json({
      status: 'Successfully stopped the game!'
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/players', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    res.json({
      status: 'OK',
      players: games[index].players
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/gameState', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    res.json({
      status: 'OK',
      gameState: games[index].gameState
    })
  } else {
    res.status(404)
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/getQuestion', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    const tempQuestion = games[index].quiz.questions[games[index].gameState.stateId]

    const questionWithoutAnswers = {
      _id: tempQuestion._id.toString(),
      question: tempQuestion.question,
      image: tempQuestion.image,
      options: []
    }

    for (let i = 0; i < tempQuestion.options.length; ++i) {
      questionWithoutAnswers.options.push({ _id: tempQuestion.options[i]._id.toString(), text: tempQuestion.options[i].text })
    }

    console.log(questionWithoutAnswers)

    res.json({
      status: 'OK',
      question: questionWithoutAnswers
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/getAnswers', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    if (games[index].gameState.subState === 'Answers') {
      res.json({
        status: 'OK',
        options: games[index].quiz.questions[games[index].gameState.stateId].options
      })
    } else {
      res.status(403)
      res.json({
        status: 'Permission denied!'
      })
    }
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/getTimeLeft', (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    res.json({
      status: 'OK',
      timeLeft: Math.max(games[index].gameState.timeStarted + games[index].quiz.questions[games[index].gameState.stateId].timeout - Date.now(), 0)
    })
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/submitChoice', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    if (games[index].choices.findIndex(e => e.id === req.user._id.toString()) === -1) {
      games[index].choices.push({
        id: req.user._id.toString(),
        timeSubmitted: Date.now(),
        choice: req.body.choice
      })
      res.json({
        status: 'OK'
      })
    } else {
      res.json({
        status: 'Already submited!'
      })
    }
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/getScore', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const index = games.findIndex(e => e.gameId === parseInt(req.body.gameId))
  if (index !== -1) {
    const currentPlayerIndex = games[index].players.findIndex(e => e.id === req.user._id.toString())
    if (currentPlayerIndex !== -1) {
      res.json({
        status: 'OK',
        score: games[index].players[currentPlayerIndex].score
      })
    } else {
      res.status(403)
      res.json({
        status: 'Player not found'
      })
    }
  } else {
    res.json({
      status: 'Game does not exist!'
    })
  }
})

app.post('/api/v1/createQuiz', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  const curQuiz = req.body.quiz
  curQuiz.owner = req.user._id
  const dbQuiz = new Quiz(curQuiz)
  await dbQuiz.save((err) => {
    if (err) {
      console.log(err)
      res.status(500)
      res.json({ status: 'Couldn\'t create a quiz!' })
    }

    res.json({ status: 'OK', dbQuiz })
  })
})

app.post('/api/v1/removeQuiz', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  Quiz.deleteOne({ _id: req.body.id }, (err) => {
    if (err) {
      console.log('Couldn\'t delete the quiz!')
      res.status(500)
      res.json({
        status: 'Couldn\'t delete the quiz!'
      })
    }
    res.json({
      status: 'OK'
    })
  })
})

app.post('/api/v1/addQuestion', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  Quiz.findById(req.body.id, async (err, quiz) => {
    if (err) {
      console.log(err)
      res.status(404)
      res.json({
        status: 'Not found!'
      })
      return
    }

    if (quiz.owner.toString() === req.user._id.toString()) {
      if (quiz.questions.findIndex((e) => e.id === req.body.question.id || e.question === req.body.question.question) !== -1) {
        res.json({
          status: 'Question already exists!'
        })
      } else {
        quiz.questions.push(req.body.question)
        quiz.markModified('questions')
        quiz.save((err) => {
          if (err) {
            console.log(err)
            res.status(500)
            res.json({
              status: err
            })
          }

          res.json({
            status: 'OK'
          })
        })
      }
    } else {
      res.status(403)
      res.json({
        status: 'Permission denied!'
      })
    }
  })
})

app.post('/api/v1/removeQuestion', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  Quiz.findById(req.body.quizId, async (err, quiz) => {
    if (err) {
      console.log(err)
      res.status(404)
      res.json({
        status: 'Not found!'
      })
      return
    }

    console.log(req.body.questionId)
    if (quiz.owner.toString() === req.user._id.toString()) {
      const questionIndex = quiz.questions.findIndex((e) => e._id.toString() === req.body.questionId)
      if (questionIndex !== -1) {
        const questions = quiz.questions
        questions.splice(questionIndex, 1)
        quiz.questions = questions
        quiz.markModified('questions')
        quiz.save((err) => {
          if (err) {
            console.log(err)
            res.status(500)
            res.json({
              status: err
            })
          }

          res.json({
            status: 'OK'
          })
        })
      } else {
        res.json({
          status: 'Question does not exist!'
        })
      }
    } else {
      res.status(403)
      res.json({
        status: 'Permission denied!'
      })
    }
  })
})

app.post('/api/v1/getQuiz', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  Quiz.findOne({ _id: req.body._id, owner: req.user.id }, (err, quiz) => {
    if (err) {
      console.log(err)
      res.status(404)
      res.json({
        status: 'Not found!'
      })
      return
    }

    res.json({
      status: 'OK',
      quiz
    })
  })
})

app.post('/api/v1/getQuizzes', connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  Quiz.find({ owner: req.user.id }, async (err, docs) => {
    if (err) {
      console.log(err)
      res.status(404)
      res.json({
        status: 'Not found!'
      })
      return
    }

    res.json({
      status: 'OK',
      quizzes: docs
    })
  })
})

app.listen(PORT, (error) => {
  if (!error) console.log('Listening on port ' + PORT)
  else console.log('Error!', error)
})
