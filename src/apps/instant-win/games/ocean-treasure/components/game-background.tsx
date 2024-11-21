import { useRef, useState } from 'react';

import { useGameContext } from '@/apps/instant-win/context/game-context';
import useIOSVideoLoop from '@/hooks/useIOSVideoLoop';

import { gameBgPoster, gameBgVideo } from '../assets';

const GameBackground = () => {
  const { prefersReducedMotion } = useGameContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  useIOSVideoLoop(videoRef);
  const [videoError, setVideoError] = useState<boolean>(false);

  const noVideo = JSON.parse(localStorage.getItem('noVideo') || 'false');

  return (
    <div className='fixed inset-0 -z-50 h-full w-full bg-background'>
      {prefersReducedMotion || videoError || noVideo ? (
        <img className='h-full w-full object-cover' src={gameBgPoster} alt='' />
      ) : (
        <video
          className='h-full w-full object-cover'
          poster={gameBgPoster}
          src={gameBgVideo}
          ref={videoRef}
          muted
          autoPlay
          loop
          playsInline
          aria-label=''
          onError={() => setVideoError(true)}
        />
      )}
    </div>
  );
};

export default GameBackground;
