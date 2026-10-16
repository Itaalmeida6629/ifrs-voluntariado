const EventVolunteerService = require('../services/eventVolunteerService')

class EventVolunteerController {
  static async registerVolunteer(req, res, next) {
    try {
      const { eventoId } = req.params
      const inscricao = await EventVolunteerService.registerVolunteer(eventoId, req.user)
      return res.status(201).json({ message: 'Inscrição realizada com sucesso', registration: inscricao })
    } catch (err) {
      return next(err)
    }
  }

  static async getEventVolunteers(req, res, next) {
    try {
      const { eventoId } = req.params
      const voluntarios = await EventVolunteerService.getEventVolunteers(eventoId)
      return res.status(200).json(voluntarios)
    } catch (err) {
      return next(err)
    }
  }

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
