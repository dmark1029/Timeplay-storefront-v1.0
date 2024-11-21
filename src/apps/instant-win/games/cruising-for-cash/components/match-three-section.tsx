import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useShowBGWithDelay } from '@/apps/instant-win/hooks/useShowBGWithDelay';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { match3TextImg } from '../assets';
import MatchThreeItem from './match-three-item';
import PrizeLotItem from './prize-lot-item';

type MatchThreeSectionProps = {
  className?: string;
};

const MatchThreeSection: React.FC<MatchThreeSectionProps> = ({ className }) => {
  const {
    match3Numbers,
    openMatch3Number,
    isGame,
    hasMatch3Game,
    prizeLotNumbers,
    openPrizeLot,
    match3NumbersStates,
    prizeLotNumbersStates,
    autoPlay,
    revealAnimating,
  } = useGameContext();
  const { scratchMatchGroup, isRevealingAllByGroups } = useAnimationContext();
  const [isMsgVisible, setIsMsgVisible] = useState(false);
  const [backgroundMatchNumberStates, setBackgroundMatchNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);
  const [backgroundPrizeLotNumberStates, setBackgroundPrizeLotNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);
  const mainPrize = prizeLotNumbers[0];

  const allMatch3NumbersAreRevealed = match3NumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  const allPrizeLotNumbersAreRevealed = prizeLotNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );

  const allNumbersAreRevealed = allMatch3NumbersAreRevealed && allPrizeLotNumbersAreRevealed;

  const showBG = useShowBGWithDelay(allNumbersAreRevealed, 800);

  const { playSoundEffect } = useAudioContext();
  const state = match3NumbersStates;
  const previousStateRef = useRef<number[]>([]);

  const handleGameItemClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    if (hasMatch3Game) {
      openMatch3Number(index);
    } else {
      setIsMsgVisible(!isMsgVisible);
    }
  };

  const handlePrizeItemClick = (index: number) => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    if (hasMatch3Game) {
      openPrizeLot(index);
    } else {
      setIsMsgVisible(!isMsgVisible);
    }
  };

  const renderMatchContent = (
    className: string,
    matchStates: InstantWinNumberStates[],
    prizeLotStats: InstantWinNumberStates[],
    clickable: boolean,
  ) => (
    <ul
      className={`flex h-full w-full flex-row items-center justify-center rounded-lg ${className}`}
    >
      <img src={match3TextImg} className='z-[1] ml-2 w-14' alt='match 3' />
      {match3Numbers.map((item, index) => {
        return (
          <MatchThreeItem
            data={item}
            state={matchStates[index] || InstantWinNumberStates.CLOSED}
            onClick={clickable ? () => handleGameItemClick(index) : () => {}}
            key={index}
            index={index}
            allNumbersRevealed={allNumbersAreRevealed}
          />
        );
      })}
      <PrizeLotItem
        data={mainPrize}
        state={prizeLotStats[0] || InstantWinNumberStates.CLOSED}
        onClick={clickable ? () => handlePrizeItemClick(0) : () => {}}
        allNumbersRevealed={allNumbersAreRevealed}
      />
    </ul>
  );

  const hideBackgroundNumbers = () => {
    return !scratchMatchGroup || !isRevealingAllByGroups;
  };

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchMatchGroup) {
      setBackgroundMatchNumberStates(match3NumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundMatchNumberStates((prev) => {
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

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchMatchGroup) {
      setBackgroundPrizeLotNumberStates(prizeLotNumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundPrizeLotNumberStates((prev) => {
        if (!prev) {
          return prizeLotNumbersStates;
        }
        const updatedStates = prev.map((state, index) => {
          if (state === InstantWinNumberStates.CLOSED) {
            return state;
          }
          return prizeLotNumbersStates[index] !== undefined ? prizeLotNumbersStates[index] : state;
        });

        return updatedStates;
      });
    }
  }, [prizeLotNumbersStates]);

  useEffect(() => {
    if (isMsgVisible && hasMatch3Game) {
      setIsMsgVisible(false);
    }
  }, [hasMatch3Game]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isMsgVisible) {
      timeout = setTimeout(() => {
        setIsMsgVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isMsgVisible]);

  useEffect(() => {
    // Checks when match 3 win occurs, and only triggers the audio once

    if (
      state.every((icon) => icon === InstantWinNumberStates.SMALL_WIN) &&
      !previousStateRef.current.every((icon) => icon === InstantWinNumberStates.SMALL_WIN)
    ) {
      playSoundEffect(Sfx.CFC_MATCH3);
    }

    previousStateRef.current = state;
  }, [state, playSoundEffect]);

  return (
    <motion.div
      animate={{ scale: hasMatch3Game ? [1, 1.2, 1] : 1, x: isMsgVisible ? [0, 5, -5, 0] : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        `relative flex h-20 grow items-center justify-around rounded-xl border-4 border-red-600 bg-white`,
        !isGame && ' opacity-50',
        hasMatch3Game || 'grayscale',
        className,
      )}
    >
      <ContainerMsg isVisible={isMsgVisible} />
      <div className='relative h-full w-full'>
        {/* background numbers */}
        {renderMatchContent(
          cn('absolute z-0 right-0', hideBackgroundNumbers() ? 'hidden' : ''),
          backgroundMatchNumberStates || [],
          backgroundPrizeLotNumberStates || [],
          false,
        )}
        {/* foreground numbers */}
        {renderMatchContent(
          cn(
            'z-[1] right-0',
            isRevealingAllByGroups && scratchMatchGroup && 'cfc-match-numbers-scratch-mask',
            showBG ? 'bg-salmon' : 'bg-white',
          ),
          match3NumbersStates,
          prizeLotNumbersStates,
          true,
        )}
      </div>
    </motion.div>
  );
};

export default MatchThreeSection;

type ContainerMsgProps = {
  isVisible: boolean;
};

const ContainerMsg: React.FC<ContainerMsgProps> = ({ isVisible }) => {
  return (
    <AnimatePresence mode='popLayout'>
      {isVisible && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md bg-neutral-600/90 py-1 font-tempo text-xs font-bold uppercase text-white'
        >
          Increase Stake to Unlock Feature
        </motion.h1>
      )}
    </AnimatePresence>
  );
};
