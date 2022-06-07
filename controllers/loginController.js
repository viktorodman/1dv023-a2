/**
 *
 * Module for loginController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const User = require('../models/User')

const loginController = {}

/**
 * Returns the login form.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.index = async (req, res) => {
  try {
    if (req.session.user) {
      throw new Error('A user is already logged in.')
    }
    res.render('login/index.hbs')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 *
 * Logs in the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.indexPost = async (req, res) => {
  try {
    if (req.session.user) {
      throw new Error('A user is already logged in.')
    }

    const { username, password } = req.body
    if (!username || !password) {
      throw new Error('Please enter all fields')
    }

    const user = await User.authenticate(username, password)
    req.session.flash = { type: 'success', text: `Welcome ${username}` }
    req.session.user = user.username
    res.redirect('/user/' + username)
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/login')
  }
}

/**
 * Logs out form.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.logout = async (req, res) => {
  try {
    if (!req.session.user) {
      throw new Error('No user is logged in')
    }
    req.session.flash = { type: 'success', text: 'You are now logged out!' }
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/')
  }
}

module.exports = loginController
