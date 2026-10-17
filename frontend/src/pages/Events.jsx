import { useEffect, useState } from 'react'

import api from '../api/api'
import EventCard from '../components/EventCard'
import EventForm from '../components/EventForm'
import { useAuth } from '../contexts/useAuth'

function Events() {
  const { usuario } = useAuth()
  const ehAdmin = usuario?.role === 'admin'
  const [eventos, setEventos] = useState([])
  const [eventoEmEdicao, setEventoEmEdicao] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [atualizacaoEventos, setAtualizacaoEventos] = useState(0)

  useEffect(() => {
    let componenteAtivo = true

    api
      .get('/events')
      .then(({ data }) => {
        if (componenteAtivo) {
          setEventos(data)
        }
      })
      .catch((error) => {
        if (componenteAtivo) {
          setErro(error.response?.data?.message || 'Não foi possível carregar os eventos')
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
  }, [atualizacaoEventos])

  const abrirFormulario = (evento = null) => {
    setEventoEmEdicao(evento)
    setMostrarFormulario(true)
    setMensagem('')
  }

  const fecharFormulario = () => {
    setEventoEmEdicao(null)
    setMostrarFormulario(false)
  }

  const salvarEvento = async (dados) => {
    if (eventoEmEdicao) {
      await api.put(`/events/${eventoEmEdicao.id}`, dados)
      setMensagem('Evento atualizado com sucesso')
    } else {
      await api.post('/events', dados)
      setMensagem('Evento criado com sucesso')
    }

    fecharFormulario()
    setCarregando(true)
    setErro('')
    setAtualizacaoEventos((valorAtual) => valorAtual + 1)
  }

  const excluirEvento = async (eventoId) => {
    if (!window.confirm('Deseja realmente excluir este evento?')) {
      return
    }

    try {
      setErro('')
      await api.delete(`/events/${eventoId}`)
      setMensagem('Evento excluído com sucesso')
      setCarregando(true)
      setAtualizacaoEventos((valorAtual) => valorAtual + 1)
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível excluir o evento')
    }
  }

  return (
    <section className="pagina-conteudo pagina-eventos">
      <div className="cabecalho-pagina">
        <div>
          <h1>Eventos</h1>
          <p>Consulte as ações de voluntariado disponíveis.</p>
        </div>
        {ehAdmin && (
          <button className="botao-principal" type="button" onClick={() => abrirFormulario()}>
            Novo evento
          </button>
        )}
      </div>

      {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {ehAdmin && mostrarFormulario && (
        <EventForm
          key={eventoEmEdicao?.id || 'novo'}
          evento={eventoEmEdicao}
          onSubmit={salvarEvento}
          onCancel={fecharFormulario}
        />
      )}

      {carregando && <p className="mensagem-carregamento">Carregando eventos...</p>}

      {!carregando && eventos.length === 0 && <p className="mensagem-vazia">Nenhum evento encontrado.</p>}

      {!carregando && eventos.length > 0 && (
        <div className="lista-eventos">
          {eventos.map((evento) => (
            <EventCard
              key={evento.id}
              evento={evento}
              ehAdmin={ehAdmin}
              onEditar={abrirFormulario}
              onExcluir={excluirEvento}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Events
