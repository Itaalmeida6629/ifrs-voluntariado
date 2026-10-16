const validateEmail = require('./validateEmail')

function validateLogin(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Corpo da requisição é obrigatório'
  }

  const { email, senha } = body

  if (!email) {
    return 'email é obrigatório'
  }

  if (!senha) {
    return 'senha é obrigatória'
  }

  if (typeof email !== 'string') {
    return 'email deve ser string'
  }

  if (typeof senha !== 'string') {
    return 'senha deve ser string'
  }

  if (!validateEmail(email)) {
    return 'email inválido'
  }

  return null
}

module.exports = validateLogin
