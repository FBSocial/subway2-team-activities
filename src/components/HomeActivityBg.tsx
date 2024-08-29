import type { Activity } from '@/services/api';
import { memo, type Key } from 'react';

const ActivityBgImg = memo(({ config }: { config: Activity['config'] }) => {
  if (!config || !Array.isArray(config.backgrounds)) return null;
  return (
    <div className={'absolute top-0 w-full'}>
      {config.backgrounds.map(
        (url: string | undefined, index: Key | null | undefined) => {
          return (
            <img
              draggable={false}
              key={index}
              src={url}
              alt={''}
              className="pointer-events-none"
            />
          );
        },
      )}
    </div>
  );
});

export default ActivityBgImg;
