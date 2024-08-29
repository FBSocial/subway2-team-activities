import { ModalContext } from '@/contexts/modal/context';
import { useContext } from 'react';

export default function useModal() {
  return useContext(ModalContext);
}
