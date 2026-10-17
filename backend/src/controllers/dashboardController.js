class DashboardController {
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
