import RewardLightImage from '@/assets/light.svg';
import { DataContext } from '@/contexts/data-context.ts';
import { useDlog } from '@/hooks';
import { ActivityDataUtils, inMiniprogram } from '@/utils';
import { useRequest } from 'ahooks';
import { useContext, useEffect, useMemo } from 'react';
import Api, { Reward, Task } from '../services/api';
import ImageButton, { ButtonLabel } from './ImageButton.tsx';

export default function RewardModal({
  reward,
  buttonLabel,
  onConfirm,
  task,
}: {
  task: Task;
  reward: Reward;
  buttonLabel?: ButtonLabel;
  onConfirm: (cdKey?: string, isStartTeam?: boolean) => void;
}) {
  const dlog = useDlog();
  const { data } = useContext(DataContext)!;
  const { data: giftRecords } = useRequest(
    async () => {
      if (inMiniprogram) {
        await Api.receiveTaskRewards(task.task_id);
        return Api.getGiftRecord();
      }
    },
    {
      retryCount: -1,
      staleTime: 510,
      cacheKey: 'my-recipe-reward-data',
    },
  );

  const cdKey = useMemo(() => {
    return ActivityDataUtils.findCdKeyByGiftId(giftRecords, reward.gift_id);
  }, [giftRecords, reward.gift_id]);

  const activityConfig = useMemo(() => {
    const defaultConfig = {
      reward_modal_inner_text_content: '',
      reward_modal_outer_text_content: '',
    };

    if (!data?.config) {
      return defaultConfig;
    }

    const config = data.config;
    const innerTextContent = cdKey
      ? config.reward_modal_inner_text_content?.replace(
          /\{\s*cdKey\s*\}/g,
          cdKey,
        )
      : '';

    return {
      ...defaultConfig,
      ...config,
      reward_modal_inner_text_content: innerTextContent,
    };
  }, [data, cdKey]);

  const startTeam = useMemo(() => data?.user?.step > 0, [data?.user]);

  const ButtonLabelText = useMemo(() => {
    if (inMiniprogram) {
      return startTeam
        ? ButtonLabel.CopyRedeemCode
        : (buttonLabel ?? ButtonLabel.CopyRedeemCode);
    } else {
      return ButtonLabel.Receive;
    }
  }, [startTeam, buttonLabel]);

  useEffect(() => {
    if (inMiniprogram && cdKey) {
      dlog?.pushMsg({
        user_id: data?.user?.user_id,
        event_id: 'dtpk_actv_team',
        event_sub_id: 'click_invite_reward',
        event_sub_param: task?.extra_data?.invite_num,
        ext_json: {
          reward_code: cdKey,
          reward_content: reward.name,
          leader_user_id: data?.user?.user_id,
        },
      });
    }
  }, [cdKey, dlog, reward.name, task, data?.user?.user_id]);

  if (inMiniprogram && !giftRecords) return null;
  if (!data || !data.config) return null;

  return (
    <>
      <div className="relative">
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2">
          <img
            src={RewardLightImage}
            className="pointer-events-none h-[300px] w-[300px] max-w-none animate-[spin_4s_linear_infinite]"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
        <img
          src={reward.img}
          className="pointer-events-none relative mt-[65px] h-[120px] w-[120px]"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          alt=""
        />
      </div>

      <p className="whitespace-nowrap pt-2 text-[13px] text-b60">
        奖品包含：{reward.name}
      </p>

      {inMiniprogram ? (
        !cdKey ? (
          <p className="h-[56px] pt-6 text-center text-[13px] text-b60">
            加载中...
          </p>
        ) : (
          <p
            className="h-[56px] whitespace-nowrap pt-2 text-center text-[13px] text-b60"
            dangerouslySetInnerHTML={{
              __html: activityConfig.reward_modal_inner_text_content,
            }}
          ></p>
        )
      ) : (
        <p
          className="pt-3 text-center text-[16px] text-b95"
          dangerouslySetInnerHTML={{
            __html: activityConfig.reward_modal_outer_text_content,
          }}
        ></p>
      )}
      <ImageButton
        label={ButtonLabelText}
        showAnimateGradient={true}
        className="copy-redeem-code mx-[5px] mb-[30px] mt-6"
        data-clipboard-text={cdKey}
        onClick={() => {
          if (inMiniprogram) {
            onConfirm(cdKey, startTeam);
          } else {
            onConfirm();
          }
        }}
      />
    </>
  );
}
