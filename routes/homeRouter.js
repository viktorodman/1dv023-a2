/**
 *
 * Home routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

router.get('/', controller.index)

module.exports = router
