import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useGameContext } from '@/apps/instant-win/context/game-context';
import { InstantWinNumberStates } from '@/apps/instant-win/types';

import { oneXFlagOpen, redFlagMultiplier } from '../assets';
import { flagMap } from '../util';

type MultiplierSectionProps = {
  className?: string;
};

const MultiplierSection: React.FC<MultiplierSectionProps> = ({ className }) => {
  const {
    genericMultiplier,
    genericMultiplierState,
    openGenericMultiplier,
    autoPlay,
    revealAnimating,
  } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const multiplier = genericMultiplier?.prize?.multiplier || 1;

  const getOpenStateFlag = () => {
    return flagMap[multiplier] || oneXFlagOpen;
  };

  const handleClick = () => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openGenericMultiplier();
  };

  const renderClosedState = (
    <button
      onClick={() => {
        handleClick();
      }}
    >
      <img
        src={redFlagMultiplier}
        className='h-[262px] w-[83.25px] min-w-[83.25px]'
        alt='multiplier'
      />
    </button>
  );

  const renderOpenState = (
    <div className='relative h-[268px] w-[83.25px] min-w-[83.25px] object-contain'>
      <img src={getOpenStateFlag()} className='h-full' alt='multiplier' />
      <p className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center text-3xl font-bold'>
        {genericMultiplier?.prize?.multiplier}x
      </p>
    </div>
  );

  const renderContent = () => {
    switch (genericMultiplierState) {
      case InstantWinNumberStates.CLOSED:
        return renderClosedState;
      default:
        return renderOpenState;
    }
  };

  return <div className={`${className}`}>{renderContent()}</div>;
};
export default MultiplierSection;
