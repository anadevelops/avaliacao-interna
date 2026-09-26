import React, { useState } from 'react';
import axios from 'axios';
import './AddSemester.css';

export default function AddSemester({ isOpen, onClose }) {
  const [formulario, setFormulario] = useState({
    codigo: '',
    is_ativo: 'True'
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
      await axios.post('http://localhost:3000/semestres', {
        codigo: formulario.codigo,
        is_ativo: formulario.is_ativo === 'True' ? 1 : 0
      });

      setStatusEnvio('sucesso');
      setFormulario({
        codigo: '',
        is_ativo: 'True'
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Erro ao adicionar semestre.');
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
              <div className="card-addSemester">
                <h3>Adicionar Semestre</h3>

                <label>Código (ex: 22.1):</label>
                <input
                  name="codigo"
                  required
                  value={formulario.codigo}
                  onChange={handleChange}
                />
                <br/>
                <label>Ativo:</label>
                <select
                  name="is_ativo"
                  value={formulario.is_ativo}
                  onChange={handleChange}
                >
                  <option value="True">Sim</option>
                  <option value="False">Não</option>
                </select>
              </div>

              <button type="submit" disabled={statusEnvio === 'enviando'}>
                {statusEnvio === 'enviando'
                  ? 'Salvando...'
                  : 'Adicionar Semestre'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}