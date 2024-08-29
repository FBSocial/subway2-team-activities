import TitleImage from '@/assets/modal-title.png';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { ModalContext } from './context';

export function ModalProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<boolean>(false);
  const [contentReady, setContentReady] = useState<boolean>(false);
  const [prerenderedContent, setPrerenderedContent] =
    useState<ReactNode | null>(null);
  const content = useRef<{
    content: ReactNode;
    title: string;
    callback?: () => void;
  } | null>(null);

  const open = (params: {
    content: ReactNode;
    title: string;
    callback?: () => void;
  }) => {
    content.current = params;
    setContentReady(false);

    console.log('Opening modal');

    // 预处理 content
    const prerendered = (
      <ModalContent title={params.title} content={params.content} />
    );

    setPrerenderedContent(prerendered);
    setOpened(true);
  };

  const close = () => {
    console.log('Closing modal');
    setOpened(false);
    setContentReady(false);
    content.current = null;
    setPrerenderedContent(null);
  };

  useLayoutEffect(() => {
    if (opened && content.current) {
      // 使用 requestAnimationFrame 确保在下一个渲染帧中设置 contentReady
      requestAnimationFrame(() => {
        setContentReady(true);
        // 如果提供了回调函数，在内容准备好后调用它
        if (content.current?.callback) {
          content.current.callback?.();
        }
      });
    }
  }, [opened]);

  return (
    <ModalContext.Provider
      value={{
        opened: opened,
        openModal: open,
        closeModal: close,
      }}
    >
      {children}

      <Modal
        isOpen={opened && contentReady}
        onRequestClose={close}
        ariaHideApp={false}
        closeTimeoutMS={250}
      >
        {prerenderedContent}
      </Modal>
    </ModalContext.Provider>
  );
}

interface ModalContentProps {
  title: string;
  content: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ title, content }) => {
  return (
    <div
      className={
        'min-h-[389px] w-[300px] rounded-[27px] bg-white/[0.01] px-[7px] pb-2.5 pt-2'
      }
      style={{
        boxShadow:
          'inset 0.69px -0.69px 2.08px 0px rgba(255, 244, 183, 0.5),inset -0.69px 1.39px 0.69px 0px rgba(255, 245, 171, 0.719),inset 0px 6.94px 48.56px 0px rgba(255, 255, 255, 0.5464)',
      }}
    >
      <h1
        className={
          'absolute left-0 right-0 z-10 min-h-[30px] -translate-y-[3px] text-center text-[22px] font-medium leading-[31px] text-[#BC6803]'
        }
      >
        {title}
      </h1>
      <img
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        src={TitleImage}
        alt=""
        className={'pointer-events-none absolute -left-[3px] -top-[90px]'}
      />

      <div
        className={
          'flex h-full w-full flex-col items-center rounded-[21px] bg-white px-[23px]'
        }
      >
        {content}
      </div>
    </div>
  );
};
