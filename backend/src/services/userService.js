const UserModel = require('../models/userModel')
const validateLogin = require('../utils/validateLogin')
const validateEmail = require('../utils/validateEmail')
const validateString = require('../utils/validateString')
const validateTelefone = require('../utils/validateTelefone')
const validateId = require('../utils/validateId')
const AppError = require('../utils/appError')
const normalizarTelefone = require('../utils/normalizarTelefone')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const rolesPermitidas = ['admin', 'voluntario']

function validarNome(nome) {
  const erro = validateString(nome, { min: 1, max: 100, fieldName: 'nome' })
  if (erro) {
    throw new AppError(erro)
  }
  return nome.trim()
}

function validarEmailUsuario(email) {
  if (!validateEmail(email)) {
    throw new AppError('Email inválido')
  }
  return email.trim().toLowerCase()
}

function validarSenha(senha) {
  const erro = validateString(senha, { min: 6, max: 255, fieldName: 'senha' })
  if (erro) {
    throw new AppError(erro)
  }
}

function validarTelefoneUsuario(telefone) {
  const telefoneNormalizado = normalizarTelefone(telefone)

  if (telefoneNormalizado !== null && telefoneNormalizado !== undefined && !validateTelefone(telefoneNormalizado)) {
    throw new AppError('Telefone inválido: use apenas números, espaços, parênteses, + e hífen, com 10 ou 11 dígitos')
  }

  return telefoneNormalizado || null
}

function normalizarRole(role, usuarioLogado) {
  if (role === undefined || role === null || role === '') {
    return 'voluntario'
  }

  if (typeof role !== 'string') {
    throw new AppError('Role deve ser uma string')
  }

  const roleNormalizada = role.trim().toLowerCase()
  if (!rolesPermitidas.includes(roleNormalizada)) {
    throw new AppError('Role deve ser "admin" ou "voluntario"')
  }

  if (roleNormalizada === 'admin' && usuarioLogado?.role !== 'admin') {
    throw new AppError('Apenas administradores podem definir a role admin', 403)
  }

  return roleNormalizada
}

/** Regras de negócio de autenticação e gerenciamento de usuários. */
class UserService {
  /**
   * Autentica um usuário e gera um token JWT.
   *
   * @param {Object} data - Email e senha informados no login.
   * @returns {Promise<{token: string}>} Token de acesso.
   * @throws {AppError} Quando os dados são inválidos ou a autenticação falha.
   */
  static async login(data) {
    const erroLogin = validateLogin(data)
    if (erroLogin) {
      throw new AppError(erroLogin)
    }

    const email = data.email.trim().toLowerCase()
    const usuario = await UserModel.findByEmail(email)

    if (!usuario) {
      throw new AppError('Email ou senha incorretos', 401)
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha_hash)
    if (!senhaValida) {
      throw new AppError('Email ou senha incorretos', 401)
    }

    const token = jwt.sign({ userId: usuario.id, email: usuario.email, role: usuario.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return { token }
  }

  /**
   * Lista todos os usuários.
   *
   * @returns {Promise<Array<Object>>} Usuários cadastrados.
   * @throws {AppError} Quando nenhum usuário é encontrado.
   */
  static async getAllUsers() {
    const users = await UserModel.findAll()
    if (users.length === 0) {
      throw new AppError('Nenhum usuário encontrado', 404)
    }
    return users
  }

  /**
   * Busca um usuário respeitando a permissão do usuário autenticado.
   *
   * @param {number|string} id - Identificador do usuário consultado.
   * @param {Object} usuarioLogado - Dados do usuário autenticado.
   * @returns {Promise<Object>} Usuário encontrado sem senha.
   * @throws {AppError} Quando o ID é inválido, o acesso é negado ou o usuário não existe.
   */
  static async getUserById(id, usuarioLogado) {
    if (!validateId(id)) {
      throw new AppError('ID do usuário inválido')
    }

    if (!usuarioLogado) {
      throw new AppError('Usuário não autenticado', 401)
    }

    if (usuarioLogado.role !== 'admin' && String(usuarioLogado.userId) !== String(id)) {
      throw new AppError('Acesso negado: você só pode visualizar o seu próprio perfil', 403)
    }

    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    const usuarioSemSenha = { ...user }
    delete usuarioSemSenha.senha_hash
    return usuarioSemSenha
  }

  /**
   * Busca um usuário pelo email sem expor o hash da senha.
   *
   * @param {string} email - Email do usuário.
   * @returns {Promise<Object>} Usuário encontrado sem senha.
   * @throws {AppError} Quando o email é inválido ou o usuário não existe.
   */
  static async findUserByEmail(email) {
    const emailNormalizado = validarEmailUsuario(email)
    const user = await UserModel.findByEmail(emailNormalizado)
    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    const usuarioSemSenha = { ...user }
    delete usuarioSemSenha.senha_hash
    return usuarioSemSenha
  }

  /**
   * Cadastra um usuário ou voluntário.
   *
   * @param {Object} data - Dados do novo usuário.
   * @param {Object|undefined} usuarioLogado - Usuário autenticado, quando aplicável.
   * @returns {Promise<Object>} Usuário criado sem senha.
   * @throws {AppError} Quando os dados são inválidos ou o email já existe.
   */
  static async createUser(data, usuarioLogado) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AppError('Corpo da requisição é obrigatório')
    }

    const camposObrigatorios = ['nome', 'email', 'senha']
    for (const campo of camposObrigatorios) {
      if (!data[campo]) {
        throw new AppError(`${campo} é obrigatório`)
      }
    }

    const nome = validarNome(data.nome)
    const email = validarEmailUsuario(data.email)
    validarSenha(data.senha)
    const telefone = validarTelefoneUsuario(data.telefone)
    const role = normalizarRole(data.role, usuarioLogado)

    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      throw new AppError('E-mail já cadastrado', 409)
    }

    const senhaHash = await bcrypt.hash(data.senha, 10)
    const userId = await UserModel.create({ nome, email, senhaHash, telefone, role })
    return await UserModel.findById(userId)
  }

  /**
   * Atualiza os dados permitidos de um usuário.
   *
   * @param {number|string} id - Identificador do usuário.
   * @param {Object} data - Campos que serão atualizados.
   * @param {Object} usuarioLogado - Usuário autenticado.
   * @returns {Promise<Object>} Usuário atualizado sem senha.
   * @throws {AppError} Quando os dados são inválidos, o acesso é negado ou o usuário não existe.
   */
  static async updateUser(id, data, usuarioLogado) {
    if (!validateId(id)) {
      throw new AppError('ID do usuário inválido')
    }

    if (!usuarioLogado) {
      throw new AppError('Usuário não autenticado', 401)
    }

    if (usuarioLogado.role !== 'admin' && String(usuarioLogado.userId) !== String(id)) {
      throw new AppError('Acesso negado: você só pode atualizar o seu próprio perfil', 403)
    }

    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) {
      throw new AppError('Nenhum campo para atualizar')
    }

    const payload = {}

    if (data.nome !== undefined) {
      payload.nome = validarNome(data.nome)
    }

    if (data.email !== undefined) {
      payload.email = validarEmailUsuario(data.email)
      const existingUser = await UserModel.findByEmail(payload.email)
      if (existingUser && String(existingUser.id) !== String(id)) {
        throw new AppError('E-mail já cadastrado', 409)
      }
    }

    if (data.senha !== undefined) {
      validarSenha(data.senha)
      payload.senha_hash = await bcrypt.hash(data.senha, 10)
    }

    if (data.telefone !== undefined) {
      payload.telefone = validarTelefoneUsuario(data.telefone)
    }

    if (data.role !== undefined) {
      payload.role = normalizarRole(data.role, usuarioLogado)
    }

    if (Object.keys(payload).length === 0) {
      throw new AppError('Nenhum campo válido para atualizar')
    }

    await UserModel.update(id, payload)
    return await UserModel.findById(id)
  }

  /**
   * Remove um usuário.
   *
   * @param {number|string} id - Identificador do usuário.
   * @returns {Promise<boolean>} Indica se o usuário foi removido.
   * @throws {AppError} Quando o ID é inválido ou o usuário não existe.
   */
  static async deleteUser(id) {
    if (!validateId(id)) {
      throw new AppError('ID do usuário inválido')
    }

    const user = await UserModel.findById(id)
    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    return await UserModel.delete(id)
  }
}

module.exports = UserService
