const db = require('../config/database')

class UserModel {
  static async findAll() {
    const [rows] = await db.query('SELECT id, nome, email, telefone, role, criado_em FROM usuarios')
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, nome, email, telefone, role, criado_em FROM usuarios WHERE id = ?', [id])
    return rows[0]
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, nome, email, senha_hash, telefone, role, criado_em FROM usuarios WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  static async create(usuario) {
    const { nome, email, senhaHash, telefone, role } = usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash, telefone, role) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senhaHash, telefone, role]
    )
    return result.insertId
  }

  static async update(id, data) {
    const camposPermitidos = ['nome', 'email', 'senha_hash', 'telefone', 'role']
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
    const [result] = await db.query(`UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`, valores)
    return result.affectedRows > 0
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = UserModel
