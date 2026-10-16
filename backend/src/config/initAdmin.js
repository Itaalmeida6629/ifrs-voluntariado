const bancoDados = require('./database')
const bcrypt = require('bcryptjs')
const validateEmail = require('../utils/validateEmail')
const validateTelefone = require('../utils/validateTelefone')

function configurarAdmin() {
  const nome = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL
  const senha = process.env.ADMIN_PASSWORD
  const telefone = process.env.ADMIN_PHONE || null

  if (!nome || !email || !senha) {
    throw new Error('Nome, email e senha do administrador são obrigatórios')
  }

  if (!validateEmail(email)) {
    throw new Error('Email do administrador inválido')
  }

  if (senha.length < 6) {
    throw new Error('A senha do administrador deve ter no mínimo 6 caracteres')
  }

  if (telefone && !validateTelefone(telefone)) {
    throw new Error('Telefone do administrador inválido: informe apenas 10 ou 11 dígitos')
  }

  return { nome, email, senha, telefone }
}

async function criarPrimeiroAdmin() {
  const [administradores] = await bancoDados.query("SELECT id FROM usuarios WHERE role = 'admin' LIMIT 1")

  if (administradores.length > 0) {
    return false
  }

  const { nome, email, senha, telefone } = configurarAdmin()

  console.log('Nenhum administrador encontrado. Iniciando configuracao inicial...')

  const senhaHash = await bcrypt.hash(senha, 10)

  await bancoDados.query('INSERT INTO usuarios (nome, email, senha_hash, telefone, role) VALUES (?, ?, ?, ?, ?)', [
    nome,
    email,
    senhaHash,
    telefone,
    'admin',
  ])

  console.log('Primeiro administrador criado com sucesso.')
  console.log(`Email: ${email}`)
  return true
}

module.exports = criarPrimeiroAdmin
