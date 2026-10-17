import { useEffect, useState } from 'react'

import api from '../api/api'
import { useAuth } from '../contexts/useAuth'

function Dashboard() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')
  const { usuario } = useAuth()

  useEffect(() => {
    api
      .get('/dashboard')
      .then(({ data }) => setDados(data))
      .catch((error) => setErro(error.response?.data?.message || 'Não foi possível carregar o dashboard'))
  }, [])

  return (
    <section className="pagina-conteudo">
      <h1>Dashboard</h1>
      <p>Bem-vindo, {usuario?.email}.</p>
      <p>Perfil: {usuario?.role}</p>
      {erro && <p className="mensagem-erro">{erro}</p>}
      {dados && <p className="mensagem-sucesso">Sessão autenticada com sucesso.</p>}
    </section>
  )
}

export default Dashboard
