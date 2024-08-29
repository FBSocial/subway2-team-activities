import Empty from '@/components/Empty';
import { useDlog } from '@/hooks';
import Api, { GiftItemStruct, TaskType } from '@/services/api';
import { useLocalStorageState, useRequest } from 'ahooks';
import { memo, useCallback, useEffect, useMemo } from 'react';
import Title from './Title';

/**
 * @typedef {Object} User
 * @property {string} avatar - 用户头像URL
 * @property {string} userId - 用户ID
 * @property {string} nickname - 用户昵称
 */

/**
 * @typedef {Object} RewardData
 * @property {GiftItemStruct[]} leader - 邀请奖励列表
 * @property {GiftItemStruct[]} member - 回归奖励列表
 */

/**
 * 奖励项组件
 * @param {Object} props
 * @param {GiftItemStruct} props.data - 奖励数据
 */
const Item = memo(({ data }: { data: GiftItemStruct }) => {
  const handleCopy = useCallback(() => {
    fb.setClipboardData(data.extra_data.cdkey);
  }, [data.extra_data.cdkey]);

  return (
    <div className={'space-x-3f relative flex h-[68px] items-center'}>
      <img
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        src={data.gift.img}
        className={'pointer-events-none mr-[12px] h-[46px] w-[46px] rounded-md'}
        alt={data.gift.name}
      />
      <div className={'flex-1 overflow-hidden'}>
        <p className={'text-sm font-semibold text-b/95'}>{data.gift.name}</p>
        <p
          className={
            'overflow-hidden overflow-ellipsis whitespace-nowrap pt-[3px] text-xs'
          }
        >
          兑换码：{data.extra_data.cdkey}
        </p>
      </div>
      <button
        className={
          'h-6 w-[64px] rounded-full border border-[#F94B2D] text-[13px] font-medium text-[#F94B2D]'
        }
        onClick={handleCopy}
      >
        复制
      </button>
      <div
        className={'absolute bottom-0 left-[63px] right-0 h-[0.5px] bg-b/10'}
      />
    </div>
  );
});

/**
 * 奖励列表组件
 * @param {Object} props
 * @param {string} props.title - 奖励类型标题
 * @param {GiftItemStruct[]} props.items - 奖励项列表
 */
const RewardList = memo(
  ({ title, items }: { title: string; items: GiftItemStruct[] }) => (
    <>
      <Title>{title}</Title>
      {items.length === 0 ? (
        <Empty label={`暂无${title}`} />
      ) : (
        items.map((item) => <Item key={item.extra_data.cdkey} data={item} />)
      )}
    </>
  ),
);

/**
 * 我的奖励组件
 */
function MyReward() {
  const dlog = useDlog();
  const [localUser] = useLocalStorageState<{
    avatar: string;
    userId: string;
    nickname: string;
  }>('user');

  const { loading, data: rewardTotalData } = useRequest(
    () => Api.getGiftRecord(),
    {
      retryCount: -1,
      debounceWait: 100,
      staleTime: 3000,
      cacheKey: 'my-recipe-reward-data',
    },
  );

  const data = useMemo(() => {
    if (!rewardTotalData || !Array.isArray(rewardTotalData.lists)) {
      return { leader: [], member: [] };
    }

    return {
      leader: rewardTotalData.lists.filter(
        (t) => t.source_data && t.source_data.type === TaskType.Invite,
      ),
      member: rewardTotalData.lists.filter(
        (t) => t.source_data && t.source_data.type === TaskType.GlobalTask,
      ),
    };
  }, [rewardTotalData]);

  useEffect(() => {
    if (loading || !data || !localUser) return;
    data.leader.forEach((item) => {
      dlog?.pushMsg({
        event_id: 'dtpk_actv_team',
        event_sub_id: 'show_join_reward',
        event_sub_param: data.member.length,
        ext_json: {
          leader_user_id: localUser.userId,
          reward_code: item.extra_data.cdkey,
          reward_content: item.gift.name,
        },
      });
    });
  }, [data, dlog, loading, localUser]);

  if (loading) {
    return <LoadingPlaceholder />;
  }

  return (
    <div>
      <div className={'w-full rounded-[15px] bg-white pb-5'}>
        <RewardList title="邀请奖励：" items={data.leader} />
        <RewardList title="回归奖励：" items={data.member} />
      </div>
    </div>
  );
}

/**
 * 加载占位组件
 */
const LoadingPlaceholder = () => (
  <div className={'animate-pulse'}>
    <div className={'my-3 h-5 w-[98px] rounded-[5px] bg-b/5'} />
    {[1, 2, 3].map((_, i) => (
      <div key={i} className={'flex py-2.5'}>
        <div className={'h-10 w-10 rounded-[10px] bg-b/5'} />
        <div className={'pl-3'}>
          <div className={'h-5 w-[90px] rounded-[5px] bg-b/5'} />
          <div className={'mt-1.5 h-4 w-[170px] rounded bg-b/5'} />
        </div>
      </div>
    ))}
  </div>
);

export default MyReward;
