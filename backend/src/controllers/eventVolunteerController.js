const EventVolunteerService = require('../services/eventVolunteerService')

/** Controladores HTTP relacionados às inscrições em eventos. */
class EventVolunteerController {
  /**
   * Inscreve o usuário autenticado em um evento.
   *
   * @param {Object} req - Requisição HTTP com o ID do evento.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com a inscrição criada.
   */
  static async registerVolunteer(req, res, next) {
    try {
      const { eventoId } = req.params
      const inscricao = await EventVolunteerService.registerVolunteer(eventoId, req.user)
      return res.status(201).json({ message: 'Inscrição realizada com sucesso', registration: inscricao })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Lista os inscritos de um evento.
   *
   * @param {Object} req - Requisição HTTP com o ID do evento.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com os inscritos.
   */
  static async getEventVolunteers(req, res, next) {
    try {
      const { eventoId } = req.params
      const voluntarios = await EventVolunteerService.getEventVolunteers(eventoId)
      return res.status(200).json(voluntarios)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Cancela a inscrição do usuário autenticado.
   *
   * @param {Object} req - Requisição HTTP com o ID do evento.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta HTTP sem conteúdo.
   */
  static async cancelVolunteer(req, res, next) {
    try {
      const { eventoId } = req.params
      await EventVolunteerService.cancelVolunteer(eventoId, req.user)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = EventVolunteerController
