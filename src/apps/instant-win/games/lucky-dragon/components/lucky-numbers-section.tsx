import React from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { cn } from '@/utils/cn';

// import { cn } from '@/utils/cn';
import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { luckyFlag } from '../assets';
import LuckyNumbersItem from './lucky-numbers-item';

type LuckyNumbersSectionProps = {
  className?: string;
  shineIndex?: number;
};

const LuckyNumbersSection: React.FC<LuckyNumbersSectionProps> = () => {
  const { isGame } = useGameContext();
  const { openLuckyNumber, luckyNumbers, luckyNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openLuckyNumber(index);
  };

  return (
    <div
      className={cn(
        `relative flex w-full flex-col items-center justify-center`,
        !isGame && 'pointer-events-none opacity-50',
      )}
    >
      {/* user numbers header */}
      <div className='lucky-symbols-header mb-2'>
        <p className='text-center align-middle uppercase'>Lucky Symbols</p>
      </div>
      <div className='flex w-[256px] items-center justify-center '>
        {/* background */}
        <img className='absolute w-[256px] max-w-[256px] object-contain' src={luckyFlag} />
        <div className='relative flex h-auto w-full max-w-[256px] flex-nowrap justify-around pb-1'>
          {luckyNumbers
            ?.slice(0, 3)
            ?.map((item, index) => (
              <LuckyNumbersItem
                data={item}
                onClick={() => handleClick(index)}
                key={index}
                state={luckyNumbersStates[index]}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LuckyNumbersSection;
