import { DataContext } from '@/contexts';
import { useDlog } from '@/hooks';
import { lazy, Suspense, useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TabItem from './TabItem.tsx';
import TeamIRaised from './team-i-raise/index.tsx';
const TeamIJoined = lazy(() => import('./team-i-joined'));

export function Component() {
  const { data, readableData, reloadData } = useContext(DataContext)!;
  const [query, setQuery] = useSearchParams();
  const tab = parseInt(query.get('tab') ?? '0') ?? 0;
  const dlog = useDlog();

  function setTab(index: number) {
    setQuery(
      (q) => {
        const newQuery = new URLSearchParams(q);
        newQuery.set('tab', index.toString());
        return newQuery;
      },
      { replace: true },
    );
    // 上报：点击我加入的团 tab
    if (index === 1) {
      dlog?.pushMsg({
        event_id: 'dtpk_actv_team',
        event_sub_id: 'click_joined_team',
        user_id: data?.user?.user_id,
      });
    }
    reloadData();
  }

  useEffect(() => {
    if (readableData.isUserGroupStarted) {
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
  }, [dlog, data, readableData.isUserGroupStarted]);

  // 使用 useMemo 来记忆化标签页内容
  const tabContent = useMemo(() => {
    switch (tab) {
      case 0:
        return <TeamIRaised data={data} />;
      case 1:
        return (
          <Suspense fallback={<></>}>
            <TeamIJoined />
          </Suspense>
        );
      default:
        return null;
    }
  }, [tab, data]);

  return (
    <div className={'relative w-full'}>
      <div className="line absolute left-[10%] w-[80%] border-t border-white"></div>
      <div className={'-mt-2 flex h-[50px] items-end'}>
        <TabItem
          selected={tab === 0}
          title="我发起的"
          onClick={() => setTab(0)}
          index={0}
        />
        <TabItem
          selected={tab === 1}
          title="我加入的"
          onClick={() => setTab(1)}
          index={1}
        />
      </div>
      <div className={'h-[246px] rounded-b-[20px] bg-white'}>{tabContent}</div>
    </div>
  );
}

Component.displayName = 'MyTeamCard';
