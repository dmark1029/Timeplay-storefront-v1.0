import React from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { GameStates, useGameContext } from '@/apps/instant-win/context/game-context';
import { cn } from '@/utils/cn';

import { StrokedText } from '.';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { dottedRectImg, neonRect1Img } from '../assets';

export type LuckyNumber = { number: number; payout: number; revealed: boolean; winner: boolean };

interface LuckyNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  className?: string;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const variants = {
  initial: { opacity: 0, scale: 1.5 },
  animate: { opacity: 1, scale: 1 },
};

const LuckyNumbersItem: React.FC<LuckyNumbersItemProps> = ({
  onClick,
  data,
  index,
  className = '',
  state,
  allNumbersRevealed,
}) => {
  const { isGame } = useGameContext();

  let ariaLabel = '';
  const number = data.number.toString();
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed target symbols item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open target symbols item. number ${number}`;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning target symbols item. number ${number}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed target symbols item';
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing target symbols item. number ${number}`;
      break;
    default:
      break;
  }

  const gallery: string[] = Object.values(
    import.meta.glob('../assets/lucky-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <li className='flex aspect-square w-10 shrink-0 sm-h:w-12 md-h:w-16'>
      <motion.button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        aria-label={ariaLabel}
        key={data.number}
        variants={variants}
        initial='initial'
        animate='animate'
        exit='initial'
        transition={{ duration: 0.2 }}
        onClick={() => {
          announce('Revealed winning numbers item. number ' + number);
          onClick();
        }}
        className={cn('flex h-full w-full items-center justify-center', className)}
      >
        {/* scratch symbol */}
        <div className='absolute flex aspect-square w-10 shrink-0 sm-h:w-12 md-h:w-16'>
          <img src={gallery[0]} className='h-full w-full object-contain' alt='' />
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
  state: InstantWinNumberStates;
  index: number;
  data: InstantWinNumber;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ state, index, data, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.OPEN:
      return (
        <OpenState
          data={data}
          index={index}
          state={state}
          allNumbersRevealed={allNumbersRevealed}
        />
      );
    case InstantWinNumberStates.SMALL_WIN:
      return (
        <OpenState
          data={data}
          index={index}
          state={state}
          allNumbersRevealed={allNumbersRevealed}
        />
      );
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.LOSER:
      return (
        <OpenState
          data={data}
          index={index}
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

// TODO: Implement PrecogState component
const PrecogState: React.FC = () => {
  return <div className='flex h-full w-full items-center justify-center bg-salmon'></div>;
};

type OpenStateProps = {
  data: InstantWinNumber;
  index: number;
  allNumbersRevealed: boolean;
  state: InstantWinNumberStates;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, index, state, active = true }) => {
  let cornerClass = '';
  switch (index) {
    case 0:
      cornerClass = 'rounded-l-lg';
      break;
    case 2:
      cornerClass = 'rounded-r-lg';
      break;
  }
  const { gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const renderState = () => {
    switch (state) {
      case InstantWinNumberStates.SMALL_WIN:
        return <SmallWinState index={index} data={data} />;
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
      <Pulse isAnimated={false} className='relative flex h-full w-full items-center justify-center'>
        <StrokedText
          text={data.number.toString()}
          className={clsx(' text-center text-2xl font-bold md-h:text-3xl', !active && 'opacity-50')}
          isActive={false}
        />
      </Pulse>
      <img
        src={dottedRectImg}
        className='absolute inset-0 z-[1] h-full w-full object-cover p-1'
        alt=''
      />
    </div>
  );

  return (
    <div
      className={cn(
        ' relative flex h-full w-full items-center justify-center bg-salmon',
        cornerClass,
        showScratch() && 'individual-scratch-mask',
      )}
    >
      {renderState()}
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
  index: number;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  return (
    <Pulse isAnimated={true} className='relative flex h-full w-full items-center justify-center'>
      <StrokedText
        text={data.number.toString()}
        className=' text-center text-xl font-bold md-h:text-3xl'
        isActive={true}
      />
      <img
        src={neonRect1Img}
        className='absolute inset-0 z-[1] h-full w-full object-cover '
        alt=''
      />
      <motion.img
        animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        src={neonRect1Img}
        className='absolute inset-0 z-[1] h-full w-full object-cover blur'
      />
    </Pulse>
  );
};
