import { useEffect } from 'react';

import { announce } from '@react-aria/live-announcer';

import { useStoreFrontContext } from '@/apps/store-front';
import { Loops, useAudioContext } from '@/contexts/audio-context';

import BetBarSimple from '../../components/bet-bar-simple';
import { useAnimationContext } from '../../context/animation-context';
import { GameStates, WinLevels, useGameContext } from '../../context/game-context';
import {
  mySymbolsBgImg,
  umbrellaBottomLeft,
  umbrellaBottomRight,
  umbrellaTopLeft,
  umbrellaTopRight,
} from './assets';
import {
  BonusNumberSection,
  GameBackground,
  Header,
  LuckyNumbersSection,
  MatchThreeSection,
  UserNumbersSection,
} from './components';
import IntroAnimation from './components/intro-animation';
import WinAnimations from './components/win-animations';

const CruisingForCashGame = () => {
  const {
    bonusNumbers,
    gameState,
    dollarAmountWon,
    isGame,
    showIntroAnimation,
    setShowIntroAnimation,
  } = useGameContext();
  const { triggerBigWin, triggerMegaWin, triggerNormalWin, triggerSuperWin } =
    useAnimationContext();
  const { setNavbarTheme } = useStoreFrontContext();
  const { startMusic, stopAllAudio } = useAudioContext();

  let winAnimationLevel = WinLevels.ZERO;

  if (triggerNormalWin) {
    winAnimationLevel = WinLevels.NORMAL;
  } else if (triggerBigWin) {
    winAnimationLevel = WinLevels.BIG;
  } else if (triggerSuperWin) {
    winAnimationLevel = WinLevels.SUPER;
  } else if (triggerMegaWin) {
    winAnimationLevel = WinLevels.MEGA;
  } else {
    winAnimationLevel = WinLevels.ZERO;
  }

  const playWinAnimation = gameState === GameStates.WIN_ANIMATIONS;

  const hasCruise = bonusNumbers[0].prize.tag === 'free_cruise';

  useEffect(() => {
    if (dollarAmountWon == undefined || dollarAmountWon == '') return;

    if (dollarAmountWon != '0' && !hasCruise) {
      announce('You won $' + dollarAmountWon);
    } else if (dollarAmountWon != '0' && hasCruise) {
      announce('You won $' + dollarAmountWon + ' and a free cruise');
    } else if (dollarAmountWon === '0' && hasCruise) {
      announce('You won a free cruise');
    } else {
      announce('Better luck next time');
    }
  }, [dollarAmountWon]);

  useEffect(() => {
    if (dollarAmountWon == undefined || dollarAmountWon == '') return;

    if (dollarAmountWon != '0' && !hasCruise) {
      announce('You won $' + dollarAmountWon);
    } else if (dollarAmountWon != '0' && hasCruise) {
      announce('You won $' + dollarAmountWon + ' and a free cruise');
    } else if (dollarAmountWon === '0' && hasCruise) {
      announce('You won a free cruise');
    } else {
      announce('Better luck next time');
    }
  }, [dollarAmountWon]);

  useEffect(() => {
    if (!showIntroAnimation) {
      startMusic(Loops.CFC_BG_MUSIC);
      if (isGame) {
        setNavbarTheme('light');
      } else {
        setNavbarTheme('dark');
      }
    } else {
      setNavbarTheme('light');
    }
  }, [showIntroAnimation, isGame]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  return (
    <div className='relative h-full max-h-lg w-full p-2'>
      <IntroAnimation isVisible={showIntroAnimation} setIsVisible={setShowIntroAnimation} />
      <WinAnimations
        level={winAnimationLevel}
        cruise={hasCruise}
        play={playWinAnimation}
        amount={parseFloat(dollarAmountWon || '0')}
      />
      {!isGame && <Overlay />}
      <GameBackground />
      <div className='flex h-full w-full flex-col justify-between overflow-auto'>
        <div className='flex h-full w-full flex-col justify-center'>
          <Header />
          <div className='my-1 flex min-w-min justify-center gap-1'>
            <BonusNumberSection className='' />
            <MatchThreeSection className='' />
          </div>
          <div className='relative flex w-full shrink-0 flex-col justify-evenly overflow-hidden rounded-xl border-6 border-red-600 px-4 pb-1 sm-h:pb-2 '>
            <img
              src={mySymbolsBgImg}
              alt=''
              className='absolute inset-0 -z-10 h-full w-full object-fill'
            />
            <img
              src={umbrellaTopLeft}
              aria-hidden='true'
              alt=''
              className='absolute left-0 top-0 z-10 w-16'
            />
            <img
              src={umbrellaTopRight}
              aria-hidden='true'
              alt=''
              className='absolute right-0 top-0 z-10 w-16'
            />
            <img
              src={umbrellaBottomLeft}
              aria-hidden='true'
              alt=''
              className='absolute bottom-0 left-0 z-10 w-16'
            />
            <img
              src={umbrellaBottomRight}
              aria-hidden='true'
              alt=''
              className='absolute bottom-0 right-0 z-10 w-16'
            />

            <LuckyNumbersSection className='px-10 pb-2' />
            <UserNumbersSection className='' />
          </div>
        </div>
        <BetBarSimple />
      </div>
    </div>
  );
};

export default CruisingForCashGame;

const Overlay = () => {
  return (
    <div
      tabIndex={-1}
      aria-hidden='true'
      className='pointer-events-none fixed inset-0  z-[19] bg-black/50'
    />
  );
};
