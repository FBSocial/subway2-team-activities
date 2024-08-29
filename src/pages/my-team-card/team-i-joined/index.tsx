import Empty from '@/components/Empty';
import ImageButton, { ButtonLabel } from '@/components/ImageButton';
import RewardModal from '@/components/RewardModal';
import { DataContext } from '@/contexts';
import useModal from '@/hooks/use-modal';
import FbApi from '@/services/FbApi';
import { inMiniprogram } from '@/utils';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InviteJoinedUserList from './InviteJoinedUserList';

export default function TeamIJoined() {
  const [query] = useSearchParams();
  const { data, readableData } = useContext(DataContext)!;
  const navigate = useNavigate();

  const {
    inviteJoined,
    activityStatus,
    inviteReward,
    isRewardReceived,
    userGlobalTask,
  } = readableData;

  const { openModal, closeModal } = useModal();
  const [rewardReceived, setRewardReceived] = useState(isRewardReceived);

  // 站外打开 app 时会自动打开此页面，并且参数中有 join，此时需要提示用户已经加入过团
  useEffect(() => {
    const isJoin = query.has('join');
    if (isJoin && query.has('tab') && inviteJoined) {
      FbApi.toast('你已加入过团');
      query.delete('join');
      navigate(`/team?${query.toString()}`, { replace: true });
    }
  }, [inviteJoined, navigate, query]);

  async function onConfirm() {
    if (activityStatus.isActivityNotStartedOrEnded) return;

    // 只有在 Fanbook 内才能领取奖励
    if (!rewardReceived) {
      setRewardReceived(true);
    }

    openModal({
      title: '恭喜你获得',
      content: (
        <RewardModal
          task={userGlobalTask!}
          buttonLabel={ButtonLabel.GetMoreRewards}
          reward={inviteReward!}
          onConfirm={(cdkey, isStartTeam) => {
            if (inMiniprogram) {
              if (cdkey && isStartTeam) {
                fb.setClipboardData(cdkey);
              } else {
                closeModal();
                navigate('/', { replace: true });
              }
            } else {
              navigate('/invite-join-fanbook', { replace: true });
            }
          }}
        />
      ),
    });
  }

  if (!data) return null;

  return (
    <>
      {!inviteJoined.length ? (
        <Empty className={'pt-[37px] text-[14px]'} label={'暂未加入其他团'} />
      ) : (
        <div className={'flex h-full flex-col items-center'}>
          <p className={'py-2 text-center text-sm font-medium'}>
            恭喜获得以下奖励
          </p>
          <img src={inviteReward?.img} className={'h-20 w-20'} alt="" />
          <InviteJoinedUserList listData={inviteJoined} />
          <div className={'w-full px-5 pt-2'}>
            <ImageButton
              onClick={onConfirm}
              label={
                activityStatus.isActivityStarted
                  ? activityStatus.isActivityEnded
                    ? ButtonLabel.ActivityEnded
                    : rewardReceived
                      ? ButtonLabel.ViewRewards
                      : ButtonLabel.ReceiveRewards
                  : ButtonLabel.ActivityNotStart
              }
              showAnimateGradient={activityStatus.isActivityInProgress}
              disabled={activityStatus.isActivityNotStartedOrEnded}
            />
          </div>
        </div>
      )}
    </>
  );
}
