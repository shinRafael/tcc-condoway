"use client";
import React, { createContext, useContext, useState } from "react";
import Modal from "@/componentes/Modal/Modal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type });
  };

  const hideModal = () => {
    setModal({ isOpen: false, title: "", message: "", type: "info" });
  };

  return (
    <ModalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
      <Modal />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);