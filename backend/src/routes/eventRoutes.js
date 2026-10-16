const EventController = require('../controllers/eventController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

router.get('/events', EventController.getAllEvents)
router.get('/events/:id', EventController.getEventById)

router.post('/events', authenticateToken, authorizeRole('admin'), EventController.createEvent)
router.put('/events/:id', authenticateToken, authorizeRole('admin'), EventController.updateEvent)
router.delete('/events/:id', authenticateToken, authorizeRole('admin'), EventController.deleteEvent)

module.exports = router
