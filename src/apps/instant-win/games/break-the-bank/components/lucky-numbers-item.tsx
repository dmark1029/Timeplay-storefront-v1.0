import clsx from 'clsx';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { GameStates, useGameContext } from '@/apps/instant-win/context/game-context';

import { SvgText } from '.';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import '../animation-code/animations.css';
import { caseClosed, caseOpen, caseOpening } from '../assets';

// import CaseOpening from './animation-components/case-opening';

export type LuckyNumber = { number: number; payout: number; revealed: boolean; winner: boolean };

interface LuckyNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  animated: boolean;
  allNumbersRevealed: boolean;
}

const LuckyNumbersItem: React.FC<LuckyNumbersItemProps> = ({ onClick, data, state, animated }) => {
  const { isGame } = useGameContext();
  let ariaLabel = '';

  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed lucky cases item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open lucky cases item. number ${data.number}`;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning lucky cases item. number ${data.number}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed lucky cases item';
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing lucky cases item. number ${data.number}`;
      break;
    default:
      break;
  }

  return (
    <li className='flex h-[49px] w-[69.5px] items-center justify-center'>
      <button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        aria-label={ariaLabel}
        onClick={onClick}
        className={`relative flex h-full w-full items-center justify-center `}
      >
        {/* scratch symbol */}

        <div className='absolute bottom-[7px] flex h-[42px] w-[48px] items-center justify-center'>
          <img
            src={caseClosed}
            className='h-full w-full'
            alt='interactive briefcase icon, click to reveal the contents'
          />
        </div>

        <RenderState state={state} data={data} animated={animated} />
      </button>
    </li>
  );
};

export default LuckyNumbersItem;

type RenderStateProps = {
  state: InstantWinNumberStates;
  data: InstantWinNumber;
  animated: boolean;
};

const RenderState: React.FC<RenderStateProps> = ({ state, data, animated }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState animated={animated} />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState data={data} state={state} />;
    case InstantWinNumberStates.SMALL_WIN:
      return <OpenState data={data} state={state} />;
    case InstantWinNumberStates.LOSER:
      return <OpenState data={data} state={state} active={false} />;
  }
};

type ClosedStateProps = {
  animated: boolean;
};

const ClosedState: React.FC<ClosedStateProps> = () => {
  return <></>;
};

//TODO: implement the precog state
const PrecogState: React.FC = () => {
  return (
    <div className='relative h-full w-full'>
      <img src={caseOpening} className='h-full w-full' alt='' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const winNumber = data.number.toString();

  const getState = () => {
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
    <div className='visible absolute inset-0 bottom-[6px] flex items-center justify-center'>
      <SvgText
        text={winNumber}
        className={'z-10 stroke-black stroke-2 text-2xl font-bold'}
        isActive={false}
      />
    </div>
  );

  return (
    <div
      className={clsx(
        `relative flex h-[49.5px] w-[60px] items-center justify-center rounded-lg bg-[#3A392D] align-middle`,
        showScratch() && 'individual-scratch-mask',
      )}
    >
      <div className={`relative flex items-center justify-center ${active ? '' : 'opacity-50'}`}>
        <img src={caseOpen} className='h-full w-full' alt='Opened briefcase icon' />
        {getState()}
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const winNumber = data.number.toString();

  return (
    <div className='casePulse winGlow visible absolute inset-0 bottom-[6px] flex h-full w-full items-center justify-center'>
      <SvgText
        text={winNumber}
        className={'z-10 mb-[6px] stroke-black stroke-2 text-2xl font-bold'}
        isActive={false}
      />
    </div>
  );
};
