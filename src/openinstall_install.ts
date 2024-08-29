/**
 * 安装 OpenInstall 插件
 * @param {Record<string, string>} [params] - 初始化参数
 * @returns {Promise<void>} - 返回一个 Promise，当 OpenInstall 插件初始化完成时 resolve
 */
export function installOpenInstall(
  params?: Record<string, string>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.openInstall) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '//res.cdn.openinstall.io/openinstall.js';

    // 设置超时时间
    const timeout = setTimeout(() => {
      reject(new Error('OpenInstall 脚本加载超时'));
    }, 10000); // 10 秒超时

    script.onload = () => {
      clearTimeout(timeout);
      window.openInstall = new OpenInstall(
        {
          appKey: 'rmst4o',
          preferWakeup: true,
          onready: () => {
            console.log('OpenInstall ready ...');
            resolve();
          },
        },
        params,
      );
    };

    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('OpenInstall 脚本加载失败'));
    };

    document.body.appendChild(script);
  });
}

export function openInFanbook({
  path,
  code,
  guildId,
}: {
  path: string;
  code: string;
  guildId: string;
}) {
  window.openInstall?.wakeupOrInstall({
    data: {
      scene: 'receive_award',
      path,
      code,
      guildId,
    },
    timeout: 2000,
  });
}
