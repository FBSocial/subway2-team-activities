import { clearAuthStatus } from '@/utils/auth-utils';

// 这个组件主要用于给测试用的，快速退出按钮
const TestLogout = () => {
  const showDebugTool = import.meta.env.VITE_SHOW_DEBUG_TOOL === 'true';
  if (!showDebugTool) return null;

  return (
    <button
      onClick={clearAuthStatus}
      className="fixed right-1 top-0 z-20 rounded-md bg-blue px-4 py-2 text-white"
    >
      退出账号(测试用)
    </button>
  );
};

export default TestLogout;
