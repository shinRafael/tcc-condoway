// Arquivo: src/context/ModalContext.js
"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
// Certifique-se que o caminho para Modal.jsx está correto
import Modal from "@/componentes/Modal/Modal"; //

// Cria o contexto
const ModalContext = createContext(undefined);

// Define o estado inicial padrão para o modal
const initialState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  buttons: null, // Aqui onde os botões customizados serão armazenados
  closeOnClickOutside: true, // Se pode fechar clicando fora
};

// Componente Provedor que envolve a aplicação
export const ModalProvider = ({ children }) => {
  // Estado que armazena os dados do modal atual
  const [modal, setModal] = useState(initialState);

  // Função para MOSTRAR o modal, atualizando o estado
  const showModal = useCallback((title, message, type = "info", buttons = null, closeOnClickOutside = true) => {
    // Log (descomente para depurar)
    // console.log("[ModalContext] Chamando showModal com:", { title, message, type, buttons: buttons ? `Array[${buttons.length}]` : buttons, closeOnClickOutside });
    setModal({
        isOpen: true,
        title,
        message,
        type,
        buttons, // Define os botões no estado
        closeOnClickOutside
    });
  }, []); // useCallback para otimização

  // Função para ESCONDER o modal, resetando o estado
  const hideModal = useCallback(() => {
    // Log (descomente para depurar)
    // console.log("[ModalContext] Chamando hideModal");
    setModal(initialState); // Volta ao estado inicial
  }, []); // useCallback para otimização

  // Renderiza o componente Modal apenas se isOpen for true
  const modalComponent = modal.isOpen ? <Modal hideModal={hideModal} /> : null;

  return (
    // Fornece o estado e as funções para os componentes descendentes
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
      {/* O componente Modal em si é renderizado aqui */}
      {modalComponent}
    </ModalContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useModal = () => {
    const context = useContext(ModalContext);
    // Garante que o hook só seja usado dentro de um ModalProvider
    if (context === undefined) {
        throw new Error('useModal precisa ser usado dentro de um ModalProvider');
    }
    return context;
};