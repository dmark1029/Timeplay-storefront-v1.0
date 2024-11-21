import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Loops, Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import useIOSVideoLoop from '@/hooks/useIOSVideoLoop';
import { usdFormatter } from '@/utils/util';

import {
  arrowImg,
  bonusTextImg,
  cardPriceImg,
  headerImg,
  mainGameTextImg,
  match3TextImg,
  oddsPerGameTextImg,
  previewBackgroundImg,
  splashBackgroundImg,
  umbrellaBottomLeft,
  umbrellaBottomRight,
  umbrellaTopLeft,
  umbrellaTopRight,
} from '../assets';
import { previewBgMp4, splashBgMp4 } from '../assets/animation-assets';
import RippleEffectText from './ripple-effect-text';

type IntroAnimationProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

enum IntroAnimationStates {
  HIDDEN,
  PREVIEW,
  SPLASH,
}

const textStrokeStyle = {
  fontStretch: 'condensed',
  WebkitTextStroke: '0.3px white', // Stroke width and color for WebKit browsers
  textShadow: `
    -0.3px -0.3px 0 white,
     0.3px -0.3px 0 white,
    -0.3px  0.3px 0 white,
     0.3px  0.3px 0 white
  `, // Shadow fallback for other browsers
};

const IntroAnimation: React.FC<IntroAnimationProps> = ({ isVisible, setIsVisible }) => {
  const { playSoundEffect, startMusic, stopMusic } = useAudioContext();
  const [state, setState] = useState(IntroAnimationStates.PREVIEW);

  const onIntroComplete = () => {
    playSoundEffect(Sfx.CFC_TAP_ANYWHERE);
    playSoundEffect(Sfx.CFC_SPLASH_TRANSITION_1);
    setState(IntroAnimationStates.HIDDEN);
  };

  useEffect(() => {
    if (isVisible) {
      setState(IntroAnimationStates.PREVIEW);
    }

    return () => {
      setState(IntroAnimationStates.HIDDEN);
    };
  }, [isVisible]);

  useEffect(() => {
    switch (state) {
      case IntroAnimationStates.PREVIEW:
        startMusic(Loops.CFC_PREVIEW);
        break;
      default:
        stopMusic();
        setIsVisible(false);
    }
  }, [state]);

  return (
    <AnimatePresence>
      {state !== IntroAnimationStates.HIDDEN && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-30 overflow-hidden'
        >
          <div className='relative flex h-full w-full items-center justify-center'>
            {state === IntroAnimationStates.PREVIEW && <Intro onComplete={onIntroComplete} />}
            <Background state={state} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default IntroAnimation;

type BackgroundProps = {
  state: IntroAnimationStates;
};

const Background: React.FC<BackgroundProps> = ({ state }) => {
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useIOSVideoLoop(videoRef);

  let videoSrc;
  let posterImg;

  if (state === IntroAnimationStates.PREVIEW) {
    videoSrc = previewBgMp4;
    posterImg = previewBackgroundImg;
  } else if (state === IntroAnimationStates.SPLASH) {
    videoSrc = splashBgMp4;
    posterImg = splashBackgroundImg;
  }

  // reset video error on state change
  useEffect(() => {
    setVideoError(false);
  }, [state]);

  return (
    <>
      <div className='absolute flex h-full w-full justify-center bg-white'>
        {videoError ? (
          <img
            className={'h-full w-full object-cover'}
            src={posterImg}
            aria-hidden={true}
            alt='Cruising for Cash poster'
          />
        ) : (
          <motion.video
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={state}
            className={' h-full w-full object-fill'}
            muted
            autoPlay
            ref={videoRef}
            loop
            poster={posterImg}
            playsInline
            onError={() => {
              setVideoError(true);
            }}
          >
            <source src={videoSrc} type={'video/mp4'} />
          </motion.video>
        )}
        <img
          src={headerImg}
          alt='Cruising for Cash'
          className='absolute top-0 mx-auto aspect-auto w-[65%] justify-center object-contain'
        />
      </div>
    </>
  );
};

type IntroProps = {
  onComplete: () => void;
};

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const { getGameData, gameId } = useStoreFrontContext();
  const { handleSetGameInfoDialog } = useDialogContext();
  const { balance } = useAppContext();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isBottom, setIsBottom] = useState(false);
  const [headerState, setHeaderState] = useState(0);
  const { playSoundEffect } = useAudioContext();
  const { isIOS } = useAppContext();

  const handlePlayNowClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onComplete();
    playSoundEffect(Sfx.CFC_CLICK);
  };

  const handleOddsClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (gameId) {
      playSoundEffect(Sfx.CFC_CLICK);
      const gameData = getGameData(gameId);
      gameData &&
        handleSetGameInfoDialog({
          game: gameData,
          type: 'game-info',
          isIOS: isIOS,
        });
      scrollToPayouts();
    }
  };

  const scrollToPayouts = () => {
    const element = document.getElementById('payouts');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      requestAnimationFrame(scrollToPayouts);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='pt- z-[21] flex h-full w-full flex-col items-center pt-24'
    >
      {/* HEADER */}
      <div className='flex w-full flex-col items-center justify-center pl-4 text-xl -tracking-wider'>
        <p
          aria-label='Win a Cruise! Win up to $50,000!'
          className='font-tempo  font-black  uppercase  text-cfc-red'
          style={textStrokeStyle}
        >
          <RippleEffectText
            trigger={headerState === 0}
            onComplete={() => setHeaderState(1)}
            className='font-tempo font-black  uppercase text-cfc-red'
            text='Win a'
          />{' '}
          <RippleEffectText
            trigger={headerState === 1}
            onComplete={() => setHeaderState(2)}
            className='font-tempo text-3xl font-black uppercase text-cfc-red'
            text='Cruise!'
          />
          <RippleEffectText
            trigger={headerState === 2}
            onComplete={() => setHeaderState(3)}
            className='font-tempo font-black  uppercase text-cfc-red'
            text='  Win up to'
          />{' '}
          <RippleEffectText
            trigger={headerState === 3}
            onComplete={() => setHeaderState(0)}
            className='font-tempo text-3xl font-black uppercase text-cfc-red'
            text='$50,000!'
          />
        </p>
      </div>

      {/* PLAY NOW BUTTON */}
      <div className='my-6'>
        <button
          onClick={handlePlayNowClick}
          className='relative flex h-16 w-64 flex-col items-center justify-center rounded-2xl border-3 border-white bg-cfc-blue'
        >
          <p className='flex w-full items-center justify-center font-tempo text-xl font-black uppercase leading-5 text-white font-stretch-condensed'>
            Play Now
          </p>
          <p className='font-roboto text-xs font-bold uppercase text-white'>
            Balance: {usdFormatter.format(balance?.cmas?.casinoBankBalance || 0)}
          </p>
        </button>
      </div>

      <div ref={scrollRef} className='mb-1 flex flex-col items-center gap-3 overflow-y-auto'>
        {/* ARROW */}
        <AnimatePresence>
          {!isBottom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='pointer-events-none fixed bottom-0 z-10 flex h-20 w-20 items-center justify-center'
            >
              <img src={arrowImg} alt='arrow signifying you can scroll' className='w-full' />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN GAME */}
        <div className='relative h-[7.8rem] w-[21rem] shrink-0'>
          <div className='absolute bottom-0 right-0 h-[6.5rem] w-[18rem] overflow-hidden rounded-2xl border-3 border-cfc-red bg-white drop-shadow-xl'>
            <div className='relative h-full w-full'>
              <p className='flex h-full items-center justify-center p-2 pl-12 text-xs font-bold text-black'>
                Scratch off all symbols to reveal a $ amount behind. If any of YOUR SYMBOLS match
                the WINNING NUMBERS you win the displayed cash amount!
              </p>
              <img
                src={umbrellaTopRight}
                aria-hidden={true}
                alt=''
                className='absolute right-0 top-0 w-6'
              />
              <img
                src={umbrellaBottomRight}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 right-0 w-6'
              />
              <img
                src={umbrellaBottomLeft}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 left-0 w-6'
              />
              <img
                src={umbrellaTopLeft}
                aria-hidden={true}
                alt=''
                className='absolute left-0 top-0 w-6'
              />
            </div>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'loop' }}
            className='absolute left-0 top-0 flex h-20 w-[5.5rem] items-center justify-center rounded-2xl border-3 border-cfc-red bg-white p-2 drop-shadow-lg'
          >
            <img src={mainGameTextImg} alt='main game' className=' w-10' />
          </motion.div>
        </div>

        {/* BONUS GAME */}
        <div className='relative h-[7.8rem] w-[21rem] shrink-0'>
          <div className='absolute bottom-0 right-0 h-[6.5rem] w-[18rem] overflow-hidden rounded-2xl border-3 border-cfc-red bg-white drop-shadow-xl'>
            <div className='relative h-full w-full'>
              <p className='flex h-full items-center justify-center p-2 pl-12 text-xs font-bold text-black'>
                Scratch the CRUISE BONUS spot to see if you are a CRUISE WINNER!
              </p>
              <img
                src={umbrellaTopRight}
                aria-hidden={true}
                alt=''
                className='absolute right-0 top-0 w-6'
              />
              <img
                src={umbrellaBottomRight}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 right-0 w-6'
              />
              <img
                src={umbrellaBottomLeft}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 left-0 w-6'
              />
              <img
                src={umbrellaTopLeft}
                aria-hidden={true}
                alt=''
                className='absolute left-0 top-0 w-6'
              />
            </div>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'loop' }}
            className='absolute left-0 top-0 flex h-20 w-[5.5rem] items-center justify-center rounded-2xl border-3 border-cfc-red bg-white p-2 drop-shadow-lg'
          >
            <img src={bonusTextImg} alt='cruise bonus' className=' w-12' />
          </motion.div>
        </div>

        {/* MATCH 3 GAME */}
        <div className='relative h-[7.8rem] w-[21rem] shrink-0'>
          <div className='absolute bottom-0 right-0 h-[6.5rem] w-[18rem] overflow-hidden rounded-2xl border-3 border-cfc-red bg-white drop-shadow-xl'>
            <div className='relative h-full w-full'>
              <p className='flex h-full items-center justify-center p-2 pl-12 text-xs font-bold text-black'>
                Scratch all three beach chairs. If all three match, reveal the $ to see what you
                won!
              </p>
              <img
                src={umbrellaTopRight}
                aria-hidden={true}
                alt=''
                className='absolute right-0 top-0 w-6'
              />
              <img
                src={umbrellaBottomRight}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 right-0 w-6'
              />
              <img
                src={umbrellaBottomLeft}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 left-0 w-6'
              />
              <img
                src={umbrellaTopLeft}
                aria-hidden={true}
                alt=''
                className='absolute left-0 top-0 w-6'
              />
            </div>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'loop' }}
            className='absolute left-0 top-0 flex h-20 w-[5.5rem] items-center justify-center rounded-2xl border-3 border-cfc-red bg-white p-2 drop-shadow-lg'
          >
            <img src={match3TextImg} alt='match 3' className=' w-12' />
          </motion.div>
        </div>

        {/* CARD PRICE */}
        <div className='relative mt-10 flex h-20 w-[21rem] shrink-0 justify-between'>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'loop' }}
            className='flex h-full w-[35%] items-center justify-center rounded-2xl border-3 border-cfc-red bg-white'
          >
            <img src={cardPriceImg} alt='card price' className=' w-11' />
          </motion.div>
          <div className='h-full  w-[60%] overflow-hidden rounded-2xl border-3 border-cfc-red bg-white drop-shadow-xl'>
            <div className='relative h-full w-full'>
              <p className='flex h-full items-center justify-center font-bold text-black'>
                $2 - $10
              </p>
              <img
                src={umbrellaTopRight}
                aria-hidden={true}
                alt=''
                className='absolute right-0 top-0 w-6'
              />
              <img
                src={umbrellaBottomRight}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 right-0 w-6'
              />
              <img
                src={umbrellaBottomLeft}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 left-0 w-6'
              />
              <img
                src={umbrellaTopLeft}
                aria-hidden={true}
                alt=''
                className='absolute left-0 top-0 w-6'
              />
            </div>
          </div>
        </div>

        {/* OVERALL ODDS PER GAME */}
        <div className='relative mt-3 flex h-20 w-[21rem] shrink-0 justify-between'>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: 'loop' }}
            className='flex h-full w-[35%] items-center justify-center rounded-2xl border-3 border-cfc-red bg-white'
          >
            <img src={oddsPerGameTextImg} alt='overall odds per game' className=' w-24' />
          </motion.div>
          <div className='h-full  w-[60%] overflow-hidden rounded-2xl border-3 border-cfc-red bg-white drop-shadow-xl'>
            <div className='relative h-full w-full'>
              <p className='flex h-full items-center justify-center font-bold text-black'>
                1 in 4.20
              </p>
              <img
                src={umbrellaTopRight}
                aria-hidden={true}
                alt=''
                className='absolute right-0 top-0 w-6'
              />
              <img
                src={umbrellaBottomRight}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 right-0 w-6'
              />
              <img
                src={umbrellaBottomLeft}
                aria-hidden={true}
                alt=''
                className='absolute bottom-0 left-0 w-6'
              />
              <img
                src={umbrellaTopLeft}
                aria-hidden={true}
                alt=''
                className='absolute left-0 top-0 w-6'
              />
            </div>
          </div>
        </div>

        {/* ODDS OF WINNING TOP PRIZE */}
        <div className='my-16 flex w-full justify-center'>
          <button
            onClick={handleOddsClick}
            className='h-10 w-52 rounded-2xl border-3 border-white bg-cfc-blue'
          >
            <p className='text-center font-tempo font-bold uppercase text-white'>
              Odds vary by price point
            </p>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
