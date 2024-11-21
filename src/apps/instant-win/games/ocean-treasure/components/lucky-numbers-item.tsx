import React, { useEffect } from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { GameStates, useGameContext } from '@/apps/instant-win/context/game-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { neonRect1Img } from '../assets';
import { dottedRect } from '../assets';

const variants = {
  initial_1: { opacity: 0, scale: 1.5 },
  initial_2: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
};

interface LuckyNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  className?: string;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const LuckyNumbersItem: React.FC<LuckyNumbersItemProps> = ({
  onClick,
  data,
  index,
  className = '',
  state,
  allNumbersRevealed,
}) => {
  const { isGame, getSymbolAriaLabel } = useGameContext();

  const gallery: string[] = Object.values(
    import.meta.glob('../assets/lucky-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <li
      className={cn(
        `flex items-center justify-center  md-h:h-[4.5rem] md-h:w-[4.5rem] md-h:translate-y-2`,
        className,
      )}
    >
      <motion.button
        key={data.number_id}
        variants={variants}
        initial={state === InstantWinNumberStates.LOSER ? 'initial_2' : 'initial_1'}
        animate='animate'
        exit='initial_1'
        transition={{ duration: 0.2 }}
        onClick={() => {
          announce('Revealed winning symbol ' + getSymbolAriaLabel(data.number - 1));
          onClick();
        }}
        className='flex h-16 w-16 shrink-0 items-center justify-center focus:outline-2 focus:outline-offset-2 focus:outline-red-500 md-h:h-24 md-h:w-24 '
        disabled={!isGame}
      >
        {/* scratch symbol */}
        <div className='absolute z-[-1] flex h-full w-full items-center justify-center p-2 md-h:p-3'>
          <img
            src={gallery[index]}
            className='h-full w-full object-contain'
            alt='Closed lucky symbol'
          />
        </div>

        <RenderState
          state={state}
          index={index}
          data={data}
          allNumbersRevealed={allNumbersRevealed}
        />
      </motion.button>
    </li>
  );
};

export default LuckyNumbersItem;

type RenderStateProps = {
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ data, index, state, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState index={index} />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.SMALL_WIN:
      return <OpenState data={data} allNumbersRevealed={allNumbersRevealed} state={state} />;
    case InstantWinNumberStates.OPEN:
      return <OpenState data={data} allNumbersRevealed={allNumbersRevealed} state={state} />;
    case InstantWinNumberStates.LOSER:
      return (
        <OpenState
          data={data}
          active={false}
          allNumbersRevealed={allNumbersRevealed}
          state={state}
        />
      );
  }
};

type ClosedStateProps = {
  index: number;
};

const ClosedState: React.FC<ClosedStateProps> = () => {
  return <></>;
};

// TODO: implement the precog state
const PrecogState: React.FC = () => {
  return <div className='flex h-full w-full items-center justify-center bg-salmon'></div>;
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { getSymbolAriaLabel, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  const renderState = () => {
    switch (state) {
      case InstantWinNumberStates.SMALL_WIN:
        return <SmallWinState data={data} />;
      default:
        return renderOpenState;
    }
  };

  const showScratch = () => {
    return (
      gameState === GameStates.PLAYING &&
      !revealAnimating &&
      !prefersReducedMotion &&
      !isRevealingAllByGroups
    );
  };

  const renderOpenState = (
    <div>
      <div
        className={clsx(
          'relative flex h-full w-full flex-col items-center justify-center p-1',
          !active && 'opacity-50',
        )}
      >
        <img
          src={prizeGallery[data.number - 1]}
          className='h-full w-full object-contain p-1 md-h:p-2'
          alt={'Lucky symbol icon ' + getSymbolAriaLabel(data.number - 1)}
        />
      </div>
      <img
        src={dottedRect}
        className='absolute inset-0 -z-[1] h-full w-full object-cover p-3'
        alt=''
      />
    </div>
  );

  return (
    <div
      className={`relative h-full w-full  rounded-md bg-salmon p-2 ${
        showScratch() ? 'individual-scratch-mask' : ''
      }`}
    >
      {renderState()}
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { playSoundEffect } = useAudioContext();
  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  useEffect(() => {
    playSoundEffect(Sfx.OTH_SYMBOL_MATCH);
  }, []);
  const { prefersReducedMotion, getSymbolAriaLabel } = useGameContext();

  return (
    <Pulse
      isAnimated={!prefersReducedMotion}
      className={'relative flex h-full w-full flex-col items-center justify-center rounded-md'}
    >
      <img
        src={prizeGallery[data.number - 1]}
        className='h-full w-full object-contain p-2 md-h:p-3'
        alt={'Winning lucky symbol of a ' + getSymbolAriaLabel(data.number - 1)}
      />
      <img
        src={neonRect1Img}
        className='absolute inset-0 h-full w-full scale-105 object-cover '
        alt=''
      />
    </Pulse>
  );
};
