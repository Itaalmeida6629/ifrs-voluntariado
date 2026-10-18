import { useEffect, useState } from 'react'

import api from '../api/api'
import VolunteerCard from '../components/VolunteerCard'
import VolunteerForm from '../components/VolunteerForm'
import { useAuth } from '../contexts/useAuth'

function Volunteers() {
  return <TelaVoluntarios />
}

function TelaVoluntarios() {
  const { usuario } = useAuth()
  const ehAdmin = usuario?.role === 'admin'
  const [voluntarios, setVoluntarios] = useState([])
  const [perfil, setPerfil] = useState(null)
  const [voluntarioEmEdicao, setVoluntarioEmEdicao] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    let componenteAtivo = true
    const url = ehAdmin ? '/users' : `/users/${usuario?.userId}`

    api
      .get(url)
      .then(({ data }) => {
        if (!componenteAtivo) {
          return
        }

        if (ehAdmin) {
          setVoluntarios(data.filter((item) => item.role === 'voluntario'))
        } else {
          setPerfil(data)
        }
      })
      .catch((error) => {
        if (componenteAtivo) {
          setErro(error.response?.data?.message || 'Não foi possível carregar os voluntários')
        }
      })
      .finally(() => {
        if (componenteAtivo) {
          setCarregando(false)
        }
      })

    return () => {
      componenteAtivo = false
    }
  }, [ehAdmin, usuario?.userId])

  const salvarVoluntario = async (dados) => {
    const id = ehAdmin ? voluntarioEmEdicao.id : usuario.userId
    const { data } = await api.put(`/users/${id}`, dados)

    if (ehAdmin) {
      setVoluntarios((prev) => prev.map((item) => (item.id === id ? data.user : item)))
      setVoluntarioEmEdicao(null)
    } else {
      setPerfil(data.user)
    }

    setMensagem('Dados atualizados com sucesso')
  }

  const excluirVoluntario = async (id) => {
    if (!window.confirm('Deseja realmente excluir este voluntário?')) {
      return
    }

    try {
      setErro('')
      await api.delete(`/users/${id}`)
      setVoluntarios((prev) => prev.filter((item) => item.id !== id))
      setMensagem('Voluntário excluído com sucesso')
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível excluir o voluntário')
    }
  }

  if (carregando) {
    return (
      <section className="pagina-conteudo">
        <p>Carregando voluntários...</p>
      </section>
    )
  }

  if (!ehAdmin) {
    return (
      <section className="pagina-conteudo formulario-container">
        <h1>Meu perfil</h1>
        {erro && <p className="mensagem-erro">{erro}</p>}
        {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
        {perfil && <VolunteerForm voluntario={perfil} onSubmit={salvarVoluntario} />}
      </section>
    )
  }

  return (
    <section className="pagina-conteudo pagina-voluntarios">
      <div className="cabecalho-pagina">
        <div>
          <h1>Voluntários</h1>
          <p>Gerencie os voluntários cadastrados no sistema.</p>
        </div>
      </div>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}

      {voluntarioEmEdicao && (
        <VolunteerForm
          key={voluntarioEmEdicao.id}
          voluntario={voluntarioEmEdicao}
          onSubmit={salvarVoluntario}
          onCancel={() => setVoluntarioEmEdicao(null)}
        />
      )}

      {voluntarios.length === 0 && <p className="mensagem-vazia">Nenhum voluntário encontrado.</p>}

      {voluntarios.length > 0 && (
        <div className="lista-voluntarios">
          {voluntarios.map((voluntario) => (
            <VolunteerCard
              key={voluntario.id}
              voluntario={voluntario}
              onEditar={setVoluntarioEmEdicao}
              onExcluir={excluirVoluntario}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Volunteers
