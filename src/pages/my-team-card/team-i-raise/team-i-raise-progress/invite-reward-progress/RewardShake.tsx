import BubbleImage from '@/assets/bubble.svg';
import BubbleInactiveImage from '@/assets/bubble_inactive.svg';
import { TaskStatus } from '@/services/api';
import clsx from 'clsx';
import { memo, useMemo } from 'react';

/**
 * RewardShake 组件的属性类型
 * @typedef {Object} RewardShakeProps
 * @property {TaskStatus} taskStatus - 任务状态
 * @property {string} img - 图片路径
 * @property {() => void} onClick - 点击事件处理函数
 */
type RewardShakeProps = {
  taskStatus: TaskStatus;
  img: string;
  onClick: () => void;
};

/**
 * 阻止默认事件
 * @param {React.DragEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement>} e - 事件对象
 */
const preventDefault = (
  e: React.DragEvent<HTMLImageElement> | React.MouseEvent<HTMLImageElement>,
) => {
  e.preventDefault();
};

/**
 * RewardShake 组件
 * @param {RewardShakeProps} props - 组件属性
 * @returns {JSX.Element}
 */
const RewardShake = memo(({ onClick, taskStatus, img }: RewardShakeProps) => {
  const bubbleImage =
    taskStatus === TaskStatus.None ? BubbleInactiveImage : BubbleImage;

  const getRewardStatus = useMemo(() => {
    switch (taskStatus) {
      case TaskStatus.Finished:
        return 'finished';
      case TaskStatus.Received:
        return 'received';
      default:
        return 'none';
    }
  }, [taskStatus]);

  return (
    <div
      className={clsx([
        'relative',
        'cursor-pointer',
        getRewardStatus === 'finished' && 'shake-reward',
      ])}
      onClick={onClick}
    >
      <img
        className="pointer-events-none"
        draggable={false}
        onDragStart={preventDefault}
        onContextMenu={preventDefault}
        src={bubbleImage}
        alt="Bubble"
      />
      <img
        onDragStart={preventDefault}
        onContextMenu={preventDefault}
        draggable={false}
        src={img}
        className="pointer-events-none absolute left-1.5 top-[3px] h-[38px] w-[38px]"
        alt="Reward"
      />
    </div>
  );
});

export default RewardShake;
