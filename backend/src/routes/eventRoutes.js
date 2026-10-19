const EventController = require('../controllers/eventController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

/**
 * @openapi
 * /events:
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Lista os eventos
 *     responses:
 *       '200':
 *         description: Lista de eventos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/events', EventController.getAllEvents)

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags:
 *       - Eventos
 *     summary: Busca um evento por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Evento não encontrado
 */
router.get('/events/:id', EventController.getEventById)

/**
 * @openapi
 * /events:
 *   post:
 *     tags:
 *       - Eventos
 *     summary: Cadastra um evento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventCreate'
 *     responses:
 *       '201':
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       '400':
 *         description: Dados do evento inválidos
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 */
router.post('/events', authenticateToken, authorizeRole('admin'), EventController.createEvent)

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     tags:
 *       - Eventos
 *     summary: Atualiza um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventUpdate'
 *     responses:
 *       '200':
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *       '400':
 *         description: Dados do evento inválidos
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 *       '404':
 *         description: Evento não encontrado
 */
router.put('/events/:id', authenticateToken, authorizeRole('admin'), EventController.updateEvent)

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags:
 *       - Eventos
 *     summary: Remove um evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Evento removido com sucesso
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 *       '404':
 *         description: Evento não encontrado
 */
router.delete('/events/:id', authenticateToken, authorizeRole('admin'), EventController.deleteEvent)

module.exports = router
