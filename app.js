/**
 * The starting point of the application.
 *
 * External modules used in this project.
 * Bcrypt: https://www.npmjs.com/package/bcrypt.
 * Dotenv: https://www.npmjs.com/package/dotenv.
 * Express: https://www.npmjs.com/package/express.
 * Express-hbs: https://www.npmjs.com/package/express-hbs.
 * Express-session: https://www.npmjs.com/package/express-session.
 * Helmet: https://www.npmjs.com/package/helmet.
 * Http-errors: https://www.npmjs.com/package/http-error.
 * Moment: https://www.npmjs.com/package/moment.
 * Mongoose: https://www.npmjs.com/package/mongoose.
 * Morgan: https://www.npmjs.com/package/express-hbs.
 *
 * Prismjs: https://prismjs.com/.
 * Materialize: https://materializecss.com/.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

require('dotenv').config()

const createError = require('http-errors')
const helmet = require('helmet')
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')
const { join } = require('path')
const logger = require('morgan')

const mongoose = require('./configs/mongoose')

const app = express()

// connect to the database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// View Engine setup

app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Additional middlewares
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'cdnjs.cloudflare.com'],
    scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
  }
}))
app.use(logger('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(__dirname, 'public')))

const sessionOptions = {
  name: 'snippets are snippets',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    httpOnly: true
  }
}

app.use(session(sessionOptions))

app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user
  }

  next()
})

// Routes
app.use('/', require('./routes/homeRouter'))
app.use('/snippets', require('./routes/snippetRouter'))
app.use('/login', require('./routes/loginRouter'))
app.use('/user', require('./routes/userRouter'))

app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  if (err.status === 403) {
    return res
      .status(403)
      .sendFile(join(__dirname, 'views', 'errors', '403.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Only providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})
app.listen(8000, () => {
  console.log('Server running at http://localhost:8000')
  console.log('Press Ctrl-C to terminate...')
})
