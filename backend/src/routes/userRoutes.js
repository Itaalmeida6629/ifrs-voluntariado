const UserController = require('../controllers/userController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

router.post('/auth/login', UserController.login)
router.post('/users', UserController.createUser)

router.put('/users/:id', authenticateToken, UserController.updateUser)
router.get('/users/:id', authenticateToken, UserController.getUserById)

router.get('/users', authenticateToken, authorizeRole('admin'), UserController.getAllUsers)
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser)

module.exports = router
