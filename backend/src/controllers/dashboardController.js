/** Controlador HTTP do dashboard autenticado. */
class DashboardController {
  /**
   * Retorna os dados básicos do usuário autenticado.
   *
   * @param {Object} req - Requisição HTTP com o usuário autenticado.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta do dashboard.
   */
  static async getDashboard(req, res, next) {
    try {
      return res.status(200).json({
        message: 'Dashboard acessado com sucesso',
        usuario: req.user,
      })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = DashboardController
