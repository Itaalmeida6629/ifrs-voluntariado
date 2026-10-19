const EventVolunteerModel = require('../models/eventVolunteerModel')
const EventModel = require('../models/eventModel')
const UserModel = require('../models/userModel')
const validateId = require('../utils/validateId')
const AppError = require('../utils/appError')

/** Regras de negócio das inscrições de voluntários em eventos. */
class EventVolunteerService {
  /**
   * Inscreve o voluntário autenticado em um evento.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @param {Object} usuarioLogado - Usuário autenticado.
   * @returns {Promise<Object>} Inscrição criada.
   * @throws {AppError} Quando o usuário não pode se inscrever ou a regra do evento é violada.
   */
  static async registerVolunteer(eventoId, usuarioLogado) {
    if (!validateId(eventoId)) {
      throw new AppError('ID do evento inválido')
    }

    if (!usuarioLogado || !validateId(usuarioLogado.userId)) {
      throw new AppError('Usuário não autenticado', 401)
    }

    if (usuarioLogado.role !== 'voluntario') {
      throw new AppError('Apenas voluntários podem se inscrever em eventos', 403)
    }

    const evento = await EventModel.findById(eventoId)
    if (!evento) {
      throw new AppError('Evento não encontrado', 404)
    }

    if (evento.status === 'finalizado') {
      throw new AppError('Não é possível se inscrever em um evento finalizado', 409)
    }

    const usuario = await UserModel.findById(usuarioLogado.userId)
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404)
    }

    const inscricaoExistente = await EventVolunteerModel.findByEventAndUser(eventoId, usuarioLogado.userId)
    if (inscricaoExistente) {
      throw new AppError('Usuário já está inscrito neste evento', 409)
    }

    const totalInscritos = await EventVolunteerModel.countByEventId(eventoId)
    if (totalInscritos >= evento.limite_voluntarios) {
      throw new AppError('O limite de voluntários para este evento foi atingido', 409)
    }

    try {
      await EventVolunteerModel.create(eventoId, usuarioLogado.userId)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Usuário já está inscrito neste evento', 409)
      }

      if (error.sqlState === '45000') {
        throw new AppError('O limite de voluntários para este evento foi atingido', 409)
      }

      throw error
    }

    return await EventVolunteerModel.findByEventAndUser(eventoId, usuarioLogado.userId)
  }

  /**
   * Lista os voluntários inscritos em um evento.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @returns {Promise<Array<Object>>} Inscritos do evento.
   * @throws {AppError} Quando o evento não existe.
   */
  static async getEventVolunteers(eventoId) {
    if (!validateId(eventoId)) {
      throw new AppError('ID do evento inválido')
    }

    const evento = await EventModel.findById(eventoId)
    if (!evento) {
      throw new AppError('Evento não encontrado', 404)
    }

    return await EventVolunteerModel.findByEventId(eventoId)
  }

  /**
   * Cancela a inscrição do usuário autenticado.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @param {Object} usuarioLogado - Usuário autenticado.
   * @returns {Promise<boolean>} Indica se a inscrição foi cancelada.
   * @throws {AppError} Quando o evento, usuário ou inscrição não existe.
   */
  static async cancelVolunteer(eventoId, usuarioLogado) {
    if (!validateId(eventoId)) {
      throw new AppError('ID do evento inválido')
    }

    if (!usuarioLogado || !validateId(usuarioLogado.userId)) {
      throw new AppError('Usuário não autenticado', 401)
    }

    const evento = await EventModel.findById(eventoId)
    if (!evento) {
      throw new AppError('Evento não encontrado', 404)
    }

    const usuario = await UserModel.findById(usuarioLogado.userId)
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404)
    }

    const inscricao = await EventVolunteerModel.findByEventAndUser(eventoId, usuarioLogado.userId)
    if (!inscricao) {
      throw new AppError('Inscrição não encontrada', 404)
    }

    await EventVolunteerModel.delete(eventoId, usuarioLogado.userId)
    return true
  }
}

module.exports = EventVolunteerService
