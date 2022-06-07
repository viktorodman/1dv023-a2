/**
 *
 * User routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')

router.get('/new', controller.isLoggedin, controller.new)
router.get('/:id', controller.show)
router.post('/create', controller.isLoggedin, controller.create)

module.exports = router
