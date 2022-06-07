/**
 *
 * Login routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/loginController')

router.post('/', controller.indexPost)
router.get('/', controller.index)
router.post('/logout', controller.logout)
module.exports = router
