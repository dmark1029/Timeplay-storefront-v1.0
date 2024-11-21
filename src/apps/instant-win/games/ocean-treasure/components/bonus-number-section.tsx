import { useEffect, useState } from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumber, InstantWinNumberStates } from '@/apps/instant-win/types';
import { cn } from '@/utils/cn';

import { BonusBottlePop } from '.';
import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import {
  bonusSymbolBgImg,
  bonusSymbolImg1,
  bonusSymbolImg2,
  bonusSymbolImg2Glow,
  bonusTextImg,
} from '../assets';

type BonusNumberSectionProps = {
  className?: string;
};

const variants = {
  initial: { opacity: 0, scale: 1.5 },
  animate: { opacity: 1, scale: 1 },
};

const BonusNumberSection: React.FC<BonusNumberSectionProps> = ({ className = '' }) => {
  const {
    openBonusNumber,
    bonusNumbers,
    featureFlags,
    formatPrize,
    bonusNumbersStates,
    autoPlay,
    prefersReducedMotion,
    isGame,
    revealAnimating,
  } = useGameContext();
  const { addAnimation, scratchBonus, isRevealingAllByGroups } = useAnimationContext();

  const [showBottleAnimation, setShowBottleAnimation] = useState(false);
  const [isMsgVisible, setIsMsgVisible] = useState(false);
  const [backgroundNumberStates, setBackgroundNumberStates] = useState<
    InstantWinNumberStates[] | undefined
  >(undefined);

  const state: InstantWinNumberStates = bonusNumbersStates[0];
  const data = bonusNumbers[0];

  let prizeText: string = 'closed';
  const hasPrize = data?.prize?.value !== '0' && data?.prize?.value;

  // if we have a small win state but no prize, log an error.
  // https://streamsix.atlassian.net/browse/LOT1-952

  if (!hasPrize && state === InstantWinNumberStates.SMALL_WIN) {
    console.error('Small win state with no prize', data, bonusNumbersStates);
  }

  if (!hasPrize) {
    prizeText = 'Better Luck Next Time';
  } else {
    prizeText = 'You won $' + formatPrize(parseFloat(data.prize.value) / 100);
  }

  const handleClick = () => {
    if (autoPlay || revealAnimating || isRevealingAllByGroups) {
      return;
    }

    if (featureFlags['reveal']) {
      announce('Revealed bonus item, ' + prizeText);
      openBonusNumber();
    } else {
      console.log('Increase Stake to Unlock Feature');
      setIsMsgVisible(!isMsgVisible);
    }
  };

  const hideBackgroundNumbers = () => {
    return !scratchBonus || !isRevealingAllByGroups;
  };

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
    if (state === InstantWinNumberStates.SMALL_WIN && !autoPlay && !prefersReducedMotion) {
      addAnimation({
        tag: '',
        duration: 7000,
        playing: showBottleAnimation,
        setIsPlaying: setShowBottleAnimation,
      });
    }
  }, [state]);

  return (
    <>
      <motion.button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        animate={{
          scale: featureFlags['reveal'] ? [1, 1.3, 1] : 1,
          y: isMsgVisible ? [0, 5, -5, 0] : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={handleClick}
        className={cn(
          'relative flex h-full w-[6rem] items-center justify-center focus:outline-2 focus:outline-offset-2 focus:outline-red-500',

          featureFlags['reveal'] || 'grayscale',
          className,
        )}
      >
        <ContainerMsg isVisible={isMsgVisible} />
        <img
          src={bonusSymbolBgImg}
          className='absolute inset-0 z-0 h-full w-full'
          aria-hidden={true}
          alt=''
        />
        <h2>
          <img
            src={bonusTextImg}
            className='absolute -top-3 z-[5] h-8 scale-125 md-h:-top-4 md-h:h-8'
            alt='Bonus game'
          />
        </h2>
        {/* background numbers used for scratch mask*/}
        <div className={`absolute z-[0] h-full w-full ${hideBackgroundNumbers() ? 'hidden' : ''}`}>
          <RenderState
            data={data}
            state={backgroundNumberStates?.[0] || InstantWinNumberStates.CLOSED}
            showBottleAnimation={false}
          />
        </div>
        <motion.div
          key={state}
          variants={variants}
          initial='initial'
          animate='animate'
          exit='initial'
          transition={{ duration: 0.2 }}
          className={clsx(
            'z-[1] h-full w-full',
            isRevealingAllByGroups && scratchBonus && 'oth-bonus-numbers-scratch-mask',
          )}
        >
          <RenderState data={data} state={state} showBottleAnimation={showBottleAnimation} />
        </motion.div>
      </motion.button>
      {showBottleAnimation && <BonusBottlePop prize={prizeText} />}
    </>
  );
};
export default BonusNumberSection;

type RenderStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  showBottleAnimation: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ data, state, showBottleAnimation }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState />;
    case InstantWinNumberStates.PRECOG:
      return <PreCogState />;
    case InstantWinNumberStates.SMALL_WIN:
      return <SmallWinState data={data} showBottleAnimation={showBottleAnimation} />;
    case InstantWinNumberStates.LOSER:
      return <OpenState active={false} />;
  }
};

const ClosedState: React.FC = () => {
  return (
    <div className='relative flex h-full w-full items-center justify-center'>
      <img src={bonusSymbolImg1} className={`w-[70%] md-h:w-[80%]`} alt='' />
    </div>
  );
};

//TODO: implement pre-cog state
const PreCogState: React.FC = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <p className='text-xs font-bold text-black'>Precog</p>
    </div>
  );
};

type OpenStateProps = {
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ active = true }) => {
  const { isGame } = useGameContext();
  return (
    <div
      className={clsx(
        ' flex h-full w-full  rounded-md bg-salmon',
        !isGame && ' pointer-events-none opacity-50',
      )}
    >
      <div className={clsx('relative flex h-full w-full flex-col items-center justify-center')}>
        <p className='font-tempo text-xs font-extrabold text-black'>No Win</p>
        <img
          src={bonusSymbolImg2}
          className={clsx('w-[70%] md-h:w-[80%]', !active && 'opacity-50')}
          alt=''
        />
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
  showBottleAnimation: boolean;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data, showBottleAnimation }) => {
  const { formatPrize, isGame } = useGameContext();
  const text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  const { autoPlay, prefersReducedMotion } = useGameContext();

  return (
    <div
      className={clsx(
        'relative z-[1] flex h-full w-full  rounded-md bg-salmon',
        !isGame && ' pointer-events-none opacity-50',
      )}
    >
      <Pulse
        isAnimated={!prefersReducedMotion}
        className={clsx(
          ` flex h-full w-full flex-col items-center justify-center`,
          !autoPlay && !prefersReducedMotion && showBottleAnimation && 'bonusSpotWinText',
        )}
      >
        <p className=' font-tempo text-xs font-extrabold text-black'>Winner!</p>
        <div className='relative flex h-[60%] w-[70%] items-center justify-center md-h:w-[80%]'>
          <img src={bonusSymbolImg2} className={'absolute '} alt='' />
          <motion.img
            animate={{ scale: [1, 1.2, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            src={bonusSymbolImg2Glow}
            className='absolute z-[2] blur-md'
            alt=''
          />
          <p className='absolute z-[3] font-tempo text-xs font-extrabold text-black'>{text}</p>
        </div>
      </Pulse>
    </div>
  );
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
          className='absolute inset-0 z-[4] flex items-center justify-center rounded-md bg-neutral-600/50 p-2 font-tempo text-xs font-bold uppercase text-white'
        >
          Increase Stake to Unlock Feature
        </motion.h1>
      )}
    </AnimatePresence>
  );
};
