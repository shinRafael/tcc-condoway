"use client";
import React, { useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import ImageUpload from '../ImageUpload/ImageUpload';
import api from '../../services/api';

export default function RightHeaderBrand() {
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ nome: 'Síndico', foto: null, userId: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Buscar informações do usuário logado
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId'); // Certifique-se de salvar isso no login
    
    // Buscar foto do usuário da API
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
    console.log('🔵 handleSavePhoto chamado');
    console.log('📸 selectedImage:', selectedImage);
    console.log('👤 userInfo.userId:', userInfo.userId);
    
    if (!selectedImage) {
      alert('Por favor, selecione uma foto primeiro!');
      return;
    }
    
    if (!userInfo.userId) {
      alert('Erro: ID do usuário não encontrado. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Enviando foto para o backend...');
      
      const formData = new FormData();
      formData.append('foto', selectedImage);

      console.log('📦 FormData criado:', formData.get('foto'));

      const response = await api.patch(`/Usuario/${userInfo.userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Resposta do backend:', response.data);

      // Atualizar a foto localmente
      setUserInfo(prev => ({
        ...prev,
        foto: response.data.dados.user_foto
      }));

      alert('Foto atualizada com sucesso!');
      setShowModal(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('❌ Erro ao atualizar foto:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Mensagem do backend:', error.response?.data);
      console.error('❌ Config da requisição:', error.config);
      
      const mensagemErro = error.response?.data?.mensagem || error.message;
      alert(`Erro ao atualizar foto: ${mensagemErro}\n\nVerifique o console para mais detalhes.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
        <span>{userInfo.nome.split(' ')[0]}</span>
        <div 
          onClick={() => setShowModal(true)}
          style={{ 
            position: 'relative',
            cursor: 'pointer',
            height: 40,
            width: 40,
          }}
        >
          {userInfo.foto ? (
            <img
              src={`http://localhost:3333${userInfo.foto}`}
              alt="Foto de Perfil"
              style={{ 
                height: 40, 
                width: 40, 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '2px solid #e2e8f0',
                display: 'block' 
              }}
            />
          ) : (
            <div style={{
              height: 40,
              width: 40,
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #cbd5e1'
            }}>
              <FiCamera size={20} color="#94a3b8" />
            </div>
          )}
          
          {/* Ícone de câmera no hover */}
          <div style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            padding: 4,
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiCamera size={12} color="white" />
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>
              Foto de Perfil
            </h2>
            
            <ImageUpload 
              onImageSelect={setSelectedImage}
              currentImage={userInfo.foto ? `http://localhost:3333${userInfo.foto}` : null}
              maxSizeMB={5}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePhoto}
                disabled={!selectedImage || loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: selectedImage && !loading ? '#3b82f6' : '#cbd5e1',
                  color: 'white',
                  cursor: selectedImage && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
