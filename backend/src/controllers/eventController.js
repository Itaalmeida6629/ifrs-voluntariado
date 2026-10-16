const EventService = require('../services/eventService')

class EventController {
  static async getAllEvents(req, res, next) {
    try {
      const events = await EventService.getAllEvents()
      return res.status(200).json(events)
    } catch (err) {
      return next(err)
    }
  }

  static async getEventById(req, res, next) {
    try {
      const { id } = req.params
      const event = await EventService.getEventById(id)
      return res.status(200).json(event)
    } catch (err) {
      return next(err)
    }
  }

  static async createEvent(req, res, next) {
    try {
      const event = await EventService.createEvent(req.body)
      return res.status(201).json({ message: 'Evento criado com sucesso', event })
    } catch (err) {
      return next(err)
    }
  }

  static async updateEvent(req, res, next) {
    try {
      const { id } = req.params
      const event = await EventService.updateEvent(id, req.body)
      return res.status(200).json({ message: 'Evento atualizado com sucesso', event })
    } catch (err) {
      return next(err)
    }
  }

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
