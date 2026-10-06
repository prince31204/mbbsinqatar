"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModalState {
  isOpen: boolean;
  universityName?: string;
  brochureUrl?: string;
  title?: string;
  buttonText?: string;
  description?: string;
}

interface ModalContextType {
  modal: ModalState;
  openModal: (
    universityName?: string,
    brochureUrl?: string,
    title?: string,
    buttonText?: string,
    description?: string,
  ) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    universityName: undefined,
    brochureUrl: undefined,
  });

  const openModal = (
    universityName?: string,
    brochureUrl?: string,
    title?: string,
    buttonText?: string,
    description?: string,
  ) => {
    setModal({
      isOpen: true,
      universityName,
      brochureUrl,
      title,
      buttonText,
      description,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      universityName: undefined,
      brochureUrl: undefined,
      title: undefined,
      buttonText: undefined,
      description: undefined,
    });
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useDownloadModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useDownloadModal must be used within ModalProvider");
  }
  return context;
}
