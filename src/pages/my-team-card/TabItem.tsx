import clsx from 'clsx';

export default function TabItem(props: {
  selected: boolean;
  title: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <div
      className={clsx([
        'flex-1 cursor-pointer select-none overflow-hidden text-center font-medium transition-all',
        props.selected
          ? 'h-[50px] rounded-t-[20px] bg-white text-[18px] text-lg leading-[50px] text-b95'
          : 'h-[42px] text-[16px] leading-[42px] text-b60',
        !props.selected && props.index === 0
          ? 'rounded-tl-[20px] border border-r-0 border-white'
          : 'rounded-tr-[20px] border border-l-0 border-white',
      ])}
      onClick={props.onClick}
    >
      {props.title}
    </div>
  );
}
