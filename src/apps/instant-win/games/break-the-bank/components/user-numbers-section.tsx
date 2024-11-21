import { useEffect, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import UserNumbersItem from './user-numbers-item';

interface UserNumbersSectionProps {
  className?: string;
  shineIndex?: number;
}

const UserNumbersSection: React.FC<UserNumbersSectionProps> = ({ className, shineIndex }) => {
  const { userNumbers, openUserNumber, isGame, userNumbersStates, autoPlay, revealAnimating } =
    useGameContext();
  const { scratchUserNumbersGroup, isRevealingAllByGroups } = useAnimationContext();

  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);
  const userSymbols = userNumbers.slice(0, 12);

  const hideBackgroundNumbers = () => {
    return !scratchUserNumbersGroup || !isRevealingAllByGroups;
  };

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
    openUserNumber(index);
  };

  const renderUserNumbersContent = (
    className: string,
    states: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul
      className={`grid h-auto w-full grid-cols-4 grid-rows-3 place-items-center gap-4 sm-h:gap-0 sm-h:px-1 sm-h:pb-0 sm-h:pt-0 md-h:gap-4 md-h:pb-4 md-h:pt-4 ${className}`}
    >
      {userSymbols.map((number, index) => {
        return (
          <UserNumbersItem
            data={number}
            onClick={() =>
              handleClick(clickable, states[index] || InstantWinNumberStates.CLOSED, index)
            }
            key={number.number_id}
            index={index}
            state={states[index] || InstantWinNumberStates.CLOSED}
            animated={shineIndex === index}
          />
        );
      })}
    </ul>
  );

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
    <div
      className={cn(
        `relative flex w-full flex-col flex-wrap items-center justify-center`,
        !isGame && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <p className='dondDefaultText text-center align-middle text-xs uppercase text-yellow-200 lg-h:text-sm'>
        Your Cases
      </p>
      {/* background numbers */}
      <div className='relative w-full items-center justify-center'>
        {renderUserNumbersContent(
          cn('absolute z-0 pt-4', hideBackgroundNumbers() && 'hidden'),
          backgroundNumberStates || [],
          false,
        )}
        {/* foreground numbers */}
        {renderUserNumbersContent(
          cn(
            'z-[1] relative pt-4',
            isRevealingAllByGroups && scratchUserNumbersGroup && 'dond-user-numbers-scratch-mask',
          ),
          userNumbersStates || [],
          true,
        )}
      </div>
    </div>
  );
};

export default UserNumbersSection;
