const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token não fornecido' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new AppError('Token inválido', 401))
    req.user = user
    next()
  })
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401))
    }

    if (req.user.role !== role) {
      return next(new AppError('Acesso negado: função insuficiente', 403))
    }

    return next()
  }
}

module.exports = { authenticateToken, authorizeRole }
