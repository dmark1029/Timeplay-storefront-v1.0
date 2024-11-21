import { BsLightningChargeFill } from 'react-icons/bs';

import { LottoBallAnimation } from '../types';

interface LottoBallProps {
  number?: string | null;
  isActive?: boolean;
  onClick?: () => void;
  scale?: 'tiny' | 'small' | 'medium' | 'large';
  fireball?: boolean | null;
  match?: boolean | null;
  isDisabled?: boolean;
  ballAnimation?: LottoBallAnimation;
  ballContainerAnimation?: LottoBallAnimation;
  hidden?: boolean;
  ballFade?: string;
  className?: string;
}

const ballColors: { [state: string]: string } = {
  default: 'border-pp-ball-default-dark bg-pp-ball-default text-pp-ball-default-dark',
  match: 'border-pp-ball-match-dark bg-pp-ball-match text-pp-ball-match-dark',
  powerplay: 'border-pp-ball-powerplay-dark bg-pp-ball-powerplay text-pp-ball-powerplay-dark',
  inactive: 'border-pp-ball-inactive-dark bg-pp-ball-inactive text-pp-ball-inactive-dark',
  active: 'border-pp-ball-active-dark bg-pp-ball-active text-pp-ball-active-dark',
};

const ballShadows: { [state: string]: string } = {
  default: 'shadow-pp-ball-default-dark',
  match: 'shadow-pp-ball-match-dark',
  powerplay: 'shadow-pp-ball-powerplay-dark',
  inactive: 'shadow-pp-ball-inactive-dark',
  active: 'shadow-pp-ball-active-dark',
};

const LottoBall: React.FC<LottoBallProps> = ({
  number = null,
  isActive,
  onClick,
  scale = 'medium',
  fireball = null,
  match = null,
  isDisabled = false,
  ballContainerAnimation,
  ballAnimation,
  hidden = false,
}) => {
  let state = 'inactive';
  if (!isDisabled) {
    // checks if number is selected in manual picks
    if (isActive) {
      state = 'active';
    } else {
      state = 'default';
    }

    // if lotto ball is a "fireball" check whether or not it enabled or not
    if (!!fireball) {
      if (fireball) {
        state = 'powerplay';
      } else {
        state = 'inactive';
      }
    }

    // colours ball if it is a match
    if (match !== null) {
      if (match && !fireball) {
        state = 'match';
      }
    }
  }

  // fireball display for lines to show if fireball is selected (no number passed)
  if (number === null && fireball !== null) {
    if (fireball) {
      number = 'F';
    } else {
      number = '';
    }
  }

  const scaling = new Map([
    ['tiny', 'text-[1.1rem]'],
    ['small', 'text-[1.25rem]'],
    ['medium', 'text-[1.51rem]'],
    ['large', 'text-[1.75rem]'],
  ]);

  if (hidden)
    return (
      <div className={`${scaling.get(scale)}`}>
        <div className='h-[2.25em] w-[2.25em]'></div>
      </div>
    );

  return (
    <div onClick={onClick} className={`${scaling.get(scale)}`}>
      <div
        className={`${ballShadows[state]} ${ballContainerAnimation ?? ''} rounded-full shadow-md`}
      >
        <div
          className={`${ballColors[state]} ${
            ballAnimation ?? ''
          } flex h-[2.25em] w-[2.25em] items-center justify-center overflow-hidden rounded-full border-2
          shadow-[0px_2px_4px_-1px_#ffffff] before:relative before:left-[-0.8em] before:m-auto before:h-[1em] before:w-[1em] before:rounded-full before:bg-zinc-50 before:content-['']
          after:relative after:right-[-0.8em] after:m-auto after:h-[1em] after:w-[1em] after:rounded-full after:bg-zinc-50 after:bg-clip-padding after:content-['']`}
        >
          <div
            className={`absolute flex h-[1.35em] w-[1.35em] items-center justify-center rounded-full bg-zinc-50 bg-gradient-to-tr font-tempo`}
          >
            {number === null || number === undefined ? (
              '?'
            ) : number === 'F' ? (
              <BsLightningChargeFill />
            ) : (
              number
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LottoBall;
