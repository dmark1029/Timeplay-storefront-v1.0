import React, { useEffect, useState } from 'react';

import clsx from 'clsx';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useShowBGWithDelay } from '@/apps/instant-win/hooks/useShowBGWithDelay';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { winningSymbolsBgImg, winningSymbolsTextImg } from '../assets';
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

  const showBG = useShowBGWithDelay(allNumbersRevealed, 800);

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openLuckyNumber(index);
  };

  const hideBackgroundNumbers = () => {
    return !scratchLuckyNumbersGroup || !isRevealingAllByGroups;
  };

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
      className={cn(`relative flex flex-wrap items-center justify-center rounded-md`, className)}
    >
      <img
        src={winningSymbolsTextImg}
        alt='Winning Symbols'
        className='absolute -top-5 z-10 h-10 md-h:-top-4 md-h:h-10'
      />
      <img
        src={winningSymbolsBgImg}
        className='absolute left-0 top-0 -z-20 h-full w-full '
        alt=''
      />

      {/* background numbers used for scratch mask*/}
      <ul
        className={clsx(
          'absolute flex h-16 flex-row justify-around gap-4 rounded-lg px-4 transition-all duration-300 md-h:h-[5.5rem]',
          hideBackgroundNumbers() && 'hidden',
        )}
      >
        {luckyNumbers.slice(0, 3).map((item, index) => (
          <LuckyNumbersItem
            data={item}
            onClick={() => {}}
            key={index}
            index={index}
            state={backgroundNumberStates?.[index] || InstantWinNumberStates.CLOSED}
            allNumbersRevealed={allNumbersRevealed}
          />
        ))}
      </ul>

      <ul
        className={clsx(
          'relative flex h-16 flex-row justify-around gap-4 rounded-lg px-4 transition-all duration-300 md-h:h-[5.5rem]',
          showBG && 'bg-salmon',
          isRevealingAllByGroups && scratchLuckyNumbersGroup && 'oth-lucky-numbers-scratch-mask',
          !isGame && 'pointer-events-none opacity-50',
        )}
      >
        {luckyNumbers.slice(0, 3).map((item, index) => (
          <LuckyNumbersItem
            data={item}
            onClick={() => handleClick(index)}
            key={index}
            index={index}
            state={luckyNumbersStates[index]}
            allNumbersRevealed={allNumbersRevealed}
          />
        ))}
      </ul>
    </div>
  );
};

export default LuckyNumbersSection;
