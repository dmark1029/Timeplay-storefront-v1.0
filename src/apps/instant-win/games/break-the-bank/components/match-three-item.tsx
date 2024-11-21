import clsx from 'clsx';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { GameStates, useGameContext } from '@/apps/instant-win/context/game-context';

import { SvgText } from '.';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import { caseOpening, match3ClosedCase, match3OpenedCase } from '../assets';

export type MatchNumber = { number: number; payout: number; revealed: boolean; winner: boolean };
interface MatchThreeItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  animated: boolean;
}

const MatchThreeItem: React.FC<MatchThreeItemProps> = ({ onClick, data, state, animated }) => {
  const { isGame, formatPrize } = useGameContext();
  const winAmount = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;
  let ariaLabel = '';

  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed match 3 item';
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed match 3 item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = 'Open match 3 item worth ' + winAmount;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = 'Winning match 3 item worth ' + winAmount;
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = 'Losing match 3 item worth ' + winAmount;
      break;
  }

  return (
    <li className='relative flex h-full w-[69.5px] items-center justify-center'>
      <button
        aria-hidden={!isGame}
        tabIndex={isGame ? 0 : -1}
        aria-label={ariaLabel}
        onClick={onClick}
        className={`relative flex h-full w-full items-center justify-center `}
      >
        {/* scratch symbol */}
        <div className={'absolute flex h-auto w-[48px] items-center justify-center'}>
          <img
            src={match3ClosedCase}
            className='h-full w-full'
            alt='interactive briefcase icon, click to reveal the contents'
          />
        </div>

        <RenderState state={state} data={data} animated={animated} />
      </button>
    </li>
  );
};

export default MatchThreeItem;

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
      <img src={caseOpening} className='h-full w-full' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  state: InstantWinNumberStates;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, active = true, state }) => {
  const { formatPrize, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();
  const winAmount = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  const getState = () => {
    switch (state) {
      case InstantWinNumberStates.SMALL_WIN:
        return <SmallWinState data={data} active={true} />;
      default:
        return renderOpenState;
    }
  };

  const renderOpenState = (
    <div className='visible absolute inset-0 bottom-[35%] flex flex-col items-center justify-center'>
      <SvgText
        text={winAmount}
        className={'z-10 stroke-black stroke-2 text-sm font-bold md-h:text-lg'}
        isActive={true}
      />
    </div>
  );

  const showScratch = () => {
    return (
      gameState === GameStates.PLAYING &&
      !revealAnimating &&
      !prefersReducedMotion &&
      !isRevealingAllByGroups
    );
  };

  return (
    <div
      className={clsx(
        `relative flex h-auto w-[60px] items-center justify-center rounded-lg bg-black align-middle`,
        showScratch() && 'individual-scratch-mask',
      )}
    >
      <div
        className={`relative flex h-full w-[85%] items-center justify-center ${
          active ? '' : 'opacity-50'
        }`}
      >
        <img src={match3OpenedCase} className='h-full w-full' alt='Opened briefcase icon' />
        {getState()}
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
  active?: boolean;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data, active = true }) => {
  const { formatPrize } = useGameContext();
  const winAmount = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  return (
    <>
      <div className={clsx('match3Glow absolute h-full w-full', !active && 'opacity-50')}>
        <div className='visible absolute inset-0 bottom-[35%] flex flex-col items-center justify-center'>
          <SvgText
            text={winAmount}
            className={'dondWinPulse z-10 stroke-black stroke-2 text-sm font-bold'}
            isActive={true}
          />
        </div>
      </div>
    </>
  );
};
