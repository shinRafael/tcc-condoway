'use client'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import '../../styles/globals.css'
import styles from './visitantes.module.css'
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';

export default function Visitantes() {
  const [visitantes, setVisitantes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [novoVisitante, setNovoVisitante] = useState({
    nome: '',
    documento: '',
    andar: '',
    numero: '',
    entrada: '',
    saida: ''
  })

  // Carregar lista ao montar
  useEffect(() => {
    listarVisitantes();
  }, [])

  // GET visitantes
  async function listarVisitantes() {
    try {
      const response = await api.get('/visitantes')
      if (response.data.sucesso) {
        setVisitantes(response.data.dados)
      } else {
        alert('Erro: ' + response.data.message)
      }
    } catch (error) {
      alert('Erro ao listar visitantes\n' + (error.response?.data?.message || error))
    }
  }

  // POST visitante
  async function handleAddVisitante(e) {
    e.preventDefault()

    try {
      const ap_id = `${novoVisitante.andar}0${novoVisitante.numero}`

      const payload = {
        nome: novoVisitante.nome,
        documento: novoVisitante.documento,
        ap_id,
        data_visita: novoVisitante.entrada,
        data_saida: novoVisitante.saida,
      }

      const response = await api.post('/visitantes', payload)

      if (response.data.sucesso) {
        listarVisitantes() // atualiza lista
        setNovoVisitante({ nome: '', documento: '', andar: '', numero: '', entrada: '', saida: '' })
        setShowForm(false)
      } else {
        alert('Erro: ' + response.data.message)
      }
    } catch (error) {
      alert('Erro ao cadastrar visitante\n' + (error.response?.data?.message || error))
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNovoVisitante({ ...novoVisitante, [name]: value })
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Controle de Visitantes"
        rightContent={(<RightHeaderBrand />)}
      />

      <div className="page-content">
        <section className={styles.content}>
          <div className={styles.contentHeader}>
            <h2 className={styles.contentTitle}>Lista de Visitantes</h2>
            <button className={styles.addButton} onClick={() => setShowForm(true)}>+ Adicionar Visitante</button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Documento</th>
                  <th>Apartamento</th>
                  <th>Data de Entrada</th>
                  <th>Data de Saída</th>
                </tr>
              </thead>
              <tbody>
                {visitantes.map((v, index) => (
                  <tr key={index}>
                    <td>{v.vst_nome}</td>
                    <td>{v.vst_documento}</td>
                    <td>{v.AP_id}</td>
                    <td>{new Date(v.vst_data_visita).toLocaleString('pt-BR')}</td>
                    <td>{new Date(v.vst_data_saida).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {showForm && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Adicionar Visitante</h3>
              <form onSubmit={handleAddVisitante}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input type='text' name='nome' value={novoVisitante.nome} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Documento</label>
                  <input type='text' name='documento' value={novoVisitante.documento} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Andar</label>
                  <input type='number' name='andar' value={novoVisitante.andar} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Número do Apê</label>
                  <input type='number' name='numero' value={novoVisitante.numero} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Data de Entrada</label>
                  <input type='datetime-local' name='entrada' value={novoVisitante.entrada} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Data de Saída</label>
                  <input type='datetime-local' name='saida' value={novoVisitante.saida} onChange={handleChange} required />
                </div>
                <div className={styles.modalActions}>
                  <button type='button' className={styles.cancelButton} onClick={() => setShowForm(false)}>Cancelar</button>
                  <button type='submit' className={styles.saveButton}>Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
