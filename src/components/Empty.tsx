import DefaultEmptyImage from '@/assets/empty.png';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface EmptyProps {
  /** 显示的文本或React节点 */
  label: ReactNode;
  /** 自定义图片URL */
  image?: string;
  /** 额外的CSS类名 */
  className?: string;
  /** 图片尺寸，默认为120px */
  imageSize?: number;
  /** 文本样式类名 */
  textClassName?: string;
}

/**
 * 空状态组件
 *
 * @param props 组件属性
 * @returns JSX.Element
 */
export default function Empty({
  label,
  image = DefaultEmptyImage,
  className,
  imageSize = 120,
  textClassName,
}: EmptyProps) {
  return (
    <div
      className={clsx('flex flex-col items-center justify-center', className)}
    >
      <img
        src={image}
        className={clsx(
          'pointer-events-none my-3',
          `h-[${imageSize}px] w-[${imageSize}px]`,
        )}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        alt="Empty state illustration"
      />
      <div className={clsx('py-1 text-b60', textClassName)}>{label}</div>
    </div>
  );
}
