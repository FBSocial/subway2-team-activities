import ArrowDownIcon from '@/assets/expand.svg';
import React from 'react';
import { Sheet } from 'react-modal-sheet';

interface SheetHeaderProps {
  onClose?: React.MouseEventHandler<HTMLDivElement>;
  title?: string;
  subtitle?: string;
}

export default function SheetHeader({
  onClose,
  title,
  subtitle,
}: SheetHeaderProps) {
  return (
    <Sheet.Header>
      <div className={'m-auto my-2 h-1 w-[35px]'} />
      <div
        className={'flex items-center justify-between px-4 py-2.5 leading-6'}
      >
        <div
          onClick={onClose}
          className={
            'flex h-6 w-6 items-center justify-center rounded-full bg-b/5'
          }
        >
          <img
            onDragStart={(e) => e.preventDefault()} // 禁用拖动
            onContextMenu={(e) => e.preventDefault()} //
            draggable={false}
            src={ArrowDownIcon}
            alt=""
            className="pointer-events-none"
          />
        </div>
        {
          <div className={'flex flex-col items-center'}>
            <p className={'font-medium text-[#1F2126]'}>{title}</p>
            {!!subtitle && (
              <div className={'text-b40 leading-[22px]'}>{subtitle}</div>
            )}
          </div>
        }
        <div className={'h-6 w-6'}></div>
      </div>
    </Sheet.Header>
  );
}
