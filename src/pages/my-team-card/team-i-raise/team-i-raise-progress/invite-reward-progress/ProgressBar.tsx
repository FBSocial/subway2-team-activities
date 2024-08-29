import CheckImage from '@/assets/check.svg';
import LockImage from '@/assets/lock.svg';
import clsx from 'clsx';
import { memo } from 'react';

/**
 * 进度条组件的属性
 * @typedef {Object} ProgressBarProps
 * @property {number} max - 最大值
 * @property {number} value - 当前值
 * @property {string[]} labels - 标签数组
 * @property {number} paddingX - 左右内边距
 */
type ProgressBarProps = {
  max: number;
  value: number;
  labels: string[];
  paddingX?: number;
};

/**
 * 进度条组件
 * @param {ProgressBarProps} props - 组件属性
 * @returns {JSX.Element}
 */
const ProgressBar = memo((props: ProgressBarProps) => {
  const { max, value, labels, paddingX = 25 } = props;

  /**
   * 渲染里程碑节点
   * @param {number} index - 里程碑索引
   * @returns {JSX.Element}
   */
  const renderMilestone = (index: number) => {
    const unlocked = value >= index + 1;
    return (
      <div className="w-0" key={index}>
        <div
          className={clsx([
            'w-4 -translate-x-2 rounded-[10px] px-1 py-0.5',
            unlocked ? 'bg-[#FF9257]' : 'bg-[#F4F4F5]',
          ])}
        >
          <img
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            src={unlocked ? CheckImage : LockImage}
            className="pointer-events-none block h-2 w-2 max-w-none"
            alt=""
          />
        </div>
      </div>
    );
  };

  /**
   * 渲染标签
   * @param {string} label - 标签文本
   * @param {number} index - 标签索引
   * @returns {JSX.Element}
   */
  const renderLabel = (label: string, index: number) => (
    <div key={index} className="w-0 overflow-visible">
      <p className="w-fit origin-top -translate-x-1/2 overflow-visible whitespace-nowrap text-[10px] text-b/95">
        {label}
      </p>
    </div>
  );

  return (
    <div className="relative">
      <div className="py-0.5">
        <div className="absolute left-0 right-0 mt-1 h-1 rounded-full bg-b/5" />
        <div className="absolute left-0 right-0 mt-1 flex h-1">
          <div
            className="h-full rounded-l-full bg-[#FF9257]"
            style={{ width: value > 0 ? paddingX : 0 }}
          />
          <div className="flex-1">
            <div
              className="h-1 bg-[#FF9257]"
              style={{
                width: `${Math.max(
                  0,
                  Math.min((value - 1) / (max - 1), 1) * 100,
                )}%`,
              }}
            />
          </div>
          <div
            className="h-full rounded-r-full bg-[#FF9257]"
            style={{ width: paddingX, opacity: value >= max ? 1 : 0 }}
          />
        </div>
        <div
          className="flex justify-between"
          style={{ marginLeft: paddingX, marginRight: paddingX }}
        >
          {Array.from({ length: max }, (_, index) => renderMilestone(index))}
        </div>
      </div>
      <div
        className="flex h-[14px] justify-between"
        style={{ marginLeft: paddingX, marginRight: paddingX }}
      >
        {labels.map((label, index) => renderLabel(label, index))}
      </div>
    </div>
  );
});

export default ProgressBar;
