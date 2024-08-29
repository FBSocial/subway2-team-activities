import { createContext } from 'react';

/**
 * Sheet 的上下文类型
 */
export interface RewardModalSheetContextType {
  /** 打开奖励 sheet */
  openRewardModalSheet: () => void;
  /** 关闭奖励 sheet */
  closeRewardModalSheet: () => void;
}

export const RewardModalSheetContext =
  createContext<RewardModalSheetContextType>({
    openRewardModalSheet: () => {},
    closeRewardModalSheet: () => {},
  });
