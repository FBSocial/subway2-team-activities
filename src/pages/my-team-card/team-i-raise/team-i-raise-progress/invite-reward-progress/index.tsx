import type { Reward, Task, TaskStatus, User } from '@/services/api';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import RewardShake from './RewardShake';
import SpaceProgressBar from './SpaceProgressBar';

type InviteRewardProgressProps = {
  userRewards: Reward[];
  userTasks: Task[];
  inviteUserList: User[];
  userTasksNameList: string[];
  taskStatus: TaskStatus[];
  onClickReward: (index: number, reward: Reward, task: Task) => void;
};

const InviteRewardProgress = memo(
  ({
    userRewards,
    userTasks,
    inviteUserList,
    taskStatus,
    userTasksNameList,
    onClickReward,
  }: InviteRewardProgressProps) => {
    const width = useMemo(() => {
      return Math.ceil(100 / userRewards.length) + '%';
    }, [userRewards]);
    return (
      <>
        <div className={clsx(['flex h-[50px] px-[15px]'])}>
          {userRewards?.map((reward, index) => {
            return (
              <div
                key={reward.gift_id}
                className="flex items-center justify-center"
                style={{ width }}
              >
                <RewardShake
                  key={reward.gift_id}
                  img={reward.img}
                  taskStatus={taskStatus[index]}
                  onClick={() => onClickReward(index, reward, userTasks[index])}
                />
              </div>
            );
          })}
        </div>
        <div className={'px-[15px]'}>
          <SpaceProgressBar
            value={inviteUserList.length ?? 0}
            max={userRewards.length}
            labels={userTasksNameList}
          />
        </div>
      </>
    );
  },
);

export default InviteRewardProgress;
