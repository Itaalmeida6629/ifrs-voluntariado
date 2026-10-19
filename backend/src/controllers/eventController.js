const EventService = require('../services/eventService')

/** Controladores HTTP relacionados aos eventos. */
class EventController {
  /**
   * Lista os eventos.
   *
   * @param {Object} req - Requisição HTTP.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com os eventos.
   */
  static async getAllEvents(req, res, next) {
    try {
      const events = await EventService.getAllEvents()
      return res.status(200).json(events)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Busca um evento pelo ID.
   *
   * @param {Object} req - Requisição HTTP com o ID nos parâmetros.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o evento.
   */
  static async getEventById(req, res, next) {
    try {
      const { id } = req.params
      const event = await EventService.getEventById(id)
      return res.status(200).json(event)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Cria um evento.
   *
   * @param {Object} req - Requisição HTTP com os dados no corpo.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o evento criado.
   */
  static async createEvent(req, res, next) {
    try {
      const event = await EventService.createEvent(req.body)
      return res.status(201).json({ message: 'Evento criado com sucesso', event })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Atualiza um evento.
   *
   * @param {Object} req - Requisição HTTP com ID e dados de atualização.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta com o evento atualizado.
   */
  static async updateEvent(req, res, next) {
    try {
      const { id } = req.params
      const event = await EventService.updateEvent(id, req.body)
      return res.status(200).json({ message: 'Evento atualizado com sucesso', event })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Remove um evento.
   *
   * @param {Object} req - Requisição HTTP com o ID nos parâmetros.
   * @param {Object} res - Resposta HTTP.
   * @param {Function} next - Próximo middleware.
   * @returns {Promise<Object>} Resposta HTTP sem conteúdo.
   */
  static async deleteEvent(req, res, next) {
    try {
      const { id } = req.params
      await EventService.deleteEvent(id)
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = EventController
