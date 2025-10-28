"use client";
import React, { createContext, useContext, useState } from "react";
import Modal from "@/componentes/Modal/Modal";

const ModalContext = createContext();

const initialModalState = {
  isOpen: false,
  title: "",
  message: "",
  type: "info",
  confirmLabel: "Fechar",
  cancelLabel: "Cancelar",
  showCancelButton: false,
  onConfirm: null,
  onCancel: null,
  autoCloseOnConfirm: true,
  autoCloseOnCancel: true,
  closeOnOverlayClick: true,
};

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(initialModalState);

  const showModal = (title, message, type = "info", options = {}) => {
    setModal({
      ...initialModalState,
      isOpen: true,
      title,
      message,
      type,
      ...options,
      confirmLabel:
        options.confirmLabel || (options.onConfirm ? "Confirmar" : initialModalState.confirmLabel),
      cancelLabel: options.cancelLabel || initialModalState.cancelLabel,
      showCancelButton:
        options.showCancelButton ?? Boolean(options.onCancel || options.onConfirm),
      autoCloseOnConfirm:
        options.autoCloseOnConfirm ?? (options.onConfirm ? false : initialModalState.autoCloseOnConfirm),
      autoCloseOnCancel: options.autoCloseOnCancel ?? initialModalState.autoCloseOnCancel,
      closeOnOverlayClick: options.closeOnOverlayClick ?? initialModalState.closeOnOverlayClick,
    });
  };

  const hideModal = () => {
    setModal(initialModalState);
  };

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);