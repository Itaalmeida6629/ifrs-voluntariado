require('dotenv').config()

const app = require('./src/app')
const initAdmin = require('./src/config/initAdmin')
const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await initAdmin()

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`)
    })
  } catch (error) {
    console.error('Falha ao inicializar o administrador:', error)
    process.exitCode = 1
  }
}

startServer()
