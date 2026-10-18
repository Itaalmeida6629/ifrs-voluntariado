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
