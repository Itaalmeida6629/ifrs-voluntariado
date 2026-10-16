function validateId(id) {
  return /^\d+$/.test(String(id)) && Number(id) > 0
}

module.exports = validateId
