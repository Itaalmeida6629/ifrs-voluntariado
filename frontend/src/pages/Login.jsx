import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/useAuth'

function Login() {
  return <TelaLogin />
}

function TelaLogin() {
  const { autenticado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario, setFormulario] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  if (autenticado) {
    return <Navigate to="/dashboard" replace />
  }

  const mensagem = location.state?.mensagem

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErro('')

    if (!formulario.email.trim() || !formulario.senha) {
      setErro('Informe email e senha')
      return
    }

    try {
      setCarregando(true)
      await login(formulario.email, formulario.senha)
      navigate('/events', { replace: true })
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível realizar o login')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="pagina-conteudo formulario-container">
      <h1>Entrar</h1>
      <p>Use seu email e senha para acessar o sistema.</p>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      <form className="formulario" onSubmit={handleSubmit}>
        <label className="campo">
          Email
          <input name="email" type="email" value={formulario.email} onChange={handleChange} />
        </label>

        <label className="campo">
          Senha
          <input name="senha" type="password" value={formulario.senha} onChange={handleChange} />
        </label>

        <button className="botao-principal" type="submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="texto-rodape">
        Ainda não possui cadastro? <Link to="/register">Cadastre-se como voluntário</Link>
      </p>
    </section>
  )
}

export default Login
