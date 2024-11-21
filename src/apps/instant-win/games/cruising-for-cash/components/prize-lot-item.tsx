import React from 'react';

import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { getCashCompPrizeDisplayFromTag } from '@/utils';

import { StrokedText } from '.';
import { GameStates, useGameContext } from '../../../context/game-context';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { dottedLineImg, prizeSymbolImg } from '../assets';

const variants = {
  initial: { opacity: 0, scale: 1.5 },
  animate: { opacity: 1, scale: 1 },
};

interface PrizeLotItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const PrizeLotItem: React.FC<PrizeLotItemProps> = ({
  onClick,
  data,
  state,
  allNumbersRevealed,
}) => {
  const { isGame, formatPrize } = useGameContext();

  let ariaLabel = '';
  const prize = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed match 3 prize item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open match 3 prize item worth ${prize}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed match 3 prize item';
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning match 3 prize item worth ${prize}`;
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing match 3 prize item worth ${prize}`;
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
      initial='initial'
      animate='animate'
      exit='initial'
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden`}
    >
      {/* scratch symbol */}
      <div className='absolute flex h-12 w-10 items-center justify-center'>
        <img src={prizeSymbolImg} className=' h-12 w-10 shrink-0 translate-y-1' alt='' />
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
      return <OpenState data={data} state={state} allNumbersRevealed={allNumbersRevealed} />;
    case InstantWinNumberStates.PRECOG:
      return <PreCogState />;
    case InstantWinNumberStates.SMALL_WIN:
      return <OpenState data={data} state={state} allNumbersRevealed={allNumbersRevealed} />;
    case InstantWinNumberStates.LOSER:
      return <OpenState data={data} state={state} allNumbersRevealed={allNumbersRevealed} />;
  }
};

const ClosedState: React.FC = () => {
  return <></>;
};

const PreCogState: React.FC = () => {
  return <div className='flex h-full w-full items-center justify-center'></div>;
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state }) => {
  const { formatPrize, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  let text: string = '';

  if (typeof data.prize.value === 'string') {
    text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  } else if (typeof data.prize.value === 'number') {
    text = '$' + formatPrize(data.prize.value / 100);
  }

  if (data?.prize?.tag) {
    text = getCashCompPrizeDisplayFromTag(data.prize.tag);
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
      !isRevealingAllByGroups &&
      !prefersReducedMotion
    );
  };

  const renderOpenState = (
    <div className='flex h-full w-full items-center justify-center'>
      <img src={dottedLineImg} className='ml-1 w-[2px]' alt='' />
      <Pulse
        maxScale={1}
        minScale={0.85}
        isAnimated={false}
        className='flex h-full w-full flex-col items-center justify-center'
      >
        <div className='relative flex h-full w-full flex-col items-center justify-center'>
          <p className='pt-1 font-tempo text-base font-bold'>Prize</p>
          <StrokedText
            text={text}
            isActive={false}
            className='text-xl font-bold leading-5 md-h:text-2xl md-h:leading-6'
          />
        </div>
      </Pulse>
    </div>
  );

  return (
    <div
      className={`z-0 flex h-full  w-full items-center justify-center rounded-r-lg bg-salmon ${
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
  const { formatPrize } = useGameContext();
  let text: string = '';

  if (typeof data.prize.value === 'string') {
    text = '$' + formatPrize(parseFloat(data.prize.value) / 100);
  } else if (typeof data.prize.value === 'number') {
    text = '$' + formatPrize(data.prize.value / 100);
  }

  if (data?.prize?.tag) {
    text = getCashCompPrizeDisplayFromTag(data.prize.tag);
  }

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <img src={dottedLineImg} className='mr-1 w-[2px]' alt='' />
      <Pulse isAnimated={true} className='flex h-full w-full flex-col items-center justify-center'>
        <div className='relative flex h-full w-full items-center justify-center p-2'>
          <StrokedText
            text={text}
            isActive={true}
            className='text-xl font-bold leading-5 md-h:text-2xl md-h:leading-6'
          />
        </div>
      </Pulse>
    </div>
  );
};
