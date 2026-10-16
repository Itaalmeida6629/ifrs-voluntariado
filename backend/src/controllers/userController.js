const UserService = require('../services/userService')

class UserController {
  static async login(req, res, next) {
    try {
      const { token } = await UserService.login(req.body)
      return res.status(200).json({ token })
    } catch (err) {
      return next(err)
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params
      const user = await UserService.getUserById(id, req.user)
      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  static async findUserByEmail(req, res, next) {
    try {
      const { email } = req.params
      const user = await UserService.findUserByEmail(email)
      return res.status(200).json(user)
    } catch (err) {
      return next(err)
    }
  }

  static async createUser(req, res, next) {
    try {
      const user = await UserService.createUser(req.body, req.user)
      return res.status(201).json({ message: 'Usuário criado com sucesso', user })
    } catch (err) {
      return next(err)
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { id } = req.params
      const user = await UserService.updateUser(id, req.body, req.user)
      return res.status(200).json({ message: 'Usuário atualizado com sucesso', user })
    } catch (err) {
      return next(err)
    }
  }

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
