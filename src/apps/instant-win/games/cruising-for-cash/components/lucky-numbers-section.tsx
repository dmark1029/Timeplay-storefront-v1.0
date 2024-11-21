import React, { useEffect, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { luckySymbolsTextImg } from '../assets';
import LuckyNumbersItem from './lucky-numbers-item';

type LuckyNumbersSectionProps = {
  className?: string;
};

const LuckyNumbersSection: React.FC<LuckyNumbersSectionProps> = ({ className }) => {
  const { openLuckyNumber, luckyNumbers, isGame, luckyNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { scratchLuckyNumbersGroup, isRevealingAllByGroups } = useAnimationContext();
  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const allNumbersRevealed = luckyNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  const hideBackgroundNumbers = () => {
    return !scratchLuckyNumbersGroup || !isRevealingAllByGroups;
  };

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openLuckyNumber(index);
  };

  const renderLuckyNumbersContent = (
    className: string,
    states: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul className={`flex items-center justify-center ${className}`}>
      {luckyNumbers.slice(0, 3).map((item, index) => (
        <LuckyNumbersItem
          data={item}
          onClick={clickable ? () => handleClick(index) : () => {}}
          key={index}
          index={index}
          state={states[index] || InstantWinNumberStates.CLOSED}
          allNumbersRevealed={allNumbersRevealed}
        />
      ))}
    </ul>
  );

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchLuckyNumbersGroup) {
      setBackgroundNumberStates(luckyNumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundNumberStates((prev) => {
        if (!prev) {
          return luckyNumbersStates;
        }
        const updatedStates = prev.map((state, index) => {
          if (state === InstantWinNumberStates.CLOSED) {
            return state;
          }
          return luckyNumbersStates[index] !== undefined ? luckyNumbersStates[index] : state;
        });

        return updatedStates;
      });
    }
  }, [luckyNumbersStates]);

  return (
    <div
      className={cn(
        `flex flex-col flex-wrap items-center justify-center rounded-md`,
        !isGame && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <img
        src={luckySymbolsTextImg}
        className='mb-1 mt-2 h-4 md-h:mb-2 md-h:mt-3'
        alt='winning numbers'
      />
      <div className='relative flex flex-col'>
        {renderLuckyNumbersContent(
          cn('absolute z-0', hideBackgroundNumbers() ? 'hidden' : ''),
          backgroundNumberStates || [],
          false,
        )}
        {renderLuckyNumbersContent(
          cn(
            'z-[1]',
            isRevealingAllByGroups && scratchLuckyNumbersGroup
              ? 'cfc-lucky-numbers-scratch-mask'
              : '',
          ),
          luckyNumbersStates,
          true,
        )}
      </div>
    </div>
  );
};

export default LuckyNumbersSection;
