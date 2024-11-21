import { useEffect, useRef, useState } from 'react';

import { announce } from '@react-aria/live-announcer';
import { motion } from 'framer-motion';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumber, InstantWinNumberStates } from '@/apps/instant-win/types';
import { FeatureFlags } from '@/apps/instant-win/types';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { bankersHandleShake, bankersPhone, bankersSpot, bonusSpotBg } from '../assets';

type BonusNumberSectionProps = {
  className?: string;
};

const BonusNumberSection: React.FC<BonusNumberSectionProps> = ({ className = '' }) => {
  const {
    isGame,
    openBonusNumber,
    bonusNumbers,
    featureFlags,
    bonusNumbersStates,
    autoPlay,
    revealAnimating,
  } = useGameContext();
  const { scratchBonus, isRevealingAllByGroups } = useAnimationContext();
  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const data = bonusNumbers[0];
  const state = bonusNumbersStates[0];

  const handleClick = () => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    if (state === InstantWinNumberStates.CLOSED) {
      announce('revealing bonus number');
      openBonusNumber();
    }
  };
  const renderBonusNumbersContent = (className: string, states: InstantWinNumberStates[]) => (
    <div className={cn('h-full w-full', className)}>
      <RenderState
        state={states[0] || InstantWinNumberStates.CLOSED}
        data={data}
        isGame={isGame}
        featureFlags={featureFlags}
      />
    </div>
  );

  const hideBackgroundNumbers = () => {
    return !scratchBonus || !isRevealingAllByGroups;
  };

  // update the background numbers
  useEffect(() => {
    // update normally if not inside the scratching animation
    if (!scratchBonus) {
      setBackgroundNumberStates(bonusNumbersStates);
    } else {
      // if we're inside the scratching animation we only want to update the states that are already open
      setBackgroundNumberStates((prev) => {
        if (!prev) {
          return bonusNumbersStates;
        }
        const updatedStates = prev.map((state, index) => {
          if (state === InstantWinNumberStates.CLOSED) {
            return state;
          }
          return bonusNumbersStates[index] !== undefined ? bonusNumbersStates[index] : state;
        });

        return updatedStates;
      });
    }
  }, [bonusNumbersStates]);

  return (
    <>
      <motion.button
        aria-hidden={isGame}
        animate={{ scale: featureFlags['reveal'] ? [1, 1.075, 1] : 1 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onClick={handleClick}
        className={cn(
          'relative flex h-full items-center justify-center rounded-lg border-2 border-yellow-200 from-10% via-yellow-100 via-50% to-amber-300 to-90%',
          !isGame && 'pointer-events-none opacity-50',
          featureFlags['reveal'] || 'opacity-50 grayscale',
          className,
        )}
      >
        <div className='relative h-full w-full'>
          {/* background numbers */}
          {renderBonusNumbersContent(
            cn('absolute z-0', hideBackgroundNumbers() && 'hidden'),
            backgroundNumberStates || [],
          )}
          {/* foreground numbers */}
          {renderBonusNumbersContent(
            cn(
              'z-[1]',
              isRevealingAllByGroups && scratchBonus && 'dond-bonus-numbers-scratch-mask',
            ),
            bonusNumbersStates,
          )}
        </div>
      </motion.button>
    </>
  );
};

export default BonusNumberSection;

type RenderStateProps = {
  state: InstantWinNumberStates;
  data: InstantWinNumber;
  isGame: boolean;
  featureFlags: FeatureFlags;
};

const RenderState: React.FC<RenderStateProps> = ({ state, data }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState />;
    case InstantWinNumberStates.SMALL_WIN:
      return <SmallWinState data={data} />;
    case InstantWinNumberStates.LOSER:
      return <OpenState />;
  }
};

const ClosedState: React.FC = () => {
  return (
    <div
      className='relative z-0 flex h-full w-full flex-col'
      aria-label='tap to reveal bonus spot reward'
    >
      <div
        className={`h-4.5 z-[1] flex w-full items-center justify-center rounded-md rounded-b-none border-1 border-yellow-300 bg-gradient-to-r from-yellow-300 from-10% via-yellow-200 via-50% to-yellow-300 to-90% lg-h:h-6`}
      >
        <p className='dondBonusSpot nowrap uppercase'>Bonus Spot</p>
      </div>
      <div className='relative h-full w-full'>
        <img
          src={bankersSpot}
          className='absolute h-full w-full rounded-md object-cover'
          aria-label='silhouette of banker for bonus spot game'
        />
      </div>
    </div>
  );
};

const PrecogState: React.FC = () => {
  return (
    <div className='relative h-full w-full'>
      <img src={bankersPhone} className='h-full w-full' alt='closed bonus item' />
    </div>
  );
};

const OpenState: React.FC = () => {
  const text = 'No win';
  return (
    <div className='dondBonusSpotBackground rounded-md'>
      <img src={bankersPhone} className='absolute h-[65%]' alt='image of bankers phone' />
      <p
        className={cn(
          'dondDefaultText relative z-10 flex h-full w-full items-center justify-center rounded-md p-2 text-center text-xs font-bold uppercase tracking-wider text-amber-200',
        )}
      >
        {text}
      </p>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { formatPrize } = useGameContext();
  const { triggerConfetti, addAnimation } = useAnimationContext();
  const text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  const { playSoundEffect } = useAudioContext();
  const [bonusOpened, setBonusOpened] = useState(false);
  const { bonusNumbersStates, autoPlay, prefersReducedMotion } = useGameContext();
  const state = bonusNumbersStates[0];
  const [triggerDondBonusSpotWin, setTriggerDondBonusSpotWin] = useState(false);

  // create a ref for the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // confetti animation
  useEffect(() => {
    playSoundEffect(Sfx.DOND_BONUS_SPOT_WIN);
    const bonusConfettiTimeout = setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          triggerConfetti(
            350, // count
            90, // angle
            80, // spread
            15, // velocity
            0.41, // xDirection
            0.825, // yDirection
            0.8, // scale
            ['#FFFFFF', '#FFD700'], // colors
            1, // zIndex
            canvas, // Pass the canvas context
          );
        }
      }
    }, 1725);

    return () => {
      clearTimeout(bonusConfettiTimeout);
    };
  }, []);

  useEffect(() => {
    if (state === InstantWinNumberStates.SMALL_WIN && !autoPlay && !prefersReducedMotion) {
      addAnimation({
        tag: 'dondBonusSpotWin',
        duration: 2000,
        playing: triggerDondBonusSpotWin,
        setIsPlaying: setTriggerDondBonusSpotWin,
      });
    }
  }, [state]);

  useEffect(() => {
    const bonusOpenedTimeout = setTimeout(() => {
      setBonusOpened(true);
    }, 1700);
    return () => {
      clearTimeout(bonusOpenedTimeout);
    };
  }, []);

  return (
    <>
      {!bonusOpened ? (
        <>
          <div className='dondBonusWinClosed relative z-0 flex h-full w-full flex-col items-center justify-center rounded-md'>
            <img
              src={bankersHandleShake}
              className='absolute z-0 h-[55%]'
              alt={'Telephone handle shaking'}
            />
          </div>
        </>
      ) : (
        <div className='canvas-wrapper'>
          <canvas
            id='confettiCanvas'
            ref={canvasRef}
            className='pointer-events-none absolute left-0 top-0 z-10 h-full w-full rounded-lg'
          ></canvas>
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-lg text-center text-xs font-bold',
              'winner dondBonusWinOpened relative text-xl',
            )}
          >
            <img
              src={bonusSpotBg}
              className='absolute h-full w-full rounded-md'
              alt={'Banker Spot Win'}
            />
            <img src={bankersPhone} className='absolute h-[65%]' alt='image of bankers phone' />
            <div className='flex flex-col items-center'>
              <p
                className='bonusWin dondDefaultText relative z-10 flex w-[90%] justify-center text-nowrap text-xs uppercase text-amber-200'
                aria-label='you won'
              >
                {'You won'}
              </p>
              <p
                className='bonusWin dondDefaultText relative z-10 flex w-[90%] justify-center rounded-md text-2xl uppercase text-amber-200'
                aria-label='winning amount'
              >
                {text}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
