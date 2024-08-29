import ImageButton, { ButtonLabel } from '@/components/ImageButton';
import RewardModal from '@/components/RewardModal';
import { useDlog, useUser } from '@/hooks';
import useModal from '@/hooks/use-modal';
import { useRewardModalSheet } from '@/hooks/use-reward-modal-sheet';
import Api, {
  TaskStatus,
  type Activity,
  type Reward,
  type Task,
} from '@/services/api';
import FbApi from '@/services/FbApi';
import { ActivityDataUtils, inMiniprogram } from '@/utils';
import { generateBaseLink } from '@/utils/url';
import { useRequest, useThrottleFn } from 'ahooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InviteRewardProgress from './invite-reward-progress';
import Recipients from './Recipients';

export default function TeamIRaiseProgress({ data }: { data: Activity }) {
  const { data: { code } = { code: '' } } = useRequest(Api.invite, {
    retryCount: -1,
    cacheKey: 'invite-code',
    staleTime: 5000,
    debounceWait: 100,
  });

  const navigate = useNavigate();
  const { user } = useUser();

  const { openModal } = useModal();
  const dlog = useDlog();
  const { openRewardModalSheet } = useRewardModalSheet();

  const {
    invitationsMatchRewards,
    inviteUserList,
    activityStatus,
    userRewards,
    userTasksNameList,
    userTasks,
    userTasksStatusList,
    userInviteTasks,
  } = ActivityDataUtils.summarizeActivityData(data);

  const [taskStatus, setTaskStatus] = useState(() => userTasksStatusList);

  async function onClickReward(index: number, reward: Reward, task: Task) {
    // 在 Fanbook 内才能领取奖励
    if (userTasksStatusList[index] === TaskStatus.Finished) {
      setTaskStatus((prev) => {
        const newStatus = [...prev];
        newStatus[index] = TaskStatus.Received;
        return newStatus;
      });
    }
    if (userTasksStatusList[index] > TaskStatus.None) {
      openRewardModal(reward, task);
    }
  }

  function openRewardModal(reward: Reward, task: Task) {
    openModal({
      title: '恭喜你获得',
      content: (
        <RewardModal
          task={task}
          reward={reward}
          onConfirm={(cdKey) => {
            if (inMiniprogram && cdKey) {
              fb.setClipboardData(cdKey);
            } else {
              navigate('/invite-join-fanbook', { replace: true });
            }
          }}
        />
      ),
    });
  }

  const { run: onInvite } = useThrottleFn(
    async () => {
      if (invitationsMatchRewards) {
        if (inMiniprogram) {
          openRewardModalSheet();
        } else {
          navigate('/invite-join-fanbook', { replace: true });
        }
        return;
      }

      if (inMiniprogram) {
        if (!code) return;
        FbApi.showGameActivityShare({
          path: `${generateBaseLink(`/invite/${code}`, false)}`,
        });
      }

      // 上报：点击发起组团（团长）
      let teamCount = 1;
      if (Array.isArray(data?.my_invite)) {
        teamCount = data?.my_invite?.length + 1;
      }
      dlog?.pushMsg({
        user_id: data?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'click_invite_join',
        event_sub_param: teamCount,
      });
    },
    { wait: 1000 },
  );

  const recipients = useMemo(() => {
    return [user, ...inviteUserList];
  }, [inviteUserList, user]);

  if (!code) return null;

  return (
    <>
      <p className={'py-2 text-center text-sm font-medium text-b95'}>
        {inviteUserList.length > 0 ? (
          <>
            已召回
            <span className={'text-orange'}>{inviteUserList.length}</span>
            名，
            {invitationsMatchRewards
              ? '恭喜解锁全部奖励'
              : '邀请好友解锁更多奖励'}
          </>
        ) : (
          '召回好友解锁以下奖励'
        )}
      </p>
      <InviteRewardProgress
        userTasksNameList={userTasksNameList}
        userRewards={userRewards}
        userTasks={userTasks}
        inviteUserList={inviteUserList}
        taskStatus={taskStatus}
        onClickReward={onClickReward}
      />
      <Recipients
        className={'pb-2 pt-3'}
        max={userInviteTasks.length + 1}
        recipients={recipients}
      />
      <div className={'px-5 pb-4'}>
        {code && (
          <ImageButton
            label={
              activityStatus.isActivityStarted
                ? activityStatus.isActivityEnded
                  ? ButtonLabel.ActivityEnded
                  : invitationsMatchRewards
                    ? ButtonLabel.ViewAllRewards
                    : ButtonLabel.Invite
                : ButtonLabel.ActivityNotStart
            }
            className={'copy-invite-link'}
            showAnimateGradient={activityStatus.isActivityInProgress}
            disabled={activityStatus.isActivityNotStartedOrEnded}
            data-clipboard-text={`${generateBaseLink(`/invite/${code}`)}`}
            onClick={onInvite}
          />
        )}
      </div>
    </>
  );
}
