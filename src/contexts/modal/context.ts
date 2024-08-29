import { createContext, ReactNode } from 'react';

type ModalContextValue = {
  opened: boolean;
  openModal: (params: { title: string; content: ReactNode }) => void;
  closeModal: () => void;
};
export const ModalContext = createContext<ModalContextValue>({
  opened: false,
  openModal: () => {},
  closeModal: () => {},
});
