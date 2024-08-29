/**
 * 获取当前时间戳（秒）
 * @returns {number} 当前时间戳（秒）
 */
export function getCurrentTimeSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
