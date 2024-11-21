import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { Music, useAudioContext } from '@/contexts/audio-context';

import '../../animation-code/animations.css';
import { megaWinAnimation, megaWinAnimationiOS, winPoster } from '../../assets';

export const MegaWin = () => {
  const { triggerTickUp, animatedWinAmount } = useAnimationContext();
  const { startMusic, stopAllAudio } = useAudioContext();
  const [videoTimeout, setVideoTimeout] = useState<boolean>(false);
  const [displayAmount, setDisplayAmount] = useState<boolean>(false);
  const videoLoadedRef = useRef<boolean | undefined>(undefined);
  const charCount = animatedWinAmount.length;
  const textSize = getTextSize(charCount);

  useEffect(() => {
    if (displayAmount) {
      setTimeout(() => {
        triggerTickUp(10000);
      }, 1000);
    }
  }, [displayAmount]);

  useEffect(() => {
    startMusic(Music.OTH_MEGA_WIN, 150);

    return () => {
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!videoLoadedRef.current) {
        setVideoTimeout(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={'winAnimationContainer megaWin'}>
      {videoTimeout ? (
        <img
          src={winPoster}
          alt='congratulations, you won!'
          className='absolute inset-0 left-0 top-0 z-30 h-full w-full object-cover'
          onLoad={() => setDisplayAmount(true)}
        />
      ) : (
        <video
          className={'absolute inset-0 left-0 top-0 z-30 h-full w-full object-fill'}
          muted
          autoPlay
          playsInline
          onPlay={() => {
            videoLoadedRef.current = true;
            setDisplayAmount(true);
          }}
        >
          <source src={megaWinAnimationiOS} type={'video/quicktime'} />
          <source src={megaWinAnimation} type={'video/webm'} />
        </video>
      )}
      <h2 className={clsx('absolute z-30 transition-all', textSize)}>
        {animatedWinAmount !== '0' ? animatedWinAmount : ''}
      </h2>
    </div>
  );
};

export default MegaWin;

const getTextSize = (charCount: number) => {
  if (charCount < 7) {
    return 'text-4xl';
  } else if (charCount < 8) {
    return 'text-3xl';
  } else {
    return 'text-2xl';
  }
};
