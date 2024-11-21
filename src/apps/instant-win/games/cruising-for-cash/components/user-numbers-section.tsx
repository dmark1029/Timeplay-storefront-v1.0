import React, { useEffect, useRef, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useShowBGWithDelay } from '@/apps/instant-win/hooks/useShowBGWithDelay';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import { mySymbolsTextImg } from '../assets';
import UserNumbersItem from './user-numbers-item';

interface UserNumbersSectionProps {
  className?: string;
}

const UserNumbersSection: React.FC<UserNumbersSectionProps> = ({ className }) => {
  const { userNumbers, openUserNumber, isGame, userNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { scratchUserNumbersGroup, isRevealingAllByGroups } = useAnimationContext();
  const mySymbols = userNumbers.slice(0, 12);
  const allNumbersAreRevealed = userNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  // Every n seconds, randomly select a number that is still closed and set its state to PRECOG for m seconds
  // This is a visual effect to simulate a user selecting a number and revealing it

  const [localUserNumbersStates, setLocalUserNumbersStates] = useState(userNumbersStates);
  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);
  const [isPrecog, setIsPrecog] = useState(false);
  const resetTimeout = useRef<NodeJS.Timeout>();
  const showBG = useShowBGWithDelay(allNumbersAreRevealed, 800);

  const handleClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    openUserNumber(index);
  };

  const renderUserNumbersContent = (
    className: string,
    states: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul
      className={cn(
        `grid grid-cols-4 grid-rows-3 place-items-center gap-1 rounded-md transition-all duration-300`,
        !isGame && 'pointer-events-none opacity-50',
        className,
      )}
    >
      {mySymbols.map((number, index) => {
        return (
          <UserNumbersItem
            data={number}
            onClick={clickable ? () => handleClick(index) : () => {}}
            key={index}
            index={index}
            state={states[index] || InstantWinNumberStates.CLOSED}
            allNumbersRevealed={allNumbersAreRevealed}
          />
        );
      })}
    </ul>
  );

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

  useEffect(() => {
    clearTimeout(resetTimeout.current);
    setIsPrecog(false);
    setLocalUserNumbersStates(userNumbersStates);
  }, [userNumbersStates]);

  useEffect(() => {
    if (!isGame) {
      return;
    }
    const interval = setInterval(() => {
      const closedIndexes = localUserNumbersStates.reduce((acc, state, index) => {
        if (state === InstantWinNumberStates.CLOSED) {
          acc.push(index);
        }
        return acc;
      }, [] as number[]);

      if (closedIndexes.length === 0) {
        return;
      }

      const randomIndex = closedIndexes[Math.floor(Math.random() * closedIndexes.length)];
      const newStates = [...localUserNumbersStates];
      newStates[randomIndex] = InstantWinNumberStates.PRECOG;
      setLocalUserNumbersStates(newStates);
      setIsPrecog(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [localUserNumbersStates, isGame]);

  useEffect(() => {
    if (isPrecog) {
      resetTimeout.current = setTimeout(() => {
        const newStates = [...localUserNumbersStates];
        const precogIndex = newStates.findIndex((state) => state === InstantWinNumberStates.PRECOG);
        newStates[precogIndex] = InstantWinNumberStates.CLOSED;
        setLocalUserNumbersStates(newStates);
        setIsPrecog(false);
      }, 2000);
    }
    return () => clearTimeout(resetTimeout.current);
  }, [isPrecog]);

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-start'>
      <img
        src={mySymbolsTextImg}
        className='z-10 mb-1 mt-2 h-4 md-h:mb-2 md-h:mt-3'
        alt='your numbers'
      />

      <div className='relative'>
        {/* background numbers */}
        {renderUserNumbersContent(
          cn('z-0 absolute', hideBackgroundNumbers() ? 'hidden' : '', className),
          backgroundNumberStates || [],
          false,
        )}
        {/* foreground numbers */}
        {renderUserNumbersContent(
          cn(
            'z-[1]',
            className,
            isRevealingAllByGroups && scratchUserNumbersGroup && 'oth-user-numbers-scratch-mask',
            showBG && 'bg-salmon',
          ),
          userNumbersStates,
          true,
        )}
      </div>
    </div>
  );
};

export default UserNumbersSection;
