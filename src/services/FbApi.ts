import { inMiniprogram } from '@/utils';

/**
 * 用户信息接口
 * @interface IUserInfo
 * @property {string} userId - 用户ID
 * @property {string} nickname - 用户昵称
 * @property {string} avatar - 用户头像
 * @property {string} gender - 用户性别
 * @property {string} shortId - 用户短ID
 */
export interface IUserInfo {
  userId: string;

  nickname: string;
  avatar: string;
  gender: string;
  shortId: string;
}

let toastDom: HTMLDivElement;
let toastTimer: number;

/**
 * FbApi 类，包含与小程序交互的方法
 * @class FbApi
 */
export default class FbApi {
  /**
   * 显示游戏活动分享
   * @static
   * @method showGameActivityShare
   * @param {Object} params - 参数对象
   * @param {string} params.path - 分享路径
   */
  static showGameActivityShare(params: { path: string }) {
    callAppFunc('showGameActivityShare', params);
  }

  /**
   * 获取用户信息
   * @static
   * @method getUserInfo
   * @returns {Promise<IUserInfo>} - 返回用户信息Promise对象
   * @throws {Error} - 如果不在小程序环境中，抛出错误
   */
  static getUserInfo(): Promise<IUserInfo> {
    if (inMiniprogram) return fb.getUserInfo();
    throw new Error('Not in miniprogram');
  }

  /**
   * 显示提示信息
   * @static
   * @method toast
   * @param {string} text - 提示文本
   */
  static toast(text: string) {
    if (inMiniprogram) {
      callAppFunc('toast', { message: text });
    } else {
      if (!toastDom) {
        toastDom = document.createElement('div');
        document.body.append(toastDom);
        toastDom.style.pointerEvents = 'none';
        toastDom.style.padding = '10px 20px';
        toastDom.style.backgroundColor = '#1A2033f2';
        toastDom.style.color = 'white';
        toastDom.style.position = 'fixed';
        toastDom.style.borderRadius = '10px';
        toastDom.style.opacity = '0';
        toastDom.style.fontWeight = '500';
        toastDom.style.fontSize = '14px';
        toastDom.style.textAlign = 'center';
        toastDom.style.transition = 'opacity 0.3s';
        toastDom.style.left = '50%';
        toastDom.style.top = '50%';
        toastDom.style.zIndex = '100';
        toastDom.style.width = 'fit-content';
        toastDom.style.whiteSpace = 'break-spaces';
        toastDom.style.transform = 'translate(-50%, -50%)';
      }
      clearTimeout(toastTimer);
      window.setTimeout(() => {
        toastDom.innerHTML = `<b>${text}</b>`;
        toastDom.style.opacity = '1';
      });
      toastTimer = window.setTimeout(() => {
        toastDom.style.opacity = '0';
      }, 2000);
    }
  }
}

/**
 * 调用小程序函数
 * @function callAppFunc
 * @param {string} name - 函数名
 * @param {...unknown} arg - 参数
 * @returns {Promise<T>} - 返回Promise对象
 * @throws {Error} - 如果不在小程序环境中，返回拒绝的Promise
 */
function callAppFunc<T>(name: string, ...arg: unknown[]): Promise<T> {
  if (inMiniprogram) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return window.flutter_inappwebview.callHandler(name, ...arg);
    } catch (e) {
      console.error(e);
    }
  }
  return Promise.reject(`call ${name} but NOT in fb env`);
}
