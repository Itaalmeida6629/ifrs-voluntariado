import { useState } from 'react'

function VolunteerForm({ voluntario, onSubmit, onCancel }) {
  const [formulario, setFormulario] = useState({
    nome: voluntario?.nome || '',
    email: voluntario?.email || '',
    telefone: voluntario?.telefone || '',
    senha: '',
  })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((prev) => ({ ...prev, [name]: value }))
  }

  const validarFormulario = () => {
    if (!formulario.nome.trim() || !formulario.email.trim()) {
      return 'Nome e email são obrigatórios'
    }

    if (!/^\S+@\S+\.\S+$/.test(formulario.email)) {
      return 'Informe um email válido'
    }

    if (formulario.telefone && !/^\d{10,11}$/.test(formulario.telefone)) {
      return 'Telefone deve conter apenas 10 ou 11 dígitos'
    }

    if (formulario.senha && formulario.senha.length < 6) {
      return 'A senha deve ter no mínimo 6 caracteres'
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

    const dados = { ...formulario }
    if (!dados.senha) {
      delete dados.senha
    }

    try {
      setErro('')
      setCarregando(true)
      await onSubmit(dados)
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível salvar o voluntário')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form className="formulario formulario-voluntario" onSubmit={handleSubmit}>
      <h2>{voluntario ? 'Editar voluntário' : 'Meu perfil'}</h2>
      {erro && <p className="mensagem-erro">{erro}</p>}

      <label className="campo">
        Nome
        <input name="nome" value={formulario.nome} onChange={handleChange} />
      </label>

      <label className="campo">
        Email
        <input name="email" type="email" value={formulario.email} onChange={handleChange} />
      </label>

      <label className="campo">
        Telefone
        <input name="telefone" value={formulario.telefone} onChange={handleChange} />
      </label>

      <label className="campo">
        Nova senha
        <input name="senha" type="password" value={formulario.senha} onChange={handleChange} />
      </label>

      <div className="acoes-formulario">
        <button className="botao-principal" type="submit" disabled={carregando}>
          {carregando ? 'Salvando...' : 'Salvar alterações'}
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

export default VolunteerForm
