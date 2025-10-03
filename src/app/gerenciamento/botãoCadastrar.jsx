'use client';

import { useState } from 'react';
import styles from './index.module.css'; // usar o mesmo CSS compartilhado
import api from '@/services/api';

export default function BotaoCadastrar({ onSaved }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cond_nome: '',
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
      // enviar o objeto que sua API espera; aqui enviamos os campos do form
      const response = await api.post('/gerenciamento', formData);
      // tenta pegar response.data.dados, response.data ou fallback para formData
      const itemSalvo = response.data?.dados ?? response.data ?? { ...formData, ger_id: `local-${Date.now()}` };

      if (onSaved) onSaved(itemSalvo);

      setFormData({ cond_nome: '', ger_data: '', ger_descricao: '', ger_valor: '' });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeOnOverlay = (e) => {
    if (e.target === e.currentTarget) toggleModal();
  };

  return (
    <>
      <button className={styles.botaoCadastrar} onClick={toggleModal}>
        Cadastrar Despesa
      </button>

      {mostrarFormulario && (
        <div className={styles.modalOverlay} onClick={closeOnOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{textAlign: 'center'}}>Cadastrar Despesa</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label className={styles.label}>
                Condomínio:
                <input className={styles.input} type="text" name="cond_nome" value={formData.cond_nome} onChange={handleChange} required />
              </label>

              <label className={styles.label}>
                Data:
                <input className={styles.input} type="date" name="ger_data" value={formData.ger_data} onChange={handleChange} required />
              </label>

              <label className={styles.label}>
                Descrição:
                <input className={styles.input} type="text" name="ger_descricao" value={formData.ger_descricao} onChange={handleChange} required />
              </label>

              <label className={styles.label}>
                Valor:
                <input className={styles.input} type="number" step="0.01" name="ger_valor" value={formData.ger_valor} onChange={handleChange} required />
              </label>

              <div className={styles.formButtons}>
                <button type="submit" className={styles.saveButton} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
                <button type="button" className={styles.cancelButton} onClick={toggleModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
