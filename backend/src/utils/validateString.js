function validateString(value, { min = 1, max = 255, fieldName = 'campo' } = {}) {
  if (value === undefined || value === null) {
    return `${fieldName} é obrigatório`
  }

  if (typeof value !== 'string') {
    return `${fieldName} deve ser string`
  }

  const trimmed = value.trim()

  if (trimmed.length < min) {
    return `${fieldName} deve ter no mínimo ${min} caracteres`
  }

  if (trimmed.length > max) {
    return `${fieldName} deve ter no máximo ${max} caracteres`
  }

  return null
}

module.exports = validateString
