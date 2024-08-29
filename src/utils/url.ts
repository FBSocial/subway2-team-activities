/**
 * 生成基础链接的工具函数
 * @param {string} pathname - 路径
 * @param {boolean} [location=true] - 是否包含当前页面的 origin，默认为 true
 * @returns {string} - 生成的链接
 */
export function generateBaseLink(
  pathname: string,
  location: boolean = true,
): string {
  if (typeof pathname !== 'string') {
    throw new Error('pathname 必须是一个字符串');
  }

  const locationOrigin =
    location && typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = import.meta.env.BASE_URL || '';

  // 确保 pathname 以斜杠开头
  const normalizedPathname = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  return `${locationOrigin}${baseUrl}${normalizedPathname}`;
}
