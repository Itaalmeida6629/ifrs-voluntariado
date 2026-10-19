const db = require('../config/database')

/** Operações de persistência das inscrições em eventos. */
class EventVolunteerModel {
  /**
   * Lista os voluntários inscritos em um evento.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @returns {Promise<Array<Object>>} Inscritos do evento.
   */
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

  /**
   * Busca uma inscrição específica.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @param {number|string} usuarioId - Identificador do usuário.
   * @returns {Promise<Object|undefined>} Inscrição encontrada ou undefined.
   */
  static async findByEventAndUser(eventoId, usuarioId) {
    const [rows] = await db.query(
      'SELECT evento_id, usuario_id, inscrito_em FROM evento_voluntarios WHERE evento_id = ? AND usuario_id = ?',
      [eventoId, usuarioId]
    )
    return rows[0]
  }

  /**
   * Conta as inscrições de um evento.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @returns {Promise<number>} Quantidade de inscritos.
   */
  static async countByEventId(eventoId) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM evento_voluntarios WHERE evento_id = ?', [eventoId])
    return rows[0].total
  }

  /**
   * Cria uma inscrição.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @param {number|string} usuarioId - Identificador do usuário.
   * @returns {Promise<boolean>} Indica se a inscrição foi criada.
   */
  static async create(eventoId, usuarioId) {
    const [result] = await db.query('INSERT INTO evento_voluntarios (evento_id, usuario_id) VALUES (?, ?)', [
      eventoId,
      usuarioId,
    ])
    return result.affectedRows > 0
  }

  /**
   * Remove uma inscrição.
   *
   * @param {number|string} eventoId - Identificador do evento.
   * @param {number|string} usuarioId - Identificador do usuário.
   * @returns {Promise<boolean>} Indica se a inscrição foi removida.
   */
  static async delete(eventoId, usuarioId) {
    const [result] = await db.query('DELETE FROM evento_voluntarios WHERE evento_id = ? AND usuario_id = ?', [
      eventoId,
      usuarioId,
    ])
    return result.affectedRows > 0
  }
}

module.exports = EventVolunteerModel
