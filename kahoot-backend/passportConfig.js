const LocalStrategy = require('passport-local').Strategy
const User = require('./models/userModel')

module.exports = (passport) => {
  // passport.use(express.json());
  passport.use(
    'local-signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const name = req.body.name
          // the user exists
          const userExists = await User.findOne({ email })
          if (userExists) {
            return done(null, false)
          }

          // create a new user
          const user = await User.create({ name, email, password })
          return done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )
  passport.use(
    'local-signin',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) return done(null, false)
          const isMatch = await user.matchPassword(password)
          if (!isMatch) return done(null, false)
          // if passwords match return user
          return done(null, user)
        } catch (error) {
          console.log(error)
          return done(error, false)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
