const AppError = require('../utils/appError')

// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  console.error('Erro interno:', err)

  return res.status(500).json({
    message: 'Erro interno do servidor',
  })
}

module.exports = errorMiddleware
