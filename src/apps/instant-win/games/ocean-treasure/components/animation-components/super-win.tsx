import { useEffect, useRef, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { Music, useAudioContext } from '@/contexts/audio-context';

import '../../animation-code/animations.css';
import { superWinAnimation, superWinAnimationiOS, winPoster } from '../../assets';

export const SuperWin = () => {
  const { triggerTickUp, animatedWinAmount } = useAnimationContext();
  const { startMusic, stopAllAudio } = useAudioContext();
  const [videoTimeout, setVideoTimeout] = useState<boolean>(false);
  const [displayAmount, setDisplayAmount] = useState<boolean>(false);
  const videoLoadedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (displayAmount) {
      setTimeout(() => {
        triggerTickUp(6000);
      }, 1000);
    }
  }, [displayAmount]);

  useEffect(() => {
    startMusic(Music.OTH_SUPER_WIN, 150);

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
    <div className={'winAnimationContainer superWin'}>
      {videoTimeout ? (
        <img
          src={winPoster}
          alt='video animation fallback'
          className='absolute inset-0 left-0 top-0 z-30 h-full w-full object-cover'
          onLoad={() => setDisplayAmount(true)}
        />
      ) : (
        <video
          className={'absolute inset-0 left-0 top-0 z-30 h-full w-full object-fill'}
          muted
          autoPlay
          playsInline
          onLoad={() => setDisplayAmount(true)}
        >
          <source src={superWinAnimationiOS} type={'video/quicktime'} />
          <source src={superWinAnimation} type={'video/webm'} />
        </video>
      )}
      <h2 className={'absolute z-30 text-[2em]'}>
        {animatedWinAmount !== '0' ? animatedWinAmount : ''}
      </h2>
    </div>
  );
};

export default SuperWin;
