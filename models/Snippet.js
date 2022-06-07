/**
 * Mongoose model Snippet.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')

const snippetSchema = new mongoose.Schema({
  snippet: {
    type: String,
    required: true,
    maxlength: 1500,
    minlength: 1
  },
  title: {
    type: String,
    required: true,
    maxlength: 50,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    minlength: 1
  },
  language: {
    type: String,
    required: true,
    enum: ['text', 'html', 'javascript', 'java'],
    maxlength: 10,
    minlength: 1
  },
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Snippet = mongoose.model('Snippet', snippetSchema)

module.exports = Snippet
