const DashboardController = require('../controllers/dashboardController')
const { authenticateToken } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Consulta o dashboard do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard acessado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardResponse'
 *       '401':
 *         description: Usuário não autenticado
 */
router.get('/dashboard', authenticateToken, DashboardController.getDashboard)

module.exports = router
