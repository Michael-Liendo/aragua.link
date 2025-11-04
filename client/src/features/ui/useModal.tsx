// src/context/ModalContext.tsx
import { createContext, type ReactNode, useContext, useState } from "react";

type ModalState = {
	[key: string]: boolean;
};

type ModalContextType = {
	modals: ModalState;
	openModal: (key: string) => void;
	closeModal: (key: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modals, setModals] = useState<ModalState>({});

	const openModal = (key: string) =>
		setModals((prev) => ({ ...prev, [key]: true }));
	const closeModal = (key: string) =>
		setModals((prev) => ({ ...prev, [key]: false }));

	return (
		<ModalContext.Provider value={{ modals, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};

export const useModals = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModals must be used within a ModalProvider");
	return ctx;
};
