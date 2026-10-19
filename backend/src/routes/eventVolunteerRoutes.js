const EventVolunteerController = require('../controllers/eventVolunteerController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

/**
 * @openapi
 * /events/{eventoId}/volunteers:
 *   post:
 *     tags:
 *       - Inscrições
 *     summary: Inscreve o voluntário autenticado em um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventoId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '201':
 *         description: Inscrição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegistrationResponse'
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Apenas voluntários podem se inscrever
 *       '404':
 *         description: Evento ou usuário não encontrado
 *       '409':
 *         description: Inscrição duplicada, evento finalizado ou limite atingido
 */
router.post('/events/:eventoId/volunteers', authenticateToken, EventVolunteerController.registerVolunteer)

/**
 * @openapi
 * /events/{eventoId}/volunteers:
 *   get:
 *     tags:
 *       - Inscrições
 *     summary: Lista os voluntários inscritos em um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventoId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de inscritos
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 *       '404':
 *         description: Evento não encontrado
 */
router.get(
  '/events/:eventoId/volunteers',
  authenticateToken,
  authorizeRole('admin'),
  EventVolunteerController.getEventVolunteers
)

/**
 * @openapi
 * /events/{eventoId}/volunteers/me:
 *   delete:
 *     tags:
 *       - Inscrições
 *     summary: Cancela a inscrição do voluntário autenticado
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventoId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Inscrição cancelada com sucesso
 *       '401':
 *         description: Usuário não autenticado
 *       '404':
 *         description: Evento, usuário ou inscrição não encontrados
 */
router.delete('/events/:eventoId/volunteers/me', authenticateToken, EventVolunteerController.cancelVolunteer)

module.exports = router
