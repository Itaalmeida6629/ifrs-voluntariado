const db = require('../config/database')

class EventVolunteerModel {
  static async findByEventId(eventoId) {
    const [rows] = await db.query(
      `SELECT ev.evento_id, ev.usuario_id, ev.inscrito_em,
              u.nome, u.email, u.telefone, u.role
         FROM evento_voluntarios ev
        JOIN usuarios u ON u.id = ev.usuario_id
        WHERE ev.evento_id = ?
        ORDER BY ev.inscrito_em`,
      [eventoId]
    )
    return rows
  }

  static async findByEventAndUser(eventoId, usuarioId) {
    const [rows] = await db.query(
      'SELECT evento_id, usuario_id, inscrito_em FROM evento_voluntarios WHERE evento_id = ? AND usuario_id = ?',
      [eventoId, usuarioId]
    )
    return rows[0]
  }

  static async countByEventId(eventoId) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM evento_voluntarios WHERE evento_id = ?', [eventoId])
    return rows[0].total
  }

  static async create(eventoId, usuarioId) {
    const [result] = await db.query('INSERT INTO evento_voluntarios (evento_id, usuario_id) VALUES (?, ?)', [
      eventoId,
      usuarioId,
    ])
    return result.affectedRows > 0
  }

  static async delete(eventoId, usuarioId) {
    const [result] = await db.query('DELETE FROM evento_voluntarios WHERE evento_id = ? AND usuario_id = ?', [
      eventoId,
      usuarioId,
    ])
    return result.affectedRows > 0
  }
}

module.exports = EventVolunteerModel
