import React from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import seedrandom from 'seedrandom';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';

import { GameStates, useGameContext } from '../../../context/game-context';
import '../../../styles.css';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';

export type MatchNumber = { number: number; payout: number; revealed: boolean; winner: boolean };

interface MatchThreeItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const variants = {
  initial: { opacity: 0, scale: 1.5 },
  animate: { opacity: 1, scale: 1 },
};

const MatchThreeItem: React.FC<MatchThreeItemProps> = ({
  onClick,
  data,
  index,
  state,
  allNumbersRevealed,
}) => {
  const { isGame } = useGameContext();

  let ariaLabel = '';
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed match 3 item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open match 3 item`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed match 3 item';
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning match 3 item`;
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing match 3 item`;
      break;
    default:
      break;
  }

  const closedSymbols: string[] = Object.values(
    import.meta.glob('../assets/match-3-closed-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <li className='flex h-14 w-11 md-h:w-12'>
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
          announce('Revealed match 3 item');
          onClick();
        }}
        className={`flex h-14 w-11 shrink-0 items-center justify-center md-h:w-12`}
      >
        {/* scratch symbols */}
        <div className='absolute flex h-14 w-11 items-center justify-center md-h:w-12'>
          <img src={closedSymbols[index]} className='h-full' alt='' />
        </div>

        <RenderState
          index={index}
          data={data}
          state={state}
          allNumbersRevealed={allNumbersRevealed}
        />
      </motion.button>
    </li>
  );
};

export default MatchThreeItem;

type RenderStateProps = {
  index: number;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ index, data, state, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState index={index} />;
    case InstantWinNumberStates.OPEN:
      return (
        <OpenState
          index={index}
          data={data}
          allNumbersRevealed={allNumbersRevealed}
          state={state}
        />
      );
    case InstantWinNumberStates.PRECOG:
      return <PreCogState />;
    case InstantWinNumberStates.SMALL_WIN:
      return (
        <OpenState
          index={index}
          data={data}
          allNumbersRevealed={allNumbersRevealed}
          state={state}
        />
      );
    case InstantWinNumberStates.LOSER:
      return (
        <OpenState
          index={index}
          data={data}
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

type OpenStateProps = {
  index: number;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, index, state }) => {
  const { match3Numbers, prizeLotNumbers, gameState, revealAnimating, prefersReducedMotion } =
    useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const mainPrize = prizeLotNumbers[0];
  const seed = mainPrize.number_id;
  const random = seedrandom(seed);
  const imgs: Map<string, string> = new Map();
  const revealedSymbols: string[] = Object.values(
    import.meta.glob('../assets/match-3-revealed-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  for (let i = 0; i < match3Numbers.length; i++) {
    const randomIndex = Math.floor(random() * revealedSymbols.length);
    imgs.set(match3Numbers[i].prize_id, revealedSymbols[randomIndex]);
    revealedSymbols.splice(randomIndex, 1);
  }

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
    <img src={imgs.get(data.prize_id)} className='aspect-auto w-full p-0.5' alt='' />
  );

  return (
    <div
      className={clsx(
        'relative flex h-full w-full items-center justify-center bg-salmon',
        index === 0 && 'rounded-l-md',
        showScratch() && 'individual-scratch-mask',
      )}
    >
      {renderState()}
    </div>
  );
};

// TODO: implement the precog state
const PreCogState: React.FC = () => {
  return <div className='flex h-full w-full items-center justify-center bg-salmon'></div>;
};

type SmallWinStateProps = {
  index: number;
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { match3Numbers, prizeLotNumbers } = useGameContext();

  const mainPrize = prizeLotNumbers[0];
  const seed = mainPrize.number_id;
  const random = seedrandom(seed);
  const imgs: Map<string, string> = new Map();
  const revealedSymbols: string[] = Object.values(
    import.meta.glob('../assets/match-3-revealed-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  for (let i = 0; i < match3Numbers.length; i++) {
    const randomIndex = Math.floor(random() * revealedSymbols.length);
    imgs.set(match3Numbers[i].prize_id, revealedSymbols[randomIndex]);
    revealedSymbols.splice(randomIndex, 1);
  }

  return (
    <Pulse
      isAnimated={true}
      maxScale={1}
      minScale={0.85}
      className='flex h-full w-full items-center justify-center'
    >
      <img src={imgs.get(data.prize_id)} className='aspect-auto w-full p-0.5' alt='' />
    </Pulse>
  );
};
