export default function CartaoIdeia({ ideia, aoAlternarStatus, aoEditar, aoExcluir }) {
  const classeDoCard = ideia.completed 
    ? "cartao-ideia ideia-executada" 
    : "cartao-ideia";

  return (
    <div className={classeDoCard}>
      <h4>{ideia.title}</h4>
      <p>Status: {ideia.completed ? ' Executada' : ' Pendente'}</p>

      <div className="botoes-grupo">
        <button onClick={() => aoAlternarStatus(ideia)}>
          {ideia.completed ? 'Reabrir' : 'Marcar executada'}
        </button>
        <button onClick={() => aoEditar(ideia)}>
          Editar
        </button>
        <button onClick={() => aoExcluir(ideia.id)} className="btn-vermelho">
          Excluir
        </button>
      </div>
    </div>
  );
}
