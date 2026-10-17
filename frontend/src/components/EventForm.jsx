import { useState } from 'react'

const formularioInicial = {
  titulo: '',
  descricao: '',
  local: '',
  data_inicio: '',
  data_fim: '',
  limite_voluntarios: '20',
  status: 'agendado',
}

function formatarDataParaFormulario(data) {
  if (!data) {
    return ''
  }

  return String(data).replace(' ', 'T').slice(0, 16)
}

function formatarDataParaApi(data) {
  return data ? `${data.replace('T', ' ')}:00` : data
}

function EventForm({ evento, onSubmit, onCancel }) {
  const [formulario, setFormulario] = useState(() => ({
    ...formularioInicial,
    ...(evento
      ? {
          titulo: evento.titulo,
          descricao: evento.descricao || '',
          local: evento.local,
          data_inicio: formatarDataParaFormulario(evento.data_inicio),
          data_fim: formatarDataParaFormulario(evento.data_fim),
          limite_voluntarios: String(evento.limite_voluntarios),
          status: evento.status,
        }
      : {}),
  }))
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const validarFormulario = () => {
    if (!formulario.titulo.trim() || !formulario.local.trim()) {
      return 'Título e local são obrigatórios'
    }

    if (!formulario.data_inicio || !formulario.data_fim) {
      return 'Informe as datas de início e fim'
    }

    if (new Date(formulario.data_fim) <= new Date(formulario.data_inicio)) {
      return 'A data de fim deve ser posterior à data de início'
    }

    if (!Number.isInteger(Number(formulario.limite_voluntarios)) || Number(formulario.limite_voluntarios) <= 0) {
      return 'O limite deve ser um número inteiro maior que zero'
    }

    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const erroValidacao = validarFormulario()

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    try {
      setErro('')
      setCarregando(true)
      await onSubmit({
        ...formulario,
        data_inicio: formatarDataParaApi(formulario.data_inicio),
        data_fim: formatarDataParaApi(formulario.data_fim),
        limite_voluntarios: Number(formulario.limite_voluntarios),
      })
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível salvar o evento')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form className="formulario formulario-evento" onSubmit={handleSubmit}>
      <h2>{evento ? 'Editar evento' : 'Novo evento'}</h2>
      {erro && <p className="mensagem-erro">{erro}</p>}

      <label className="campo">
        Título
        <input name="titulo" value={formulario.titulo} onChange={handleChange} />
      </label>

      <label className="campo">
        Descrição
        <textarea name="descricao" value={formulario.descricao} onChange={handleChange} rows="3" />
      </label>

      <label className="campo">
        Local
        <input name="local" value={formulario.local} onChange={handleChange} />
      </label>

      <div className="grade-evento">
        <label className="campo">
          Data de início
          <input name="data_inicio" type="datetime-local" value={formulario.data_inicio} onChange={handleChange} />
        </label>

        <label className="campo">
          Data de fim
          <input name="data_fim" type="datetime-local" value={formulario.data_fim} onChange={handleChange} />
        </label>
      </div>

      <div className="grade-evento">
        <label className="campo">
          Limite de voluntários
          <input
            name="limite_voluntarios"
            type="number"
            min="1"
            value={formulario.limite_voluntarios}
            onChange={handleChange}
          />
        </label>

        <label className="campo">
          Status
          <select name="status" value={formulario.status} onChange={handleChange}>
            <option value="agendado">Agendado</option>
            <option value="finalizado">Finalizado</option>
          </select>
        </label>
      </div>

      <div className="acoes-formulario">
        <button className="botao-principal" type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar evento'}
        </button>
        {onCancel && (
          <button className="botao-secundario" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default EventForm
