import DefaultAvatarImage from '@/assets/default_avatar.svg';
import ImageButton, { ButtonLabel } from '@/components/ImageButton';
import LoginCard from '@/components/login-card';
import RewardModal from '@/components/RewardModal';
import { DataContext } from '@/contexts';
import { useDlog } from '@/hooks';
import useModal from '@/hooks/use-modal';
import Api, { Activity, User } from '@/services/api';
import FbApi from '@/services/FbApi';
import { ActivityDataUtils, inMiniprogram } from '@/utils';
import { isNoTokenNotInMiniprogram } from '@/utils/auth-utils.ts';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

export function Component() {
  const data = useLoaderData() as {
    activity: Activity;
    user: User;
    invite_joined?: User[];
    code: string;
  };
  const {
    data: activity2,
    readableData,
    reloadData,
  } = useContext(DataContext)!;
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const { user, activity } = data;
  const { globalTask, inviteReward } =
    ActivityDataUtils.summarizeActivityData(activity);
  const [showLogin, setShowLogin] = useState(false);
  const dlog = useDlog();
  const [invite_joined, setInviteJoined] = useState(false);

  const { activityStatus } = readableData;

  useEffect(() => {
    dlog?.pushMsg({
      user_id: activity2?.user?.user_id,
      event_id: 'dtpk_actv_team',
      event_sub_id: 'show_join_team',
      // 人数要加上团长
      event_sub_param: data.invite_joined?.length ?? 0,
      ext_json: {
        leader_user_id: data.user.user_id,
      },
    });

    if (invite_joined) {
      dlog?.pushMsg({
        user_id: activity2?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'click_join_team',
        // 人数要加上团长
        event_sub_param: activity2.invite_joined?.length,
        ext_json: {
          leader_user_id: user.user_id,
        },
      });

      dlog?.pushMsg({
        user_id: activity2?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_join_reward',
        ext_json: {
          leader_user_id: user.user_id,
          reward_code: '',
          reward_content: '',
        },
      });
    }
  }, [
    activity2.invite_joined?.length,
    activity2?.user?.user_id,
    data.invite_joined?.length,
    data.user.user_id,
    dlog,
    invite_joined,
    user.user_id,
  ]);

  const handleImmediateAccept = () => {
    // 检查是否未认证且不在小程序中，小程序只有在应用内，会自动注入 token
    if (isNoTokenNotInMiniprogram()) {
      setShowLogin(true);
      // 上报：参加组团页拉起账号登录弹窗曝光
      dlog?.pushMsg({
        user_id: activity2?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_account_login',
        event_sub_param: 'join_team',
      });
      return;
    } else {
      // 否则就走接受邀请的逻辑
      join();
    }
  };

  async function join() {
    try {
      const res = await Api.acceptInvite(data.code);
      if (!res.status) {
        // 无参团资格 || 团已满员
        if (res.code === 60012 || res.code === 60013) {
          // 上报：参加者不符合条件弹窗曝光
          dlog?.pushMsg({
            user_id: activity2?.user?.user_id,
            event_id: 'dtpk_actv_team',
            event_sub_id: 'show_mismatch',
            ext_json: {
              leader_user_id: user.user_id,
            },
          });
          openModal({
            title: '非常遗憾',
            content: (
              <>
                <p className={'pt-[65px] text-center text-[#3d3d3d]'}>
                  {res.code === 60012 ? (
                    <>
                      你不符合领取条件
                      <br />
                      快去邀请自己好友解锁吧
                    </>
                  ) : (
                    <>
                      当前组队已满员
                      <br />
                      暂不可加入
                    </>
                  )}
                </p>
                <img
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()} // 禁用拖动
                  onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
                  src={data.activity.config.reward_illustration}
                  alt=""
                  className={
                    'pointer-events-none mt-[31px] h-[114px] w-[260px]'
                  }
                />
                <div className={'w-full pb-[30px] pt-[37px]'}>
                  <ImageButton
                    label={
                      activityStatus.isActivityStarted
                        ? activityStatus.isActivityEnded
                          ? ButtonLabel.ActivityEnded
                          : ButtonLabel.RaiseNow
                        : ButtonLabel.ActivityNotStart
                    }
                    disabled={activityStatus.isActivityNotStartedOrEnded}
                    onClick={async () => {
                      dlog?.pushMsg({
                        user_id: activity2?.user?.user_id,
                        event_id: 'dtpk_actv_team',
                        event_sub_id: 'click_initiating_team',
                        event_sub_param: 'join_fail',
                        ext_json: {
                          leader_user_id: user.user_id,
                        },
                      });
                      closeModal();
                      await reloadData();
                      navigate('/team?step=1', { replace: true });
                    }}
                  />
                </div>
              </>
            ),
          });
        } else if (res.code === 60014) {
          // 已加入团，跳回我加入的团
          await reloadData();
          navigate('/team?tab=1&join', { replace: true });
        } else if (res.code === 60015) {
          // 用户加入自己发起的团，跳回我发起的团
          // 如果 user 为空，说明现在的数据没有登录态，要重新请求
          await reloadData();
          navigate('/team', { replace: true });
        } else if (res.desc) {
          FbApi.toast(res.desc);
        }
        return;
      } else {
        // 为了埋点的数据，必须拉取一下接口
        await reloadData();
        setInviteJoined(true);
      }
    } catch (error) {
      console.log('%c Line:180 🍰 error', 'color:#33a5ff', error);
    }

    openModal({
      title: '恭喜你获得',
      content: (
        <RewardModal
          reward={inviteReward!}
          task={globalTask!}
          buttonLabel={ButtonLabel.GetMoreRewards}
          onConfirm={async () => {
            if (inMiniprogram) {
              closeModal();
              // 点击发起组团 - 参团者成功加入后我也发起（目标参与用户）
              dlog?.pushMsg({
                user_id: activity?.user?.user_id,
                event_id: 'dtpk_actv_team',
                event_sub_id: 'click_initiating_team',
                event_sub_param: 'join_succ',
                ext_json: {
                  leader_user_id: user.user_id,
                },
              });
              navigate('/', { replace: true });
            } else {
              navigate('/invite-join-fanbook', { replace: true });
            }
          }}
        />
      ),
    });
  }

  if (!inviteReward || !data || !activity2) return;

  return (
    <>
      <div
        className={
          'flex w-full items-center self-start rounded-t-[20px] border border-white px-5 py-[7px]'
        }
      >
        <img
          draggable={false}
          onDragStart={(e) => e.preventDefault()} // 禁用拖动
          onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
          src={user.avatar || DefaultAvatarImage}
          className={'pointer-events-none h-7 w-7 rounded-full'}
          alt=""
        />
        <div
          className={
            'flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap pl-1.5 text-left text-sm font-medium text-b95'
          }
        >
          <span>{user.nickname || '用户123'}</span> 邀请你加入
        </div>
      </div>
      <div
        className={
          'flex w-full flex-col items-center rounded-b-[20px] bg-white px-[21px] pb-[27px] pt-[11px]'
        }
      >
        <p className={'text-sm font-medium'}>加入后获得以下奖励</p>
        <img
          draggable={false}
          onDragStart={(e) => e.preventDefault()} // 禁用拖动
          onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
          src={inviteReward.img}
          alt=""
          className={
            'pointer-events-none mt-2 block h-[86px] w-[86px] rounded-xl'
          }
        />
        <p className={'whitespace-nowrap pt-2 text-[13px] text-b60'}>
          奖品包含：{inviteReward.name}
        </p>
        <ImageButton
          label={
            activityStatus.isActivityStarted
              ? activityStatus.isActivityEnded
                ? ButtonLabel.ActivityEnded
                : ButtonLabel.Join
              : ButtonLabel.ActivityNotStart
          }
          className={'mt-6'}
          showAnimateGradient={activityStatus.isActivityInProgress}
          disabled={activityStatus.isActivityNotStartedOrEnded}
          onClick={handleImmediateAccept}
        />
      </div>
      <LoginCard
        open={showLogin}
        onRequestClose={() => setShowLogin(false)}
        onLogin={async () => {
          await join();
        }}
      />
    </>
  );
}

Component.displayName = 'InviteCard';
