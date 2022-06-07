/**
 *
 * Snippet routes.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/issueController')

router.get('/', controller.index)
router.get('/new', controller.authorize, controller.new)
router.get('/:id', controller.show)
router.get('/:id/edit', controller.authorizeUser, controller.edit)
router.get('/:id/remove', controller.authorizeUser, controller.remove)
router.post('/create', controller.authorize, controller.create)
router.post('/:id/update', controller.authorizeUser, controller.update)
router.post('/:id/delete', controller.authorizeUser, controller.delete)

module.exports = router
