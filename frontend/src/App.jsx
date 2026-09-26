import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import Sidebar from './components/sidebar/Sidebar';
import AddMember from './components/members/AddMember';
import AddSemester from './components/semesters/AddSemester';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  const [membros, setMembros] = useState([]);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addSemesterOpen, setAddSemesterOpen] = useState(false);
  const [semestreAtivo, setSemestreAtivo] = useState(null);
  
  const [avaliadorId, setAvaliadorId] = useState('');
  const [jaVotou, setJaVotou] = useState(false);
  const [formulario, setFormulario] = useState({});
  const [statusEnvio, setStatusEnvio] = useState(''); // 'enviando', 'sucesso', 'erro'

  // Carrega dados iniciais ao abrir o app
  useEffect(() => {
    axios.get(`${API_URL}/dados-iniciais`).then(res => {
      setMembros(res.data.membros);
      setSemestreAtivo(res.data.semestreAtivo);
      
      // Prepara o estado inicial do formulário vazio
      const formInicial = {};
      res.data.membros.forEach(m => {
        formInicial[m.id] = { nota: '', comentario: '' };
      });
      setFormulario(formInicial);
    });
  }, []);

  // Verifica se o usuário selecionado já votou
  const handleSelecionarAvaliador = async (e) => {
    const id = parseInt(e.target.value);
    setAvaliadorId(id);
    
    if (id && semestreAtivo) {
      const res = await axios.get(`${API_URL}/status/${id}/${semestreAtivo.id}`);
      setJaVotou(res.data.jaVotou);
    }
  };

  const handleMudancaForm = (avaliadoId, campo, valor) => {
    setFormulario(prev => ({
      ...prev,
      [avaliadoId]: { ...prev[avaliadoId], [campo]: valor }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusEnvio('enviando');

    // Transforma o objeto do formulário em um array para o backend
    const avaliacoesArray = membros.map(m => ({
      avaliado_id: m.id,
      nota: parseInt(formulario[m.id].nota),
      comentario: formulario[m.id].comentario
    }));

    try {
      await axios.post(`${API_URL}/avaliacoes`, {
        avaliador_id: avaliadorId,
        semestre_id: semestreAtivo.id,
        avaliacoes: avaliacoesArray
      });
      setStatusEnvio('sucesso');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao enviar.');
      setStatusEnvio('erro');
    }
  };

  if (statusEnvio === 'sucesso') {
    return <h2>Obrigado! Suas avaliações foram registradas de forma anônima.</h2>;
  }

  return (
    <div className="app-layout">
      <Sidebar onAddMember={() => setAddMemberOpen(true)}
               onAddSemester={() => setAddSemesterOpen(true)}/>
      <main className="app-content">
        <div className="container">
          <h1>Avaliação 360º - PET</h1>
          {semestreAtivo && <h2>Semestre: {semestreAtivo.codigo}</h2>}

          <div className="identificacao">
            <label>Quem é você?</label>
            <select value={avaliadorId} onChange={handleSelecionarAvaliador}>
              <option value="">Selecione seu nome...</option>
              {membros.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>

          {avaliadorId !== '' && jaVotou && (
            <div className="alerta">
              <p>Você já enviou sua avaliação neste semestre.</p>
            </div>
          )}

          {avaliadorId !== '' && !jaVotou && (
            <form onSubmit={handleSubmit}>
              {membros.map(membro => (
                <div key={membro.id} className="card-avaliacao">
                  <h3>{membro.nome} {membro.id === avaliadorId ? "(Autoavaliação)" : ""}</h3>
              
                  <label>Nota (0 a 10):</label>
                  <input 
                    type="number" min="0" max="10" required
                    value={formulario[membro.id]?.nota}
                    onChange={(e) => handleMudancaForm(membro.id, 'nota', e.target.value)}
                  />
              
                  <label>Comentário:</label>
                  <textarea 
                    required rows="3"
                    value={formulario[membro.id]?.comentario}
                    onChange={(e) => handleMudancaForm(membro.id, 'comentario', e.target.value)}
                  />
                </div>
              ))}

              <button type="submit" disabled={statusEnvio === 'enviando'}>
                {statusEnvio === 'enviando' ? 'Salvando...' : 'Enviar Avaliações'}
              </button>
            </form>
          )}
        </div>
        <AddMember
          isOpen={addMemberOpen}
          onClose={() => setAddMemberOpen(false)}
        />

        <AddSemester
          isOpen={addSemesterOpen}
          onClose={() => setAddSemesterOpen(false)}
        />
      </main>
    </div>
  );
}