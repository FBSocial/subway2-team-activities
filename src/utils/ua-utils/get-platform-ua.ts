import UAParser from 'ua-parser-js';

function iOS() {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
}

// 定义平台类型以增强代码的可维护性和类型安全性
type PlatformType = 'ios' | 'android' | string;

/**
 * 检测当前设备是否为 iOS 或 Android。
 * @returns {PlatformType} 返回 "ios", "android" 或 ""。
 */
export function detectDeviceType(): PlatformType {
  const parser = new UAParser();
  const result = parser.getResult();
  // 使用全等比较
  if (iOS()) {
    return 'ios';
  } else if (result.os.name === 'Android') {
    return 'android';
  }

  // 添加了对未知或未处理的平台的基本处理
  // 虽然返回了空字符串，但实际项目中可能需要更细致的错误处理逻辑
  return result?.os?.name ?? '';
}

/**
 * 创建并返回包含设备类型信息的HTTP头。
 * 依赖于 detectDeviceType 函数来获取设备类型。
 * @returns {{ platform: PlatformType }} 返回一个包含 'x-super-properties' 标头的对象。
 */
export function createDeviceTypeHeader(): { Platform: string } {
  // 明确指出此函数依赖于 detectDeviceType 函数
  return {
    Platform: detectDeviceType(),
  };
}
