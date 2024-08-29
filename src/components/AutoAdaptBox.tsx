import type { ReactNode } from 'react';

export function AutoAdaptBox({ children }: { children: ReactNode }) {
  return (
    <div
      className={
        'm-auto flex w-[352px] flex-1 origin-left cursor-pointer select-none flex-col items-center rounded-b-[20px] rounded-t-[20px] bg-white text-center text-lg backdrop-blur-[10px] transition-all'
      }
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, #FFFFFF 37%, #FFFFFF 100%)',
      }}
    >
      {children}
    </div>
  );
}
