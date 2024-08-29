import Home from '@/pages/Home.tsx';
import Api from '@/services/api';
import {
  isAuthenticatedInMiniprogram,
  isNoTokenNotInMiniprogram,
} from '@/utils/auth-utils';
import { createBrowserRouter, redirect } from 'react-router-dom';

type BrowserRouter = ReturnType<typeof createBrowserRouter>;

const router: BrowserRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: '',
          index: true,
          lazy: () => import('@/pages/RaiseTeamCard'),
          loader: () => {
            if (isAuthenticatedInMiniprogram()) {
              return redirect('/team');
            }
            return null;
          },
        },
        {
          path: 'team',
          lazy: () => import('@/pages/my-team-card'),
          loader: () => {
            if (isNoTokenNotInMiniprogram()) {
              return redirect('/');
            }
            return null;
          },
        },
        {
          path: 'invite/:code',
          lazy: () => import('@/pages/InviteCard'),
          id: 'invite',
          loader: async ({ params }) => {
            try {
              if (!params?.code) {
                console.warn('Missing invite code, redirecting to home');
                return redirect('/');
              }

              return Api.getInvitedInfo(params.code);
            } catch (error) {
              console.error('Error fetching invite info:', error);
              return redirect('/');
            }
          },
        },
      ],
    },
    {
      path: '/invite-join-fanbook',
      lazy: () => import('@/pages/InviteFanBook'),
      id: 'invite-join-fanbook',
      loader: async () => {
        try {
          const { invite } = await Api.getActivity('invite_joined,my_invite');
          if (!invite || !invite.includes('act_')) {
            console.log('邀请链接拿不到，重定向首页');
            return redirect('/');
          }
          const match = invite?.match(/act_\d+/);
          const invite_code = match ? match[0] : '';
          const inviteData = await Api.getInvitePageInfo(invite_code);
          return { ...inviteData, invite_code };
        } catch (error) {
          console.error('Error fetching invite page info:', error);
          return redirect('/');
        }
      },
    },
    {
      path: '*',
      loader: () => redirect('/'),
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default router;
