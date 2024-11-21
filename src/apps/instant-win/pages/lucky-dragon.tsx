import { AnimateTransition } from '@/components';

import LuckyDragonGame from '../games/lucky-dragon';

const LuckyDragonPage = () => {
  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <LuckyDragonGame />
    </AnimateTransition>
  );
};
export default LuckyDragonPage;
