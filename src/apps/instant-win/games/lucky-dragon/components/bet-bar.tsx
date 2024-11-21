import { useState } from 'react';

// import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import PurchaseModal from '@/apps/instant-win/components/purchase-modal';
import { InstantWinState } from '@/apps/instant-win/types';
import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';

import { GameStates, useGameContext } from '../../../context/game-context';
import '../assets';

enum PlayButtonState {
  SCRATCH,
  NEXT,
}

enum AutoplayButtonState {
  ENABLED_PLAYING,
  ENABLED_PAUSED,
  DISABLED,
}

enum BetBarStates {
  BUY,
  GAME,
}

const BetBar = ({ className = '' }) => {
  const { instances } = useGameContext();

  const totalInstances = instances?.length;
  const hasTickets = totalInstances > 0;

  let betBarState: BetBarStates = BetBarStates.BUY;
  if (hasTickets) {
    betBarState = BetBarStates.GAME;
  } else {
    betBarState = BetBarStates.BUY;
  }

  return (
    <div
      className={cn(
        'relative z-[21] mt-auto flex h-32 w-full flex-col items-center justify-center bg-black bg-opacity-60 px-6 py-2',
        className,
      )}
      id='bet-bar'
    >
      {/* <BuyMessage isVisible={!hasTickets} /> */}
      <RenderState state={betBarState} />
    </div>
  );
};

export default BetBar;

type RenderStateProps = {
  state: BetBarStates;
};

const RenderState: React.FC<RenderStateProps> = ({ state }) => {
  switch (state) {
    case BetBarStates.BUY:
      return <BuyState />;
    case BetBarStates.GAME:
      return <GameState />;
    default:
      return null;
  }
};

const BuyState: React.FC = () => {
  const { stakeIndex, possibleStakes, changeStakeAndSession } = useGameContext();
  const { balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;
  const { handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const handleBuyClick = async () => {
    console.log('handlePurchaseClick');
    setIsPurchaseModalOpen(true);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  const handleStakeClick = (index: number) => {
    console.log('handleStakeClick');
    changeStakeAndSession(index);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  // const handleInfoClick = () => {
  //   console.log('handleInfoClick');
  //   playSoundEffect(Sfx.OTH_BASIC_CLICK);
  // };

  return (
    <>
      <div className='flex h-full w-full justify-between'>
        <div className='flex w-full flex-col'>
          <p className='mb-2 mt-1 text-sm font-bold text-amber-300'>Select Your Ticket Price:</p>
          <div className='flex w-full justify-between'>
            <div className='flex h-full items-center gap-2'>
              {possibleStakes.slice(0, 3).map((price, index) => (
                <StakeButton
                  key={index}
                  onClick={() => handleStakeClick(index)}
                  selected={index === stakeIndex}
                  text={price.toString()}
                />
              ))}
            </div>
            <BuyButton onClick={handleBuyClick} />
          </div>
          <div className='mt-2 flex items-center justify-end gap-2'>
            <p className='text-sm font-bold text-amber-300'>
              Balance: <span className='text-white'>{casinoBalance.toFixed(2)}</span>
            </p>
            {/* <InfoButton onClick={handleInfoClick} /> */}
          </div>
        </div>
      </div>
      <PurchaseModal isOpen={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen} />
    </>
  );
};

type StakeButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  text: string;
  selected?: boolean;
};

const StakeButton: React.FC<StakeButtonProps> = ({ onClick, disabled, text, selected }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={clsx('relative flex w-12 items-center justify-center')}
    >
      {/* <img
        src={selected ? roundButtonSelectedImg : roundButtonEnabledImg}
        className='scale-105'
        alt=''
      /> */}
      <div
        className={clsx(
          'absolute -translate-y-[0.15rem] font-black',
          selected ? 'text-amber-300' : 'text-white',
        )}
      >
        ${text}
      </div>
    </motion.button>
  );
};

type BuyButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const BuyButton: React.FC<BuyButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className='relative ml-2 flex h-12 items-center justify-center drop-shadow-lg'
    >
      {/* <img src={buyButtonEnabledImg} className='h-full' alt='' /> */}
      <div
        className={clsx(
          'font-tempo text-3xl font-black uppercase leading-3',
          disabled ? 'text-neutral-700' : 'text-amber-300',
        )}
      >
        Buy
      </div>
    </motion.button>
  );
};

// type InfoButtonProps = {
//   onClick: () => void;
// };

// // const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
// //   return (
// //     <Popover>
// //       <PopoverTrigger>
// //         <motion.button
// //           initial={{ scale: 0 }}
// //           animate={{ scale: 1 }}
// //           whileTap={{ scale: 0.9 }}
// //           onClick={onClick}
// //           className='relative flex h-4 w-4 items-center justify-center drop-shadow-lg'
// //         >
// //           {/* <img src={informationButtonImg} className='h-full' alt='info' /> */}
// //         </motion.button>
// //       </PopoverTrigger>
// //       <PopoverContent>
// //         <div className='flex flex-col gap-2 p-4'>
// //           <p className='text-sm font-bold '>Your Gaming Wallet Balance</p>
// //         </div>
// //       </PopoverContent>
// //     </Popover>
// //   );
// // };

const GameState: React.FC = () => {
  const { isLoading, balance } = useAppContext();
  const casinoBalance = balance?.cmas?.casinoBankBalance || 0;
  const {
    instances,
    autoPlay,
    setAutoPlay,
    getNextInstance,
    gameState,
    instance,
    animatedRevealAll,
  } = useGameContext();
  const { playSoundEffect, handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();
  const [isRevealingAll, setIsRevealingAll] = useState(false);

  const totalInstances = instances?.length;
  const hasTickets = totalInstances > 0;
  const remainingTickets = totalInstances - 1;
  const disableNextButton =
    remainingTickets === 0 &&
    (gameState === GameStates.GAME_OVER || instance?.state === InstantWinState.InstantWinCompleted);

  const isPlayingAnimation = gameState === GameStates.WIN_ANIMATIONS;

  const nextInstance = async () => {
    console.log('next card');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    getNextInstance();
  };

  const revealAll = async () => {
    playSoundEffect(Sfx.OTH_REVEAL_ALL_BUTTON);
    console.log('reveal all');
    setIsRevealingAll(true);
    try {
      await animatedRevealAll();
    } catch (e) {
      // if we fail to reveal all set revealing to false
      console.error(e);
    } finally {
      setIsRevealingAll(false);
    }
  };

  let handlePlayClick: () => void;
  let playButtonState = PlayButtonState.NEXT;
  let isPlayButtonDisabled: boolean = false;

  if (
    gameState === GameStates.WIN_ANIMATIONS ||
    gameState === GameStates.GAME_OVER ||
    gameState === GameStates.REVEALED
  ) {
    playButtonState = PlayButtonState.NEXT;
    handlePlayClick = nextInstance;
  } else {
    playButtonState = PlayButtonState.SCRATCH;
    handlePlayClick = revealAll;
  }

  if (isLoading || isPlayingAnimation || isRevealingAll || autoPlay || disableNextButton) {
    isPlayButtonDisabled = true;
    handlePlayClick = () => {};
  }

  const startAutoplay = () => {
    console.log('start autoplay');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setAutoPlay(true);
  };

  const stopAutoplay = () => {
    console.log('stop autoplay');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setAutoPlay(false);
  };

  // const handleInfoClick = () => {
  //   console.log('handleInfoClick');
  //   playSoundEffect(Sfx.OTH_BASIC_CLICK);
  // };

  let handleAutoplayClick: () => void;
  let autoplayButtonState: AutoplayButtonState;
  if (isLoading || !hasTickets || isPlayingAnimation) {
    autoplayButtonState = AutoplayButtonState.DISABLED;
    handleAutoplayClick = () => {};
  } else {
    if (autoPlay) {
      autoplayButtonState = AutoplayButtonState.ENABLED_PLAYING;
      handleAutoplayClick = stopAutoplay;
    } else {
      autoplayButtonState = AutoplayButtonState.ENABLED_PAUSED;
      handleAutoplayClick = startAutoplay;
    }
  }

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center gap-3'>
      <div className='flex w-full justify-between'>
        <PlayButton
          onClick={handlePlayClick}
          state={playButtonState}
          disabled={isPlayButtonDisabled}
        />
        <AutoplayButton state={autoplayButtonState} onClick={handleAutoplayClick} />
      </div>
      <div className='flex w-full justify-between'>
        <div>
          <p className='text-sm font-bold text-amber-300'>
            Cards Remaining: <span className='text-white'>{remainingTickets}</span>
          </p>
        </div>
        <div className='flex items-center justify-end gap-2'>
          <p className='text-sm font-bold text-amber-300'>
            Balance: <span className='text-white'>{casinoBalance.toFixed(2)}</span>
          </p>
          {/* <InfoButton onClick={handleInfoClick} /> */}
        </div>
      </div>
    </div>
  );
};

type PlayButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  state: PlayButtonState;
  className?: string;
};

const PlayButton = ({ onClick, disabled = false, className, state }: PlayButtonProps) => {
  //   const imgSrc = disabled ? nextCardButtonDisabledImg : nextCardButtonEnabledImg;
  let text = 'Scratch \n all';

  if (state === PlayButtonState.NEXT) {
    text = 'Next card';
  } else if (state === PlayButtonState.SCRATCH) {
    text = 'Scratch all';
  } else {
    console.error('Invalid play button state');
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative mt-auto flex h-11 shrink-0 items-center justify-center drop-shadow-lg',
        className,
      )}
    >
      {/* <img src={imgSrc} className='h-full' alt='' /> */}

      <div
        className={clsx(
          'p-2 text-xl font-black uppercase leading-none',
          disabled ? 'text-neutral-700' : `text-white `,
        )}
      >
        {text}
      </div>
    </motion.button>
  );
};

type AutoplayButtonProps = {
  state: AutoplayButtonState;
  onClick: () => void;
};

const AutoplayButton = ({ state, onClick }: AutoplayButtonProps) => {
  // let imgSrc;
  let text;

  if (state === AutoplayButtonState.DISABLED) {
    // imgSrc = autoplayButtonDisabledImg;
    text = 'autoplay';
  } else if (state === AutoplayButtonState.ENABLED_PLAYING) {
    // imgSrc = autoplayButtonEnabledImg;
    text = 'stop \n autoplay';
  } else if (state === AutoplayButtonState.ENABLED_PAUSED) {
    // imgSrc = autoplayButtonEnabledImg;
    text = 'autoplay';
  } else {
    console.error('Invalid autoplay button state');
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: state === AutoplayButtonState.DISABLED ? 1 : 0.9 }}
      onClick={onClick}
      disabled={state === AutoplayButtonState.DISABLED}
      className='relative flex h-11 items-center justify-center drop-shadow-lg'
    >
      {/* <img src={imgSrc} className='h-full' alt='autoplay' /> */}
      <div
        className={clsx(
          'text-[12px] font-black uppercase leading-4',
          state === AutoplayButtonState.DISABLED && ' text-base text-neutral-700',
          state === AutoplayButtonState.ENABLED_PLAYING && 'px-2 text-white',
          state === AutoplayButtonState.ENABLED_PAUSED && ' text-base text-white',
        )}
      >
        {text}
      </div>
    </motion.button>
  );
};
