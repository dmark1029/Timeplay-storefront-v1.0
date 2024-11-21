import clsx from 'clsx';

import Pulse from '@/apps/instant-win/components/pulse';
import { useGameContext } from '@/apps/instant-win/context/game-context';

import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import '../animation-code/animations.css';
import { losingFrame, luckyCoin, winningFrame } from '../assets';

export type LuckyNumber = { number: number; payout: number; revealed: boolean; winner: boolean };

interface LuckyNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  state: InstantWinNumberStates;
}

const LuckyNumbersItem: React.FC<LuckyNumbersItemProps> = ({ onClick, data, state }) => {
  return (
    <button onClick={onClick} className={`flex h-12 w-12 shrink-0 items-center justify-center`}>
      <div className='h-full w-full'>
        <RenderState state={state} data={data} />
      </div>
    </button>
  );
};

export default LuckyNumbersItem;

type RenderStateProps = {
  state: InstantWinNumberStates;
  data: InstantWinNumber;
};

const RenderState: React.FC<RenderStateProps> = ({ state, data }) => {
  switch (state) {
    case InstantWinNumberStates.CLOSED:
      return <ClosedState />;
    case InstantWinNumberStates.PRECOG:
      return <PrecogState />;
    case InstantWinNumberStates.OPEN:
      return <OpenState data={data} />;
    case InstantWinNumberStates.SMALL_WIN:
      return <SmallWinState data={data} />;
    case InstantWinNumberStates.LOSER:
      return <OpenState data={data} active={false} />;
  }
};

type ClosedStateProps = {};

const ClosedState: React.FC<ClosedStateProps> = () => {
  return (
    <div className='relative flex h-full w-full items-center justify-center'>
      <img src={luckyCoin} className='mt-3 h-10 w-10' />
    </div>
  );
};

//TODO: implement the precog state
const PrecogState: React.FC = () => {
  return (
    <div className='relative flex h-full w-full items-center justify-center'>
      <img src={luckyCoin} className='h-11 w-11' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, active = true }) => {
  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG,svg}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <div className={`relative h-full w-full rounded-md`}>
      <div className='flex items-center justify-center'>
        <img
          src={losingFrame}
          alt='Background'
          className='absolute inset-0 m-auto mt-1 h-full w-full object-contain'
        />
      </div>
      <div
        className={clsx(
          'flex aspect-square h-full flex-col items-center justify-center',
          !active && 'opacity-50',
        )}
      >
        <img
          src={prizeGallery[data.number - 1]}
          className='z-10 mt-2 h-6 w-auto object-contain'
          aria-label={'Symbol type ' + (data.number - 1)}
        />
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { prefersReducedMotion } = useGameContext();

  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG,svg}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  return (
    <div className={`relative h-full w-full items-center justify-center rounded-md `}>
      <Pulse
        isAnimated={!prefersReducedMotion}
        className={`relative flex h-full w-full flex-col items-center justify-center`}
      >
        <img
          src={winningFrame}
          alt='Background'
          className='absolute inset-0 m-auto mt-1 h-full w-full object-contain'
        />
        <div className='flex h-full w-full flex-col'>
          <div className={clsx('flex aspect-square h-full flex-col items-center justify-center')}>
            <img
              src={prizeGallery[data.number - 1]}
              className='z-10 mt-1 h-6 w-auto object-contain'
              aria-label={'Symbol type ' + (data.number - 1)}
            />
          </div>
        </div>
      </Pulse>
    </div>
  );
};
