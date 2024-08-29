import CheckImage from '@/assets/check.svg';
import LockImage from '@/assets/lock.svg';
import clsx from 'clsx';
import { memo, useMemo } from 'react';

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
const SpaceProgressBar = memo((props: ProgressBarProps) => {
  const { max, value, labels } = props;
  console.log('%c Line:28 🍪 value', 'color:#6ec1c2', value);

  const width = useMemo(() => {
    return Math.ceil(100 / max) + '%';
  }, [max]);

  /**
   * 渲染里程碑节点
   * @param {number} index - 里程碑索引
   * @returns {JSX.Element}
   */
  const renderMilestone = (index: number) => {
    const unlocked = value >= index + 1;
    return (
      <div
        style={{ width }}
        className="relative flex justify-center py-0.5"
        key={index}
      >
        <div
          className={clsx([
            'absolute z-10 mt-1 h-1',
            index === 0 && 'rounded-bl-full rounded-tl-full',
            index === max - 1 && 'rounded-rl-full rounded-rl-full',
            index === 0 && 'left-1/2 w-1/2 bg-b/5',
            index === max - 1 && 'right-1/2 w-1/2 bg-b/5',
            index !== max - 1 && index !== 0 && 'w-full bg-b/5',
          ])}
        />
        <div
          className={clsx([
            'absolute z-20 mt-1 h-1',
            index === 0 && 'rounded-bl-full rounded-tl-full',
            index === max - 1 && 'rounded-rl-full rounded-rl-full',
            unlocked && index === 0 && 'left-1/2 w-1/2 bg-[#FF9257]',
            unlocked && index === max - 1 && '!left-0 w-1/2 bg-[#FF9257]',
            unlocked &&
              index !== 0 &&
              index !== max - 1 &&
              'w-full bg-[#FF9257]',
          ])}
        />
        <div className="w-0" key={index}>
          <div
            className={clsx([
              'relative z-30 w-4 -translate-x-2 rounded-[10px] px-1 py-0.5',
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
    <div style={{ width }} className="flex justify-center" key={index}>
      <div className="w-0 overflow-visible">
        <p className="w-fit origin-top -translate-x-1/2 overflow-visible whitespace-nowrap text-[10px] text-b/95">
          {label}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div className="py-0.5">
        <div className="flex">
          {Array.from({ length: max }, (_, index) => renderMilestone(index))}
        </div>
      </div>
      <div className="flex h-[14px] justify-center">
        {labels.map((label, index) => renderLabel(label, index))}
      </div>
    </div>
  );
});

export default SpaceProgressBar;
