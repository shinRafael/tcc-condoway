'use client'
import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import '../../styles/globals.css'
import styles from './visitantes.module.css' // Novo arquivo CSS para o dashboard
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';

// --- Dados Mock para simular o Dashboard ---

const mockVisitantesHoje = [
  { id: 1, nome: 'João da Silva', documento: '123.456.789-00', unidade: 'Bloco A - Apto 101', morador: 'Carlos Souza', qr_code_valido: true, validade: '25/09/2025 23:59' },
  { id: 2, nome: 'Maria Oliveira', documento: '000.111.222-33', unidade: 'Bloco B - Apto 205', morador: 'Ana Lima', qr_code_valido: true, validade: '25/09/2025 18:00' },
  { id: 3, nome: 'Pedro Santos', documento: '444.555.666-77', unidade: 'Bloco A - Apto 302', morador: 'Roberto Costa', qr_code_valido: false, validade: '26/09/2025 23:59' },
];

const mockLogAtividades = [
  { id: 1, hora: '19:52', tipo: 'entrada', nome: 'Visitante XYZ', unidade: 'Apto 101' },
  { id: 2, hora: '19:40', tipo: 'saida', nome: 'Prestador ABC', unidade: 'Apto 503' },
  { id: 3, hora: '19:35', tipo: 'entrada', nome: 'Visitante 123', unidade: 'Apto 205' },
];


// --- Componente Principal ---

export default function ControleAcessos() {
  const [visitantesHoje, setVisitantesHoje] = useState(mockVisitantesHoje);
  const [apartamentos, setApartamentos] = useState([]); // Para a busca e notificação
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fluxo QR Code
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [modalAcesso, setModalAcesso] = useState(null); // null, 'autorizado', 'negado'

  // Fluxo Inesperado
  const [apartamentoDestino, setApartamentoDestino] = useState('');
  const [notificando, setNotificando] = useState(false);
  const [statusNotificacao, setStatusNotificacao] = useState(''); // 'aguardando', 'liberado', 'negado'
  const [visitanteInesperadoNome, setVisitanteInesperadoNome] = useState('');


  // Simulando a listagem de apartamentos
  useEffect(() => {
    // Aqui você chamaria 'listarApartamentos()'
    const mockApartamentos = [
        { ap_id: 1, bloco_id: 'A', ap_andar: 1, ap_numero: 101, morador: 'Carlos Souza' },
        { ap_id: 2, bloco_id: 'A', ap_andar: 2, ap_numero: 205, morador: 'Ana Lima' },
        { ap_id: 3, bloco_id: 'B', ap_andar: 3, ap_numero: 302, morador: 'Roberto Costa' },
    ];
    setApartamentos(mockApartamentos);
  }, []);


  // --- Lógica para a Lista "Aguardando Chegada Hoje" ---
  const visitantesFiltrados = useMemo(() => {
    if (!searchTerm) return visitantesHoje;
    return visitantesHoje.filter(v =>
      v.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.unidade.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visitantesHoje, searchTerm]);

  // --- Lógica para o Fluxo 1: QR Code ---
  const simularScanQR = () => {
    setScannerAtivo(true);
    // Simula o tempo de leitura da webcam
    setTimeout(() => {
      setScannerAtivo(false);
      // Simula a validação do QR Code (usando o primeiro mock visitante como exemplo)
      const visitanteValidado = mockVisitantesHoje[0]; 
      
      if (visitanteValidado && visitanteValidado.qr_code_valido) {
        setModalAcesso({
            status: 'AUTORIZADO',
            cor: 'green',
            visitante: visitanteValidado
        });
      } else {
         setModalAcesso({
            status: 'QR CODE INVÁLIDO',
            cor: 'red',
            visitante: visitanteValidado || { nome: 'Visitante Desconhecido' }
        });
      }

    }, 1500);
  };

  const handleConfirmarAcesso = (acao) => {
    // Lógica para chamar API.post('/acesso', { action: acao, ... })
    console.log(`Acesso ${acao} para: ${modalAcesso.visitante.nome}`);
    // Atualiza o Log de Atividades e remove da lista de espera
    setModalAcesso(null);
    // setVisitantesHoje(...)
  };

  // --- Lógica para o Fluxo 2: Visitante Inesperado ---

  const handleNotificarMorador = () => {
    if (!apartamentoDestino || !visitanteInesperadoNome) {
        alert('Selecione um apartamento e digite o nome do visitante.');
        return;
    }
    setNotificando(true);
    setStatusNotificacao('Aguardando autorização de Morador...');
    console.log(`Notificando morador do AP ${apartamentoDestino} sobre a chegada de ${visitanteInesperadoNome}`);
    
    // Simulação da resposta do morador (em tempo real)
    setTimeout(() => {
        // Simula o morador APROVANDO
        const moradorAprova = true; 

        if (moradorAprova) {
            setStatusNotificacao('ENTRADA LIBERADA');
        } else {
            setStatusNotificacao('ACESSO NEGADO PELO MORADOR');
        }
    }, 4000); // 4 segundos para a resposta

  };

  const handleConfirmarEntradaInesperado = () => {
    if (statusNotificacao === 'ENTRADA LIBERADA') {
        // Lógica de registro no sistema
        console.log(`ENTRADA CONFIRMADA para ${visitanteInesperadoNome} (AP ${apartamentoDestino})`);
        setNotificando(false);
        setStatusNotificacao('');
        setVisitanteInesperadoNome('');
        setApartamentoDestino('');
    } else {
        alert('A entrada não foi liberada pelo morador.');
    }
  }

  const handleResetInesperado = () => {
    setNotificando(false);
    setStatusNotificacao('');
    setVisitanteInesperadoNome('');
    setApartamentoDestino('');
  }


  // --- Renderização ---
  return (
    <div className="page-container">
      <PageHeader
        title="Controle de Acessos - Portaria"
        rightContent={(<RightHeaderBrand />)}
      />

      <div className="page-content">
        <div className={styles.dashboardGrid}>
          
          {/* 1. Área do Scanner (Widget) */}
          <div className={`${styles.widget} ${styles.scannerArea}`}>
            <h3 className={styles.widgetTitle}>Scanner de QR Code</h3>
            {scannerAtivo ? (
                <div className={styles.scannerAtivo}>
                    <div className={styles.scannerAnimation} />
                    <p>Escaneando...</p>
                </div>
            ) : (
                <button 
                    className={styles.scanButton} 
                    onClick={simularScanQR}
                    disabled={modalAcesso !== null || notificando}
                >
                    Ativar Câmera e Escanear
                </button>
            )}
          </div>
          
          {/* 2. Lista "Aguardando Chegada Hoje" */}
          <div className={`${styles.widget} ${styles.listaAguardando}`}>
            <h3 className={styles.widgetTitle}>Aguardando Chegada Hoje</h3>
            
            <input
              type="text"
              placeholder="Buscar visitante ou unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.listContainer}>
              {visitantesFiltrados.length === 0 ? (
                  <p className={styles.emptyList}>Nenhum visitante pré-autorizado para hoje.</p>
              ) : (
                <ul className={styles.visitanteList}>
                  {visitantesFiltrados.map(v => (
                    <li key={v.id} className={styles.visitanteItem}>
                      <span className={styles.visitanteNome}>{v.nome}</span>
                      <span className={styles.visitanteDestino}>{v.unidade}</span>
                      <span className={styles.visitanteMorador}>Autorizado por: {v.morador}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 3. Log de Atividade Recente */}
          <div className={`${styles.widget} ${styles.logAtividade}`}>
            <h3 className={styles.widgetTitle}>Log de Atividade Recente</h3>
            <ul className={styles.logList}>
              {mockLogAtividades.map(log => (
                <li key={log.id} className={`${styles.logItem} ${styles[log.tipo]}`}>
                  <span className={styles.logHora}>{log.hora}:</span>
                  <span>
                    **[{log.nome}]**, visitante do **{log.unidade}**, **{log.tipo === 'entrada' ? 'entrou' : 'saiu'}**.
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Fluxo de Ação 2: Visitante sem QR Code (Inesperado) */}
          <div className={`${styles.widget} ${styles.fluxoInesperado}`}>
            <h3 className={styles.widgetTitle}>Visitante Sem QR Code (Inesperado)</h3>
            
            {notificando && statusNotificacao !== 'ENTRADA LIBERADA' ? (
                // Exibe o status de espera ou negação
                <div className={styles.statusBox}>
                    <p className={styles.statusText} style={{ color: statusNotificacao.includes('NEGADO') ? 'red' : '#3498db' }}>
                        {statusNotificacao}
                    </p>
                    <button className={styles.cancelButton} onClick={handleResetInesperado}>
                        Cancelar / Nova Tentativa
                    </button>
                </div>

            ) : notificando && statusNotificacao === 'ENTRADA LIBERADA' ? (
                // Exibe o status de liberação e botão de confirmação
                <div className={styles.statusBox}>
                    <p className={styles.statusText} style={{ color: 'green', fontWeight: 'bold' }}>ENTRADA LIBERADA</p>
                    <p>Visitante: {visitanteInesperadoNome}</p>
                    <p>Destino: {apartamentos.find(ap => ap.ap_id.toString() === apartamentoDestino)?.morador} ({apartamentoDestino})</p>
                    <button 
                        className={styles.confirmButton} 
                        onClick={handleConfirmarEntradaInesperado}
                    >
                        Confirmar Entrada
                    </button>
                    <button className={styles.cancelButton} onClick={handleResetInesperado}>
                        Cancelar
                    </button>
                </div>
            ) : (
                // Formulário de Notificação Inicial
                <form onSubmit={(e) => { e.preventDefault(); handleNotificarMorador(); }}>
                    <div className={styles.formGroup}>
                        <label>Nome do Visitante</label>
                        <input 
                            type='text' 
                            value={visitanteInesperadoNome} 
                            onChange={(e) => setVisitanteInesperadoNome(e.target.value)} 
                            required 
                            placeholder='Nome do visitante inesperado'
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Unidade de Destino</label>
                        <select 
                            value={apartamentoDestino} 
                            onChange={(e) => setApartamentoDestino(e.target.value)} 
                            required
                        >
                            <option value="">Buscar AP (Bloco/Número)</option>
                            {apartamentos.map(ap => (
                                <option key={ap.ap_id} value={ap.ap_id}>
                                    Bloco {ap.bloco_id} - Ap {ap.ap_numero} - ({ap.morador})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={styles.notifyButton}>
                        Notificar Morador
                    </button>
                </form>
            )}
          </div>
        </div>


        {/* Modal de Acesso (Fluxo QR Code) */}
        {modalAcesso && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 
                className={styles.modalTitle} 
                style={{ color: modalAcesso.cor }}
              >
                ACESSO {modalAcesso.status}
              </h3>

              <div className={styles.acessoInfo}>
                  <p><strong>Nome:</strong> {modalAcesso.visitante.nome}</p>
                  <p><strong>Documento:</strong> {modalAcesso.visitante.documento || 'Não cadastrado'}</p>
                  <p><strong>Destino:</strong> {modalAcesso.visitante.unidade || 'N/A'}</p>
                  <p><strong>Autorizado por:</strong> {modalAcesso.visitante.morador || 'N/A'}</p>
                  <p><strong>Validade:</strong> {modalAcesso.visitante.validade || 'N/A'}</p>
              </div>

              {modalAcesso.status.includes('AUTORIZADO') && (
                <div className={styles.modalActions}>
                  <button 
                    className={styles.denyButton} 
                    onClick={() => handleConfirmarAcesso('NEGADO')}
                  >
                    Negar Acesso
                  </button>
                  <button 
                    className={styles.confirmButton} 
                    onClick={() => handleConfirmarAcesso('CONFIRMADO')}
                  >
                    Confirmar Entrada
                  </button>
                </div>
              )}

              {!modalAcesso.status.includes('AUTORIZADO') && (
                 <div className={styles.modalActions}>
                    <button 
                        className={styles.confirmButton} 
                        onClick={() => setModalAcesso(null)}
                    >
                        Fechar
                    </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}