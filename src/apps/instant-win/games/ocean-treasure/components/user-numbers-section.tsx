import React, { useEffect, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useShowBGWithDelay } from '@/apps/instant-win/hooks/useShowBGWithDelay';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../../../styles.css';
import '../animation-code/animations.css';
import { mySymbolsBgImg, mySymbolsTextImg } from '../assets';
import UserNumbersItem from './user-numbers-item';

interface UserNumbersSectionProps {
  className?: string;
}

const UserNumbersSection: React.FC<UserNumbersSectionProps> = ({ className }) => {
  const {
    userNumbers,
    openUserNumber,
    isGame,
    userNumbersStates,
    autoPlay,
    revealAnimating,
    alluserNumbersRevealed,
  } = useGameContext();
  const { scratchUserNumbersGroup, isRevealingAllByGroups } = useAnimationContext();

  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const showBG = useShowBGWithDelay(alluserNumbersRevealed, 800);

  const allNumbersRevealed = userNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openUserNumber(index);
  };

  const hideBackgroundNumbers = () => {
    return !scratchUserNumbersGroup || !isRevealingAllByGroups;
  };

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchUserNumbersGroup) {
      setBackgroundNumberStates(userNumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundNumberStates((prev) => {
        if (!prev) {
          return userNumbersStates;
        }
        const updatedStates = prev.map((state, index) => {
          if (state === InstantWinNumberStates.CLOSED) {
            return state;
          }
          return userNumbersStates[index] !== undefined ? userNumbersStates[index] : state;
        });

        return updatedStates;
      });
    }
  }, [userNumbersStates]);

  return (
    <div className={`relative flex h-full w-full justify-center`}>
      <img src={mySymbolsBgImg} className='absolute inset-0 -z-20 h-full w-full' alt='' />
      <img
        src={mySymbolsTextImg}
        className='absolute -top-6 z-10 h-12 md-h:-top-6 md-h:h-12 '
        alt='Your Symbols'
      />

      {/* background numbers used for scratch mask*/}
      <ul
        className={cn(
          `absolute grid h-full w-full grid-cols-4 grid-rows-3 place-items-center gap-0.5 rounded-md p-2 transition-all duration-300`,
          hideBackgroundNumbers() && 'hidden',
          className,
        )}
      >
        {userNumbers.map((number, index) => {
          return (
            <UserNumbersItem
              data={number}
              onClick={() => {}}
              key={index}
              index={index}
              state={backgroundNumberStates?.[index] || InstantWinNumberStates.CLOSED}
              allNumbersRevealed={allNumbersRevealed}
            />
          );
        })}
      </ul>
      <ul
        className={cn(
          `relative grid h-full w-full grid-cols-4 grid-rows-3 place-items-center gap-0.5 rounded-md p-2 transition-all duration-300 `,
          showBG && 'bg-salmon',
          isRevealingAllByGroups && scratchUserNumbersGroup && 'oth-user-numbers-scratch-mask',
          !isGame && 'pointer-events-none opacity-50',
          className,
        )}
        aria-label='List of your symbols'
      >
        {userNumbers.map((number, index) => {
          return (
            <UserNumbersItem
              data={number}
              onClick={() => handleClick(index)}
              key={index}
              index={index}
              state={userNumbersStates[index]}
              allNumbersRevealed={allNumbersRevealed}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default UserNumbersSection;
