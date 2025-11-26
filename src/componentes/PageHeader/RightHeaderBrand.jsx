"use client";
import React, { useState, useEffect } from 'react';
import { FiCamera, FiLogOut } from 'react-icons/fi'; // 1. Importe FiLogOut
import ImageUpload from '../ImageUpload/ImageUpload';
import api from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { useRouter } from 'next/navigation'; // 2. Importe useRouter

export default function RightHeaderBrand() {
  const { showModal: showInfoModal } = useModal();
  const router = useRouter(); // 3. Inicialize o router
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ nome: 'Síndico', foto: null, userId: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ... (useEffect e handleSavePhoto mantidos iguais ao original) ...
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId'); 
    
    const fetchUserData = async () => {
      try {
        if (userId) {
          const response = await api.get(`/Usuario/${userId}`);
          const userData = response.data.dados;
          setUserInfo({
            nome: userData.user_nome || userType || 'Síndico',
            foto: userData.user_foto,
            userId: userId
          });
        } else {
          setUserInfo({ nome: userType || 'Síndico', foto: null, userId: null });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSavePhoto = async () => {
      // ... (código original do handleSavePhoto) ...
      // MANTENHA O CÓDIGO ORIGINAL AQUI, OMITI APENAS PARA ECONOMIZAR ESPAÇO NA RESPOSTA
      if (!selectedImage) { showInfoModal('Atenção', 'Selecione uma foto!', 'error'); return; }
      if (!userInfo.userId) { showInfoModal('Erro', 'ID não encontrado.', 'error'); return; }
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('foto', selectedImage);
        const response = await api.patch(`/Usuario/${userInfo.userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setUserInfo(prev => ({ ...prev, foto: response.data.dados.user_foto }));
        showInfoModal('Sucesso', 'Foto atualizada!');
        setShowModal(false);
        setSelectedImage(null);
      } catch (error) {
        showInfoModal('Erro', `Erro ao atualizar foto.`, 'error');
      } finally { setLoading(false); }
  };

  // 4. Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('sidebarBadges');
    router.push('/login');
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b' }}>
        {/* Nome do Usuário */}
        <span style={{ fontWeight: '500' }}>{userInfo.nome.split(' ')[0]}</span>
        
        {/* Foto de Perfil */}
        <div 
          onClick={() => setShowModal(true)}
          style={{ 
            position: 'relative',
            cursor: 'pointer',
            height: 40,
            width: 40,
          }}
          title="Alterar foto de perfil"
        >
          {userInfo.foto ? (
            <img
              src={`http://localhost:3333${userInfo.foto}`}
              alt="Foto de Perfil"
              style={{ height: 40, width: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', display: 'block' }}
            />
          ) : (
            <div style={{ height: 40, width: 40, borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #cbd5e1' }}>
              <FiCamera size={20} color="#94a3b8" />
            </div>
          )}
          <div style={{ position: 'absolute', bottom: -2, right: -2, backgroundColor: '#3b82f6', borderRadius: '50%', padding: 4, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCamera size={12} color="white" />
          </div>
        </div>

        {/* 5. Botão de Logout */}
        <button 
            onClick={handleLogout}
            title="Sair do sistema"
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626', // Vermelho
                marginLeft: '8px',
                transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.7}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
        >
            <FiLogOut size={22} />
        </button>
      </div>

      {/* Modal de Upload (Mantido igual) */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>Foto de Perfil</h2>
            <ImageUpload onImageSelect={setSelectedImage} currentImage={userInfo.foto ? `http://localhost:3333${userInfo.foto}` : null} maxSizeMB={5} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Cancelar</button>
              <button onClick={handleSavePhoto} disabled={!selectedImage || loading} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', backgroundColor: selectedImage && !loading ? '#3b82f6' : '#cbd5e1', color: 'white', cursor: selectedImage && !loading ? 'pointer' : 'not-allowed', fontSize: '14px', fontWeight: '500' }}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}