import CartaoIdeia from './Cartaoidea';

export default function ListaIdeias({ ideias, carregando, erro, aoAlternarStatus, aoEditar, aoExcluir }) {
  
  if (carregando === true) {
    return <p className="msg-status"> Carregando ideias...</p>;
  }

  if (erro !== null) {
    return <p className="msg-erro"> {erro}</p>;
  }

  if (ideias.length === 0) {
    return <p className="msg-status">Nenhuma ideia por aqui — que tal cadastrar a primeira?</p>;
  }

  return (
    <div className="lista-ideias">
      {ideias.map((item) => (
        <CartaoIdeia
          key={item.id}
          ideia={item}
          aoAlternarStatus={aoAlternarStatus}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
        />
      ))}
    </div>
  );
}
