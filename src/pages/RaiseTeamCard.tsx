import ImageButton, { ButtonLabel } from '@/components/ImageButton.tsx';
import LoginCard from '@/components/login-card';
import { DataContext } from '@/contexts';
import { useDlog } from '@/hooks';
import { isAuthenticated } from '@/utils/auth-utils.ts';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Component() {
  const {
    data,
    reloadData,
    readableData: { activityStatus, isUserGroupStarted },
  } = useContext(DataContext)!;
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const dlog = useDlog();

  function onRaiseTeam() {
    if (isAuthenticated()) {
      navigate('/team', { replace: true });
    } else {
      setShowLogin(true);
      // 上报：发起组团页账号登录弹窗曝光
      dlog?.pushMsg({
        user_id: data?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_account_login',
        event_sub_param: 'initiating_team',
      });
    }
  }

  useEffect(() => {
    if (!data) return;
    if (isUserGroupStarted) {
      // 上报：发起组团页曝光
      dlog?.pushMsg({
        user_id: data?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_invite_join',
        event_sub_param: 'initiating_team',
      });
    } else {
      dlog?.pushMsg({
        user_id: data?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_initiating_team',
      });
    }
  }, [dlog, data, isUserGroupStarted]);

  return (
    <>
      <img
        src={data.config.reward_illustration}
        onDragStart={(e) => e.preventDefault()} // 禁用拖动
        onContextMenu={(e) => e.preventDefault()} //
        draggable={false}
        alt=""
        className={
          'pointer-events-none mt-[46px] h-[140px] w-[320px] object-cover'
        }
      />
      <div className={'flex space-x-[5px]'}></div>
      <div className={'w-full px-[21px] pb-[40px] pt-[30px]'}>
        <ImageButton
          label={
            activityStatus.isActivityStarted
              ? activityStatus.isActivityEnded
                ? ButtonLabel.ActivityEnded
                : ButtonLabel.RaiseTeam
              : ButtonLabel.ActivityNotStart
          }
          disabled={activityStatus.isActivityNotStartedOrEnded}
          showAnimateGradient={activityStatus.isActivityInProgress}
          onClick={onRaiseTeam}
        />
      </div>
      <LoginCard
        open={showLogin}
        onRequestClose={() => setShowLogin(false)}
        onLogin={async () => {
          await reloadData();
          navigate('/team', { replace: true });
        }}
      />
    </>
  );
}

Component.displayName = 'RaiseTeamCard';
