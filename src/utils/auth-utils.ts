import Cookies from 'js-cookie';
import { inMiniprogram } from './ua-utils/user-agent-match';

/**
 * 认证状态枚举
 */
export enum AuthStatus {
  AUTHENTICATED_IN_MINIPROGRAM = 'AUTHENTICATED_IN_MINIPROGRAM',
  AUTHENTICATED = 'AUTHENTICATED',
  IN_MINIPROGRAM_NO_TOKEN = 'IN_MINIPROGRAM_NO_TOKEN',
  NO_TOKEN_NOT_IN_MINIPROGRAM = 'NO_TOKEN_NOT_IN_MINIPROGRAM',
}

/**
 * 检查是否存在有效的认证令牌
 *
 * @returns {boolean} 如果存在有效的认证令牌则返回 true，否则返回 false
 */
export function hasToken(): boolean {
  return !!Cookies.get('token');
}

/**
 * 获取当前的认证状态
 *
 * @returns {AuthStatus} 当前的认证状态
 */
function getCurrentAuthStatus(): AuthStatus {
  if (inMiniprogram) {
    return hasToken()
      ? AuthStatus.AUTHENTICATED_IN_MINIPROGRAM
      : AuthStatus.IN_MINIPROGRAM_NO_TOKEN;
  } else {
    return hasToken()
      ? AuthStatus.AUTHENTICATED
      : AuthStatus.NO_TOKEN_NOT_IN_MINIPROGRAM;
  }
}

/**
 * 认证回调函数类型
 */
type AuthCallback = () => void;

/**
 * 认证回调函数对象类型
 */
type AuthCallbacks = Partial<Record<AuthStatus, AuthCallback>>;

/**
 * 检查用户认证状态，并在对应状态下执行关联的回调函数，同时支持兜底回调
 *
 * @param {AuthCallbacks} [callbacks] - 回调函数对象，键为认证状态，值为对应的回调函数
 * @param {AuthCallback} [fallback] - 兜底回调函数，所有情况都会执行
 * @returns {AuthStatus} 当前的认证状态
 */
export function getAuthStatus(
  callbacks?: AuthCallbacks,
  fallback?: AuthCallback,
): AuthStatus {
  const authStatus = getCurrentAuthStatus();

  if (callbacks) {
    const callback = callbacks[authStatus];
    if (typeof callback === 'function') {
      callback();
    }
  }

  if (typeof fallback === 'function') {
    fallback();
  }

  return authStatus;
}

/**
 * 清除认证状态
 *
 * 该函数会检查是否存在认证信息（token 和用户信息），
 * 如果存在，则移除存储在 Cookies 中的 token 和 localStorage 中的用户信息，
 * 并重新加载页面以确保认证状态被清除。
 */
export function clearAuthStatus(): void {
  const user = localStorage.getItem('user');

  if (hasToken() || user) {
    Cookies.remove('token');
    localStorage.removeItem('user');
    window.location.reload();
  } else {
    console.log('没有找到认证信息，无需清除。');
  }
}

/**
 * 检查当前认证状态是否与目标状态匹配
 *
 * @param {AuthStatus} targetStatus - 目标认证状态
 * @returns {boolean} 如果当前认证状态与目标状态匹配，则返回 true，否则返回 false
 */
export function isAuthStatusMatch(targetStatus: AuthStatus): boolean {
  return getCurrentAuthStatus() === targetStatus;
}

/**
 * 检查是否在小程序中且已认证
 *
 * @returns {boolean} 如果在小程序中且已认证则返回 true，否则返回 false
 */
export function isAuthenticatedInMiniprogram(): boolean {
  return isAuthStatusMatch(AuthStatus.AUTHENTICATED_IN_MINIPROGRAM);
}

/**
 * 检查是否已认证（非小程序环境）
 *
 * @returns {boolean} 如果已认证且不在小程序中则返回 true，否则返回 false
 */
export function isAuthenticated(): boolean {
  return isAuthStatusMatch(AuthStatus.AUTHENTICATED);
}

/**
 * 检查是否在小程序中但未认证
 *
 * @returns {boolean} 如果在小程序中但未认证则返回 true，否则返回 false
 */
export function isInMiniprogramNoToken(): boolean {
  return isAuthStatusMatch(AuthStatus.IN_MINIPROGRAM_NO_TOKEN);
}

/**
 * 检查是否未认证且不在小程序中
 *
 * @returns {boolean} 如果未认证且不在小程序中则返回 true，否则返回 false
 */
export function isNoTokenNotInMiniprogram(): boolean {
  return isAuthStatusMatch(AuthStatus.NO_TOKEN_NOT_IN_MINIPROGRAM);
}
