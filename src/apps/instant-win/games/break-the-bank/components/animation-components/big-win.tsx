import { useEffect, useRef, useState } from 'react';

import { useAnimationContext } from '@/apps/instant-win/context/animation-context';
import { Music, useAudioContext } from '@/contexts/audio-context';

import '../../animation-code/animations.css';
import { dondBigWin, dondBigWiniOS, dondDefaultWinPoster } from '../../assets';

export const BigWin = () => {
  const { triggerTickUp, animatedWinAmount } = useAnimationContext();
  const { startMusic, stopAllAudio } = useAudioContext();

  const [videoTimeout, setVideoTimeout] = useState<boolean>(false);
  const [displayAmount, setDisplayAmount] = useState<boolean>(false);
  const videoLoadedRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (displayAmount) {
      setTimeout(() => {
        triggerTickUp(4250);
      }, 2000);
    }
  }, [displayAmount]);

  useEffect(() => {
    startMusic(Music.DOND_BIG_WIN, 150);
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
    <div className={'dondWinAnimationContainer dondWin dondBigWin'}>
      {videoTimeout ? (
        <img
          src={dondDefaultWinPoster}
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
          onPlay={() => {
            videoLoadedRef.current = true;
            setDisplayAmount(true);
          }}
        >
          <source src={dondBigWiniOS} type={'video/quicktime'} />
          <source src={dondBigWin} type={'video/webm'} />
        </video>
      )}
      <h2 className={'absolute z-30 text-[2em]'}>
        {animatedWinAmount !== '0' ? animatedWinAmount : ''}
      </h2>
    </div>
  );
};

export default BigWin;
