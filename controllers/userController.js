/**
 *
 * Module for userController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../models/User')
const Snippet = require('../models/Snippet')
const createError = require('http-errors')
const userController = {}

/**
 * Returns a form for creating a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

userController.new = async (req, res) => {
  try {
    res.render('user/new')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/')
  }
}

/**
 * Creates a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.create = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      throw new Error('Password didnt match')
    }

    const userExists = await User.findOne({ username: username })

    if (userExists) {
      throw new Error('that username is already taken!')
    }

    const user = new User({
      username: username,
      password: password
    })

    await user.save()

    req.session.flash = { type: 'success', text: 'Account successfully created!' }
    res.redirect('/login')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/user/new')
  }
}

/**
 * Displays a specific user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
userController.show = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ username: req.params.id })
    if (!userExists) {
      throw new Error('User does not exist')
    }

    const viewData = {
      mySnippets: (await Snippet.find({ author: req.params.id }))
        .map(mySnippet => ({
          title: mySnippet.title,
          description: mySnippet.description,
          language: mySnippet.language,
          id: mySnippet._id
        })),
      author: req.params.id
    }

    res.render('user/show', { viewData })
  } catch (error) {
    next(createError(404, error.message))
  }
}

/**
 * Check if a user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} Express next middleware function.
 */
userController.isLoggedin = (req, res, next) => {
  if (req.session.user) {
    return next(createError(403))
  }
  next()
}

module.exports = userController
