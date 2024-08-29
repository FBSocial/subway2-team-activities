import DefaultAvatarImage from '@/assets/default_avatar.svg';
import { useUser } from '@/hooks';
import type { Activity } from '@/services/api';
import clsx from 'clsx';
import { memo } from 'react';

type InviteJoinedUserListProps = Activity['invite_joined'];

const InviteJoinedUserList = memo(
  ({ listData }: { listData: InviteJoinedUserListProps }) => {
    const { user: me } = useUser();
    if (!listData || !Array.isArray(listData)) return null;

    return (
      <div
        className={'flex flex-wrap items-center justify-center space-x-1 pt-3'}
      >
        {listData.map((user, index) => {
          return (
            <div key={index} className={'flex w-[42px] flex-col items-center'}>
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
                  user.member_id === me?.userId && 'text-red',
                ])}
              >
                {user.nickname || '用户123'}
              </p>
            </div>
          );
        })}
      </div>
    );
  },
);

export default InviteJoinedUserList;
