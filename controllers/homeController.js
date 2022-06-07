/**
 *
 * Module for homeController.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 *
 */

'use strict'

const homeController = {}

const viewData = {
  homePageSnippet: 'shuffleCards (array) {\n    let currentIndex = array.length\n    let temporaryValue = 0\n    let randomIndex = 0\n\n    while (currentIndex !== 0) {\n      randomIndex = Math.floor(Math.random() * currentIndex)\n      currentIndex -= 1\n\n      temporaryValue = array[currentIndex]\n      array[currentIndex] = array[randomIndex]\n      array[randomIndex] = temporaryValue\n    }\n  }',
  language: 'javascript'
}
/**
 * Displays the home page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
homeController.index = async (req, res) => {
  res.render('home/index.hbs', { viewData })
}

module.exports = homeController
