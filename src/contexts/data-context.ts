import { Activity } from '@/services/api';
import type { ActivityDataUtils } from '@/utils';
import { createContext } from 'react';

export type DataContextValue = {
  data: Activity;
  reloadData: () => Promise<Activity>;
  readableData: ReturnType<typeof ActivityDataUtils.summarizeActivityData>;
};

export const DataContext = createContext<DataContextValue | null>(null);
