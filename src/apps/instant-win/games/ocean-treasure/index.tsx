import { useEffect } from 'react';

import { announce } from '@react-aria/live-announcer';

import { useStoreFrontContext } from '@/apps/store-front';
import { Loops, Sfx, useAudioContext } from '@/contexts/audio-context';

import BetBarSimple from '../../components/bet-bar-simple';
import { useAnimationContext } from '../../context/animation-context';
import { useGameContext } from '../../context/game-context';
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

const OceanTreasureGame = () => {
  const { isGame } = useGameContext();
  const { setNavbarTheme } = useStoreFrontContext();

  const {
    triggerNormalWin,
    triggerBigWin,
    triggerSuperWin,
    triggerMegaWin,
    showIntroAnimation,
    setShowIntroAnimation,
    dollarAmountWon,
  } = useAnimationContext();

  const { startMusic, stopMusic } = useAudioContext();

  useEffect(() => {
    setShowIntroAnimation(true);

    return () => {
      stopMusic();
    };
  }, []);

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
      if (!isGame) {
        startMusic(Loops.OTH_UNDERWATER);
        setNavbarTheme('dark');
      } else {
        startMusic(Loops.OTH_BG1);
        setNavbarTheme('light');
      }
    } else {
      setNavbarTheme('dark');
    }
  }, [showIntroAnimation, isGame]);

  return (
    <div className='relative h-full w-full'>
      {/* Celebration animations */}
      {triggerNormalWin && <NormalWin />}
      {triggerBigWin && <BigWin />}
      {triggerSuperWin && <SuperWin />}
      {triggerMegaWin && <MegaWin />}

      {/* Intro Animation */}
      {showIntroAnimation && <IntroAnimation />}

      {/* Game */}
      <GameBackground />

      {!isGame && <Overlay />}

      <div
        aria-hidden={showIntroAnimation}
        className='fadeInGame flex h-full w-full min-w-[360px] flex-col justify-between'
      >
        <Header />
        <div className='flex w-full grow flex-col items-center justify-center px-4'>
          <LuckyNumbersSection />
          <div className='mb-2 mt-6 flex h-44 w-full max-w-sm justify-between gap-4 md-h:h-52'>
            <BonusNumberSection className='h-full' />
            <UserNumbersSection className='h-full' />
          </div>
          <div className='w-full max-w-sm '>
            <MatchThreeSection />
          </div>
        </div>
        <BetBarSimple />
      </div>
    </div>
  );
};

export default OceanTreasureGame;

const Overlay = () => {
  const { playSoundEffect } = useAudioContext();
  return (
    <div
      tabIndex={-1}
      aria-hidden='true'
      className='fixed inset-0 z-[15] flex items-center justify-center bg-black/50'
      onClick={() => {
        playSoundEffect(Sfx.OTH_STAKE_END);
      }}
    />
  );
};
