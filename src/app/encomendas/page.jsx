"use client";
import { useState } from "react";
import styles from "./encomendas.module.css";
import PageHeader from "@/componentes/PageHeader";
import RightHeaderBrand from "@/componentes/PageHeader/RightHeaderBrand";
import FabButton from '@/componentes/FabButton/FabButton';
import IconAction from '@/componentes/IconAction/IconAction';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Page() {
  const [encomendas, setEncomendas] = useState([
    { enc_id: 1, enc_userap_id: 1, enc_nome_loja: "Magazine Online", enc_status: "aguardando_retirada", enc_data_chegada: "2025-08-18", enc_data_retirada: null },
    { enc_id: 2, enc_userap_id: 4, enc_nome_loja: "Loja do Lar", enc_status: "entregue", enc_data_chegada: "2025-08-20", enc_data_retirada: "2025-08-23" },
    { enc_id: 3, enc_userap_id: 4, enc_nome_loja: "Tech Store", enc_status: "aguardando_retirada", enc_data_chegada: "2025-08-20", enc_data_retirada: null },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [novaEncomenda, setNovaEncomenda] = useState({
    enc_userap_id: "",
    enc_nome_loja: "",
    enc_status: "aguardando_retirada",
    enc_data_chegada: "",
    enc_data_retirada: null,
  });

  const [editandoId, setEditandoId] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");

  // Totais
  const totalEncomendas = encomendas.length;
  const encomendasPendentes = encomendas.filter((e) => e.enc_status === "aguardando_retirada").length;
  const encomendasRetiradas = encomendas.filter((e) => e.enc_status === "entregue").length;

  // Adicionar encomenda
  const handleAddEncomenda = (e) => {
    e.preventDefault();
    const nova = {
      ...novaEncomenda,
      enc_id: encomendas.length + 1,
    };
    setEncomendas([...encomendas, nova]);
    setNovaEncomenda({
      enc_userap_id: "",
      enc_nome_loja: "",
      enc_status: "aguardando_retirada",
      enc_data_chegada: "",
      enc_data_retirada: null,
    });
    setShowForm(false);
  };

  // Salvar status editado
  const handleSalvarStatus = (id) => {
    setEncomendas((prev) =>
      prev.map((enc) =>
        enc.enc_id === id ? { ...enc, enc_status: novoStatus, enc_data_retirada: novoStatus === "entregue" ? new Date().toISOString().split("T")[0] : null } : enc
      )
    );
    setEditandoId(null);
    setNovoStatus("");
  };

  return (
    <div className="page-container">
      <PageHeader title="Encomendas" rightContent={(<RightHeaderBrand />)} />

      <div className="page-content">
        {/* Cards */}
        <section className={styles.dashboardCards}>
          <div className={styles.card}>
            <h3>Total de Encomendas</h3>
            <p>{totalEncomendas}</p>
          </div>
          <div className={styles.card}>
            <h3>Pendentes</h3>
            <p>{encomendasPendentes}</p>
          </div>
          <div className={styles.card}>
            <h3>Retiradas</h3>
            <p>{encomendasRetiradas}</p>
          </div>
        </section>

        {/* Botão adicionar */}
        <div style={{ marginBottom: "20px" }}>
          <FabButton label={showForm ? "Cancelar" : "Adicionar Encomenda"} onClick={() => setShowForm(!showForm)} />
        </div>

      {/* Formulário */}
      {showForm && (
        <div className={styles.formContainer}>
          <h2>Nova Encomenda</h2>
          <form onSubmit={handleAddEncomenda}>
            <input
              type="number"
              placeholder="Apartamento ID"
              value={novaEncomenda.enc_userap_id}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_userap_id: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Loja / Transportadora"
              value={novaEncomenda.enc_nome_loja}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_nome_loja: e.target.value })}
              required
            />
            <input
              type="date"
              value={novaEncomenda.enc_data_chegada}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_data_chegada: e.target.value })}
              required
            />
            <select
              value={novaEncomenda.enc_status}
              onChange={(e) => setNovaEncomenda({ ...novaEncomenda, enc_status: e.target.value })}
            >
              <option value="aguardando_retirada">Aguardando Retirada</option>
              <option value="entregue">Entregue</option>
            </select>
            <button type="submit" className={styles.submitButton}>Salvar</button>
          </form>
        </div>
      )}

      {/* Tabela */}
      <section className={styles.tableSection}>
        <h2>Encomendas Recentes</h2>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Morador</th>
                <th>Data de Recebimento</th>
                <th>Data de Retirada</th>
                <th>Loja / Transportadora</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {encomendas.map((enc) => (
                <tr key={enc.enc_id}>
                  <td>Apto {enc.enc_userap_id}</td>
                  <td>{enc.enc_data_chegada}</td>
                  <td>{enc.enc_data_retirada ? enc.enc_data_retirada : "Não retirada"}</td>
                  <td>{enc.enc_nome_loja}</td>
                  <td>
                    {editandoId === enc.enc_id ? (
                      <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
                        <option value="aguardando_retirada">Aguardando Retirada</option>
                        <option value="entregue">Entregue</option>
                      </select>
                    ) : (
                      <>
                        {enc.enc_status === "entregue" && (
                          <span className={styles.statusEntregue}>Entregue</span>
                        )}
                        {enc.enc_status === "aguardando_retirada" && (
                          <span className={styles.statusPendente}>Aguardando Retirada</span>
                        )}
                      </>
                    )}
                  </td>
                  <td>
                    {editandoId === enc.enc_id ? (
                      <button className={styles.saveButton} onClick={() => handleSalvarStatus(enc.enc_id)}>
                        Salvar
                      </button>
                    ) : (
                      <>
                        <IconAction icon={FiEdit2} label="Editar" onClick={() => { setEditandoId(enc.enc_id); setNovoStatus(enc.enc_status); }} variant="edit" />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
      </div>
    </div>
  );
}
