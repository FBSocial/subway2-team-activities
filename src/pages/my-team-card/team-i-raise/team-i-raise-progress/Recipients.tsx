import DefaultAvatarImage from '@/assets/default_avatar.svg';
import UserPlaceholderImage from '@/assets/user_placeholder.svg';
import { User } from '@/services/api';
import type { IUserInfo } from '@/services/FbApi';
import clsx from 'clsx';
import { memo } from 'react';

type RecipientsProps = {
  className: string;
  recipients: (User | IUserInfo | undefined)[];
  max: number;
};
const Recipients = memo(({ recipients, className, max }: RecipientsProps) => {
  if (recipients.length === 0) return null;
  return (
    <div className={clsx(['flex justify-center space-x-1 px-10', className])}>
      {Array.from({ length: max }, (_, index) => {
        const user = recipients[index];
        return (
          <div
            key={index}
            className={
              'flex h-11 w-[42px] flex-col items-center overflow-hidden'
            }
          >
            {user ? (
              <>
                <img
                  onDragStart={(e) => e.preventDefault()} // 禁用拖动
                  onContextMenu={(e) => e.preventDefault()} //
                  draggable={false}
                  src={user.avatar || DefaultAvatarImage}
                  className={'pointer-events-none h-6 w-6 rounded-full'}
                  alt=""
                />
                <p
                  className={clsx([
                    'w-full origin-center overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-[10px] leading-[20px]',
                    index === 0 && 'text-red',
                  ])}
                >
                  {user.nickname || '用户123'}
                </p>
              </>
            ) : (
              <img
                className="pointer-events-none"
                onDragStart={(e) => e.preventDefault()} // 禁用拖动
                onContextMenu={(e) => e.preventDefault()} //
                draggable={false}
                src={UserPlaceholderImage}
                alt={''}
              />
            )}
          </div>
        );
      })}
    </div>
  );
});

export default Recipients;
