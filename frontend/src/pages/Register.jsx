import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../api/api'

function Register() {
  const navigate = useNavigate()
  const [formulario, setFormulario] = useState({ nome: '', email: '', senha: '', telefone: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErro('')

    if (!formulario.nome.trim() || !formulario.email.trim() || !formulario.senha) {
      setErro('Nome, email e senha são obrigatórios')
      return
    }

    try {
      setCarregando(true)
      await api.post('/volunteers', formulario)
      navigate('/login', { state: { mensagem: 'Cadastro realizado com sucesso. Faça login para continuar.' } })
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível realizar o cadastro')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="pagina-conteudo formulario-container">
      <h1>Cadastro de voluntário</h1>
      {erro && <p className="mensagem-erro">{erro}</p>}

      <form className="formulario" onSubmit={handleSubmit}>
        <label className="campo">
          Nome
          <input name="nome" value={formulario.nome} onChange={handleChange} />
        </label>

        <label className="campo">
          Email
          <input name="email" type="email" value={formulario.email} onChange={handleChange} />
        </label>

        <label className="campo">
          Senha
          <input name="senha" type="password" value={formulario.senha} onChange={handleChange} />
        </label>

        <label className="campo">
          Telefone
          <input name="telefone" value={formulario.telefone} onChange={handleChange} />
        </label>

        <button className="botao-principal" type="submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p className="texto-rodape">
        Já possui cadastro? <Link to="/login">Voltar para o login</Link>
      </p>
    </section>
  )
}

export default Register
