import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import MatchThreeItem from './match-three-item';

type MatchThreeSectionProps = {
  className?: string;
  shineIndex?: number;
};

const MatchThreeSection: React.FC<MatchThreeSectionProps> = ({ className, shineIndex }) => {
  const {
    match3Numbers,
    openMatch3Number,
    isGame,
    hasMatch3Game,
    match3NumbersStates,
    formatPrize,
    autoPlay,
    revealAnimating,
  } = useGameContext();
  const { playSoundEffect } = useAudioContext();
  const { scratchMatchGroup, isRevealingAllByGroups } = useAnimationContext();

  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const state = match3NumbersStates;

  const isWinner = !!match3Numbers[0]?.winner;
  const allNumbersRevealed = match3NumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const winAmount = '$' + formatPrize((parseFloat(match3Numbers[0]?.prize?.value) || 0) / 100);

  const previousStateRef = useRef<number[]>([]);

  const hideBackgroundNumbers = () => {
    return !scratchMatchGroup || !isRevealingAllByGroups;
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
    openMatch3Number(index);
  };

  const renderMatchNumbersContent = (
    className: string,
    states: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul
      className={clsx(
        'bottom-1.5 flex h-20 w-full items-center justify-evenly rounded-lg bg-black sm-h:h-16 md-h:h-20 lg-h:h-[92px]',
        className,
      )}
      aria-label={!hasMatch3Game ? 'Inactive Match 3 Game' : 'Match 3 Game Active'}
    >
      {match3Numbers.map((item, index) => {
        return (
          <MatchThreeItem
            data={item}
            onClick={() =>
              handleClick(clickable, states[index] || InstantWinNumberStates.CLOSED, index)
            }
            key={item.number_id}
            state={states[index] || InstantWinNumberStates.CLOSED}
            animated={shineIndex === index}
          />
        );
      })}
    </ul>
  );

  useEffect(() => {
    // Checks when match 3 win occurs, and only triggers the audio once

    if (
      state.every((icon) => icon === InstantWinNumberStates.SMALL_WIN) &&
      !previousStateRef.current.every((icon) => icon === InstantWinNumberStates.SMALL_WIN)
    ) {
      playSoundEffect(Sfx.DOND_MATCH_3);
    }

    previousStateRef.current = state;
  }, [state, playSoundEffect]);

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchMatchGroup) {
      setBackgroundNumberStates(match3NumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundNumberStates((prev) => {
        if (!prev) {
          return match3NumbersStates;
        }
        const updatedStates = prev.map((state, index) => {
          if (state === InstantWinNumberStates.CLOSED) {
            return state;
          }
          return match3NumbersStates[index] !== undefined ? match3NumbersStates[index] : state;
        });

        return updatedStates;
      });
    }
  }, [match3NumbersStates]);

  return (
    <motion.div
      animate={{ scale: hasMatch3Game ? [1, 1.075, 1] : 1 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'h-full w-full rounded-lg border-2 border-yellow-200 bg-black',
        !isGame && 'pointer-events-none opacity-50',
        hasMatch3Game || 'opacity-50 grayscale',
        className,
      )}
    >
      <div
        className={`h-4.5 flex w-full justify-center rounded-md rounded-b-none border-1 border-yellow-300 bg-gradient-to-r from-yellow-300 from-10% via-yellow-200 via-50% to-yellow-300 to-90% lg-h:h-7`}
      >
        <p className='dondDefaultText pb-1.5 text-xs uppercase'>Match 3</p>
      </div>
      <div className={cn('relative')}>
        {allNumbersRevealed && (
          <p className='dondMatch3Overlay dondDefaultText visible absolute bottom-1.5 z-20 flex h-full w-full items-center justify-center rounded-md bg-transparent/70 px-2 text-center text-sm uppercase text-amber-200'>
            {isWinner ? `You won ${winAmount}` : 'No win'}
          </p>
        )}
        {/* background numbers */}
        {renderMatchNumbersContent(
          cn('absolute z-0', hideBackgroundNumbers() && 'hidden'),
          backgroundNumberStates || [],
          false,
        )}
        {/* foreground numbers */}
        {renderMatchNumbersContent(
          cn(
            'relative z-[1]',
            isRevealingAllByGroups && scratchMatchGroup && 'dond-match-numbers-scratch-mask',
          ),
          match3NumbersStates || [],
          true,
        )}
      </div>
    </motion.div>
  );
};

export default MatchThreeSection;
