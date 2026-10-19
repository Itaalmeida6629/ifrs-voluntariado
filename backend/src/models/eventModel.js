const db = require('../config/database')

/** Operações de persistência dos eventos no banco de dados. */
class EventModel {
  /**
   * Lista todos os eventos.
   *
   * @returns {Promise<Array<Object>>} Eventos cadastrados.
   */
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status, criado_em FROM eventos'
    )
    return rows
  }

  /**
   * Busca um evento pelo identificador.
   *
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<Object|undefined>} Evento encontrado ou undefined.
   */
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status, criado_em FROM eventos WHERE id = ?',
      [id]
    )
    return rows[0]
  }

  /**
   * Cadastra um evento.
   *
   * @param {Object} evento - Dados do evento.
   * @returns {Promise<number>} ID gerado pelo banco.
   */
  static async create(evento) {
    const { titulo, descricao, local, dataInicio, dataFim, limiteVoluntarios, status } = evento
    const [result] = await db.query(
      'INSERT INTO eventos (titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, local, dataInicio, dataFim, limiteVoluntarios, status]
    )
    return result.insertId
  }

  /**
   * Atualiza os campos permitidos de um evento.
   *
   * @param {number|string} id - Identificador do evento.
   * @param {Object} data - Campos que serão atualizados.
   * @returns {Promise<boolean>} Indica se algum registro foi alterado.
   */
  static async update(id, data) {
    const camposPermitidos = ['titulo', 'descricao', 'local', 'data_inicio', 'data_fim', 'limite_voluntarios', 'status']
    const campos = []
    const valores = []

    for (const campo of camposPermitidos) {
      if (data[campo] !== undefined) {
        campos.push(`${campo} = ?`)
        valores.push(data[campo])
      }
    }

    if (campos.length === 0) {
      return false
    }

    valores.push(id)
    const [result] = await db.query(`UPDATE eventos SET ${campos.join(', ')} WHERE id = ?`, valores)
    return result.affectedRows > 0
  }

  /**
   * Remove um evento.
   *
   * @param {number|string} id - Identificador do evento.
   * @returns {Promise<boolean>} Indica se algum registro foi removido.
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM eventos WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = EventModel
