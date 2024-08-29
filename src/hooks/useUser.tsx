import FbApi, { IUserInfo } from '@/services/FbApi';
import { inMiniprogram } from '@/utils';
import { useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';

let localUser: IUserInfo | null = null;

export function useUser() {
  const [user, setUser] = useState<IUserInfo | null>(localUser);
  const [userInStorage] = useLocalStorageState<IUserInfo>('user', {
    listenStorageChange: true,
  });

  useEffect(() => {
    if (user) return;
    if (userInStorage) return;

    if (inMiniprogram) {
      FbApi.getUserInfo().then((user) => {
        localUser = user;
        setUser(user);
      });
    }
  }, [user, userInStorage]);

  return { user: user ?? userInStorage, setUser };
}
