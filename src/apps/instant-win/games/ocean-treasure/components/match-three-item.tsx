import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import seedrandom from 'seedrandom';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';

import { GameStates, useGameContext } from '../../../context/game-context';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';

export type MatchNumber = { number: number; payout: number; revealed: boolean; winner: boolean };
interface MatchThreeItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  iconIndex: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const variants = {
  initial_1: { opacity: 0, scale: 1.5 },
  initial_2: { opacity: 0, scale: 1.1 },
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

  const gallery: string[] = Object.values(
    import.meta.glob('../assets/match-3-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <li className={`flex aspect-square h-full items-center justify-center first:rounded-l-lg`}>
      <motion.button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        key={data.number_id}
        variants={variants}
        initial={state === InstantWinNumberStates.LOSER ? 'initial_2' : 'initial_1'}
        animate='animate'
        exit='initial_1'
        transition={{ duration: 0.2 }}
        onClick={() => {
          announce('Revealed symbol type ' + (data.number - 1));
          onClick();
        }}
        className={`flex aspect-square h-full items-center justify-center focus:outline-2 focus:outline-offset-2 focus:outline-red-500`}
      >
        {/* scratch symbols */}

        <div className='absolute flex aspect-square h-full w-auto items-center justify-center'>
          <img
            src={gallery[0]}
            className='-z-10 h-full w-full object-contain'
            aria-label='Closed match 3 item'
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

export default MatchThreeItem;

type RenderStateProps = {
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ data, state, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
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

const ClosedState: React.FC = () => {
  return <></>;
};

// TODO: Implement PrecogState component
const PrecogState: React.FC = () => {
  return <div className='flex h-full w-full items-center justify-center bg-salmon'></div>;
};

type OpenStateProps = {
  data: InstantWinNumber;
  active?: boolean;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { match3Numbers, prizeLotNumbers, gameState, revealAnimating, prefersReducedMotion } =
    useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const mainPrize = prizeLotNumbers[0];
  const seed = mainPrize.number_id;
  const random = seedrandom(seed);
  const imgs: Map<string, string> = new Map();
  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  for (let i = 0; i < match3Numbers.length; i++) {
    const randomIndex = Math.floor(random() * prizeGallery.length);
    imgs.set(match3Numbers[i].prize_id, prizeGallery[randomIndex]);
    prizeGallery.splice(randomIndex, 1);
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
    <Pulse
      isAnimated={false}
      className={clsx(
        'flex h-full w-full flex-col items-center justify-center p-2',
        !active && 'opacity-50',
      )}
    >
      <img
        src={imgs.get(data.prize_id)}
        className='h-full w-full object-contain'
        aria-label={'Match 3 symbol'}
      />
    </Pulse>
  );

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-salmon ${
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
  const { match3Numbers, prizeLotNumbers, prefersReducedMotion } = useGameContext();

  const mainPrize = prizeLotNumbers[0];
  const seed = mainPrize.number_id;
  const random = seedrandom(seed);
  const imgs: Map<string, string> = new Map();
  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  for (let i = 0; i < match3Numbers.length; i++) {
    const randomIndex = Math.floor(random() * prizeGallery.length);
    imgs.set(match3Numbers[i].prize_id, prizeGallery[randomIndex]);
    prizeGallery.splice(randomIndex, 1);
  }

  return (
    <Pulse
      isAnimated={!prefersReducedMotion}
      className='flex h-full w-full flex-col items-center justify-center py-3.5'
    >
      <img
        src={imgs.get(data.prize_id)}
        className='h-full w-full object-contain'
        aria-label={'Winning match 3 symbol'}
      />
    </Pulse>
  );
};
