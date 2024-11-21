import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import seedrandom from 'seedrandom';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { useShowBGWithDelay } from '@/apps/instant-win/hooks/useShowBGWithDelay';
import { InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { match3SymbolsBgImg, match3TextImg } from '../assets';
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

  const allMatch3Revealed = match3NumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const allPrizeLotRevealed = prizeLotNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const allRevealed = allMatch3Revealed && allPrizeLotRevealed;

  const possibleImages = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let mainPrize = match3Numbers[0];
  if (prizeLotNumbers.length > 0) {
    mainPrize = prizeLotNumbers[0];
  }
  const imgs: Map<string, number> = new Map();
  const seed = mainPrize.number_id;
  const random = seedrandom(seed);

  const showBG = useShowBGWithDelay(allRevealed, 800);

  for (let i = 0; i < match3Numbers.length; i++) {
    const randomIndex = Math.floor(random() * possibleImages.length);
    imgs.set(match3Numbers[i].prize_id, possibleImages[randomIndex]);
    possibleImages.splice(randomIndex, 1);
  }

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

  return (
    <motion.div
      animate={{ scale: hasMatch3Game ? [1, 1.3, 1] : 1, x: isMsgVisible ? [0, 5, -5, 0] : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        `relative flex h-full w-full items-center justify-end  `,
        hasMatch3Game || 'grayscale',
        className,
      )}
    >
      <ContainerMsg isVisible={isMsgVisible} />
      <img
        src={match3TextImg}
        className='absolute left-[9%] z-10 aspect-auto h-[4.5rem] -translate-x-1/2 translate-y-1 md-h:h-[5.2rem] '
        alt='Match 3'
        role='heading'
        aria-level={2}
      />
      <img src={match3SymbolsBgImg} className='absolute -z-10 h-14 w-[85%] md-h:h-[4rem]' alt='' />
      {/* background numbers used for scratch mask*/}
      <ul
        className={clsx(
          'absolute flex h-14 w-full flex-row items-center justify-center pl-[25%] transition-all duration-300 ease-in-out md-h:h-[4rem]',
          hideBackgroundNumbers() && 'hidden',
        )}
        aria-label={!hasMatch3Game ? 'Inactive Match 3 Game' : 'Match 3 Game'}
      >
        {match3Numbers.map((item, index) => {
          return (
            <MatchThreeItem
              data={item}
              onClick={() => {}}
              key={index}
              index={index}
              iconIndex={imgs.get(item.prize_id) || 0}
              state={backgroundMatchNumberStates?.[index] || InstantWinNumberStates.CLOSED}
              allNumbersRevealed={allRevealed}
            />
          );
        })}
        <PrizeLotItem
          data={mainPrize}
          state={backgroundPrizeLotNumberStates?.[0] || InstantWinNumberStates.CLOSED}
          onClick={() => {}}
          allNumbersRevealed={allRevealed}
        />
      </ul>

      <ul
        className={clsx(
          'flex h-14 w-full flex-row items-center justify-center pl-[25%] transition-all duration-300 ease-in-out md-h:h-[4rem]',
          showBG && 'rounded-md bg-salmon',
          isRevealingAllByGroups && scratchMatchGroup && 'oth-match-numbers-scratch-mask',
          !isGame && 'opacity-50',
        )}
        aria-label={!hasMatch3Game ? 'Inactive Match 3 Game' : 'Match 3 Game'}
      >
        {match3Numbers.map((item, index) => {
          return (
            <MatchThreeItem
              data={item}
              onClick={() => handleGameItemClick(index)}
              key={index}
              index={index}
              iconIndex={imgs.get(item.prize_id) || 0}
              state={match3NumbersStates[index]}
              allNumbersRevealed={allRevealed}
            />
          );
        })}
        <PrizeLotItem
          data={mainPrize}
          state={prizeLotNumbersStates[0]}
          onClick={() => handlePrizeItemClick(0)}
          allNumbersRevealed={allRevealed}
        />
      </ul>
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
          className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md bg-neutral-600/50 py-1 pl-[20%] font-tempo text-xs font-bold uppercase text-white'
        >
          Increase Stake to Unlock Feature
        </motion.h1>
      )}
    </AnimatePresence>
  );
};
