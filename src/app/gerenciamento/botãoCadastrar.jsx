'use client';

import { useState } from 'react';
import styles from './index.module.css';
import api from '@/services/api';

export default function BotaoCadastrar({ onSaved }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cond_id: '',
    ger_data: '',
    ger_descricao: '',
    ger_valor: '',
  });
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setMostrarFormulario(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/gerenciamento', formData);
      const itemSalvo = response.data.dados || formData;

      if (onSaved) onSaved(itemSalvo);

      setFormData({ cond_id: '', ger_data: '', ger_descricao: '', ger_valor: '' });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className={styles.botaoCadastrar} onClick={toggleModal}>
        Cadastrar Despesa
      </button>

      {mostrarFormulario && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Cadastrar Despesa</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Condomínio:
                <input
                  type="text"
                  name="cond_id"
                  value={formData.cond_id}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Data:
                <input
                  type="date"
                  name="ger_data"
                  value={formData.ger_data}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Descrição:
                <input
                  type="text"
                  name="ger_descricao"
                  value={formData.ger_descricao}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Valor:
                <input
                  type="number"
                  step="0.01"
                  name="ger_valor"
                  value={formData.ger_valor}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className={styles.formButtons}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" onClick={toggleModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
