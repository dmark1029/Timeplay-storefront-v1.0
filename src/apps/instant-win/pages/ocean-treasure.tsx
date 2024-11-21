import { AnimateTransition } from '@/components';

import OceanTreasureGame from '../games/ocean-treasure';

const OceanTreasurePage = () => {
  return (
    <AnimateTransition initial={true} className='h-full w-full' duration={0.5}>
      <OceanTreasureGame />
    </AnimateTransition>
  );
};
export default OceanTreasurePage;
