'use client';
import { useState } from 'react';
import styles from './index.module.css';
import api from '@/services/api';
import { useModal } from "@/context/ModalContext"; 

export default function BotaoCadastrar({ onSaved }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // const [condominios, setCondominios] = useState([]); // 2. Removido estado de condominios
  const [formData, setFormData] = useState({
    // cond_id: '', // 3. Removido cond_id do estado inicial do form
    ger_data: '',
    ger_descricao: '',
    ger_valor: '',
  });
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal(); 

  // 4. Removido o useEffect que buscava condomínios

  const toggleModal = () => setMostrarFormulario(prev => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 5. INJETAR O ID DO CONDOMÍNIO AQUI
      const payload = {
        ...formData,
        cond_id: 1 // ID 1 = Residencial Jardim Europa (baseado no insert.novo.sql)
      };

      const response = await api.post('/gerenciamento', payload); // 6. Enviar 'payload'
      const itemSalvo = response.data?.dados ?? response.data ?? { ...payload, ger_id: `local-${Date.now()}` };

      if (onSaved) onSaved(itemSalvo);

      // 7. Resetar o formulário
      setFormData({ ger_data: '', ger_descricao: '', ger_valor: '' });
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      showModal('Erro', 'Erro ao salvar despesa. Verifique os dados e tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const closeOnOverlay = (e) => {
    if (e.target === e.currentTarget) toggleModal();
  };

  return (
    <>
      <button className={styles.addButton} onClick={toggleModal}>
        💰 Cadastrar Despesa
      </button>

      {mostrarFormulario && (
        <div className={styles.modalOverlay} onClick={closeOnOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{textAlign: 'center'}}>Cadastrar Despesa</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              
              {/* 8. CAMPO DE CONDOMÍNIO REMOVIDO */}
              <label className={styles.label}>
                Condomínio:
                <input 
                  className={`${styles.input} ${styles.disabledInput}`} 
                  type="text" 
                  value="Residencial Jardim Europa" 
                  disabled 
                />
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