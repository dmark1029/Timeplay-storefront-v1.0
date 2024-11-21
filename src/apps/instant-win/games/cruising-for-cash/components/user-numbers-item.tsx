import { useRef } from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { getCashCompPrizeDisplayFromTag } from '@/utils';

import { GameStates, useGameContext } from '../../../context/game-context';
import '../../../styles.css';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { dottedRectImg, neonRect1Img } from '../assets';
import StrokedText from './stroked-text';

interface UserNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  index: number;
  allNumbersRevealed: boolean;
}

const variants = {
  initial_1: { opacity: 0, scale: 1.5 },
  initial_2: { opacity: 1, scale: 1 },
  animate: { opacity: 1, scale: 1 },
};

const UserNumbersItem: React.FC<UserNumbersItemProps> = ({
  onClick,
  data,
  state,
  index,
  allNumbersRevealed,
}) => {
  const { formatPrize, isGame } = useGameContext();

  // remember if the state is transitioning from precog to closed or from closed to precog
  const prevState = useRef<InstantWinNumberStates>(state);
  let isTransitioning = true;
  if (
    state === InstantWinNumberStates.PRECOG &&
    prevState.current === InstantWinNumberStates.CLOSED
  ) {
    prevState.current = InstantWinNumberStates.PRECOG;
    isTransitioning = false;
  } else if (
    state === InstantWinNumberStates.CLOSED &&
    prevState.current === InstantWinNumberStates.PRECOG
  ) {
    prevState.current = InstantWinNumberStates.CLOSED;
    isTransitioning = false;
  }

  const gallery: string[] = Object.values(
    import.meta.glob('../assets/my-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  let ariaLabel = '';
  const number = data.number.toString();
  const text = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed my symbols item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open my symbols item. number ${number} worth ${text}`;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning my symbols item. number ${number} worth ${text}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed my symbols item';
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing my symbols item. number ${number} worth ${text}`;
      break;
    default:
      break;
  }

  return (
    <li className='flex aspect-square w-10 sm-h:w-12 md-h:w-16'>
      <motion.button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        key={data.number_id}
        variants={variants}
        aria-label={ariaLabel}
        initial={isTransitioning ? 'initial_1' : 'initial_2'}
        animate='animate'
        exit='initial'
        transition={{ duration: 0.2 }}
        onClick={() => {
          announce('Revealed my symbols item. number ' + number + ' worth ' + text);
          onClick();
        }}
        className={`relative flex h-full w-full items-center justify-center`}
      >
        {/* scratch symbol */}
        <div className='absolute flex h-full w-full items-center justify-center'>
          <img className='h-auto w-full p-1' src={gallery[index]} alt='' />
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

export default UserNumbersItem;

type RenderStateProps = {
  state: InstantWinNumberStates;
  index: number;
  data: InstantWinNumber;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ state, index, data, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState index={index} />;
    case InstantWinNumberStates.OPEN:
      return <OpenState data={data} allNumbersRevealed={allNumbersRevealed} state={state} />;
    case InstantWinNumberStates.PRECOG:
      return <PreCogState index={index} />;
    case InstantWinNumberStates.SMALL_WIN:
      return <OpenState data={data} allNumbersRevealed={allNumbersRevealed} state={state} />;
    case InstantWinNumberStates.LOSER:
      return (
        <OpenState
          data={data}
          allNumbersRevealed={allNumbersRevealed}
          state={state}
          active={false}
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
  data: InstantWinNumber;
  allNumbersRevealed: boolean;
  state: InstantWinNumberStates;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { formatPrize, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  let text: string = '';

  if (typeof data.prize.value === 'string') {
    text = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;
  } else if (typeof data.prize.value === 'number') {
    text = `$${formatPrize(data.prize.value / 100)}`;
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
      !prefersReducedMotion &&
      !isRevealingAllByGroups
    );
  };

  const renderOpenState = (
    <div>
      <img src={dottedRectImg} className='absolute inset-0 h-full w-full p-1' alt='' />
      <div
        className={clsx(
          'relative flex h-full w-full flex-col items-center justify-center p-2',
          !active && 'opacity-50',
        )}
      >
        <StrokedText
          text={data.number.toString()}
          className='pt-1 text-2xl font-bold leading-5 md-h:text-3xl md-h:leading-6'
        />
        <p className='font-tempo text-xs font-bold md-h:text-sm'>{text}</p>
      </div>
    </div>
  );

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center rounded-md bg-salmon ${
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
    text = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;
  } else if (typeof data.prize.value === 'number') {
    text = `$${formatPrize(data.prize.value / 100)}`;
  }

  if (data?.prize?.tag) {
    text = getCashCompPrizeDisplayFromTag(data.prize.tag);
  }

  return (
    <Pulse isAnimated={true} className='relative flex h-full w-full items-center justify-center'>
      <img src={neonRect1Img} className='absolute inset-0 h-full w-full scale-105' alt='' />
      <motion.img
        animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        src={neonRect1Img}
        className='absolute inset-0 z-[1] h-full w-full object-cover blur'
      />
      <div className='relative flex h-full w-full flex-col items-center justify-center p-2'>
        <StrokedText
          text={data.number.toString()}
          className='pt-1 text-2xl font-bold leading-5 md-h:text-3xl md-h:leading-6'
          isActive={true}
        />
        <p className='font-tempo text-xs font-bold md-h:text-sm'>{text}</p>
      </div>
    </Pulse>
  );
};

type PreCogStateProps = {
  index: number;
};

const PreCogState: React.FC<PreCogStateProps> = ({ index }) => {
  const gallery: string[] = Object.values(
    import.meta.glob('../assets/my-symbols-animated/*.{png,jpg,jpeg,PNG,JPEG,gif}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <img
        className='h-auto w-full -translate-x-[0.12rem] -translate-y-[0.12rem] scale-110 p-1'
        src={gallery[index]}
        alt=''
      />
    </div>
  );
};
