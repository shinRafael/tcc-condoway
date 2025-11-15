'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import api from '../../services/api';
import styles from './visitantes.module.css';
import PageHeader from '@/componentes/PageHeader';
import RightHeaderBrand from '@/componentes/PageHeader/RightHeaderBrand';
import { useModal } from "@/context/ModalContext";

export default function ControleAcessos() {
  const { showModal } = useModal();

  // Estados principais
  const [visitantesHoje, setVisitantesHoje] = useState([]);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAcesso, setModalAcesso] = useState(null);
  const [notificando, setNotificando] = useState(false);
  const [statusNotificacao, setStatusNotificacao] = useState('');
  const [visitanteInesperado, setVisitanteInesperado] = useState({ nome: '', apartamentoDestino: '' });
  
  // Estados do QR Code Scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ==============================================================
  // 🔹 CARREGAR VISITANTES
  // ==============================================================
  useEffect(() => {
    carregarVisitantes();
  }, []);

  // Cleanup do scanner ao desmontar componente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const carregarVisitantes = async () => {
    try {
      const response = await api.get('/visitantes/dashboard');
      setVisitantesHoje(response.data.dados || []);
    } catch (err) {
      console.error('Erro ao buscar visitantes:', err);
      showModal('Erro', 'Não foi possível carregar os visitantes.', 'error');
    }
  };

  // ==============================================================
  // 🔹 FILTRO DE VISITANTES
  // ==============================================================
  const visitantesFiltrados = useMemo(() => {
    return visitantesHoje.filter(v =>
      v.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.unidade?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [visitantesHoje, searchTerm]);

  // ==============================================================
  // 🔹 AÇÕES DE ACESSO
  // ==============================================================
 const handleConfirmarAcesso = async (visitante, acao) => {
  try {
    console.log(`🔹 Ação selecionada: ${acao} para o visitante ID ${visitante.id}`);

    if (acao === "ENTROU") {
      // ✅ Registra a entrada do visitante
      await api.put(`/visitantes/${visitante.id}/entrada`);
      showModal("Sucesso", "Entrada registrada com sucesso.", "success");

    } else if (acao === "SAIU") {
      // ✅ Registra a saída do visitante
      await api.put(`/visitantes/${visitante.id}/saida`);
      showModal("Sucesso", "Saída registrada com sucesso.", "success");

    } else if (acao === "NEGADO") {
      // ❌ Agora chama a rota correta (para portaria/síndico)
      await api.patch(`/visitantes/${visitante.id}/nega`);
      showModal("Negado", "Acesso negado com sucesso.", "info");
    }

    // 🔄 Recarrega a lista de visitantes após a ação
    await carregarVisitantes();

  } catch (error) {
    console.error("❌ Erro ao confirmar acesso:", error);
    // Se o backend devolver erro 403 ou 500, exibe modal de erro
    const status = error.response?.status;
    if (status === 403) {
      showModal("Acesso negado", "Você não tem permissão para executar esta ação.", "error");
    } else if (status === 500) {
      showModal("Erro no servidor", "Ocorreu um erro interno ao processar o pedido.", "error");
    } else {
      showModal("Erro", "Falha ao registrar o acesso.", "error");
    }
  }
};

  // ==============================================================
  // 🔹 VISITANTE INESPERADO
  // ==============================================================
  const handleNotificarMorador = async () => {
    const { nome, apartamentoDestino } = visitanteInesperado;
    if (!nome || !apartamentoDestino) {
      showModal('Atenção', 'Preencha o nome e selecione o apartamento.', 'error');
      return;
    }

    setNotificando(true);
    setStatusNotificacao('Enviando notificação...');

    try {
      const response = await api.post(`/moradores/${apartamentoDestino}/notificar-visitante`, {
        vst_nome: nome,
      });

      if (response.data.sucesso) {
        setStatusNotificacao('Notificação enviada ao morador!');
      } else {
        setStatusNotificacao('Falha ao enviar notificação.');
      }
    } catch (err) {
      console.error('Erro ao notificar morador:', err);
      setStatusNotificacao('Erro ao notificar morador.');
    }
  };

  const resetFluxoInesperado = () => {
    setNotificando(false);
    setStatusNotificacao('');
    setVisitanteInesperado({ nome: '', apartamentoDestino: '' });
  };

  // ==============================================================
  // 🔹 QR CODE SCANNER
  // ==============================================================
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usa câmera traseira em mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        streamRef.current = stream;
        setShowScanner(true);
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      showModal('Erro', 'Não foi possível acessar a câmera. Verifique as permissões.', 'error');
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowScanner(false);
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Usa a API BarcodeDetector se disponível
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        barcodeDetector.detect(canvas)
          .then(barcodes => {
            if (barcodes.length > 0) {
              handleQRCodeDetected(barcodes[0].rawValue);
              return;
            }
          })
          .catch(err => console.error('Erro ao detectar QR:', err));
      }
    }

    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  const handleQRCodeDetected = async (data) => {
    stopScanner();
    
    try {
      // Espera que o QR Code contenha o ID do visitante
      const visitanteId = parseInt(data);
      
      if (isNaN(visitanteId)) {
        showModal('Erro', 'QR Code inválido.', 'error');
        return;
      }

      // Busca o visitante pelo ID
      const visitante = visitantesHoje.find(v => v.id === visitanteId);
      
      if (!visitante) {
        showModal('Erro', 'Visitante não encontrado.', 'error');
        return;
      }

      // Registra automaticamente a entrada
      await handleConfirmarAcesso(visitante, 'ENTROU');
      showModal('Sucesso', `Entrada registrada para ${visitante.nome}!`, 'success');
      
    } catch (err) {
      console.error('Erro ao processar QR Code:', err);
      showModal('Erro', 'Erro ao processar QR Code.', 'error');
    }
  };

  // ==============================================================
  // 🔹 RENDERIZAÇÃO
  // ==============================================================
  return (
    <div className="page-container">
      <PageHeader title="Controle de Acessos - Portaria" rightContent={<RightHeaderBrand />} />

      <div className="page-content">
        {/* Botão de Scanner QR Code */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button 
            className={styles.addButton} 
            onClick={startScanner}
            style={{ backgroundColor: '#28a745' }}
          >
            📷 Escanear QR Code
          </button>
        </div>

        {/* Modal do Scanner */}
        {showScanner && (
          <div className={styles.scannerModal}>
            <div className={styles.scannerContainer}>
              <div className={styles.scannerHeader}>
                <h3>Escaneie o QR Code do Visitante</h3>
                <button className={styles.closeButton} onClick={stopScanner}>✕</button>
              </div>
              <div className={styles.videoContainer}>
                <video ref={videoRef} style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
              <p className={styles.scannerInstructions}>Posicione o QR Code dentro do quadro</p>
            </div>
          </div>
        )}

        <div className={styles.dashboardGrid}>

          {/* === Lista de Visitantes === */}
          <div className={`${styles.widget} ${styles.listaAguardando}`}>
            <h3 className={styles.widgetTitle}>Visitantes de Hoje</h3>
            <input
              type="text"
              placeholder="Buscar visitante ou unidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.listContainer}>
              {visitantesFiltrados.length === 0 ? (
                <p className={styles.emptyList}>Nenhum visitante registrado hoje.</p>
              ) : (
                <ul className={styles.visitanteList}>
                  {visitantesFiltrados.map(v => (
                    <li key={v.id} className={styles.visitanteItem}>
                      <div className={styles.visitanteInfo}>
                        <span className={styles.visitanteNome}>{v.nome}</span>
                        <span className={styles.visitanteDestino}>Unidade: {v.unidade}</span>
                        <span className={styles.visitanteMorador}>Autorizado por: {v.morador}</span>
                      </div>
                      <div className={styles.actions}>
                        {v.status === 'Aguardando' && (
                          <>
                            <button className={styles.confirmButton} onClick={() => handleConfirmarAcesso(v, 'ENTROU')}>Registrar Entrada</button>
                            <button className={styles.denyButton} onClick={() => handleConfirmarAcesso(v, 'NEGADO')}>Negar</button>
                          </>
                        )}
                        {v.status === 'Entrou' && (
                          <button className={styles.cancelButton} onClick={() => handleConfirmarAcesso(v, 'SAIU')}>Registrar Saída</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* === Visitante Inesperado === */}
          <div className={`${styles.widget} ${styles.fluxoInesperado}`}>
            <h3 className={styles.widgetTitle}>Visitante Sem Autorização Prévia</h3>

            {notificando ? (
              <div className={styles.statusBox}>
                <p className={styles.statusText}>{statusNotificacao}</p>
                <button className={styles.cancelButton} onClick={resetFluxoInesperado}>Voltar</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleNotificarMorador(); }}>
                <div className={styles.formGroup}>
                  <label>Nome do Visitante</label>
                  <input
                    type="text"
                    value={visitanteInesperado.nome}
                    onChange={(e) => setVisitanteInesperado({ ...visitanteInesperado, nome: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Unidade de Destino</label>
                  <input
                    type="number"
                    placeholder="ID do apartamento (userap_id)"
                    value={visitanteInesperado.apartamentoDestino}
                    onChange={(e) => setVisitanteInesperado({ ...visitanteInesperado, apartamentoDestino: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className={styles.notifyButton}>Notificar Morador</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
