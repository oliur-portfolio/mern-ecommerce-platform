import React, { createContext, useContext, useState } from "react";

type TModalName = "userCreate" | "userBlock" | "userDelete" | "productDelete";

interface ModalContextType {
  activeModal: TModalName | null;
  selectedId: string | null;
  openModal: (name: TModalName, id?: string) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [activeModal, setActiveModal] = useState<TModalName | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openModal = (name: TModalName, id?: string) => {
    setActiveModal(name);
    setSelectedId(id ?? null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedId(null);
  };

  return (
    <ModalContext.Provider
      value={{
        closeModal,
        openModal,
        activeModal,
        selectedId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
};
