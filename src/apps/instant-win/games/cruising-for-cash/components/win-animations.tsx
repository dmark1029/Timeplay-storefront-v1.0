import { useEffect, useState } from 'react';

import anime from 'animejs';
import { AnimatePresence, motion } from 'framer-motion';

import { WinLevels } from '@/apps/instant-win/context/game-context';
import { Loops, Music, useAudioContext } from '@/contexts/audio-context';

import {
  bigWinCruiseMov,
  bigWinCruiseWebm,
  bigWinMov,
  bigWinWebm,
  cfcDefaultWinPoster,
  megaWinCruiseMov,
  megaWinCruiseWebm,
  megaWinMov,
  megaWinWebm,
  normalWinCruiseMov,
  normalWinCruiseWebm,
  normalWinMov,
  normalWinWebm,
  superWinCruiseMov,
  superWinCruiseWebm,
  superWinMov,
  superWinWebm,
} from '../assets/animation-assets';

type WinAnimationsProps = {
  level: WinLevels;
  cruise: boolean;
  play: boolean;
  amount: number;
  onAnimationEnd?: () => void;
};

type animation = {
  length: number;
  tickUpStart: number;
  tickUpEnd: number;
  cruiseMsgStart: number;
  webm: string;
  cruiseWebm: string;
  mov: string;
  cruiseMov: string;
  audio?: Music;
  cruiseAudio?: Music;
};

type animations = {
  [key in WinLevels]: animation;
};

const animations: animations = {
  [WinLevels.ZERO]: {
    length: 0,
    tickUpStart: 0,
    tickUpEnd: 0,
    cruiseMsgStart: 0,
    webm: '',
    cruiseWebm: '',
    mov: '',
    cruiseMov: '',
  },
  [WinLevels.NORMAL]: {
    length: 7500,
    tickUpStart: 500,
    tickUpEnd: 5050,
    cruiseMsgStart: 5050,
    webm: normalWinWebm,
    cruiseWebm: normalWinCruiseWebm,
    mov: normalWinMov,
    cruiseMov: normalWinCruiseMov,
    audio: Music.CFC_NORMAL_WIN,
    cruiseAudio: Music.CFC_NORMAL_WIN_CRUISE,
  },
  [WinLevels.BIG]: {
    length: 7500,
    tickUpStart: 500,
    tickUpEnd: 5050,
    cruiseMsgStart: 5050,
    webm: bigWinWebm,
    cruiseWebm: bigWinCruiseWebm,
    mov: bigWinMov,
    cruiseMov: bigWinCruiseMov,
    audio: Music.CFC_BIG_WIN,
    cruiseAudio: Music.CFC_BIG_WIN_CRUISE,
  },
  [WinLevels.SUPER]: {
    length: 10000,
    tickUpStart: 500,
    tickUpEnd: 7500,
    cruiseMsgStart: 7500,
    webm: superWinWebm,
    cruiseWebm: superWinCruiseWebm,
    mov: superWinMov,
    cruiseMov: superWinCruiseMov,
    audio: Music.CFC_SUPER_WIN,
    cruiseAudio: Music.CFC_SUPER_WIN_CRUISE,
  },
  [WinLevels.MEGA]: {
    length: 14500,
    tickUpStart: 500,
    tickUpEnd: 12250,
    cruiseMsgStart: 12250,
    webm: megaWinWebm,
    cruiseWebm: megaWinCruiseWebm,
    mov: megaWinMov,
    cruiseMov: megaWinCruiseMov,
    audio: Music.CFC_MEGA_WIN,
    cruiseAudio: Music.CFC_MEGA_WIN_CRUISE,
  },
};

const WinAnimations: React.FC<WinAnimationsProps> = ({
  level,
  cruise,
  play,
  amount,
  onAnimationEnd,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [winText, setWinText] = useState('');
  const [isWinTextVisible, setIsWinTextVisible] = useState(false);
  const [isCruiseTextVisible, setIsCruiseTextVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [movFailed, setMovFailed] = useState(false);
  const [webmFailed, setWebmFailed] = useState(false);
  const { playSoundEffect, stopSoundEffect, startMusic, stopAllAudio } = useAudioContext();

  const initialVal = 0;
  const endVal = amount;
  const triggerTickUp = (duration: number) => {
    setIsWinTextVisible(true);
    playSoundEffect(Loops.DOND_WIN_TICK_UP);
    anime({
      targets: { value: initialVal },
      value: endVal,
      round: 100,
      easing: 'easeOutQuad',
      duration: duration,
      update: (anim) => {
        const formattedDisplayAmount = parseFloat(anim.animations[0].currentValue).toFixed(2);
        setWinText(`$${formattedDisplayAmount}`);
      },
    });
    setTimeout(() => {
      stopSoundEffect(Loops.DOND_WIN_TICK_UP);
      // When we get it, win tickup end will go here
    }, duration);
  };

  const handleError = (type: 'mov' | 'webm') => {
    if (type === 'mov') {
      setMovFailed(true);
    }
    if (type === 'webm') {
      setWebmFailed(true);
    }
  };

  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;
    if (level !== WinLevels.ZERO && play) {
      timeout1 = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      timeout2 = setTimeout(() => {
        setIsVisible(false);
        setIsWinTextVisible(false);
        setIsCruiseTextVisible(false);
        setWinText('');
        onAnimationEnd && onAnimationEnd();
      }, animations[level].length);
    } else if (level === WinLevels.ZERO || !play) {
      setIsVisible(false);
      setIsWinTextVisible(false);
      setIsCruiseTextVisible(false);
      setWinText('');
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [level, play]);

  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    let timeout2: NodeJS.Timeout;

    const tickerDuration = animations[level].tickUpEnd - animations[level].tickUpStart;
    if (isVisible) {
      timeout1 = setTimeout(() => {
        triggerTickUp(tickerDuration);
      }, animations[level].tickUpStart);

      if (cruise) {
        timeout2 = setTimeout(() => {
          setIsCruiseTextVisible(true);
        }, animations[level].cruiseMsgStart);
      }
    }

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isVisible]);

  useEffect(() => {
    const winAudio = animations[level].audio;
    const winCruiseAudio = animations[level].cruiseAudio;
    if (level !== WinLevels.ZERO) {
      if (cruise && winCruiseAudio) {
        startMusic(winCruiseAudio);
      } else if (!cruise && winAudio) {
        startMusic(winAudio);
      }
    }
  }, [level]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    if (movFailed && webmFailed) {
      setVideoError(true);
    }
  }, [movFailed, webmFailed]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 z-30'
        >
          <div className='relative flex h-full w-full items-center justify-center'>
            {videoError ? (
              <img
                src={cfcDefaultWinPoster}
                alt='default win poster'
                className='absolute inset-0 left-0 top-0 h-full w-full object-cover'
              />
            ) : (
              <video
                className='absolute inset-0 left-0 top-0 h-full w-full object-cover'
                muted
                autoPlay
                playsInline
                onCanPlay={() => {
                  setVideoError(false);
                }}
              >
                {!movFailed && (
                  <source
                    src={cruise ? animations[level].cruiseMov : animations[level].mov}
                    type='video/quicktime'
                    onError={() => handleError('mov')}
                  />
                )}
                {!webmFailed && (
                  <source
                    src={cruise ? animations[level].cruiseWebm : animations[level].webm}
                    type='video/webm'
                    onError={() => handleError('webm')}
                  />
                )}
              </video>
            )}
            {isWinTextVisible && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className='absolute top-[57%] z-30 font-tempo text-4xl font-extrabold text-cfc-red'
              >
                {winText}
              </motion.h2>
            )}
            {isCruiseTextVisible && (
              <motion.h2
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                className='absolute top-[70%] z-30 px-2 font-tempo text-2xl font-extrabold uppercase text-white md-h:top-[71%] md-h:text-3xl'
              >
                You Won a 7-day <br /> Caribbean Cruise!
              </motion.h2>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default WinAnimations;
