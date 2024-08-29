import FbApi from '@/services/FbApi';
import { inMiniprogram } from '@/utils';
import { Reporter } from 'fanbook-lib-reporter';
import { useCallback, useEffect, useState } from 'react';
import createEventReporter from './dlog';

type DlogReporter = Reporter<Record<string, unknown>>;

/**
 * 自定义钩子，用于初始化和返回一个 dlog 报告器实例。
 * @param logType - 日志事件类型，默认为 'dlog_app_bot_action_event_fb'。
 * @returns 一个 dlog 报告器实例或 null。
 */
export function useDlog(
  logType: string = 'dlog_app_bot_action_event_fb',
): DlogReporter | null {
  const [dlog, setDlog] = useState<DlogReporter | null>(null);

  const createDlog = useCallback(async (): Promise<DlogReporter> => {
    console.log('创建 dlog 实例，这应该只被调用一次');

    if (inMiniprogram) {
      const { userId } = await FbApi.getUserInfo();
      const appVersion =
        navigator.userAgent.match(/inMiniprogram\/(\d+\.\d+\.\d+)/)?.[1] || '';
      return createEventReporter(logType, userId, { app_version: appVersion });
    } else {
      return createEventReporter(logType);
    }
  }, [logType]);

  useEffect(() => {
    let isMounted = true;
    let dlogPromise: Promise<DlogReporter> | null = null;

    if (!dlog) {
      dlogPromise = createDlog();
      dlogPromise
        .then((newDlog) => {
          if (isMounted) {
            setDlog(newDlog);
          }
        })
        .catch((error) => {
          console.error('Failed to create dlog instance:', error);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [dlog, createDlog]);

  return dlog;
}

export default useDlog;
