import { Reporter } from 'fanbook-lib-reporter';

type CommonFields = Record<string, unknown>;
type ReporterOptions<T> = {
  cacheMsg: boolean;
  reportInterval: number;
  maxMsgQueueCount: number;
  reportUrl: string;
  commonMsgFields: CommonFields & T;
};

export default function createEventReporter<T extends CommonFields>(
  uniqueLogType: string,
  userId?: string,
  commonFields?: CommonFields,
): Reporter<T> {
  const fields: CommonFields = {
    log_type: uniqueLogType,
    actv_id: import.meta.env.VITE_ACTIVITY_ID,
    ...commonFields,
  };

  if (userId) {
    fields.user_id = userId;
  }

  const options: ReporterOptions<T> = {
    cacheMsg: false, // 开启 cache 会导致创建 Reporter 实例时立即触发的埋点丢失，暂时关闭
    reportInterval: 1000,
    maxMsgQueueCount: 1,
    reportUrl: import.meta.env.VITE_DLOG_URL,
    commonMsgFields: fields as CommonFields & T,
  };

  return new Reporter<T>(uniqueLogType, options);
}
