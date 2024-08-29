import TitleImage from '@/assets/modal-title.png';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';
import Model from 'react-modal';

const ModalContext = createContext<{
  opened: boolean;
  openModal: (params: { title: string; content: ReactNode }) => void;
  closeModal: () => void;
}>({
  opened: false,
  openModal: () => {},
  closeModal: () => {},
});

export default function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<boolean>(false);

  const open = (params: { content: ReactNode; title: string }) => {
    setOpened(true);
    content.current = params;
  };
  const close = () => setOpened(false);
  const content = useRef<{ content: ReactNode; title: string } | null>(null);

  return (
    <ModalContext.Provider
      value={{
        opened: opened,
        openModal: open,
        closeModal: close,
      }}
    >
      {children}
      <Model
        isOpen={opened}
        onRequestClose={close}
        closeTimeoutMS={250}
        ariaHideApp={false}
      >
        <div
          className={
            'w-[300px] rounded-[27px] bg-white/[0.01] px-[7px] pb-2.5 pt-2'
          }
          style={{
            boxShadow:
              'inset 0.69px -0.69px 2.08px 0px rgba(255, 244, 183, 0.5),inset -0.69px 1.39px 0.69px 0px rgba(255, 245, 171, 0.719),inset 0px 6.94px 48.56px 0px rgba(255, 255, 255, 0.5464)',
          }}
        >
          <h1
            className={
              'absolute left-0 right-0 z-10 -translate-y-[3px] text-center text-[22px] font-medium leading-[31px] text-[#BC6803]'
            }
          >
            {content.current?.title}
          </h1>
          <img
            draggable={false}
            onDragStart={(e) => e.preventDefault()} // 禁用拖动
            onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
            src={TitleImage}
            alt=""
            className={'pointer-events-none absolute -left-[3px] -top-[90px]'}
          />

          <div
            className={
              'flex h-full w-full flex-col items-center rounded-[21px] bg-white px-[23px]'
            }
          >
            {content.current?.content}
          </div>
        </div>
      </Model>
    </ModalContext.Provider>
  );
}
