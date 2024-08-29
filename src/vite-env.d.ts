/// <reference types="vite/client" />
import { IUserInfo } from '@/services/FbApi';

declare global {
  declare const fb: {
    openMiniProgram(args: { appId: string; keepCurrent: boolean }): void;
    getUserToken(): Promise<{ token: string }>;
    getUserInfo(): Promise<IUserInfo>;
    dlog(args: {
      actionEventId?: string;
      actionEventSubId?: string;
      actionEventSubParam?: string;
      pageId?: string;
      extJson?: Record<string, unknown>;
    }): void;
    setClipboardData(text: string): void;
  };

  interface Window {
    openInstall: OpenInstall;
    flutter_inappwebview: {
      callHandler: (name: string, ...args: unknown[]) => Promise<unknown>;
    };
  }

  class OpenInstall {
    constructor(
      paramsA: {
        appKey: string;
        preferWakeup?: boolean;
        onready: () => void;
      },
      paramsB?: Record<string, string>,
    );

    wakeupOrInstall(paras?: {
      data: Record<string, string>;
      timeout: number;
    }): void;

    install(paras?: { data: Record<string, string> }): void;
  }
}
