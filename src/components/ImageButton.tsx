import ActivityEndedImage from '@/assets/activity_ended.svg';
import ActivityNotStartImage from '@/assets/activity_not_started.svg';
import GetMoreRewardsImage from '@/assets/get_more_rewards.svg';
import InviteImage from '@/assets/invite.svg';
import JoinImage from '@/assets/join.svg';
import RaiseImage from '@/assets/raise_now.svg';
import RaiseTeamImage from '@/assets/raise_team.svg';
import ReceiveImage from '@/assets/receive.svg';
import ReceiveRewardsImage from '@/assets/receive_rewards.svg';
import ViewAllRewardsImage from '@/assets/view_all_rewards.svg';
import ViewRewardsImage from '@/assets/view_rewards.svg';

import CopyRedeemCodeImage from '@/assets/copy_redeem_code.svg';
import { useDebounceFn } from 'ahooks';
import clsx from 'clsx';
import React, { useMemo } from 'react';

export enum ButtonLabel {
  Join,
  // 立即发起
  RaiseNow,
  // 发起组团
  RaiseTeam,
  // 邀请好友成团
  Invite,
  // 复制兑换码
  CopyRedeemCode,
  // 立即领取
  Receive,
  // 获取更多奖励
  GetMoreRewards,
  // 领取奖励
  ReceiveRewards,
  // 查看奖励
  ViewRewards,
  // 活动已结束
  ActivityEnded,
  // 活动未开始
  ActivityNotStart,
  // 查看全部奖励
  ViewAllRewards,
}

export default function ImageButton({
  label,
  className,
  showAnimateGradient,
  disabled,
  onClick,
  ...buttonProps
}: {
  label: ButtonLabel;
  showAnimateGradient?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  let labelImage = '';

  switch (label) {
    case ButtonLabel.Join:
      labelImage = JoinImage;
      break;
    case ButtonLabel.RaiseNow:
      labelImage = RaiseImage;
      break;
    case ButtonLabel.RaiseTeam:
      labelImage = RaiseTeamImage;
      break;
    case ButtonLabel.Invite:
      labelImage = InviteImage;
      break;
    case ButtonLabel.CopyRedeemCode:
      labelImage = CopyRedeemCodeImage;
      break;
    case ButtonLabel.Receive:
      labelImage = ReceiveImage;
      break;
    case ButtonLabel.GetMoreRewards:
      labelImage = GetMoreRewardsImage;
      break;
    case ButtonLabel.ReceiveRewards:
      labelImage = ReceiveRewardsImage;
      break;
    case ButtonLabel.ViewRewards:
      labelImage = ViewRewardsImage;
      break;
    case ButtonLabel.ActivityEnded:
      labelImage = ActivityEndedImage;
      break;
    case ButtonLabel.ActivityNotStart:
      labelImage = ActivityNotStartImage;
      break;
    case ButtonLabel.ViewAllRewards:
      labelImage = ViewAllRewardsImage;
      break;
  }

  const addButtonLoaderEffect = useMemo(() => {
    if (showAnimateGradient && !disabled) {
      return ['relative', 'overflow-hidden', 'loader'];
    }
    return [];
  }, [showAnimateGradient, disabled]);

  const handleClick = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    onClick?.(evt);
  };

  const { run } = useDebounceFn(handleClick, {
    wait: 300,
  });

  return (
    <button
      {...buttonProps}
      className={clsx([
        'h-[50px] w-full rounded-full',
        addButtonLoaderEffect,
        className,
      ])}
      style={{
        background: 'linear-gradient(90deg, #FF8439 6%, #F94B2D 87%)',
      }}
      disabled={disabled}
      onClick={run}
    >
      <img
        onClick={(evt) => evt.stopPropagation()}
        draggable={false}
        src={labelImage}
        alt=""
        className={'pointer-events-none inline-block select-none'}
      />
    </button>
  );
}
