function formatarData(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(data))
}

function EventCard({ evento, ehAdmin, onEditar, onExcluir }) {
  return (
    <article className="cartao-evento">
      <div className="cabecalho-evento">
        <div>
          <h2>{evento.titulo}</h2>
          <span className={`status-evento status-${evento.status}`}>{evento.status}</span>
        </div>
        <span className="limite-evento">Limite: {evento.limite_voluntarios}</span>
      </div>

      {evento.descricao && <p className="descricao-evento">{evento.descricao}</p>}

      <dl className="detalhes-evento">
        <div>
          <dt>Local</dt>
          <dd>{evento.local}</dd>
        </div>
        <div>
          <dt>Início</dt>
          <dd>{formatarData(evento.data_inicio)}</dd>
        </div>
        <div>
          <dt>Fim</dt>
          <dd>{formatarData(evento.data_fim)}</dd>
        </div>
      </dl>

      {ehAdmin && (
        <div className="acoes-evento">
          <button className="botao-secundario" type="button" onClick={() => onEditar(evento)}>
            Editar
          </button>
          <button className="botao-perigo" type="button" onClick={() => onExcluir(evento.id)}>
            Excluir
          </button>
        </div>
      )}
    </article>
  )
}

export default EventCard
