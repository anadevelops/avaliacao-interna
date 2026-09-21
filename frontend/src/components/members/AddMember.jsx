import React, { useState } from 'react';
import axios from 'axios';
import './AddMember.css';

export default function AddMember({ isOpen, onClose }) {
  const [formulario, setFormulario] = useState({
    nome: '',
    categoria: 'Bolsista'
  });

  const [statusEnvio, setStatusEnvio] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusEnvio('enviando');

    try {
      await axios.post('http://localhost:3000/membros', {
        nome: formulario.nome,
        categoria: formulario.categoria,
        ativo: 1
      });

      setStatusEnvio('sucesso');
      setFormulario({
        nome: '',
        categoria: 'Bolsista'
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erro ao adicionar membro.');
      setStatusEnvio('erro');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="popup-overlay" onClick={onClose}>
          <div
            className="popup-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="popup-close" onClick={onClose}>
              &times;
            </button>

            <form onSubmit={handleSubmit}>
              <div className="card-addMember">
                <h3>Adicionar Membro</h3>

                <label>Nome:</label>
                <input
                  name="nome"
                  required
                  value={formulario.nome}
                  onChange={handleChange}
                />
                <br/>
                <label>Categoria:</label>
                <select
                  name="categoria"
                  value={formulario.categoria}
                  onChange={handleChange}
                >
                  <option value="Bolsista">Bolsista</option>
                  <option value="Voluntári@">Voluntári@</option>
                  <option value="Colaborador@">Colaborador@</option>
                </select>
              </div>

              <button type="submit" disabled={statusEnvio === 'enviando'}>
                {statusEnvio === 'enviando'
                  ? 'Salvando...'
                  : 'Adicionar Membro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}