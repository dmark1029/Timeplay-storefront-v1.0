import { AnimateTransition } from '@/components';

import CruisingForCashGame from '../games/cruising-for-cash';

const CruisingForCashPage = () => {
  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <CruisingForCashGame />
    </AnimateTransition>
  );
};

export default CruisingForCashPage;
