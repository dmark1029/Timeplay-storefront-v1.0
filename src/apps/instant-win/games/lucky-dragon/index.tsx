import { useEffect } from 'react';

import { Loops, useAudioContext } from '@/contexts/audio-context';

import { useAnimationContext } from '../../context/animation-context';
import {
  BetBar,
  BonusNumberSection,
  GameBackground,
  Header,
  LuckyNumbersSection,
  MultiplierSection,
  UserNumbersSection,
} from './components';

const LuckyDragonGame = () => {
  // const { isGame } = useGameContext();
  const { startMusic, stopMusic } = useAudioContext();

  // ticket swipe states
  const {
    showIntroAnimation,
    setShowIntroAnimation,
    // triggerNormalWin,
    // triggerBigWin,
    // triggerSuperWin,
    // triggerMegaWin,
  } = useAnimationContext();

  useEffect(() => {
    setShowIntroAnimation(true);
  }, []);

  useEffect(() => {
    if (!showIntroAnimation) {
      startMusic(Loops.DOND_BG_MUSIC);
    } else {
      stopMusic();
    }
  }, [showIntroAnimation]);

  return (
    <div className='flex h-full w-full max-w-lg grow flex-col items-center'>
      {/* Intro Animation */}
      {/* {showIntroAnimation && <IntroAnimation />} */}

      {/* Celebration Animations */}
      {/* {triggerMegaWin && <MegaWin />}
      {triggerNormalWin && <NormalWin />}
      {triggerSuperWin && <SuperWin />}
      {triggerBigWin && <BigWin />} */}

      {/* Game */}
      <GameBackground />
      {/* {!isGame && <Overlay />} */}

      <div className='relative flex h-[20%] w-full justify-between'>
        <Header className='' />
      </div>
      <div className='flex-col items-center justify-center'>
        <div className='flex grow items-center justify-center'>
          <MultiplierSection className='pr-3' />
          <div className='relative flex flex-col items-center justify-center'>
            <LuckyNumbersSection className='' />
            <UserNumbersSection className='' />
          </div>
        </div>
        <div className='flex h-28 flex-row items-center justify-evenly'>
          <BonusNumberSection className='' />
        </div>
      </div>
      {/* TODO: Swap this bet bar out for simple bet bar and remove it */}
      <BetBar className='' />
    </div>
  );
};

export default LuckyDragonGame;

// const Overlay = () => {
//   return <div className='fixed inset-0 z-20 flex items-center justify-center bg-black/50'></div>;
// };
