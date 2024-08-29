/**
 * 用户代理字符串
 */
const userAgent = navigator.userAgent;

/**
 * 判断是否在游乐园环境中
 */
const isInAmusementPark = userAgent.includes('AmusementPark');

/**
 * 判断是否在 Fanbook HTML 环境中
 */
const isInFanbookHTML = userAgent.includes('fanbook/');

/**
 * 判断是否在 Fanbook 小程序环境中
 */
const isInMiniprogram = userAgent.includes('FBMP');

/**
 * 判断是否在 Fanbook 环境中（包括游乐园、HTML 或小程序）
 */
const isInFanbook = isInAmusementPark || isInFanbookHTML || isInMiniprogram;

/**
 * 判断是否在苹果设备上
 */
const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(userAgent);

/**
 * 判断是否在安卓设备上
 */
const isAndroidDevice = /android/i.test(userAgent);

/**
 * 比较版本号，判断版本 a 是否大于版本 b
 * @param a - 版本号 a
 * @param b - 版本号 b
 * @returns 如果版本 a 大于版本 b，返回 true，否则返回 false
 */
export function isVersionGreaterThan(a: string, b: string): boolean {
  return a.localeCompare(b, undefined, { numeric: true }) > 0;
}

/**
 * 检查应用版本是否大于或等于最小版本
 * @param minVersion - 最小版本号，默认为 '2.2.3'
 * @returns 如果应用版本大于或等于最小版本，返回 true，否则返回 false
 */
export function checkAppVersion(minVersion: string = '2.2.3'): boolean {
  const versionMatch = userAgent.match(
    /(fanbook|AmusementPark)\/(\d+\.\d+\.\d+)/,
  );
  const version = versionMatch?.[2];
  if (!version) return false;
  return minVersion === version || isVersionGreaterThan(version, minVersion);
}

export {
  isInAmusementPark as inAmusementPark,
  isAndroidDevice as inAndroidDevice,
  isAppleDevice as inAppleDevice,
  isInFanbook as inFanbook,
  isInFanbookHTML as inFanbookHTML,
  isInMiniprogram as inMiniprogram,
};
