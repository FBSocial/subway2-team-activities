import ImageButton, { ButtonLabel } from '@/components/ImageButton';
import type { Activity } from '@/services/api';
import { ActivityDataUtils } from '@/utils';
import { memo } from 'react';

type TeamIRaiseBeforeProps = {
  data: Activity;
  onClick: () => void;
};

const TeamIRaiseBefore = memo(({ data, onClick }: TeamIRaiseBeforeProps) => {
  const { activityStatus } = ActivityDataUtils.summarizeActivityData(data);

  if (!data) return null;

  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      <img
        onDragStart={(e) => e.preventDefault()} // 禁用拖动
        onContextMenu={(e) => e.preventDefault()} //
        src={data.config.reward_illustration}
        draggable={false}
        alt=""
        className={'pointer-events-none h-[131px] w-[300px] object-cover'}
      />
      <div className={'w-full px-[20px] pt-[31px]'}>
        <ImageButton
          label={
            activityStatus.isActivityStarted
              ? activityStatus.isActivityEnded
                ? ButtonLabel.ActivityEnded
                : ButtonLabel.RaiseNow
              : ButtonLabel.ActivityNotStart
          }
          disabled={activityStatus.isActivityNotStartedOrEnded}
          showAnimateGradient={activityStatus.isActivityInProgress}
          onClick={onClick}
        />
      </div>
    </div>
  );
});

TeamIRaiseBefore.displayName = 'TeamIRaiseBefore';
export default TeamIRaiseBefore;
