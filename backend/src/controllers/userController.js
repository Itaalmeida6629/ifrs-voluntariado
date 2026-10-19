const UserService = require('../services/userService')

/** Controladores HTTP relacionados aos usuários. */
class UserController {
  /**
   * Processa o login e retorna o token JWT.
   *
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o token ou erro encaminhado.
   */
  static async login(req, res, next) {
    try {
      const { token } = await UserService.login(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Lista os usuários cadastrados.
   *
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com os usuários.
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Busca um usuário pelo ID.
   *
   * @param {Object} req - Requisição HTTP com o ID nos parâmetros.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o usuário encontrado.
   */
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params
      const user = await UserService.getUserById(id, req.user)
      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Busca um usuário pelo email.
   *
   * @param {Object} req - Requisição HTTP com o email nos parâmetros.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o usuário encontrado.
   */
  static async findUserByEmail(req, res, next) {
    try {
      const { email } = req.params
      const user = await UserService.findUserByEmail(email)
      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Cria um voluntário ou usuário autorizado.
   *
   * @param {Object} req - Requisição HTTP com os dados no corpo.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o usuário criado.
   */
  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body, req.user)
      return res.status(201).json({ message: 'Usuário criado com sucesso', user })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Atualiza um usuário.
   *
   * @param {Object} req - Requisição HTTP com ID e dados de atualização.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o usuário atualizado.
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await UserService.updateUser(id, req.body, req.user)
      return res.status(200).json({ message: 'Usuário atualizado com sucesso', user })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Remove um usuário.
   *
   * @param {Object} req - Requisição HTTP com o ID nos parâmetros.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta HTTP sem conteúdo.
   */
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      await UserService.deleteUser(id)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = UserController
