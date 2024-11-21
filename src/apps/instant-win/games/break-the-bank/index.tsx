import { useEffect, useRef, useState } from 'react';

import { announce } from '@react-aria/live-announcer';
import clsx from 'clsx';

import { useStoreFrontContext } from '@/apps/store-front';
import { Loops, useAudioContext } from '@/contexts/audio-context';

import BetBarSimple from '../../components/bet-bar-simple';
import SwipeableTicket from '../../components/swipeable-ticket';
import { useAnimationContext } from '../../context/animation-context';
import { GameStates, useGameContext } from '../../context/game-context';
import { InstantWinNumber, SwipeMode } from '../../types';
import {
  BigWin,
  BonusNumberSection,
  GameBackground,
  Header,
  IntroAnimation,
  LuckyNumbersSection,
  MatchThreeSection,
  MegaWin,
  NormalWin,
  SuperWin,
  UserNumbersSection,
} from './components';

type ShineGroup = {
  setShineIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  numbers: InstantWinNumber[];
};

const BreakTheBankGame = () => {
  const { instance, gameState, userNumbers, luckyNumbers, match3Numbers, isGame, dollarAmountWon } =
    useGameContext();
  const { startMusic, stopMusic } = useAudioContext();
  const { setNavbarTheme } = useStoreFrontContext();

  // ticket swipe states
  const {
    showIntroAnimation,
    setShowIntroAnimation,
    triggerNormalWin,
    triggerBigWin,
    triggerSuperWin,
    triggerMegaWin,
  } = useAnimationContext();
  const [toggleTicketSwipe, setToggleTicketSwipe] = useState<boolean>(false);
  const [isSwipeActive, setIsSwipeActive] = useState<boolean>(false);

  // shine states
  const [userShineIndex, setUserShineIndex] = useState<number | undefined>(undefined);
  const [luckyShineIndex, setLuckyShineIndex] = useState<number | undefined>(undefined);
  const [match3ShineIndex, setMatch3ShineIndex] = useState<number | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const shineGroups: ShineGroup[] = [
    { setShineIndex: setUserShineIndex, numbers: userNumbers },
    { setShineIndex: setLuckyShineIndex, numbers: luckyNumbers },
    { setShineIndex: setMatch3ShineIndex, numbers: match3Numbers },
  ];

  useEffect(() => {
    setShowIntroAnimation(true);
  }, []);

  useEffect(() => {
    if (!!instance && isSwipeActive) {
      setToggleTicketSwipe(true);
      setTimeout(() => setToggleTicketSwipe(false), 750);
    }
  }, [instance]);

  // this is to track if a game has ended, to avoid swiping first ticket.
  useEffect(() => {
    if (gameState === GameStates.GAME_OVER) {
      setIsSwipeActive(true);
    }
  }, [gameState]);

  useEffect(() => {
    if (dollarAmountWon != '') {
      if (dollarAmountWon != '0') {
        announce('You won $' + dollarAmountWon);
      } else {
        announce('Better luck next time');
      }
    }
  }, [dollarAmountWon]);

  useEffect(() => {
    if (!showIntroAnimation) {
      startMusic(Loops.DOND_BG_MUSIC);
      setNavbarTheme('dark');
    } else {
      stopMusic();
      setNavbarTheme('dark');
    }
  }, [showIntroAnimation, isGame]);

  useEffect(() => {
    const setRandomShine = () => {
      // get a random number to determine which group to shine
      const groupIndex = Math.floor(Math.random() * shineGroups?.length);

      // get the group
      const shineGroup = shineGroups[groupIndex];

      // get a random number index from the group
      const numberIndex = Math.floor(Math.random() * shineGroup?.numbers?.length);

      shineGroups.map((x, index) => {
        if (index === groupIndex) {
          x.setShineIndex(numberIndex);
        } else {
          x.setShineIndex(undefined);
        }
        x.setShineIndex;
      });
    };

    intervalRef.current = setInterval(() => {
      setRandomShine();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopMusic();
    };
  }, []);

  return (
    <div className='flex h-full w-full max-w-lg grow flex-col items-center'>
      {/* Intro Animation */}
      {showIntroAnimation && <IntroAnimation />}

      {/* Celebration Animations */}
      {triggerMegaWin && <MegaWin />}
      {triggerNormalWin && <NormalWin />}
      {triggerSuperWin && <SuperWin />}
      {triggerBigWin && <BigWin />}

      {/* Game */}
      <GameBackground />
      {!isGame && <Overlay />}

      <div className='relative flex h-[20%] w-full justify-between'>
        <Header className='' />
      </div>
      <div className='relative flex w-full grow flex-col items-center justify-center lg-h:p-5'>
        <SwipeableTicket
          className='flex w-full grow flex-col items-center justify-center sm-h:justify-start'
          mode={SwipeMode.Manual}
          toggle={toggleTicketSwipe}
        >
          <div
            className={clsx(
              `relative flex w-[90%] flex-col overflow-hidden rounded-lg border-2 border-solid border-yellow-300`,
              !isGame && 'pointer-events-none opacity-50',
            )}
          >
            <LuckyNumbersSection className='' shineIndex={luckyShineIndex} />
            <UserNumbersSection className='' shineIndex={userShineIndex} />
          </div>
          <div className='flex h-28 w-[90%] flex-row justify-center gap-2 pt-2.5 sm-h:h-24 md-h:h-28 lg-h:h-32'>
            <BonusNumberSection className='w-1/3' />
            <MatchThreeSection className='w-2/3' shineIndex={match3ShineIndex} />
          </div>
        </SwipeableTicket>
      </div>
      <BetBarSimple />
    </div>
  );
};

export default BreakTheBankGame;

const Overlay = () => {
  return (
    <div
      tabIndex={-1}
      aria-hidden='true'
      className='fixed inset-0 z-[10] flex items-center justify-center bg-black/50'
    ></div>
  );
};
