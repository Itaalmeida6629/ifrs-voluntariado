const db = require('../config/database')

class EventModel {
  static async findAll() {
    const [rows] = await db.query(
      'SELECT id, titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status, criado_em FROM eventos'
    )
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status, criado_em FROM eventos WHERE id = ?',
      [id]
    )
    return rows[0]
  }

  static async create(evento) {
    const { titulo, descricao, local, dataInicio, dataFim, limiteVoluntarios, status } = evento
    const [result] = await db.query(
      'INSERT INTO eventos (titulo, descricao, local, data_inicio, data_fim, limite_voluntarios, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, local, dataInicio, dataFim, limiteVoluntarios, status]
    )
    return result.insertId
  }

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

  static async delete(id) {
    const [result] = await db.query('DELETE FROM eventos WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = EventModel
