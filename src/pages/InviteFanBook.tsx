import InviteFanBookBadge from '@/assets/invite_fanbook_badge.svg';
import InviteFanBookBg from '@/assets/invite_fanbook_bg.svg';
import InviteFanBookFooter from '@/assets/invite_fanbook_footer.svg';
import { installOpenInstall, openInFanbook } from '@/openinstall_install.ts';
import { H5PageResponse } from '@/services/api';
import { inMiniprogram } from '@/utils';
import { useDebounceFn } from 'ahooks';
import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

if (!inMiniprogram) {
  installOpenInstall();
}

export function Component() {
  const inviteData = useLoaderData() as H5PageResponse['data'] & {
    invite_code: string;
  };

  const { guild } = inviteData;
  const [loading, setLoading] = useState(false);

  const handleWakeUpApp = () => {
    if (!window?.openInstall) return;
    const clientParams = {
      path: '/subway-team-activities/team',
      code: inviteData?.invite_code,
      guildId: guild?.guild_id,
    };
    openInFanbook(clientParams);
  };

  useEffect(() => {
    setLoading(true);
    const st = setTimeout(() => {
      clearTimeout(st);
      setLoading(false);
    }, 1500);
  }, []);

  const { run } = useDebounceFn(handleWakeUpApp, {
    wait: 500,
  });

  return (
    <div
      className={
        'invite-fanbook-page relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[20px] px-[31.5px]'
      }
      style={{
        backgroundImage: `url(${InviteFanBookBg})`,
        objectFit: 'cover',
      }}
    >
      <div className="invite-card mt-[98px] flex h-[450px] w-[312px] flex-col items-center justify-start overflow-hidden rounded-[20px] bg-white shadow-[0_4px_15px_0_rgba(236,236,236,0.15)]">
        <div className="relative">
          <img
            src={guild?.banner}
            alt=""
            draggable={false}
            className="game-banner pointer-events-none h-[157px] w-[312px]"
          />
          <img
            src={guild?.icon}
            alt=""
            className={
              'avatar ml-2/4 pointer-events-none absolute left-2/4 h-[90px] w-[90px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] bg-white p-[5px] shadow-[0_0_11px_0_rgba(0,0,0,0.15)]'
            }
            draggable={false}
          />
        </div>
        <div className="title flex items-center justify-center pt-[57px]">
          <div className="text-[20px] font-medium">{guild?.name}</div>
          <img
            className="green-star pointer-events-none ml-1 h-[16px] w-[30px] border-none"
            draggable={false}
            onDragStart={(e) => e.preventDefault()} // 禁用拖动
            onContextMenu={(e) => e.preventDefault()} // 禁用右键菜单
            alt=""
            src={InviteFanBookBadge}
          />
        </div>
        <div className="member-counter pt-3 text-center text-[13px] text-b95">
          {guild?.memberNum} 位成员
        </div>
        {loading ? (
          <div className="mb-[40px] mt-[90px] h-[45px] w-[270px] cursor-pointer rounded-[22.5px] bg-blue text-center text-[18px] font-medium leading-[45px] text-white">
            加载中...
          </div>
        ) : (
          <div
            className="mb-[40px] mt-[90px] h-[45px] w-[270px] cursor-pointer rounded-[22.5px] bg-blue text-center text-[18px] font-medium leading-[45px] text-white"
            onClick={run}
          >
            接受邀请
          </div>
        )}
      </div>
      <div>
        <div
          className="logo h-[36px] w-[106px]"
          style={{
            backgroundImage: `url(${InviteFanBookFooter})`,
            objectFit: 'cover',
          }}
        ></div>
        <div className="black-line mb-[21px] mt-6 h-[4.5px] w-[118px] rounded-[1.25px] bg-[#1F2126]"></div>
      </div>
    </div>
  );
}

Component.displayName = 'InviteFanBook';
