import clsx from 'clsx';

import Pulse from '@/apps/instant-win/components/pulse';
import { useGameContext } from '@/apps/instant-win/context/game-context';
import { getPreMultiplierAmountWon } from '@/apps/instant-win/util';

import { InstantWinNumber, InstantWinNumberStates } from '../../../types';
import '../animation-code/animations.css';
import { closedItem, losingFrame, winningFrame } from '../assets';

interface UserNumbersItemProps {
  onClick: () => void;
  data: InstantWinNumber;
  index: number;
  state: InstantWinNumberStates;
}

const UserNumbersItem: React.FC<UserNumbersItemProps> = ({ onClick, data, state }) => {
  return (
    <button onClick={onClick} className='flex h-12 w-12 shrink-0 items-center justify-center'>
      <div className='h-full w-full content-center items-center'>
        <RenderState state={state} data={data} />
      </div>
    </button>
  );
};

export default UserNumbersItem;

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

const ClosedState: React.FC = () => {
  return (
    <div className={clsx('relative flex justify-center')}>
      <img src={closedItem} className='h-10' />
    </div>
  );
};

//TODO: implement the precog state
const PrecogState: React.FC = () => {
  return (
    <div className='relative h-full w-full'>
      <img src={closedItem} className='h-full w-full' />
    </div>
  );
};

type OpenStateProps = {
  data: InstantWinNumber;
  active?: boolean;
};

const OpenState: React.FC<OpenStateProps> = ({ data, active = true }) => {
  const { formatPrize } = useGameContext();

  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG,svg}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  const winAmount = formatPrize(getPreMultiplierAmountWon(data.prize));

  return (
    <div className={`relative h-full w-full rounded-md`}>
      <img
        src={losingFrame}
        alt='Background'
        className='absolute inset-0 m-auto h-full w-auto object-contain'
      />
      <div
        className={clsx(
          'relative flex aspect-square h-full w-full flex-col items-center justify-center',
        )}
      >
        <div
          className={clsx(
            'flex aspect-square h-full flex-col items-center justify-between',
            !active && 'opacity-50',
          )}
        >
          <div className='flex flex-grow items-center justify-center'>
            <img
              src={prizeGallery[data.number - 1]}
              className='z-10 mt-1 h-5 w-auto object-contain'
              aria-label={'Symbol type ' + (data.number - 1) + ' worth $' + winAmount}
            />
          </div>
          <p className='font-arial z-20 mb-1 translate-y-0.5 text-[.6rem] font-bold'>{`$${winAmount}`}</p>
        </div>
      </div>
    </div>
  );
};

type SmallWinStateProps = {
  data: InstantWinNumber;
};

const SmallWinState: React.FC<SmallWinStateProps> = ({ data }) => {
  const { formatPrize, prefersReducedMotion } = useGameContext();
  const prizeGallery: string[] = Object.values(
    import.meta.glob('../assets/prize-symbols/*.{png,jpg,jpeg,PNG,JPEG,svg}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  );

  const winAmount = `${formatPrize(getPreMultiplierAmountWon(data.prize))}`;

  return (
    <div className={`relative h-full w-full items-center justify-center rounded-md `}>
      <Pulse
        isAnimated={!prefersReducedMotion}
        className={`relative flex h-full w-full flex-col items-center justify-center`}
      >
        <img
          src={winningFrame}
          alt='Background'
          className='absolute inset-0 m-auto h-full w-auto object-contain'
        />
        <div className='flex h-full w-full flex-col'>
          <div className={clsx('flex aspect-square h-full flex-col items-center justify-between')}>
            <div className='flex flex-grow items-center justify-center'>
              <img
                src={prizeGallery[data.number - 1]}
                className='z-10 mt-1 h-5 w-auto object-contain'
                aria-label={'Symbol type ' + (data.number - 1) + ' worth $' + winAmount}
              />
            </div>
            <p className='font-arial z-20 mb-1 translate-y-0.5 text-[.6rem] font-bold text-white'>{`$${winAmount}`}</p>
          </div>
        </div>
      </Pulse>
    </div>
  );
};
