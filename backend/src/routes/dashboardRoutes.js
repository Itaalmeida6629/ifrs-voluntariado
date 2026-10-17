const DashboardController = require('../controllers/dashboardController')
const { authenticateToken } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

router.get('/dashboard', authenticateToken, DashboardController.getDashboard)

module.exports = router
