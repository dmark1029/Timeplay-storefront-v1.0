import { useEffect } from 'react';

import { motion } from 'framer-motion';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
// import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { InstantWinNumber, InstantWinNumberStates } from '@/apps/instant-win/types';
import { FeatureFlags } from '@/apps/instant-win/types';
import { AnimateTransition } from '@/components';
// import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { useGameContext } from '../../../context/game-context';
import '../animation-code/animations.css';
import { bonusBackground, bonusGameText, fortuneCookieClosed } from '../assets';

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
  const { isRevealingAllByGroups } = useAnimationContext();

  const data = bonusNumbers[0];
  const state = bonusNumbersStates[0];

  const handleClick = () => {
    if (
      state !== InstantWinNumberStates.CLOSED ||
      autoPlay ||
      revealAnimating ||
      isRevealingAllByGroups
    ) {
      return;
    }
    openBonusNumber();
  };

  return (
    <div className='relative flex w-[354px] min-w-[354px] max-w-[354px] items-center justify-evenly'>
      <img src={bonusBackground} className='absolute w-full' />
      <img src={bonusGameText} className='relative z-10 h-14' alt='fortune cookie bonus game' />
      <motion.button
        animate={{ scale: featureFlags['reveal'] ? [1, 1.075, 1] : 1 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onClick={() => handleClick()}
        className={cn(
          'relative flex w-36 items-center justify-center',
          !isGame && 'pointer-events-none opacity-50',
          featureFlags['reveal'] || 'opacity-50 grayscale',
          className,
        )}
      >
        {state === InstantWinNumberStates.SMALL_WIN ? (
          <RenderState state={state} data={data} isGame={isGame} featureFlags={featureFlags} />
        ) : (
          <AnimateTransition transitionKey={state.toString()} className='h-full'>
            <RenderState state={state} data={data} isGame={isGame} featureFlags={featureFlags} />
          </AnimateTransition>
        )}
      </motion.button>
    </div>
  );
};

export default BonusNumberSection;

type RenderStateProps = {
  state: InstantWinNumberStates;
  data: InstantWinNumber;
  isGame: boolean;
  featureFlags: FeatureFlags;
};

const RenderState: React.FC<RenderStateProps> = ({ state, data, isGame, featureFlags }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState isGame={isGame} featureFlags={featureFlags} />;
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

type ClosedStateProps = {
  isGame: boolean;
  featureFlags: FeatureFlags;
};

const ClosedState: React.FC<ClosedStateProps> = () => {
  return (
    <div
      className='flex h-full w-full items-center justify-center'
      aria-label='tap to open your fortune cookie'
    >
      <img className='relative h-12' src={fortuneCookieClosed} />
    </div>
  );
};

const PrecogState: React.FC = () => {
  return (
    <div className='relative h-full w-full'>
      <img src={fortuneCookieClosed} className='h-full w-full' />
    </div>
  );
};

const OpenState: React.FC = () => {
  const text = 'Better Luck Next Time';
  return (
    <div className='fortune-paper mr-3 flex h-24 w-40 flex-col justify-center self-center'>
      <p
        className={cn(
          'relative flex h-full items-center justify-center rounded-md p-2 text-center text-xs font-extrabold uppercase leading-tight',
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
  const text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  // const { addAnimation } = useAnimationContext();
  // const { playSoundEffect } = useAudioContext();
  // const { bonusNumbersStates, autoPlay, prefersReducedMotion } = useGameContext();
  // const state = bonusNumbersStates[0];
  // const [triggerDondBonusSpotWin, setTriggerDondBonusSpotWin] = useState(false);

  // useEffect(() => {
  //   playSoundEffect(Sfx.DOND_BONUS_SPOT_WIN);
  // }, []);

  // useEffect(() => {
  //   if (state === InstantWinNumberStates.SMALL_WIN && !autoPlay && !prefersReducedMotion) {
  //     addAnimation({
  //       tag: 'dondBonusSpotWin',
  //       duration: 2000,
  //       playing: triggerDondBonusSpotWin,
  //       setIsPlaying: setTriggerDondBonusSpotWin,
  //     });
  //   }
  // }, [state]);

  useEffect(() => {
    const bonusOpenedTimeout = setTimeout(() => {}, 1700);
    return () => {
      clearTimeout(bonusOpenedTimeout);
    };
  }, []);

  return (
    <>
      <div className='fortune-paper flex h-full w-full max-w-xl flex-col justify-center self-center '>
        <p
          className={cn(
            'relative flex h-full items-center justify-center rounded-md p-2 text-center text-sm font-bold uppercase tracking-wider',
          )}
        >
          {text}
        </p>
      </div>
    </>
  );
};
