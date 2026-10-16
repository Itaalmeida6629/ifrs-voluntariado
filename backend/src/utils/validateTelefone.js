function validateTelefone(telefone) {
  if (typeof telefone !== 'string') {
    return false
  }

  const regex = /^\d{10,11}$/
  return regex.test(telefone)
}

module.exports = validateTelefone
