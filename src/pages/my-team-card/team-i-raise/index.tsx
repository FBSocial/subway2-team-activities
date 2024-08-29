import { useDlog } from '@/hooks';
import { type Activity } from '@/services/api';
import FbApi from '@/services/FbApi';
import { ActivityDataUtils, inMiniprogram } from '@/utils';
import ClipboardJS from 'clipboard';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TeamIRaiseProgress from './team-i-raise-progress';
import TeamIRaiseBefore from './TeamIRaiseBefore';

interface TeamIRaisedProps {
  data: Activity;
}

export default function TeamIRaised({ data }: TeamIRaisedProps) {
  const dlog = useDlog();
  const [search] = useSearchParams();

  const { invitationsMatchRewards, activityStatus } =
    ActivityDataUtils.summarizeActivityData(data);

  // 从被邀请页面跳转过来，需要直接到 step 1，会通过 search 参数传递
  // 其他正常情况就根据数据里的 user.step 字段决定
  const [step, setStep] = useState(() => {
    const step = data.user?.step ?? 0;
    if (search.has('step')) {
      const stepFromSearch = parseInt(search.get('step') ?? '0');
      if (isNaN(stepFromSearch)) return step;
      else return stepFromSearch;
    }
    return step;
  });

  // 站外用 Clipboard.js 复制邀请链接，站内会调用 Native API。
  useEffect(() => {
    if (invitationsMatchRewards) return;
    let clipboard: ClipboardJS;
    if (!inMiniprogram && activityStatus.isActivityInProgress) {
      clipboard = new ClipboardJS('.copy-invite-link');
      clipboard.on('success', () => {
        FbApi.toast('邀请链接复制成功\n快去邀请好友吧');
      });
    }
    return () => {
      clipboard?.destroy();
    };
  }, [invitationsMatchRewards, activityStatus]);

  const handleSetInviteUsers = () => {
    setStep(1);
    dlog?.pushMsg({
      user_id: data?.user?.user_id,
      event_id: 'dtpk_actv_team',
      event_sub_id: 'click_initiating_team',
      event_sub_param: 'initiating_team',
    });
  };

  if (!data) return null;

  if (step === 0) {
    return <TeamIRaiseBefore onClick={handleSetInviteUsers} data={data} />;
  }

  // 我发起的团有两个步骤，第一步是发起组团，第二部是展示进度
  // 此为第二步页面

  return <TeamIRaiseProgress data={data} />;
}
