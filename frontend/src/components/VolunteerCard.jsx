function VolunteerCard({ voluntario, onEditar, onExcluir }) {
  return (
    <article className="cartao-voluntario">
      <div>
        <h2>{voluntario.nome}</h2>
        <p>{voluntario.email}</p>
        <p>{voluntario.telefone || 'Telefone não informado'}</p>
      </div>

      <div className="acoes-voluntario">
        <button className="botao-secundario" type="button" onClick={() => onEditar(voluntario)}>
          Editar
        </button>
        <button className="botao-perigo" type="button" onClick={() => onExcluir(voluntario.id)}>
          Excluir
        </button>
      </div>
    </article>
  )
}

export default VolunteerCard
