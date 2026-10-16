const EventVolunteerController = require('../controllers/eventVolunteerController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

router.post('/events/:eventoId/volunteers', authenticateToken, EventVolunteerController.registerVolunteer)
router.get(
  '/events/:eventoId/volunteers',
  authenticateToken,
  authorizeRole('admin'),
  EventVolunteerController.getEventVolunteers
)
router.delete('/events/:eventoId/volunteers/me', authenticateToken, EventVolunteerController.cancelVolunteer)

module.exports = router
