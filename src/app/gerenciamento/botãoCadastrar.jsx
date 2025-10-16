'use client';

import { useState, useEffect } from 'react'; // Adicione useEffect
import styles from './index.module.css';
import api from '@/services/api';
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function BotaoCadastrar({ onSaved }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Lista para guardar os condomínios que vêm da API
  const [condominios, setCondominios] = useState([]);
  const [formData, setFormData] = useState({
    // MUDANÇA: Trocamos cond_nome por cond_id
    cond_id: '',
    ger_data: '',
    ger_descricao: '',
    ger_valor: '',
  });
  const [loading, setLoading] = useState(false);

  // Efeito para buscar os condomínios quando o modal é aberto
  useEffect(() => {
    if (mostrarFormulario) {
      const fetchCondominios = async () => {
        try {
          const response = await api.get('/condominio');
          if (response.data?.sucesso) {
            setCondominios(response.data.dados);
          }
        } catch (error) {
          console.error("Erro ao buscar condomínios:", error);
        }
      };
      fetchCondominios();
    }
  }, [mostrarFormulario]);

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
      const itemSalvo = response.data?.dados ?? response.data ?? { ...formData, ger_id: `local-${Date.now()}` };

      if (onSaved) onSaved(itemSalvo);

      setFormData({ cond_id: '', ger_data: '', ger_descricao: '', ger_valor: '' });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      alert('Erro ao salvar despesa. Verifique os dados e tente novamente.'); // Feedback para o usuário
    } finally {
      setLoading(false);
    }
  };
  
  const closeOnOverlay = (e) => {
    if (e.target === e.currentTarget) toggleModal();
  };

  return (
    <>
      <FabButton label="Cadastrar Despesa" onClick={toggleModal} />

      {mostrarFormulario && (
        <div className={styles.modalOverlay} onClick={closeOnOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{textAlign: 'center'}}>Cadastrar Despesa</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* MUDANÇA: Trocamos o input de texto por um select */}
              <label className={styles.label}>
                Condomínio:
                <select className={styles.input} name="cond_id" value={formData.cond_id} onChange={handleChange} required>
                  <option value="">Selecione um condomínio</option>
                  {condominios.map(cond => (
                    <option key={cond.cond_id} value={cond.cond_id}>
                      {cond.cond_nome}
                    </option>
                  ))}
                </select>
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