import clsx from 'clsx';

export default function StickyButton(props: {
  label: string;
  className: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={clsx([
        'w-6 cursor-pointer select-none rounded-l-lg border border-white/60 bg-black/50 py-[7px] text-center text-xs text-white',
        props.className,
      ])}
      onClick={props.onClick}
    >
      {props.label}
    </div>
  );
}
