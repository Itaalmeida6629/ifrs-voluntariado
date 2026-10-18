import { useEffect, useState } from 'react'

import api from '../api/api'
import EventCard from '../components/EventCard'
import EventForm from '../components/EventForm'
import EventVolunteerList from '../components/EventVolunteerList'
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
  const [eventoSelecionado, setEventoSelecionado] = useState(null)
  const [voluntariosInscritos, setVoluntariosInscritos] = useState([])
  const [carregandoInscritos, setCarregandoInscritos] = useState(false)

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
      if (eventoSelecionado?.id === eventoId) {
        setEventoSelecionado(null)
        setVoluntariosInscritos([])
      }
      setCarregando(true)
      setAtualizacaoEventos((valorAtual) => valorAtual + 1)
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível excluir o evento')
    }
  }

  const inscreverVoluntario = async (eventoId) => {
    try {
      setErro('')
      await api.post(`/events/${eventoId}/volunteers`)
      setMensagem('Inscrição realizada com sucesso')
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível realizar a inscrição')
    }
  }

  const cancelarInscricao = async (eventoId) => {
    if (!window.confirm('Deseja cancelar sua inscrição neste evento?')) {
      return
    }

    try {
      setErro('')
      await api.delete(`/events/${eventoId}/volunteers/me`)
      setMensagem('Inscrição cancelada com sucesso')
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível cancelar a inscrição')
    }
  }

  const verInscritos = async (evento) => {
    try {
      setErro('')
      setEventoSelecionado(evento)
      setVoluntariosInscritos([])
      setCarregandoInscritos(true)
      const { data } = await api.get(`/events/${evento.id}/volunteers`)
      setVoluntariosInscritos(data)
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível carregar os inscritos')
      setEventoSelecionado(null)
    } finally {
      setCarregandoInscritos(false)
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
              onInscrever={inscreverVoluntario}
              onCancelar={cancelarInscricao}
              onVerInscritos={verInscritos}
            />
          ))}
        </div>
      )}

      {ehAdmin && eventoSelecionado && (
        <EventVolunteerList
          evento={eventoSelecionado}
          voluntarios={voluntariosInscritos}
          carregando={carregandoInscritos}
          onFechar={() => setEventoSelecionado(null)}
        />
      )}
    </section>
  )
}

export default Events
