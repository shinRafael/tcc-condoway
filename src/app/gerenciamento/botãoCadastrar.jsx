'use client';

import { useState } from 'react';
import api from '@/services/api'; // <- ajuste o caminho conforme seu projeto
import styles from './index.module.css';

export default function BotaoCadastrar({ onClick, show, onClose, onSaved }) {
  const isControlled = typeof show !== 'undefined';
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cond_id: '',
    ger_data: '',
    ger_descricao: '',
    ger_valor: ''
  });

  const visible = isControlled ? show : mostrarFormulario;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fechar = () => {
    if (isControlled) {
      if (onClose) onClose();
    } else {
      setMostrarFormulario(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ger_valor: parseFloat(String(formData.ger_valor).replace(",", ".") || 0)
      };
      const response = await api.post('/gerenciamento', payload);
      // chama callback do parent se existir
      if (onSaved) onSaved(response.data);
      alert('Cadastro realizado com sucesso!');
      // fecha/limpa
      fechar();
      setFormData({ cond_id: '', ger_data: '', ger_descricao: '', ger_valor: '' });
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar, tente novamente.');
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          if (onClick) onClick();
          if (!isControlled) setMostrarFormulario(true);
        }}
        className={styles.addButton}
      >
        + Adicionar
      </button>

      {visible && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit} className={styles.formulario}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="cond_id">ID do condomínio</label>
                <input
                  id="cond_id"
                  className={styles.input}
                  type="text"
                  name="cond_id"
                  placeholder="ID do condomínio"
                  value={formData.cond_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="ger_data">Data</label>
                <input
                  id="ger_data"
                  className={styles.input}
                  type="date"
                  name="ger_data"
                  value={formData.ger_data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="ger_descricao">Descrição</label>
                <input
                  id="ger_descricao"
                  className={styles.input}
                  type="text"
                  name="ger_descricao"
                  placeholder="Descrição"
                  value={formData.ger_descricao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="ger_valor">Valor</label>
                <input
                  id="ger_valor"
                  className={styles.input}
                  type="number"
                  step="0.01"
                  name="ger_valor"
                  placeholder="Valor"
                  value={formData.ger_valor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Cadastrar
                </button>
                <button
                  type="button"
                  onClick={fechar}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
