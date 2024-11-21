import clsx from 'clsx';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { GameStates, useGameContext } from '@/apps/instant-win/context/game-context';

import '../../../styles.css';
import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import '../animation-code/animations.css';
import { caseClosed, caseOpen } from '../assets';
import SvgText from './svg-text';

interface UserNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
  animated: boolean;
}

const UserNumbersItem: React.FC<UserNumbersItemProps> = ({ onClick, data, state, animated }) => {
  const { isGame, formatPrize } = useGameContext();
  let ariaLabel = '';
  const text = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  switch (state) {
    case InstantWinNumberStates.CLOSED:
      ariaLabel = 'Closed your cases item';
      break;
    case InstantWinNumberStates.OPEN:
      ariaLabel = `Open your cases item. number ${data.number} worth ${text}`;
      break;
    case InstantWinNumberStates.SMALL_WIN:
      ariaLabel = `winning your cases item. number ${data.number} worth ${text}`;
      break;
    case InstantWinNumberStates.PRECOG:
      ariaLabel = 'Closed your cases item';
      break;
    case InstantWinNumberStates.LOSER:
      ariaLabel = `Losing your cases item. number ${data.number} worth ${text}`;
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
        className='relative flex h-full w-full items-center justify-center'
      >
        {/* scratch symbol */}
        <div className='absolute bottom-[7px] flex h-[42x] w-[48px] items-center justify-center'>
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

export default UserNumbersItem;

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
      <img src={caseOpen} className='h-full w-full' alt='' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  active?: boolean;
  state: InstantWinNumberStates;
};

const OpenState: React.FC<OpenStateProps> = ({ data, state, active = true }) => {
  const { formatPrize, gameState, revealAnimating, prefersReducedMotion } = useGameContext();
  const { isRevealingAllByGroups } = useAnimationContext();

  const winAmount = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  const getState = () => {
    switch (state) {
      case InstantWinNumberStates.SMALL_WIN:
        return <SmallWinState data={data} />;
      default:
        return renderOpenState;
    }
  };

  const renderOpenState = (
    <div
      className={`caseTextBottom absolute inset-0 flex h-[80%] flex-col items-center justify-center`}
    >
      <SvgText
        text={data.number.toString()}
        isActive={false}
        className='relative z-10 stroke-black stroke-2 font-bold'
        fontSize='16px'
      />
      <SvgText
        text={winAmount}
        isActive={false}
        className='relative z-10 stroke-2 text-base font-bold'
        fontSize='12px'
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
        `relative h-[49.5px] w-[60px] items-center justify-center rounded-lg bg-black align-middle`,
        showScratch() && 'individual-scratch-mask',
      )}
    >
      <div className={`${active ? '' : 'opacity-50'}`}>
        <img src={caseOpen} className='absolute h-full w-full' alt='Opened briefcase icon' />
        {getState()}
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { formatPrize } = useGameContext();

  const winAmount = `$${formatPrize(parseFloat(data.prize.value) / 100)}`;

  return (
    <div className={clsx('winGlow absolute h-full w-full')}>
      <div
        className={`caseTextBottom visible absolute inset-0 flex h-[80%] flex-col items-center justify-center`}
      >
        <SvgText
          text={data.number.toString()}
          isActive={true}
          className='relative z-10 stroke-black stroke-2 text-lg font-bold '
          fontSize='16px'
        />
        <SvgText
          text={winAmount}
          isActive={true}
          className='relative z-10 stroke-2 text-base font-bold'
          fontSize='12px'
        />
      </div>
    </div>
  );
};
