import { useState, useEffect } from 'react';
import Formularioideia from './Formularioideia.jsx';
import Listaideias from './Listaideia.jsx';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com';

export default function App() {
  const [ideias, setIdeias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [ideiaEmEdicao, setIdeiaEmEdicao] = useState(null);

  // RF01 — Listar as ideias 
  useEffect(() => {
    const controller = new AbortController();

    async function buscarIdeias() {
      try {
        setCarregando(true);
        setErro(null);
        const resposta = await fetch(`${API_URL}/todos?_limit=15`, { signal: controller.signal });
        
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as ideias do servidor.');
        }
        
        const dados = await resposta.json();

        
        const ideiasEmPortugues = [
          "Exemplo: Criar um app de receitas automáticas"
        ];

        
        const dadosTraduzidos = ideiasEmPortugues.map((titulo, index) => {
          const dadosOriginaisdaAPI = dados[index] || {};
          return {
            userId: dadosOriginaisdaAPI.userId || 1,
            id: dadosOriginaisdaAPI.id || (index + 1),
            completed: dadosOriginaisdaAPI.completed || false,
            title: titulo 
          };
        });

        setIdeias(dadosTraduzidos);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setErro(err.message);
        }
      } finally {
        setCarregando(false);
      }
    }

    buscarIdeias();

    return () => controller.abort();
  }, []);

  // RF02 e RF03 — Cadastrar ou Editar Ideia
  const lidarComSalvarFormulario = async (titulo) => {
    if (ideiaEmEdicao) {
      // RF03: Modo Edição (PUT)
      try {
        const resposta = await fetch(`${API_URL}/todos/${ideiaEmEdicao.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...ideiaEmEdicao, title: titulo })
        });

        if (!resposta.ok) throw new Error('Falha ao atualizar a ideia.');

        const ideiaAtualizada = await resposta.json();
        
        setIdeias(ideias.map(i => i.id === ideiaEmEdicao.id ? ideiaAtualizada : i));
        setIdeiaEmEdicao(null);
      } catch (err) {
        alert('Erro ao salvar edição: ' + err.message);
      }
    } else {
      // RF02: Modo Criação (POST)
      try {
        const novaIdeiaCorpo = { userId: 1, title: titulo, completed: false };
        const resposta = await fetch(`${API_URL}/todos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novaIdeiaCorpo)
        });

        if (!resposta.ok) throw new Error('Falha ao criar nova ideia.');

        const ideiaCriada = await resposta.json();
        
        const proximoId = ideias.length > 0 ? Math.max(...ideias.map(i => i.id)) + 1 : 1;
        const ideiaComIdUnico = { ...ideiaCriada, id: proximoId };

        setIdeias([ideiaComIdUnico, ...ideias]);
      } catch (err) {
        alert('Erro ao cadastrar: ' + err.message);
      }
    }
  };


  // RF05 — Marcar como executada
  const lidarComAlternarStatus = async (ideia) => {
    const statusOriginal = ideia.completed;
    setIdeias(ideias.map(i => i.id === ideia.id ? { ...i, completed: !statusOriginal } : i));

    try {
      const resposta = await fetch(`${API_URL}/todos/${ideia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ideia, completed: !statusOriginal })
      });

      if (!resposta.ok) throw new Error();
    } catch { 
      setIdeias(ideias.map(i => i.id === ideia.id ? { ...i, completed: statusOriginal } : i));
      alert('Não foi possível atualizar o status no servidor. Desfazendo alteração.');
    }
  };

  // RF04 — Excluir uma ideia (com Estratégia de Rollback)
  const lidarComExcluir = async (id) => {
    const listaOriginal = [...ideias]
    setIdeias(ideias.filter(i => i.id !== id));

    try {
      const resposta = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      });

      if (!resposta.ok) throw new Error();
    } catch { 
      setIdeias(listaOriginal);
      alert('Erro ao excluir do servidor. Operação desfeita.');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Banco de Ideias</h1>
        <p>Gerencie seus projetos e tire os planos do papel</p>
      </header>

      <Formularioideia 
        key={ideiaEmEdicao ? ideiaEmEdicao.id : 'novo'}
        aoSalvar={lidarComSalvarFormulario} 
        ideiaEmEdicao={ideiaEmEdicao}
        aoCancelar={() => setIdeiaEmEdicao(null)}
      />

      <Listaideias 
        ideias={ideias}
        carregando={carregando}
        erro={erro}
        aoAlternarStatus={lidarComAlternarStatus}
        aoEditar={(ideia) => setIdeiaEmEdicao(ideia)}
        aoExcluir={lidarComExcluir}
      />
    </div>
  );
}
