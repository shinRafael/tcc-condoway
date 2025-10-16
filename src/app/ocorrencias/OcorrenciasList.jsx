"use client";
import React, { useState } from 'react';
import styles from './ocorrencias.module.css'; // Importando o CSS Module

// Componente para renderizar um card individual
const OcorrenciaCard = ({ ocorrencia, onUpdateStatus }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case "Aberta": return styles.pendente;
            case "Em Andamento": return styles.emAndamento;
            case "Resolvida": return styles.resolvida;
            case "Cancelada": return styles.cancelada;
            default: return styles.pendente;
        }
    };

    return (
        <div className={`${styles.card} ${getStatusClass(ocorrencia.oco_status)}`}>
            <div className={styles.cardHeader}>
                <h3>{ocorrencia.oco_protocolo}</h3>
                <span className={styles.data}>
                    {new Date(ocorrencia.oco_data).toLocaleDateString("pt-BR")}
                </span>
            </div>
            <p className={styles.mensagem}>{ocorrencia.oco_descricao}</p>
            <div className={styles.actions}>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Aberta")} disabled={ocorrencia.oco_status === "Aberta"}>Aberta</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Em Andamento")} disabled={ocorrencia.oco_status === "Em Andamento"}>Em Andamento</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Resolvida")} disabled={ocorrencia.oco_status === "Resolvida"}>Resolvida</button>
                <button onClick={() => onUpdateStatus(ocorrencia.oco_id, "Cancelada")} disabled={ocorrencia.oco_status === "Cancelada"}>Cancelada</button>
            </div>
        </div>
    );
};

// Componente principal que organiza a navegação por abas
export default function OcorrenciasList({ ocorrenciasPorStatus, onUpdateStatus }) {
    const [abaAtiva, setAbaAtiva] = useState('Abertas');
    const { abertas = [], emAndamento = [], resolvidas = [], canceladas = [] } = ocorrenciasPorStatus || {};

    const listas = {
        'Abertas': abertas,
        'Em Andamento': emAndamento,
        'Resolvidas': resolvidas,
        'Canceladas': canceladas,
    };

    const listaParaExibir = listas[abaAtiva] || [];

    return (
        <div className={styles.containerPrincipalAbas}>
            {/* Botões de Navegação por Abas */}
            <div className={styles.botoesNavegacao}>
                <button onClick={() => setAbaAtiva('Abertas')} className={abaAtiva === 'Abertas' ? styles.ativo : ''}>Abertas ({abertas.length})</button>
                <button onClick={() => setAbaAtiva('Em Andamento')} className={abaAtiva === 'Em Andamento' ? styles.ativo : ''}>Em Andamento ({emAndamento.length})</button>
                <button onClick={() => setAbaAtiva('Resolvidas')} className={abaAtiva === 'Resolvidas' ? styles.ativo : ''}>Resolvidas ({resolvidas.length})</button>
                <button onClick={() => setAbaAtiva('Canceladas')} className={abaAtiva === 'Canceladas' ? styles.ativo : ''}>Canceladas ({canceladas.length})</button>
            </div>

            {/* Grid de Cards da Aba Ativa */}
            <div className={styles.gridCards}>
                {listaParaExibir.length > 0 ? (
                    listaParaExibir.map((o) => (
                        <OcorrenciaCard key={o.oco_id} ocorrencia={o} onUpdateStatus={onUpdateStatus} />
                    ))
                ) : (
                    <p className={styles.avisoVazio}>Nenhuma ocorrência nesta categoria.</p>
                )}
            </div>
        </div>
    );
}