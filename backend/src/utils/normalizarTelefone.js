/**
 * Remove máscaras de telefone aceitas pela aplicação.
 *
 * @param {string|null|undefined} telefone - Telefone informado.
 * @returns {string|null|undefined} Telefone somente com números ou o valor original inválido.
 */
function normalizarTelefone(telefone) {
  if (typeof telefone !== 'string') {
    return telefone
  }

  const valor = telefone.trim()

  if (!valor) {
    return null
  }

  if (!/^[\d()+\- ]+$/.test(valor)) {
    return valor
  }

  return valor.replace(/\D/g, '')
}

module.exports = normalizarTelefone
