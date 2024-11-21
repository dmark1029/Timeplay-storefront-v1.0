import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import anime from 'animejs';
import confetti from 'canvas-confetti';

import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Loops, Sfx, useAudioContext } from '@/contexts/audio-context';
import { useAnimationManager } from '@/hooks';
import { Animation, GameId, GameIds } from '@/utils/types';

import { ConfettiStar } from '../assets/';
import { GameStates, WinLevels, useGameContext } from './game-context';

type AnimationContextType = {
  triggerConfetti: (
    count: number,
    angle: number,
    spread: number,
    velocity: number,
    xDirection: number,
    yDirection: number,
    scale: number,
    colors: string[],
    zIndex: number,
    canvas: HTMLCanvasElement,
  ) => void;
  triggerStarBurst: (
    count: number,
    angle: number,
    spread: number,
    velocity: number,
    decay: number,
    xDirection: number,
    yDirection: number,
    scale: number,
    gravity: number,
    shapes: confetti.Shape[],
    colors: string[],
    ticks: number,
    zIndex: number,
  ) => void;
  triggerNormalWin: boolean;
  triggerBigWin: boolean;
  triggerSuperWin: boolean;
  triggerMegaWin: boolean;
  triggerTickUp: (duration: number) => void;
  animatedWinAmount: string;
  dollarAmountWon: string | undefined;
  showIntroAnimation: boolean;
  setShowIntroAnimation: (showIntroAnimation: boolean) => void;
  addAnimation: (animation: Animation) => void;
  displayCasinoBalance: string;
  starBurst: (position: DOMRect) => void;
  scratchUserNumbersGroup: boolean;
  scratchLuckyNumbersGroup: boolean;
  scratchMatchGroup: boolean;
  scratchBonus: boolean;
  scratchMultiplier: boolean;
  triggerGroupScratchAnimation: () => Promise<void>;
  isRevealingAllByGroups: boolean;
  triggerBalanceTickBurst: boolean;
};

type GroupScratchConfig = {
  // length of animation
  duration: number;
  // boolean which toggles on the animation in the component that uses it
  trigger: React.Dispatch<React.SetStateAction<boolean>>;
  // condition on whether or not to trigger the animation, used in iteration for skipping group when feature is absent
  conditions: boolean[];
  // function to open associated numbers
  openFunc: () => void;
};

type GroupScratchConfigMap = {
  [key in GameIds]?: GroupScratchConfig[];
};

const AnimationContext = createContext<AnimationContextType | null>(null);

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  // contexts
  const {
    winLevel,
    gameState,
    moveToGameState,
    dollarAmountWon,
    setShowIntroAnimation,
    showIntroAnimation,
    featureFlags,
    completeRevealAll,
    allLuckyNumbersRevealed,
    alluserNumbersRevealed,
    allMatchNumbersRevealed,
    allBonusNumbersRevealed,
    genericMultiplierRevealed,
    groupRevealLuckyNumbers,
    groupRevealUserNumbers,
    groupRevealMatchNumbers,
    groupRevealBonusNumbers,
    groupRevealGenericMultiplier,
    instance,
  } = useGameContext();
  const { playSoundEffect, stopSoundEffect, startMusic } = useAudioContext();
  const { gameId } = useStoreFrontContext();
  const { balance, prevCasinoBalance } = useAppContext();

  // managers
  const { addAnimation } = useAnimationManager();

  // triggers
  const [triggerNormalWin, setTriggerNormalWin] = useState(false);
  const [triggerBigWin, setTriggerBigWin] = useState(false);
  const [triggerSuperWin, setTriggerSuperWin] = useState(false);
  const [triggerMegaWin, setTriggerMegaWin] = useState(false);
  const [triggerBalanceTickBurst, setTriggerBalanceTickBurst] = useState(false);

  const [animatedWinAmount, setAnimatedWinAmount] = useState('');
  const [displayCasinoBalance, setDisplayCasinoBalance] = useState<string>(
    `$${balance?.casino_available_balance?.toFixed(2) || '0.00'}`,
  );

  // vars to determine when animations are running (for condi rendering)
  const [isRevealingAllByGroups, setIsRevealingAllByGroups] = useState<boolean>(false);

  // vars for scratching groups of numbers during reveal all
  const [scratchUserNumbersGroup, setScratchUserNumbersGroup] = useState<boolean>(false);
  const [scratchLuckyNumbersGroup, setScratchLuckyNumbersGroup] = useState<boolean>(false);
  const [scratchMatchGroup, setScratchMatchGroup] = useState<boolean>(false);
  const [scratchBonus, setScratchBonusGroup] = useState<boolean>(false);
  const [scratchMultiplier, setScratchMultiplier] = useState<boolean>(false);

  // refs
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  // Add new animation durations for new game addition
  const OthDurations = {
    OTH_NORMAL_WIN: 7750,
    OTH_BIG_WIN: 9000,
    OTH_SUPER_WIN: 11000,
    OTH_MEGA_WIN: 13000,
  };

  const DondDurations = {
    DOND_NORMAL_WIN: 8000,
    DOND_BIG_WIN: 8000,
    DOND_SUPER_WIN: 10500,
    DOND_MEGA_WIN: 15000,
  };

  const CfcDurations = {
    CFC_NORMAL_WIN: 8250,
    CFC_BIG_WIN: 8250,
    CFC_SUPER_WIN: 10000,
    CFC_MEGA_WIN: 15000,
  };

  // the settings for group scratching animations, can adjust order and timing as needed
  const groupScratchConfigs: GroupScratchConfigMap = {
    [GameIds.BreakTheBank]: [
      {
        duration: 1000,
        trigger: setScratchLuckyNumbersGroup,
        conditions: [!allLuckyNumbersRevealed],
        openFunc: groupRevealLuckyNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchUserNumbersGroup,
        conditions: [!alluserNumbersRevealed],
        openFunc: groupRevealUserNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchMatchGroup,
        conditions: [!allMatchNumbersRevealed, featureFlags.match],
        openFunc: groupRevealMatchNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchBonusGroup,
        conditions: [!allBonusNumbersRevealed, featureFlags.reveal],
        openFunc: groupRevealBonusNumbers,
      },
    ],
    [GameIds.CruisingForCash]: [
      {
        duration: 1000,
        trigger: setScratchMatchGroup,
        conditions: [!allMatchNumbersRevealed, featureFlags.match],
        openFunc: groupRevealMatchNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchLuckyNumbersGroup,
        conditions: [!allLuckyNumbersRevealed],
        openFunc: groupRevealLuckyNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchUserNumbersGroup,
        conditions: [!alluserNumbersRevealed],
        openFunc: groupRevealUserNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchBonusGroup,
        conditions: [!allBonusNumbersRevealed, featureFlags.reveal],
        openFunc: groupRevealBonusNumbers,
      },
    ],
    [GameIds.OceanTreasure]: [
      {
        duration: 1000,
        trigger: setScratchLuckyNumbersGroup,
        conditions: [!allLuckyNumbersRevealed],
        openFunc: groupRevealLuckyNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchUserNumbersGroup,
        conditions: [!alluserNumbersRevealed],
        openFunc: groupRevealUserNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchMatchGroup,
        conditions: [!allMatchNumbersRevealed, featureFlags.match],
        openFunc: groupRevealMatchNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchBonusGroup,
        conditions: [!allBonusNumbersRevealed, featureFlags.reveal],
        openFunc: groupRevealBonusNumbers,
      },
    ],
    [GameIds.LuckyDragon]: [
      {
        duration: 1000,
        trigger: setScratchLuckyNumbersGroup,
        conditions: [!allLuckyNumbersRevealed],
        openFunc: groupRevealLuckyNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchUserNumbersGroup,
        conditions: [!alluserNumbersRevealed],
        openFunc: groupRevealUserNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchMatchGroup,
        conditions: [!allMatchNumbersRevealed, featureFlags.match],
        openFunc: groupRevealMatchNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchBonusGroup,
        conditions: [!allBonusNumbersRevealed, featureFlags.reveal],
        openFunc: groupRevealBonusNumbers,
      },
      {
        duration: 1000,
        trigger: setScratchMultiplier,
        conditions: [!genericMultiplierRevealed, featureFlags.genericMultiplier],
        openFunc: groupRevealGenericMultiplier,
      },
    ],
  };

  const balanceTickUp = () => {
    const start = prevCasinoBalance.current;
    const end = balance?.casino_available_balance || 0;

    if (!!end && start !== null && start < end) {
      setTriggerBalanceTickBurst(true);
      setDisplayCasinoBalance(`$${start?.toFixed(2)}`);
      anime({
        targets: { value: start },
        value: end,
        round: 100,
        easing: 'easeOutQuad',
        duration: 2000,
        update: (anim) => {
          const currentValue = Number(anim.animations[0].currentValue);
          const formattedDisplayAmount = currentValue.toFixed(2);
          setDisplayCasinoBalance(`$${formattedDisplayAmount}`);
        },
        complete: () => {
          setDisplayCasinoBalance(`$${end.toFixed(2)}`);
          setTriggerBalanceTickBurst(false);
        },
      });
    } else {
      setDisplayCasinoBalance(`$${end.toFixed(2)}`);
    }
  };

  const triggerTickUp = (duration: number) => {
    if (dollarAmountWon) {
      const endAmount = parseFloat(dollarAmountWon);
      const initialAmount = 1;
      setAnimatedWinAmount(`$${initialAmount.toFixed(endAmount % 1 === 0 ? 0 : 2)}`);
      switch (gameId) {
        case 'dond-dbk':
        case 'cruising-for-cash':
          playSoundEffect(Loops.DOND_WIN_TICK_UP);
          break;
        default:
          break;
      }

      anime({
        targets: { value: initialAmount },
        value: endAmount,
        round: 100,
        easing: 'easeOutQuad',
        duration: duration,
        update: (anim) => {
          const currentValue = Number(anim.animations[0].currentValue);
          const formattedDisplayAmount = currentValue.toFixed(2);
          setAnimatedWinAmount(`$${formattedDisplayAmount}`);
        },
      });
      switch (gameId) {
        case 'ocean-treasure':
          {
            const timeout = setTimeout(() => {
              playSoundEffect(Sfx.OTH_TICK);
            }, duration);

            timeouts.current.push(timeout);
          }
          break;
        case 'dond-dbk':
          {
            const timeout = setTimeout(() => {
              stopSoundEffect(Loops.DOND_WIN_TICK_UP);
              playSoundEffect(Sfx.DOND_TICKUP_END);
            }, duration);
            timeouts.current.push(timeout);
          }
          break;
        default:
          break;
      }
    } else {
      console.log('[Animation Context - tick up animation] Amount won not found...');
    }
  };

  const handleAnimationDuration = (game: GameId | null) => {
    let dynamicDuration = 0;
    // Add new if statement with nested switch for adding new game animation durations, and assign the game's enum to dynamic duration
    if (game === GameIds.OceanTreasure) {
      switch (winLevel) {
        case WinLevels.NORMAL:
          dynamicDuration = OthDurations.OTH_NORMAL_WIN;
          break;
        case WinLevels.BIG:
          dynamicDuration = OthDurations.OTH_BIG_WIN;
          break;
        case WinLevels.SUPER:
          dynamicDuration = OthDurations.OTH_SUPER_WIN;
          break;
        case WinLevels.MEGA:
          dynamicDuration = OthDurations.OTH_MEGA_WIN;
          break;
        default:
          dynamicDuration = 0;
      }
    } else if (game === GameIds.BreakTheBank) {
      switch (winLevel) {
        case WinLevels.NORMAL:
          dynamicDuration = DondDurations.DOND_NORMAL_WIN;
          break;
        case WinLevels.BIG:
          dynamicDuration = DondDurations.DOND_BIG_WIN;
          break;
        case WinLevels.SUPER:
          dynamicDuration = DondDurations.DOND_SUPER_WIN;
          break;
        case WinLevels.MEGA:
          dynamicDuration = DondDurations.DOND_MEGA_WIN;
          break;
        default:
          dynamicDuration = 0;
      }
    } else if (game === GameIds.CruisingForCash) {
      switch (winLevel) {
        case WinLevels.NORMAL:
          dynamicDuration = CfcDurations.CFC_NORMAL_WIN;
          break;
        case WinLevels.BIG:
          dynamicDuration = CfcDurations.CFC_BIG_WIN;
          break;
        case WinLevels.SUPER:
          dynamicDuration = CfcDurations.CFC_SUPER_WIN;
          break;
        case WinLevels.MEGA:
          dynamicDuration = CfcDurations.CFC_MEGA_WIN;
          break;
        default:
          dynamicDuration = 0;
      }
    }
    return dynamicDuration;
  };

  const triggerWinAnimation = () => {
    let bgMusic: Loops;
    switch (gameId) {
      case 'ocean-treasure':
        bgMusic = Loops.OTH_BG1;
        break;
      case 'dond-dbk':
        bgMusic = Loops.DOND_BG_MUSIC;
        break;
      case 'cruising-for-cash':
        bgMusic = Loops.CFC_BG_MUSIC;
        break;
      default:
        break;
    }
    switch (winLevel) {
      case WinLevels.NORMAL:
        addAnimation({
          duration: handleAnimationDuration(gameId),
          playing: triggerNormalWin,
          setIsPlaying: setTriggerNormalWin,
          tag: '',
          onComplete: () => {
            moveToGameState(GameStates.GAME_OVER);
            // Delay allows FadeMusic to complete on the win states unmounting before starting music again
            const timeout = setTimeout(() => {
              startMusic(bgMusic);
            }, 350);
            timeouts.current.push(timeout);
            setAnimatedWinAmount('');
          },
        });
        break;
      case WinLevels.BIG:
        addAnimation({
          duration: handleAnimationDuration(gameId),
          playing: triggerBigWin,
          setIsPlaying: setTriggerBigWin,
          tag: '',
          onComplete: () => {
            moveToGameState(GameStates.GAME_OVER);
            const timeout = setTimeout(() => {
              startMusic(bgMusic);
            }, 350);
            timeouts.current.push(timeout);
            setAnimatedWinAmount('');
          },
        });
        break;
      case WinLevels.SUPER:
        addAnimation({
          duration: handleAnimationDuration(gameId),
          playing: triggerSuperWin,
          setIsPlaying: setTriggerSuperWin,
          tag: '',
          onComplete: () => {
            moveToGameState(GameStates.GAME_OVER);
            const timeout = setTimeout(() => {
              startMusic(bgMusic);
            }, 350);
            timeouts.current.push(timeout);
            setAnimatedWinAmount('');
          },
        });
        break;
      case WinLevels.MEGA:
        addAnimation({
          duration: handleAnimationDuration(gameId),
          playing: triggerMegaWin,
          setIsPlaying: setTriggerMegaWin,
          tag: '',
          onComplete: () => {
            moveToGameState(GameStates.GAME_OVER);
            const timeout = setTimeout(() => {
              startMusic(bgMusic);
            }, 350);
            timeouts.current.push(timeout);
            setAnimatedWinAmount('');
          },
        });
        break;
      default:
        return;
    }
  };

  // triggers the group scratch animations per the current game's config
  // note that the useState are technically not awaited (reacted to), but in this case the timing is not critical.
  const triggerGroupScratchAnimation = async () => {
    setIsRevealingAllByGroups(true);
    if (!!gameId) {
      // get the config for this game
      const config = groupScratchConfigs[gameId];
      if (!!config) {
        for (let i = 0; i < config.length; i++) {
          // if the condition is not met, skip this group
          const conditionsMet = config[i].conditions.every((x) => x);
          if (!conditionsMet) {
            continue;
          }

          // open the area
          config[i].openFunc();
          // trigger the anim
          config[i].trigger(true);
          // wait the duration
          await new Promise((resolve) => setTimeout(resolve, config[i].duration));
        }
      }

      // turn off masks
      config?.forEach((x) => {
        x.trigger(false);
      });
    }
    await completeRevealAll();
    setIsRevealingAllByGroups(false);
  };

  const triggerStarBurst = (
    count: number,
    angle: number,
    spread: number,
    velocity: number,
    decay: number,
    xDirection: number,
    yDirection: number,
    scale: number,
    gravity: number,
    shapes: confetti.Shape[],
    colors: string[],
    ticks: number,
    zIndex: number,
  ) => {
    confetti({
      particleCount: count,
      angle: angle,
      spread: spread,
      startVelocity: velocity,
      decay: decay,
      origin: {
        x: xDirection,
        y: yDirection,
      },
      scalar: scale,
      gravity: gravity,
      shapes: shapes,
      colors: colors,
      ticks: ticks,
      zIndex: zIndex,
    });
  };

  const starBurst = (position: DOMRect) => {
    const elementCenterX = position.left + position.width / 2;
    const elementCenterY = position.top + position.height / 2 - 3;
    const xPosition = elementCenterX / window.innerWidth;
    const yPosition = elementCenterY / window.innerHeight;
    const fireworkCount = 30;
    const duration = 2000;
    const intervalTime = duration / fireworkCount;
    const customStar = new Image();
    customStar.src = ConfettiStar;

    let currentFirework = 0;

    const fireworkInterval = setInterval(() => {
      if (currentFirework >= fireworkCount) {
        clearInterval(fireworkInterval); // Stop shooting stars when the limit is reached
        return;
      }

      // svg path from star.svg
      const customStar = confetti.shapeFromPath({
        path: 'M35.84,25.61l1.19.47-1.19.47c-4.25,1.68-7.61,5.04-9.29,9.29l-.47,1.19-.47-1.19c-1.68-4.25-5.04-7.61-9.29-9.29l-1.19-.47,1.19-.47c4.25-1.68,7.61-5.04,9.29-9.29l.47-1.19.47,1.19c1.68,4.25,5.04,7.61,9.29,9.29Z',
      });
      // Trigger one shooting star
      triggerStarBurst(
        1, // count
        90, // direction
        160, // spread in deg
        4, // velocity
        0.9, // decay
        xPosition, // x anchor position on page
        yPosition, // y anchor position on page
        1.26, // scale
        0.2, // gravity
        [customStar], // shape of particle
        ['#FFF'], // colour
        70, // ticks - how long to disappear
        0.1, // z index
      );
      currentFirework++; // Increment the number of fired stars
    }, intervalTime); // Time between each star
  };

  const triggerConfetti = (
    count: number,
    angle: number,
    spread: number,
    velocity: number,
    xDirection: number,
    yDirection: number,
    scale: number,
    colors: string[],
    zIndex: number,
    canvas?: HTMLCanvasElement,
  ) => {
    confetti.create(canvas, { resize: true })({
      particleCount: count,
      angle: angle,
      spread: spread,
      startVelocity: velocity,
      gravity: 0.75,
      origin: {
        x: xDirection,
        y: yDirection,
      },
      scalar: scale,
      colors: colors,
      zIndex: zIndex,
    });
  };

  useEffect(() => {
    if (gameState === GameStates.WIN_ANIMATIONS) {
      setTimeout(() => {
        triggerWinAnimation();
      }, 1750);
    }
  }, [gameState]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      timeouts.current = [];
    };
  }, []);

  // update the balance display when balance gets updated. If in game over state, update via balance tick up
  useEffect(() => {
    if (
      gameState === GameStates.GAME_OVER &&
      !!balance?.casino_available_balance &&
      !!prevCasinoBalance.current &&
      prevCasinoBalance.current < balance.casino_available_balance &&
      !!instance?.gameplay_state?.payout
    ) {
      balanceTickUp();
    } else {
      setDisplayCasinoBalance(`$${balance?.casino_available_balance?.toFixed(2) || '0.00'}`);
    }
  }, [balance?.casino_available_balance]);

  const animationContextValue = {
    triggerConfetti,
    triggerStarBurst,
    triggerNormalWin,
    triggerBigWin,
    triggerSuperWin,
    triggerMegaWin,
    triggerTickUp,
    animatedWinAmount,
    dollarAmountWon,
    showIntroAnimation,
    setShowIntroAnimation,
    addAnimation,
    scratchUserNumbersGroup,
    scratchLuckyNumbersGroup,
    scratchMatchGroup,
    scratchBonus,
    scratchMultiplier,
    triggerGroupScratchAnimation,
    isRevealingAllByGroups,
    displayCasinoBalance,
    starBurst,
    triggerBalanceTickBurst,
  };

  return (
    <AnimationContext.Provider value={animationContextValue}>{children}</AnimationContext.Provider>
  );
};

export default AnimationContext;

export const useAnimationContext = (): AnimationContextType => useContext(AnimationContext)!;
