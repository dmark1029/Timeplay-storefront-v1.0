import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import Pulse from '@/apps/instant-win/components/pulse';
import { useAnimationContext } from '@/apps/instant-win/context/animation-context';

import { GameStates, useGameContext } from '../../../context/game-context';
import '../../../styles.css';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { neonRect1Img } from '../assets';
import { dottedRect } from '../assets';
import SvgText from './svg-text';

const variants = {
  initial_1: { opacity: 0, scale: 1.5 },
  initial_2: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
};

interface UserNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
}

const UserNumbersItem: React.FC<UserNumbersItemProps> = ({
  onClick,
  data,
  index,
  state,
  allNumbersRevealed,
}) => {
  const { formatPrize, isGame, getSymbolAriaLabel } = useGameContext();

  const gallery: string[] = Object.values(
    import.meta.glob('../assets/my-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  const text = formatPrize(parseFloat(data.prize.value) / 100);

  return (
    <li className={`relative flex h-full w-full items-center justify-center`}>
      <motion.button
        key={data.number_id}
        variants={variants}
        initial={state === InstantWinNumberStates.LOSER ? 'initial_2' : 'initial_1'}
        animate='animate'
        exit='initial_1'
        transition={{ duration: 0.2 }}
        onClick={() => {
          announce('Revealed symbol ' + getSymbolAriaLabel(data.number - 1) + ' worth $' + text);
          onClick();
        }}
        className={`relative flex h-full w-full items-center justify-center focus:outline-2 focus:outline-offset-2 focus:outline-red-500`}
        disabled={!isGame}
      >
        {/* scratch symbol */}

        <div className='absolute z-[-1] flex h-full w-full items-center justify-center'>
          <img className='h-auto w-full ' src={gallery[index]} aria-label={'Closed number'} />
        </div>

        <RenderState
          data={data}
          index={index}
          state={state}
          allNumbersRevealed={allNumbersRevealed}
        />
      </motion.button>
    </li>
  );
};

export default UserNumbersItem;

type RenderStateProps = {
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  allNumbersRevealed: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ data, index, state, allNumbersRevealed }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState data={data} index={index} />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState data={data} />;
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
  data: InstantWinNumber;
  index: number;
};

const ClosedState: React.FC<ClosedStateProps> = () => {
  return <></>;
};

type PrecogStateProps = {
  data: InstantWinNumber;
};

const PrecogState: React.FC<PrecogStateProps> = () => {
  return <div className='flex h-full w-full items-center justify-center bg-salmon'></div>;
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  active?: boolean;
  allNumbersRevealed: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { formatPrize, getSymbolAriaLabel, gameState, revealAnimating, prefersReducedMotion } =
    useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const text = formatPrize(parseFloat(data.prize.value) / 100);

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
    <div
      className={clsx(
        'relative flex aspect-square h-full w-full flex-col items-center justify-center',
      )}
    >
      <div
        className={clsx(
          'flex aspect-square h-full flex-col items-center justify-center px-2 pb-2 pt-2.5',
        )}
      >
        <img
          src={prizeGallery[data.number - 1]}
          className={clsx('z-10 h-6 w-auto object-contain', !active && 'opacity-50')}
          aria-label={'Symbol ' + getSymbolAriaLabel(data.number - 1) + ' worth $' + text}
        />
        <SvgText
          text={`$${text}`}
          isActive={data.winner}
          className='z-20 translate-y-0.5 text-[10px] font-bold md-h:text-xs'
        />
      </div>

      <img
        src={dottedRect}
        className='absolute inset-0 z-[1] h-full w-full object-contain p-1'
        alt=''
      />
    </div>
  );

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-md bg-salmon ${
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
  const { formatPrize, prefersReducedMotion, getSymbolAriaLabel } = useGameContext();
  const text = formatPrize(parseFloat(data.prize.value) / 100);

  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <div className='relative flex aspect-square h-full flex-col items-center justify-center '>
      <Pulse
        isAnimated={!prefersReducedMotion}
        className={`relative flex h-full w-full flex-col items-center justify-center`}
      >
        <div className='flex h-full w-full flex-col px-2 pb-2 pt-2.5'>
          <img
            src={prizeGallery[data.number - 1]}
            className='z-10 h-6 w-auto object-contain'
            aria-label={'Symbol ' + getSymbolAriaLabel(data.number - 1) + ' worth $' + text}
          />
          <SvgText
            text={`$${text}`}
            isActive={data.winner}
            className='z-20 translate-y-0.5 text-[10px] font-bold md-h:text-xs'
          />
        </div>
        <img
          src={neonRect1Img}
          className='absolute inset-0 z-[1] h-full w-full scale-105 object-fill'
          alt=''
        />
      </Pulse>
    </div>
  );
};
