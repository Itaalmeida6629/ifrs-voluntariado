const UserController = require('../controllers/userController')
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware')
const express = require('express')

const router = express.Router()

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Autentica um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Dados de login inválidos
 *       '401':
 *         description: Email ou senha incorretos
 */
router.post('/auth/login', UserController.login)

/**
 * @openapi
 * /volunteers:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cadastra um voluntário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerCreate'
 *     responses:
 *       '201':
 *         description: Voluntário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Dados inválidos
 *       '409':
 *         description: Email já cadastrado
 */
router.post('/volunteers', UserController.createUser)

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - Usuários
 *     summary: Atualiza um usuário
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       '200':
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso negado
 *       '404':
 *         description: Usuário não encontrado
 */
router.put('/users/:id', authenticateToken, UserController.updateUser)

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Busca um usuário por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso negado
 *       '404':
 *         description: Usuário não encontrado
 */
router.get('/users/:id', authenticateToken, UserController.getUserById)

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Lista os usuários cadastrados
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 */
router.get('/users', authenticateToken, authorizeRole('admin'), UserController.getAllUsers)

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Remove um usuário
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
 *         description: Usuário removido com sucesso
 *       '401':
 *         description: Usuário não autenticado
 *       '403':
 *         description: Acesso restrito a administradores
 *       '404':
 *         description: Usuário não encontrado
 */
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), UserController.deleteUser)

module.exports = router
