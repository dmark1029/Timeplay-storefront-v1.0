import React from 'react';

import clsx from 'clsx';
import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';

import { SvgText } from '.';
import { GameStates, useGameContext } from '../../../context/game-context';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import dollarSign from '../assets/dollar-sign.png';
import vertLine from '../assets/dotted-line.png';

export type MatchNumber = {
  number: number;
  payout: number;
  revealed: boolean;
  winner: boolean;
  allNumbersRevealed: boolean;
};

interface PrizeLotItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const variants = {
  initial_1: { opacity: 0, scale: 1.5 },
  initial_2: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
};

const PrizeLotItem: React.FC<PrizeLotItemProps> = ({
  onClick,
  data,
  state,
  allNumbersRevealed,
}) => {
  const { isGame, formatPrize } = useGameContext();

  let ariaLabel = '';
  const prize = formatPrize(parseFloat(data.prize.value) / 100);
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed match 3 prize';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open match 3 prize: $${prize}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Precog';
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning match 3 prize: $${prize}`;
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing match 3 prize: $${prize}`;
      break;
    default:
      break;
  }

  return (
    <motion.button
      aria-hidden={!isGame}
      aria-label={ariaLabel}
      tabIndex={isGame ? 0 : -1}
      key={data.number_id}
      variants={variants}
      initial={state === InstantWinNumberStates.LOSER ? 'initial_2' : 'initial_1'}
      animate='animate'
      exit='initial_1'
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`relative flex h-full w-[25%] shrink-0 items-center justify-center overflow-hidden focus:outline-2 focus:outline-offset-2 focus:outline-red-500`}
    >
      {/* scratch symbol */}
      <div className='absolute flex h-full w-full items-center justify-center'>
        <img
          src={dollarSign}
          className='h-full w-full object-contain'
          alt='Dollar sign representing a closed match-three prize'
        />
      </div>

      <RenderState data={data} state={state} allNumbersRevealed={allNumbersRevealed} />
    </motion.button>
  );
};

export default PrizeLotItem;

type RenderStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ data, state, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState data={data} allNumbersRevealed={allNumbersRevealed} state={state} />;
    case InstantWinNumberStates.PRECOG:
      return <PreCogState />;
    case InstantWinNumberStates.SMALL_WIN:
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

const ClosedState: React.FC = () => {
  return <></>;
};

//TODO: implement pre-cog state
const PreCogState: React.FC = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <img src={vertLine} className='h-auto w-full p-1' alt='' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  active?: boolean;
  allNumbersRevealed: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { formatPrize, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  let text;

  if (typeof data.prize.value === 'string') {
    text = formatPrize(parseFloat(data.prize.value) / 100);
  } else if (typeof data.prize.value === 'number') {
    text = formatPrize(data.prize.value / 100);
  }

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
    <div className='flex h-full w-full items-center justify-center'>
      <img src={vertLine} className='absolute inset-y-0 left-0 h-full' alt='' />
      <Pulse isAnimated={false} className='flex h-full w-full flex-col items-center justify-center'>
        <div
          className={clsx(
            'relative flex h-full w-full flex-col items-center justify-center p-2',
            !active && 'opacity-50',
          )}
        >
          <SvgText
            text={'Prize'}
            isActive={data.winner}
            className='pt-1 font-tempo text-base font-bold'
            defaultColor='fill-black'
            activeColor='fill-black'
          />
          <SvgText
            text={`$${text}`}
            isActive={data.winner}
            className='font-tempo text-sm font-bold md-h:text-lg'
            defaultColor='fill-black'
            activeColor='fill-black'
          />
        </div>
      </Pulse>
    </div>
  );

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center rounded-r-lg bg-salmon ${
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
  const { formatPrize, prefersReducedMotion } = useGameContext();
  const text = formatPrize(parseFloat(data.prize.value) / 100);

  return (
    <div className={'relative flex h-full w-full'}>
      <img src={vertLine} className='absolute inset-y-0 left-0 h-full' alt='' />
      <Pulse
        isAnimated={!prefersReducedMotion}
        className='flex h-full w-full flex-col items-center justify-center'
      >
        <div className='relative flex h-full w-full flex-col items-center justify-center p-2'>
          <SvgText
            text={'Prize'}
            isActive={data.winner}
            className='pt-1 font-tempo text-base font-bold'
            defaultColor='fill-black'
            activeColor='fill-black'
          />
          <SvgText
            text={`$${text}`}
            isActive={data.winner}
            className='font-tempo text-sm font-bold md-h:text-lg'
            defaultColor='fill-black'
            activeColor='fill-black'
          />
        </div>
      </Pulse>
    </div>
  );
};
