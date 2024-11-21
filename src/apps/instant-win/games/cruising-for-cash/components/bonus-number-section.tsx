import { useEffect, useState } from 'react';

import { announce } from '@react-aria/live-announcer';
import { AnimatePresence, motion } from 'framer-motion';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumber, InstantWinNumberStates } from '@/apps/instant-win/types';
import { Music, Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { bonusTextImg, freeCruiseImg, freeCruiseTextImg } from '../assets';
import { bonusSpotMov, bonusSpotWebm } from '../assets/animation-assets';
import AnimatedItem from './animated-item';
import StrokedText from './stroked-text';

type BonusNumberSectionProps = {
  className?: string;
};

const BonusNumberSection: React.FC<BonusNumberSectionProps> = ({ className = '' }) => {
  const {
    openBonusNumber,
    bonusNumbers,
    featureFlags,
    bonusNumbersStates,
    autoPlay,
    prefersReducedMotion,
    isGame,
    formatPrize,
    revealAnimating,
  } = useGameContext();
  const { isRevealingAllByGroups, scratchBonus } = useAnimationContext();
  const { addAnimation } = useAnimationContext();
  const [isMsgVisible, setIsMsgVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const state: InstantWinNumberStates = bonusNumbersStates[0];
  const data = bonusNumbers[0];
  const hasCruise = data.prize.tag === 'free_cruise';

  let ariaLabel = '';
  const prize = '$' + formatPrize(parseFloat(data.prize.value) / 100);

  let bg = '';

  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed cruise bonus item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open bonus number item.`;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      if (hasCruise) {
        ariaLabel = 'Winning cruise bonus item. You won a free cruise';
        bg = 'bg-white';
      } else {
        ariaLabel = `Winning cruise bonus item worth ${prize}`;
      }
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed cruise bonus item';
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing cruise bonus item`;
      bg = 'bg-white';
      break;
    default:
      break;
  }

  const hideBackgroundNumbers = () => {
    return !scratchBonus || !isRevealingAllByGroups;
  };

  const renderBonusNumbersContent = (className: string, states: InstantWinNumberStates[]) => (
    <AnimatedItem
      transitionKey={state.toString()}
      className={`relative h-full w-full items-center justify-center ${bg} ${className}`}
    >
      <RenderState state={states[0] || InstantWinNumberStates.CLOSED} data={data} />
      <ConfettiAnimation show={showConfetti} />
    </AnimatedItem>
  );

  const handleClick = () => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    if (featureFlags['reveal']) {
      announce('Revealing cruise bonus item');
      openBonusNumber();
    } else {
      console.log('Increase Stake to Unlock Feature');
      setIsMsgVisible(!isMsgVisible);
    }
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

  useEffect(() => {
    if (isMsgVisible && featureFlags['reveal']) {
      setIsMsgVisible(false);
    }
  }, [featureFlags['reveal']]);

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
    if (state === InstantWinNumberStates.SMALL_WIN && !autoPlay && !prefersReducedMotion) {
      addAnimation({
        tag: '',
        duration: hasCruise ? 7000 : 3000,
        playing: showConfetti,
        setIsPlaying: setShowConfetti,
      });
    }
  }, [state]);

  return (
    <motion.button
      aria-label={ariaLabel}
      aria-hidden={!isGame}
      tabIndex={isGame ? 0 : -1}
      onClick={handleClick}
      animate={{
        scale: featureFlags['reveal'] ? [1, 1.3, 1] : 1,
        x: isMsgVisible ? [0, -5, 5, 0] : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-4 border-red-600 bg-white ',
        !isGame && 'opacity-50',
        featureFlags['reveal'] || 'grayscale',
        className,
      )}
    >
      <ContainerMsg isVisible={isMsgVisible} />
      {/* background number */}
      {renderBonusNumbersContent(
        cn('z-0 absolute', hideBackgroundNumbers() ? 'hidden' : ''),
        backgroundNumberStates || [],
      )}
      {/* foreground number */}
      {renderBonusNumbersContent(
        cn(
          'z-[1] bg-white rounded-lg',
          isRevealingAllByGroups && scratchBonus ? 'cfc-bonus-numbers-scratch-mask' : '',
        ),
        bonusNumbersStates,
      )}
    </motion.button>
  );
};
export default BonusNumberSection;

type ConfettiAnimationProps = {
  show: boolean;
};

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className='absolute -z-[1] h-40 w-40'>
          <motion.video
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className='h-full w-full object-cover'
            autoPlay
            playsInline
            muted
            loop
          >
            <source src={bonusSpotMov} type='video/quicktime' />
            <source src={bonusSpotWebm} type='video/webm' />
          </motion.video>
        </div>
      )}
    </AnimatePresence>
  );
};

type RenderStateProps = {
  state: InstantWinNumberStates;
  data: InstantWinNumber;
};

const RenderState: React.FC<RenderStateProps> = ({ state, data }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState />;
    case InstantWinNumberStates.SMALL_WIN:
      return <SmallWinState data={data} />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.LOSER:
      return <OpenState />;
  }
};

const ClosedState: React.FC = () => {
  return <img src={bonusTextImg} className='p-3' alt='closed cruise bonus item' />;
};

const OpenState: React.FC = () => {
  const { bonusNumbersStates, revealAnimating } = useGameContext();
  const state: InstantWinNumberStates = bonusNumbersStates[0];
  const { playSoundEffect } = useAudioContext();

  const textStrokeStyle = {
    WebkitTextStroke: '0.4px white', // Stroke width and color for WebKit browsers
    textShadow: `
      -0.4px -0.4px 0 white,
       0.4px -0.4px 0 white,
      -0.4px  0.4px 0 white,
       0.4px  0.4px 0 white
    `, // Shadow fallback for other browsers
  };

  useEffect(() => {
    if (state === InstantWinNumberStates.LOSER && !revealAnimating) {
      playSoundEffect(Sfx.CFC_BONUS_SPOT_LOSE);
    }
  }, [state]);

  return (
    <>
      <img src={freeCruiseImg} className='h-full w-full rounded-lg object-cover' alt='' />
      <div
        className='absolute h-full w-full rounded-lg'
        style={{
          backgroundColor: 'rgba(237, 212, 209, 0.65)',
        }}
      ></div>
      <h2 className='absolute inset-0 h-full w-full object-contain font-tempo text-base font-extrabold uppercase text-cfc-red md-h:text-xl'>
        <span
          className='text-xl uppercase'
          style={{
            ...textStrokeStyle,
            position: 'absolute',
            left: '50%',
            top: '55%',
            transform: 'translate(-50%,-50%)',
            lineHeight: '1.25rem',
            filter: 'drop-shadow(0px 0px 6.4px rgba(0, 0, 0, 0.6))',
          }}
        >
          No prize
        </span>
      </h2>
    </>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const hasNonMonetaryPrize = data?.prize?.tag !== '';
  const { startMusic, stopAllAudio } = useAudioContext();

  useEffect(() => {
    if (hasNonMonetaryPrize) {
      startMusic(Music.CFC_FREE_CRUISE);
    } else {
      startMusic(Music.CFC_BONUS_SPOT);
    }
    return () => {
      stopAllAudio();
    };
  }, [hasNonMonetaryPrize]);

  return (
    <div className='flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-salmon'>
      {hasNonMonetaryPrize ? (
        <NonMonetaryPrizeType data={data} />
      ) : (
        <MonetaryPrizeType data={data} />
      )}
    </div>
  );
};

type MonetaryPrizeTypeProps = {
  data: InstantWinNumber;
};

const MonetaryPrizeType: React.FC<MonetaryPrizeTypeProps> = ({ data }) => {
  const { formatPrize } = useGameContext();
  const text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  return <StrokedText isActive={true} text={text} className='text-2xl' />;
};

type NonMonetaryPrizeTypeProps = {
  data: InstantWinNumber;
};

const NonMonetaryPrizeType: React.FC<NonMonetaryPrizeTypeProps> = ({ data }) => {
  const cashCompPrizeUrls: Record<string, string> = {
    free_cruise: freeCruiseImg,
  };
  return (
    <>
      <img src={cashCompPrizeUrls[data.prize.tag]} className=' h-full w-full object-cover' alt='' />
      <img
        src={freeCruiseTextImg}
        className='absolute inset-0 h-full w-full object-contain p-2'
        alt='you won a free cruise'
      />
    </>
  );
};

const PrecogState: React.FC = () => {
  return <p className='text-xs font-bold text-black'>Precog</p>;
};

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
          className='absolute inset-0 z-20 flex items-center justify-center rounded-md bg-neutral-600/90 p-2 font-tempo text-xs font-bold uppercase text-white'
        >
          Increase Stake to Unlock Feature
        </motion.h1>
      )}
    </AnimatePresence>
  );
};
