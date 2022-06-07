/**
 *
 * Module for snippetController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const Snippet = require('../models/Snippet')

const snippetController = {}
const createError = require('http-errors')

/**
 * Displays all the snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetController.index = async (req, res, next) => {
  try {
    const viewData = {
      userSnippets: (await Snippet.find({}))
        .map(userSnippet => ({
          title: userSnippet.title,
          description: userSnippet.description,
          language: userSnippet.language,
          author: userSnippet.author,
          id: userSnippet._id
        }))
    }
    res.render('snippets/index.hbs', { viewData })
  } catch (error) {
    next(createError(404))
  }
}

/**
 * Displays a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetController.show = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    if (!snippet) {
      throw new Error('Snippet does not exist')
    }

    const viewData = {
      snippetstr: snippet.snippet,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      author: snippet.author,
      id: snippet._id,
      isUserSnippet: (snippet.author === req.session.user)
    }

    res.render('snippets/show.hbs', { viewData })
  } catch (error) {
    next(createError(404, error.message))
  }
}

/**
 * Returns a form for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 *
 */
snippetController.new = async (req, res) => {
  res.render('snippets/new')
}

/**
 * Returns a form for editing a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
snippetController.edit = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })

    const viewData = {
      snippetstr: snippet.snippet,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      author: snippet.author,
      id: snippet._id
    }

    res.render('snippets/edit', { viewData })
  } catch (error) {
    next(createError(403, error.message))
  }
}

/**
 * Updates a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 *
 */
snippetController.update = async (req, res) => {
  try {
    const { snippetstr, title, description, language, id } = req.body

    const result = await Snippet.updateOne({ _id: id }, {
      snippet: snippetstr,
      title: title,
      description: description,
      language: language
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Snippet was successfully Updated!' }
    } else {
      req.session.flash = { type: 'danger', text: 'Something went wrong when updating the snippet.' }
    }
    res.redirect('/snippets/' + id)
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/snippets')
  }
}

/**
 * Returns a form for removing a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetController.remove = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })

    const viewData = {
      title: snippet.title,
      id: snippet._id
    }

    res.render('snippets/remove', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/snippets')
  }
}

/**
 * Deletes a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 *
 */
snippetController.delete = async (req, res) => {
  try {
    await Snippet.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'Snippet was successfully Deleted!' }
    res.redirect('/snippets')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/snippets')
  }
}

/**
 * Creates a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 *
 */
snippetController.create = async (req, res) => {
  try {
    const { snippetstr, title, description, language } = req.body

    const snippet = new Snippet({
      snippet: snippetstr,
      title: title,
      description: description,
      language: language,
      author: req.session.user
    })

    await snippet.save()

    req.session.flash = { type: 'success', text: 'Snippet was successfully created!' }
    res.redirect('/snippets')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('/')
  }
}

/**
 * Returns a form for editing a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} - Express next middleware function.
 */
snippetController.authorize = (req, res, next) => {
  if (!req.session.user) {
    return next(createError(403))
  }
  next()
}

/**
 * Returns a form for editing a specific snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} - Express next middleware function.
 */
snippetController.authorizeUser = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })

    if (req.session.user !== snippet.author) {
      return next(createError(403))
    }
    next()
  } catch (error) {
    next(createError(404))
  }
}

module.exports = snippetController
