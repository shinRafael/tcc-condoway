'use client'
import { useState } from 'react'
import '../../styles/globals.css'
import styles from './visitantes.module.css'
import PageHeader from '@/componentes/PageHeader';

export default function Visitantes() {
  const [visitantes, setVisitantes] = useState([
    { nome: 'Carlos Pereira', documento: '111.222.333-44', andar: 2, numero: 1, entrada: '26/08/2025 14:00', saida: '26/08/2025 18:30' },
    { nome: 'Ana Costa', documento: '555.666.777-88', andar: 3, numero: 5, entrada: '26/08/2025 10:00', saida: '26/08/2025 11:45' },
    { nome: 'Ricardo Lima', documento: '999.888.777-66', andar: 1, numero: 2, entrada: '25/08/2025 19:30', saida: '25/08/2025 22:00' },
  ])

  const [showForm, setShowForm] = useState(false)
  const [novoVisitante, setNovoVisitante] = useState({
    nome: '',
    documento: '',
    andar: '',
    numero: '',
    entrada: '',
    saida: ''
  })

  const getApartamento = (andar, numero) => {
    return `${andar}0${numero}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setNovoVisitante({ ...novoVisitante, [name]: value })
  }

  const handleAddVisitante = (e) => {
    e.preventDefault()
    setVisitantes([...visitantes, {
      ...novoVisitante,
      entrada: new Date(novoVisitante.entrada).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      saida: new Date(novoVisitante.saida).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    }])
    setNovoVisitante({ nome: '', documento: '', andar: '', numero: '', entrada: '', saida: '' })
    setShowForm(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Controle de Visitantes"
        rightContent={(
          <div className={styles.userInfo}>
            <span>Síndico</span>
            <img src='https://via.placeholder.com/35' alt='User' className={styles.userAvatar} />
          </div>
        )}
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
                  <td>{v.nome}</td>
                  <td>{v.documento}</td>
                  <td>{getApartamento(v.andar, v.numero)}</td>
                  <td>{v.entrada}</td>
                  <td>{v.saida}</td>
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
                <input type='text' name='nome' placeholder='Ex: João da Silva' value={novoVisitante.nome} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Documento</label>
                <input type='text' name='documento' placeholder='Ex: 123.456.789-00' value={novoVisitante.documento} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Andar</label>
                <input type='number' name='andar' placeholder='Ex: 5' value={novoVisitante.andar} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Número do Apê</label>
                <input type='number' name='numero' placeholder='Ex: 2' value={novoVisitante.numero} onChange={handleChange} required />
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