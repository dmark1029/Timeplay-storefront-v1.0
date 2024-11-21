import { useEffect, useRef, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import PurchaseModal from '@/apps/instant-win/components/purchase-modal';
import { InstantWinState } from '@/apps/instant-win/types';
import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { cn } from '@/utils/cn';
import { GameIds } from '@/utils/types';

import { useAnimationContext } from '../context/animation-context';
import { GameStates, useGameContext } from '../context/game-context';
import {
  autoplayButtonActiveImg as dondAutoplayButtonActiveImg,
  autoplayButtonDisabledImg as dondAutoplayButtonDisabledImg,
  autoplayButtonEnabledImg as dondAutoplayButtonEnabledImg,
  buyButtonEnabledImg as dondBuyButtonEnabledImg,
  informationButtonImg as dondInformationButtonImg,
  playButtonDisabledImg as dondPlayButtonDisabledImg,
  playButtonEnabledImg as dondPlayButtonEnabledImg,
  stakeButtonEnabledImg as dondStakeButtonEnabledImg,
  stakeButtonSelectedImg as dondStakeButtonSelectedImg,
} from '../games/break-the-bank/assets';
import { informationButtonImg as cfcInformationButtonImg } from '../games/cruising-for-cash/assets';
import '../games/ocean-treasure/animation-code/animations.css';
import {
  autoplayButtonActiveImg as othAutoplayButtonActiveImg,
  autoplayButtonDisabledImg as othAutoplayButtonDisabledImg,
  autoplayButtonEnabledImg as othAutoplayButtonEnabledImg,
  buyButtonEnabledImg as othBuyButtonEnabledImg,
  informationButtonImg as othInformationButtonImg,
  nextCardButtonDisabledImg as othNextCardButtonDisabledImg,
  nextCardButtonEnabledImg as othNextCardButtonEnabledImg,
  roundButtonEnabledImg as othRoundButtonEnabledImg,
  roundButtonSelectedImg as othRoundButtonSelectedImg,
} from '../games/ocean-treasure/assets';
import '../styles.css';
import AutoplayModal from './autoplay-modal';

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

const BetBarSimple: React.FC = () => {
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
    <Wrapper>
      <RenderState state={betBarState} />
    </Wrapper>
  );
};

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const { gameId } = useStoreFrontContext();

  return (
    <div
      id='bet-bar'
      className={cn(
        'relative z-[21] mt-auto flex h-32 w-full flex-col items-center justify-center ',
        gameId === GameIds.OceanTreasure && ' z-[19] bg-black bg-opacity-60 px-6 py-2',
        gameId === GameIds.CruisingForCash && 'px-6 py-2',
        gameId === GameIds.BreakTheBank &&
          'z-[10] bg-black bg-opacity-60 px-5 sm-h:h-[6.25rem] md-h:h-32',
      )}
    >
      {children}
    </div>
  );
};

export default BetBarSimple;

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
  const { handleGenericClickAudio } = useAudioContext();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { gameId } = useStoreFrontContext();
  const { displayCasinoBalance } = useAnimationContext();

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

  const handleInfoClick = () => {
    console.log('handleInfoClick');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  return (
    <>
      <div className='flex h-full w-full flex-col sm-h:justify-start md-h:justify-center'>
        <h2
          className={cn(
            gameId === GameIds.OceanTreasure &&
              'text-md mb-2 mt-1 font-passion-one tracking-wide text-oct-blue',
            gameId === GameIds.CruisingForCash &&
              'text-md mb-2 mt-1 font-tempo tracking-wide text-white',
            gameId === GameIds.BreakTheBank &&
              'mt-1 font-eurostile-extended-bold text-xs text-dond-yellow sm-h:mb-0 md-h:mb-2',
          )}
        >
          Select Your Card Price:
        </h2>
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
        <div
          className={`mt-2 flex items-center justify-end gap-2`}
          style={{
            height: '1rem',
          }}
        >
          <p
            className={cn(
              gameId === GameIds.OceanTreasure &&
                'text-md font-passion-one leading-5 tracking-wide text-oct-blue',
              gameId === GameIds.CruisingForCash &&
                '-translate-y-[0.2rem] font-tempo text-base text-white',
              gameId === GameIds.BreakTheBank &&
                'font-eurostile-extended-bold text-xs text-dond-yellow',
            )}
            style={{
              height: '18px',
            }}
          >
            Balance:{' '}
            <span
              className={cn(
                gameId === GameIds.OceanTreasure && 'text-white',
                gameId === GameIds.CruisingForCash && 'text-white',
                gameId === GameIds.BreakTheBank && 'text-dond-yellow',
              )}
            >
              {displayCasinoBalance}
            </span>
          </p>
          <InfoButton onClick={handleInfoClick} />
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
  let selectedImgSrc;
  let unselectedImgSrc;

  const { gameId } = useStoreFrontContext();

  if (gameId === GameIds.OceanTreasure) {
    selectedImgSrc = othRoundButtonSelectedImg;
    unselectedImgSrc = othRoundButtonEnabledImg;
  } else if (gameId === GameIds.CruisingForCash) {
    selectedImgSrc = null;
    unselectedImgSrc = null;
  } else if (gameId === GameIds.BreakTheBank) {
    selectedImgSrc = dondStakeButtonSelectedImg;
    unselectedImgSrc = dondStakeButtonEnabledImg;
  } else {
    console.error('Invalid game id');
  }

  const imgSrc = selected ? selectedImgSrc : unselectedImgSrc;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-12 w-12 items-center justify-center drop-shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-white sm-h:h-11 sm-h:w-11 md-h:h-12 md-h:w-12',
        gameId === GameIds.OceanTreasure && '',
        gameId === GameIds.OceanTreasure && selected && '',

        gameId === GameIds.CruisingForCash && 'rounded-xl border-3 border-cfc-blue bg-cfc-blue ',
        gameId === GameIds.CruisingForCash && selected && ' bg-white',

        gameId === GameIds.BreakTheBank && '',
        gameId === GameIds.BreakTheBank && selected && '',
      )}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          className={cn(
            gameId === GameIds.OceanTreasure && 'drop-shadow-lg',
            gameId === GameIds.CruisingForCash && '',
            gameId === GameIds.BreakTheBank && '',
          )}
          alt=''
        />
      )}
      <div
        className={cn(
          'absolute',
          gameId === GameIds.OceanTreasure &&
            ' -translate-y-[0.15rem] font-passion-one text-xl font-black text-oct-dark-brown drop-shadow-[0px_1px_0.5px_#F0DEC7]',
          gameId === GameIds.OceanTreasure &&
            selected &&
            'text-white drop-shadow-[0px_0px_2px_#702F19]',

          gameId === GameIds.CruisingForCash && 'font-tempo text-white',
          gameId === GameIds.CruisingForCash && selected && 'font-tempo text-xl text-cfc-blue',

          gameId === GameIds.BreakTheBank && 'font-black text-black',
          gameId === GameIds.BreakTheBank && selected && 'text-dond-gold',
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
  const { gameId } = useStoreFrontContext();
  let imgSrc;

  if (gameId === GameIds.OceanTreasure) {
    imgSrc = othBuyButtonEnabledImg;
  } else if (gameId === GameIds.CruisingForCash) {
    imgSrc = null;
  } else if (gameId === GameIds.BreakTheBank) {
    imgSrc = dondBuyButtonEnabledImg;
  } else {
    console.error('Invalid game id');
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      aria-label='Press to open the purchase modal'
      className={cn(
        'relative ml-2 flex  items-center justify-center drop-shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white',
        gameId === GameIds.OceanTreasure &&
          'h-12 font-tempo text-3xl font-black uppercase leading-3 text-oct-dark-brown disabled:text-neutral-700',
        gameId === GameIds.CruisingForCash &&
          'h-12 w-28 rounded-xl bg-cfc-blue font-tempo text-2xl uppercase text-white',
        gameId === GameIds.BreakTheBank &&
          'h-12 font-eurostile-extended-bold text-base uppercase sm-h:h-10 md-h:h-12',
      )}
    >
      {imgSrc && <img src={imgSrc} className='h-full' alt='' />}
      <div
        className={cn(
          'absolute',
          gameId === GameIds.OceanTreasure &&
            'font-passion-one drop-shadow-[0px_1px_0.5px_#F0DEC7]',
        )}
      >
        Buy
      </div>
    </motion.button>
  );
};

type InfoButtonProps = {
  onClick: () => void;
};

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  const { gameId } = useStoreFrontContext();
  let imgSrc;

  if (gameId === GameIds.OceanTreasure) {
    imgSrc = othInformationButtonImg;
  } else if (gameId === GameIds.CruisingForCash) {
    imgSrc = cfcInformationButtonImg;
  } else if (gameId === GameIds.BreakTheBank) {
    imgSrc = dondInformationButtonImg;
  } else {
    console.error('Invalid game id');
  }

  return (
    <Popover className='focus:rounded-[.9rem] focus:ring-2 focus:ring-info-popover-blue'>
      <PopoverTrigger>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className='relative flex h-4 w-4 items-center justify-center drop-shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white'
        >
          <img src={imgSrc} className='h-full' alt='info' />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex flex-col gap-2 p-4'>
          <p className='text-sm font-bold '>Your Gaming Wallet Balance</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const GameState: React.FC = () => {
  const { isLoading } = useAppContext();
  const {
    instances,
    autoPlay,
    setAutoPlay,
    getNextInstance,
    gameState,
    instance,
    isInstanceCompleting,
    revealAllError,
    completeError,
    isRevealingAll,
    setIsRevealingAll,
  } = useGameContext();
  const { triggerGroupScratchAnimation, displayCasinoBalance, starBurst, triggerBalanceTickBurst } =
    useAnimationContext();
  const { playSoundEffect, handleGenericClickAudio } = useAudioContext();
  const { gameId } = useStoreFrontContext();

  const [isAutoplayModalOpen, setIsAutoplayModalOpen] = useState(false);

  const balancePositionRef = useRef<HTMLSpanElement>(null);

  const totalInstances = instances?.length;
  const hasTickets = totalInstances > 0;
  const remainingTickets = totalInstances - 1;
  const disableNextButton =
    remainingTickets === 0 &&
    (gameState === GameStates.GAME_OVER || instance?.state === InstantWinState.InstantWinCompleted);

  const isInitializing = gameState === GameStates.INITIALIZING;
  const isPlayingAnimation = gameState === GameStates.WIN_ANIMATIONS;

  const nextInstance = async () => {
    console.log('next card');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    getNextInstance();
  };

  const revealAll = async () => {
    console.log('reveal all');
    setIsRevealingAll(true);
    try {
      switch (gameId) {
        case 'ocean-treasure':
          playSoundEffect(Sfx.OTH_REVEAL_ALL_BUTTON);
          await triggerGroupScratchAnimation();
          break;
        case 'dond-dbk':
          playSoundEffect(Sfx.DOND_REVEAL_ALL_BUTTON);
          await triggerGroupScratchAnimation();
          break;
        case 'cruising-for-cash':
          playSoundEffect(Sfx.CFC_REVEAL_ALL_BUTTON);
          await triggerGroupScratchAnimation();
          break;
      }
    } catch (e) {
      // if we fail to reveal all set revealing to false
      console.error(e);
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

  if (
    isLoading ||
    isPlayingAnimation ||
    isRevealingAll ||
    autoPlay ||
    disableNextButton ||
    isInstanceCompleting ||
    isInitializing
  ) {
    isPlayButtonDisabled = true;
    handlePlayClick = () => {};
  }

  // set revealling completed when the state changes
  useEffect(() => {
    if (gameState === GameStates.GAME_OVER || gameState === GameStates.WIN_ANIMATIONS) {
      setIsRevealingAll(false);
    }
  }, [gameState]);

  // if theres an error during complete or reveal call, we want to re-enable the button
  useEffect(() => {
    // if theres an error revealing or completeing reset this bool
    if (revealAllError || completeError) {
      setIsRevealingAll(false);
    }
  }, [revealAllError, completeError]);

  const startAutoplay = () => {
    console.log('start autoplay');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    const dontAskForAutoplay = localStorage.getItem('dont_ask_for_autoplay');
    if (dontAskForAutoplay === 'true') {
      setAutoPlay(true);
      return;
    }
    setIsAutoplayModalOpen(true);
  };

  const stopAutoplay = () => {
    console.log('stop autoplay');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
    setAutoPlay(false);
  };

  const handleInfoClick = () => {
    console.log('handleInfoClick');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  let handleAutoplayClick: () => void;
  let autoplayButtonState: AutoplayButtonState;
  if (isLoading || !hasTickets || isPlayingAnimation || (isInstanceCompleting && !autoPlay)) {
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

  useEffect(() => {
    if (triggerBalanceTickBurst && !!balancePositionRef?.current?.getBoundingClientRect()) {
      starBurst(balancePositionRef.current?.getBoundingClientRect());
    }
  }, [triggerBalanceTickBurst]);

  return (
    <>
      <div className=' relative flex h-full w-full flex-col items-center justify-center gap-3 sm-h:mt-2 sm-h:justify-start md-h:mt-2 md-h:justify-center'>
        <div className='flex w-full justify-between'>
          <PlayButton
            onClick={handlePlayClick}
            state={playButtonState}
            disabled={isPlayButtonDisabled}
          />
          <AutoplayButton state={autoplayButtonState} onClick={handleAutoplayClick} />
        </div>
        <div
          className='flex w-full justify-between'
          style={{
            height: '1rem',
          }}
        >
          <div>
            <p
              className={cn(
                gameId === GameIds.OceanTreasure && ' text-sm font-bold text-oct-blue',
                gameId === GameIds.CruisingForCash && ' font-tempo text-base text-cfc-dark-blue',
                gameId === GameIds.BreakTheBank &&
                  ' font-eurostile-extended-bold text-[10px] text-dond-yellow',
              )}
              style={{
                height: '18px',
              }}
            >
              Cards Remaining:{' '}
              <span
                className={cn(
                  gameId === GameIds.OceanTreasure && ' text-white',
                  gameId === GameIds.CruisingForCash && ' text-cfc-dark-blue',
                  gameId === GameIds.BreakTheBank && ' text-dond-yellow',
                )}
              >
                {remainingTickets}
              </span>
            </p>
          </div>
          <div
            className='flex items-center justify-end gap-2'
            style={{
              height: '1rem',
            }}
          >
            <p
              className={cn(
                gameId === GameIds.OceanTreasure &&
                  'text-md font-passion-one leading-5 tracking-wide text-oct-blue',
                gameId === GameIds.CruisingForCash &&
                  '-translate-y-[0.2rem] font-tempo text-base font-bold text-cfc-dark-blue',
                gameId === GameIds.BreakTheBank &&
                  'font-eurostile-extended-bold text-[10px] text-dond-yellow',
              )}
              style={{
                height: '18px',
              }}
            >
              Balance:{' '}
              <span
                ref={balancePositionRef}
                className={cn(
                  gameId === GameIds.OceanTreasure && ' text-white',
                  gameId === GameIds.CruisingForCash && ' text-cfc-dark-blue',
                  gameId === GameIds.BreakTheBank && ' text-dond-yellow',
                  // triggerBalanceTickBurst && 'coinBurst',
                )}
              >
                {displayCasinoBalance}
              </span>
            </p>
            <InfoButton onClick={handleInfoClick} />
          </div>
        </div>
      </div>
      <AutoplayModal isOpen={isAutoplayModalOpen} onOpenChange={setIsAutoplayModalOpen} />
    </>
  );
};

type PlayButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  state: PlayButtonState;
};

const PlayButton = ({ onClick, disabled = false, state }: PlayButtonProps) => {
  const { gameId } = useStoreFrontContext();

  let disabledImgSrc;
  let enabledImgSrc;

  let text = 'Scratch all';

  if (state === PlayButtonState.NEXT) {
    text = 'Next card';
  } else if (state === PlayButtonState.SCRATCH) {
    text = 'Scratch all';
  } else {
    console.error('Invalid play button state');
  }

  if (gameId === GameIds.OceanTreasure) {
    disabledImgSrc = othNextCardButtonDisabledImg;
    enabledImgSrc = othNextCardButtonEnabledImg;
  } else if (gameId === GameIds.CruisingForCash) {
    disabledImgSrc = null;
    enabledImgSrc = null;
  } else if (gameId === GameIds.BreakTheBank) {
    disabledImgSrc = dondPlayButtonDisabledImg;
    enabledImgSrc = dondPlayButtonEnabledImg;
  } else {
    console.error('Invalid game id');
  }

  const imgSrc = disabled ? disabledImgSrc : enabledImgSrc;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative mt-auto flex shrink-0 items-center justify-center drop-shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white',
        gameId === GameIds.OceanTreasure &&
          'h-11 w-40 font-passion-one text-xl font-black uppercase leading-none text-oct-dark-brown disabled:text-neutral-700 ',
        gameId === GameIds.CruisingForCash &&
          'h-11 w-40 rounded-xl bg-cfc-blue font-tempo text-xl uppercase text-white disabled:bg-neutral-700 disabled:text-neutral-300',
        gameId === GameIds.BreakTheBank &&
          'h-11 font-eurostile-extended-bold text-xs uppercase disabled:text-neutral-700',
      )}
    >
      {imgSrc && <img src={imgSrc} className='h-full' alt='' />}

      <p
        className={clsx(
          'absolute p-2',
          gameId === GameIds.OceanTreasure && 'drop-shadow-[0px_1px_0.5px_#F0DEC7]',
        )}
      >
        {text}
      </p>
    </motion.button>
  );
};

type AutoplayButtonProps = {
  onClick: () => void;
  state: AutoplayButtonState;
};

const AutoplayButton = ({ state, onClick }: AutoplayButtonProps) => {
  const { gameId } = useStoreFrontContext();
  let imgSrc;
  let text;

  let disabledImgSrc;
  let enabledPlayingImgSrc;
  let enabledPausedImgSrc;
  let ariaLabel;
  const dontAskForAutoplay = localStorage.getItem('dont_ask_for_autoplay');

  if (gameId === GameIds.OceanTreasure) {
    disabledImgSrc = othAutoplayButtonDisabledImg;
    enabledPlayingImgSrc = othAutoplayButtonActiveImg;
    enabledPausedImgSrc = othAutoplayButtonEnabledImg;
  } else if (gameId === GameIds.CruisingForCash) {
    disabledImgSrc = null;
    enabledPlayingImgSrc = null;
    enabledPausedImgSrc = null;
  } else if (gameId === GameIds.BreakTheBank) {
    disabledImgSrc = dondAutoplayButtonDisabledImg;
    enabledPlayingImgSrc = dondAutoplayButtonActiveImg;
    enabledPausedImgSrc = dondAutoplayButtonEnabledImg;
  } else {
    console.error('Invalid game id');
  }

  if (state === AutoplayButtonState.DISABLED) {
    text = 'autoplay';
    imgSrc = disabledImgSrc;
    ariaLabel = 'Autoplay is disabled';
  } else if (state === AutoplayButtonState.ENABLED_PLAYING) {
    text = 'stop';
    imgSrc = enabledPlayingImgSrc;
    ariaLabel = 'Press to stop autoplay';
  } else if (state === AutoplayButtonState.ENABLED_PAUSED) {
    text = 'autoplay';
    imgSrc = enabledPausedImgSrc;
    ariaLabel =
      dontAskForAutoplay === 'true' ? 'Press to start autoplay' : 'Press to open autoplay modal';
  } else {
    console.error('Invalid autoplay button state');
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: state === AutoplayButtonState.DISABLED ? 1 : 0.9 }}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={state === AutoplayButtonState.DISABLED}
      className={cn(
        'relative flex items-center justify-center text-base drop-shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white',
        gameId === GameIds.OceanTreasure &&
          'h-11 w-28 font-passion-one text-xl font-black uppercase leading-4 text-oct-dark-brown disabled:text-neutral-700 sm-h:w-28',
        gameId === GameIds.OceanTreasure &&
          state === AutoplayButtonState.ENABLED_PLAYING &&
          'text-oct-neutral',

        gameId === GameIds.CruisingForCash &&
          'h-11 w-28 rounded-xl bg-cfc-blue font-tempo text-xl uppercase text-white disabled:bg-neutral-700 disabled:text-neutral-300',

        gameId === GameIds.CruisingForCash &&
          state === AutoplayButtonState.ENABLED_PLAYING &&
          'bg-cfc-white border-3 border-cfc-blue bg-white text-cfc-blue disabled:bg-neutral-700',

        gameId === GameIds.BreakTheBank &&
          'h-11 w-32 font-eurostile-extended-bold text-xs uppercase disabled:text-neutral-700',
        gameId === GameIds.BreakTheBank &&
          state === AutoplayButtonState.ENABLED_PLAYING &&
          'text-dond-yellow',
      )}
    >
      {imgSrc && <img src={imgSrc} className='h-full w-full' alt='autoplay' />}
      <div
        className={cn(
          'absolute px-2',
          gameId === GameIds.OceanTreasure &&
            (state === AutoplayButtonState.ENABLED_PLAYING
              ? 'drop-shadow-[0px_1px_0.5px_#702F19]'
              : 'drop-shadow-[0px_1px_0.5px_#F0DEC7]'),
        )}
      >
        {text}
      </div>
    </motion.button>
  );
};
