import { memo, useLayoutEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import SheetHeader from './SheetHeader.tsx';

const RuleSheet = memo(
  ({
    isOpen,
    onClose,
    rule,
    title,
  }: {
    title: string;
    rule: string;
    isOpen: boolean;
    onClose: () => void;
  }) => {
    useLayoutEffect(() => {
      if (isOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }

      // Cleanup function to remove the class when the component unmounts
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }, [isOpen]);

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
              <div
                className={
                  'flex-1 overflow-y-auto whitespace-pre-line py-[18px] text-b60'
                }
              >
                {rule}
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onTap={onClose} />
      </Sheet>
    );
  },
);
export default RuleSheet;
