import { AutoAdaptBox } from '@/components/AutoAdaptBox';
import ActivityBgImg from '@/components/HomeActivityBg';
import RuleSheet from '@/components/RuleSheet.tsx';
import StickyButton from '@/components/StickyButton.tsx';
import TestLogout from '@/components/TestLogout.tsx';
import { DataContext } from '@/contexts';
import { ModalProvider } from '@/contexts/modal';
import { useDlog } from '@/hooks';
import { useRewardModalSheet } from '@/hooks/use-reward-modal-sheet';
import Api from '@/services/api';
import { ActivityDataUtils, inMiniprogram } from '@/utils';
import { useRequest } from 'ahooks';
import { useCallback, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../App.css';
import './home.css';

function Home() {
  const [isRuleOpened, setIsRuleOpened] = useState(false);
  const { openRewardModalSheet } = useRewardModalSheet();
  const dlog = useDlog();

  const { data, runAsync: reloadData } = useRequest(
    async () => await Api.getActivity('invite_joined,my_invite'),
    {
      debounceWait: 510,
    },
  );

  const handleViewRules = useCallback(() => {
    setIsRuleOpened(true);
    dlog?.pushMsg({
      user_id: data?.user?.user_id,
      event_id: 'dtpk_actv_team',
      event_sub_id: 'click_initiating_team_info',
    });
  }, [data?.user?.user_id, dlog]);

  const dataContextValue = useMemo(() => {
    if (!data) return null;
    const readableData = ActivityDataUtils.summarizeActivityData(data);
    return {
      data,
      reloadData,
      readableData,
    };
  }, [data, reloadData]);

  if (!data?.config) return null;

  return (
    <DataContext.Provider value={dataContextValue}>
      <ModalProvider>
        <ActivityBgImg config={data.config} />

        <div className={'absolute left-0 right-0 top-[361px]'}>
          <AutoAdaptBox>
            <Outlet />
          </AutoAdaptBox>
        </div>

        <StickyButton
          label={'规则'}
          className={'absolute right-0 top-[47px]'}
          onClick={handleViewRules}
        />
        {inMiniprogram && (
          <StickyButton
            label={'奖励'}
            className={'absolute right-0 top-[109px]'}
            onClick={openRewardModalSheet}
          />
        )}
        <RuleSheet
          isOpen={isRuleOpened}
          onClose={() => setIsRuleOpened(false)}
          title={data.title ?? ''}
          rule={data.description ?? ''}
        />

        <TestLogout />
      </ModalProvider>
    </DataContext.Provider>
  );
}

export default Home;
