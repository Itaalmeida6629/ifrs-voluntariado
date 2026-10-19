const EventModel = require('../models/eventModel')
const validateString = require('../utils/validateString')
const validateId = require('../utils/validateId')
const AppError = require('../utils/appError')

const statusPermitidos = ['agendado', 'finalizado']

function validarTexto(valor, opcoes) {
  const erro = validateString(valor, opcoes)
  if (erro) {
    throw new AppError(erro)
  }
  return valor.trim()
}

function validarData(data, campo) {
  if (typeof data !== 'string' || !data.trim()) {
    throw new AppError(`${campo} é obrigatória`)
  }

  if (Number.isNaN(new Date(data).getTime())) {
    throw new AppError(`${campo} inválida`)
  }

  return data.trim()
}

function validarPeriodo(dataInicio, dataFim) {
  if (new Date(dataFim).getTime() <= new Date(dataInicio).getTime()) {
    throw new AppError('A data de término deve ser posterior à data de início')
  }
}

function validarLimiteVoluntarios(limite, usarPadrao = false) {
  if (limite === undefined && usarPadrao) {
    return 20
  }

  if (!Number.isInteger(limite) || limite <= 0) {
    throw new AppError('O limite de voluntários deve ser um número inteiro maior que zero')
  }

  return limite
}

function normalizarStatus(status, usarPadrao = false) {
  if (status === undefined && usarPadrao) {
    return 'agendado'
  }

  if (typeof status !== 'string') {
    throw new AppError('Status inválido')
  }

  const statusNormalizado = status.trim().toLowerCase()
  if (!statusPermitidos.includes(statusNormalizado)) {
    throw new AppError('Status inválido')
  }

  return statusNormalizado
}

function validarDescricao(descricao) {
  if (descricao === undefined || descricao === null || descricao === '') {
    return null
  }

  return validarTexto(descricao, { min: 1, max: 200, fieldName: 'descrição' })
}

/** Regras de negócio para gerenciamento de eventos. */
class EventService {
  /**
   * Lista os eventos cadastrados.
   *
   * @returns {Promise<Array<Object>>} Eventos disponíveis.
   */
  static async getAllEvents() {
    return await EventModel.findAll()
  }

  /**
   * Busca um evento pelo identificador.
   *
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object>} Evento encontrado.
   * @throws {AppError} Quando o ID é inválido ou o evento não existe.
   */
  static async getEventById(id) {
    if (!validateId(id)) {
      throw new AppError('ID do evento inválido')
    }

    const event = await EventModel.findById(id)
    if (!event) {
      throw new AppError('Evento não encontrado', 404)
    }
    return event
  }

  /**
   * Cadastra um evento com os dados validados.
   *
   * @param {Object} data - Dados do novo evento.
   * @returns {Promise<Object>} Evento criado.
   * @throws {AppError} Quando os dados do evento são inválidos.
   */
  static async createEvent(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new AppError('Corpo da requisição é obrigatório')
    }

    const camposObrigatorios = ['titulo', 'local', 'data_inicio', 'data_fim']
    for (const campo of camposObrigatorios) {
      if (!data[campo]) {
        throw new AppError(`${campo} é obrigatório`)
      }
    }

    const titulo = validarTexto(data.titulo, { min: 1, max: 150, fieldName: 'título' })
    const descricao = validarDescricao(data.descricao)
    const local = validarTexto(data.local, { min: 1, max: 100, fieldName: 'local' })
    const dataInicio = validarData(data.data_inicio, 'A data de início')
    const dataFim = validarData(data.data_fim, 'A data de fim')
    validarPeriodo(dataInicio, dataFim)

    const limiteVoluntarios = validarLimiteVoluntarios(data.limite_voluntarios, true)
    const status = normalizarStatus(data.status, true)

    const eventId = await EventModel.create({
      titulo,
      descricao,
      local,
      dataInicio,
      dataFim,
      limiteVoluntarios,
      status,
    })

    return await EventModel.findById(eventId)
  }

  /**
   * Atualiza um evento.
   *
   * @param {number|string} id - Identificador do evento.
   * @param {Object} data - Campos que serão atualizados.
   * @returns {Promise<Object>} Evento atualizado.
   * @throws {AppError} Quando os dados são inválidos ou o evento não existe.
   */
  static async updateEvent(id, data) {
    if (!validateId(id)) {
      throw new AppError('ID do evento inválido')
    }

    const event = await EventModel.findById(id)
    if (!event) {
      throw new AppError('Evento não encontrado', 404)
    }

    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) {
      throw new AppError('Nenhum campo para atualizar')
    }

    const payload = {}

    if (data.titulo !== undefined) {
      payload.titulo = validarTexto(data.titulo, { min: 1, max: 150, fieldName: 'título' })
    }

    if (data.descricao !== undefined) {
      payload.descricao = validarDescricao(data.descricao)
    }

    if (data.local !== undefined) {
      payload.local = validarTexto(data.local, { min: 1, max: 100, fieldName: 'local' })
    }

    if (data.data_inicio !== undefined) {
      payload.data_inicio = validarData(data.data_inicio, 'A data de início')
    }

    if (data.data_fim !== undefined) {
      payload.data_fim = validarData(data.data_fim, 'A data de fim')
    }

    if (data.data_inicio !== undefined || data.data_fim !== undefined) {
      validarPeriodo(payload.data_inicio || event.data_inicio, payload.data_fim || event.data_fim)
    }

    if (data.limite_voluntarios !== undefined) {
      payload.limite_voluntarios = validarLimiteVoluntarios(data.limite_voluntarios)
    }

    if (data.status !== undefined) {
      payload.status = normalizarStatus(data.status)
    }

    if (Object.keys(payload).length === 0) {
      throw new AppError('Nenhum campo válido para atualizar')
    }

    await EventModel.update(id, payload)
    return await EventModel.findById(id)
  }

  /**
   * Remove um evento.
   *
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<boolean>} Indica se o evento foi removido.
   * @throws {AppError} Quando o ID é inválido ou o evento não existe.
   */
  static async deleteEvent(id) {
    if (!validateId(id)) {
      throw new AppError('ID do evento inválido')
    }

    const event = await EventModel.findById(id)
    if (!event) {
      throw new AppError('Evento não encontrado', 404)
    }

    return await EventModel.delete(id)
  }
}

module.exports = EventService
