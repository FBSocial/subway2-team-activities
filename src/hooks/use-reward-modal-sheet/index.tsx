import {
  RewardModalSheetContext,
  type RewardModalSheetContextType,
} from '@/contexts/reward-modal-sheet/context';
import { useContext } from 'react';

/**
 * 使用 Sheet 上下文的自定义 Hook
 * @returns {RewardModalSheetContextType} Sheet 上下文
 * @throws {Error} 如果在 SheetProvider 外部使用会抛出错误
 */
export const useRewardModalSheet = (): RewardModalSheetContextType => {
  const context = useContext(RewardModalSheetContext);
  if (context === undefined) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return context;
};
