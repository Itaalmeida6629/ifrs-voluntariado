const db = require('../config/database')

/** Operações de persistência dos usuários no banco de dados. */
class UserModel {
  /**
   * Lista os usuários sem retornar as senhas.
   *
   * @returns {Promise<Array<Object>>} Usuários cadastrados.
   */
  static async findAll() {
    const [rows] = await db.query('SELECT id, nome, email, telefone, role, criado_em FROM usuarios')
    return rows
  }

  /**
   * Busca um usuário pelo identificador.
   *
   * @param {number|string} id - Identificador do usuário.
   * @returns {Promise<Object|undefined>} Usuário encontrado ou undefined.
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT id, nome, email, telefone, role, criado_em FROM usuarios WHERE id = ?', [id])
    return rows[0]
  }

  /**
   * Busca um usuário pelo email, incluindo o hash para autenticação.
   *
   * @param {string} email - Email do usuário.
   * @returns {Promise<Object|undefined>} Usuário encontrado ou undefined.
   */
  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, nome, email, senha_hash, telefone, role, criado_em FROM usuarios WHERE email = ?',
      [email]
    )
    return rows[0]
  }

  /**
   * Cadastra um usuário.
   *
   * @param {Object} usuario - Dados persistidos do usuário.
   * @returns {Promise<number>} ID gerado pelo banco.
   */
  static async create(usuario) {
    const { nome, email, senhaHash, telefone, role } = usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (nome, email, senha_hash, telefone, role) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senhaHash, telefone, role]
    )
    return result.insertId
  }

  /**
   * Atualiza os campos permitidos de um usuário.
   *
   * @param {number|string} id - Identificador do usuário.
   * @param {Object} data - Campos que serão atualizados.
   * @returns {Promise<boolean>} Indica se algum registro foi alterado.
   */
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

  /**
   * Remove um usuário.
   *
   * @param {number|string} id - Identificador do usuário.
   * @returns {Promise<boolean>} Indica se algum registro foi removido.
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = UserModel
