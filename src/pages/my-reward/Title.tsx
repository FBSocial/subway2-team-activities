import { memo } from 'react';

const Title = memo((props: { children: string }) => {
  return (
    <div className={'pb-2 pt-5 text-sm font-medium'}>{props.children}</div>
  );
});

Title.displayName = 'Title';

export default Title;
