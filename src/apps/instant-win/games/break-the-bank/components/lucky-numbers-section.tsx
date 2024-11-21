import React, { useEffect, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import LuckyNumbersItem from './lucky-numbers-item';

type LuckyNumbersSectionProps = {
  className?: string;
  shineIndex?: number;
};

const LuckyNumbersSection: React.FC<LuckyNumbersSectionProps> = ({ className, shineIndex }) => {
  const { openLuckyNumber, luckyNumbers, isGame, luckyNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { scratchLuckyNumbersGroup, isRevealingAllByGroups } = useAnimationContext();

  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const allNumbersRevealed = luckyNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  const handleClick = (clickable: boolean, state: InstantWinNumberStates, index: number) => {
    if (
      !clickable ||
      (state !== InstantWinNumberStates.CLOSED && state !== InstantWinNumberStates.PRECOG) ||
      autoPlay ||
      revealAnimating ||
      isRevealingAllByGroups
    ) {
      return;
    }
    openLuckyNumber(index);
  };

  const renderLuckyNumbersContent = (
    className: string,
    states: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul
      className={`flex w-full flex-nowrap justify-evenly sm-h:pb-0 sm-h:pt-1.5 md-h:pb-2.5 md-h:pt-4 ${className}`}
    >
      {luckyNumbers.map((item, index) => (
        <LuckyNumbersItem
          data={item}
          onClick={() =>
            handleClick(clickable, states[index] || InstantWinNumberStates.CLOSED, index)
          }
          key={item.number}
          state={states[index] || InstantWinNumberStates.CLOSED}
          animated={shineIndex === index}
          allNumbersRevealed={allNumbersRevealed}
        />
      ))}
    </ul>
  );

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
    <>
      <div className='w-full bg-gradient-to-r from-yellow-300 from-10% via-yellow-100 via-50% to-yellow-300 to-90% p-1 md-h:py-1.5'>
        <p className='dondDefaultText pb-1.5 text-center align-middle text-xs uppercase lg-h:text-sm'>
          Winning Cases
        </p>
      </div>
      <div className='relative bottom-1.5 rounded-t-lg bg-black'>
        <div
          className={cn(
            `flex w-full flex-wrap items-center justify-center rounded-t-lg border-b-1 border-yellow-300 bg-[#3A392D]`,
            !isGame && 'pointer-events-none opacity-50',
            className,
          )}
        >
          {/* background numbers */}
          {renderLuckyNumbersContent(
            cn('absolute z-0', hideBackgroundNumbers() && 'hidden'),
            backgroundNumberStates || [],
            false,
          )}
          {/* foreground numbers */}
          {renderLuckyNumbersContent(
            cn(
              'z-1',
              isRevealingAllByGroups &&
                scratchLuckyNumbersGroup &&
                'dond-lucky-numbers-scratch-mask',
            ),
            luckyNumbersStates || [],
            true,
          )}
        </div>
      </div>
    </>
  );
};

export default LuckyNumbersSection;
