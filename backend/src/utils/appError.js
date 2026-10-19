/** Erro esperado da aplicação com status HTTP associado. */
class AppError extends Error {
  /**
   * Cria um erro de aplicação.
   *
   * @param {string} message - Mensagem apresentada ao consumidor da API.
   * @param {number} [statusCode=400] - Status HTTP da resposta.
   */
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = AppError
