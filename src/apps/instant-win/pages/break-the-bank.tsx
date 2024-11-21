import { AnimateTransition } from '@/components';

import BreakTheBankGame from '../games/break-the-bank';

const BreakTheBankPage = () => {
  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <BreakTheBankGame />
    </AnimateTransition>
  );
};

export default BreakTheBankPage;
