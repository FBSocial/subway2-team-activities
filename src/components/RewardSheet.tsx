import MyReward from '@/pages/my-reward';
import { Sheet } from 'react-modal-sheet';
import SheetHeader from './SheetHeader.tsx';

export default function RewardSheet({
  isOpen,
  onClose,
  title,
}: {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      detent={'content-height'}
      disableDrag={true}
      style={{
        overscrollBehavior: 'contain',
      }}
    >
      <Sheet.Container className={'h-[60vh]'}>
        <SheetHeader onClose={onClose} title={title} />
        <Sheet.Content className={'match-rule px-4 pb-safe'} disableDrag>
          <Sheet.Scroller draggableAt="both">
            <MyReward />
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
