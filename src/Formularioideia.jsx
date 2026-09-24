import { useState } from 'react';

export default function FormularioIdeia({ aoSalvar, ideiaEmEdicao, aoCancelar }) {
  const [tituloInput, setTituloInput] = useState(ideiaEmEdicao ? ideiaEmEdicao.title : '');

  function enviarFormulario(evento) {
    evento.preventDefault();
    if (tituloInput.trim() === '') {
      alert('Digite um título para a ideia!');
      return;
    }
    aoSalvar(tituloInput);
    setTituloInput('');
  }

  return (
    <div className="formulario-box">
      <h3>{ideiaEmEdicao ? 'Editar Ideia' : 'Nova Ideia'}</h3>
      
      <form onSubmit={enviarFormulario}>
        <div className="campo-grupo">
          <label>Título:</label>
          <input 
            type="text" 
            placeholder="Digite sua ideia aqui..."
            value={tituloInput}
            onChange={(e) => setTituloInput(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-azul">
          {ideiaEmEdicao ? 'Salvar' : 'Adicionar ideia'}
        </button>

        {ideiaEmEdicao && (
          <button type="button" onClick={aoCancelar} className="btn-cinza">
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
