function EventVolunteerList({ evento, voluntarios, carregando, onFechar }) {
  return (
    <section className="painel-inscritos">
      <div className="cabecalho-painel">
        <div>
          <h2>Inscritos em {evento.titulo}</h2>
          <p>{voluntarios.length} voluntário(s) inscrito(s)</p>
        </div>
        <button className="botao-secundario" type="button" onClick={onFechar}>
          Fechar
        </button>
      </div>

      {carregando && <p className="mensagem-carregamento">Carregando inscritos...</p>}

      {!carregando && voluntarios.length === 0 && <p className="mensagem-vazia">Nenhum voluntário inscrito.</p>}

      {!carregando && voluntarios.length > 0 && (
        <div className="lista-inscritos">
          {voluntarios.map((voluntario) => (
            <article className="cartao-inscrito" key={voluntario.usuario_id}>
              <strong>{voluntario.nome}</strong>
              <span>{voluntario.email}</span>
              <span>{voluntario.telefone || 'Telefone não informado'}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default EventVolunteerList
