import RewardSheet from '@/components/RewardSheet';
import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { RewardModalSheetContext } from './context';

/**
 * SheetProvider 的属性类型
 */
interface RewardModalSheetProviderProps {
  /** 子组件 */
  children: ReactNode;
}

/**
 * Sheet 提供者组件
 * @param {RewardModalSheetProviderProps} props - 组件属性
 * @returns {JSX.Element} SheetProvider 组件
 */
export const RewardModalSheetProvider: React.FC<
  RewardModalSheetProviderProps
> = ({ children }) => {
  const [isRewardOpened, setIsRewardOpened] = useState(false);

  const openRewardModalSheet = () => setIsRewardOpened(true);

  const closeRewardModalSheet = () => setIsRewardOpened(false);

  useLayoutEffect(() => {
    if (isRewardOpened) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isRewardOpened]);

  return (
    <RewardModalSheetContext.Provider
      value={{
        openRewardModalSheet,
        closeRewardModalSheet,
      }}
    >
      {children}
      <RewardSheet
        isOpen={isRewardOpened}
        onClose={closeRewardModalSheet}
        title="我的奖励"
      />
    </RewardModalSheetContext.Provider>
  );
};
