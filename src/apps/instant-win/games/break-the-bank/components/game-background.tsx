import { useRef, useState } from 'react';

import useIOSVideoLoop from '@/hooks/useIOSVideoLoop';

import { dondAnimatedBg } from '../assets';
import backgroundImg from '../assets/bg.png';

const GameBackground = () => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useIOSVideoLoop(videoRef);

  return (
    <div className='absolute -z-50 flex h-full w-full max-w-lg grow flex-col items-center'>
      {videoError ? (
        <img
          className={'h-full w-full object-cover'}
          src={backgroundImg}
          alt='image of deal or no deal background'
        />
      ) : (
        <video
          className={'absolute inset-0 -z-10 h-full w-full object-cover'}
          ref={videoRef}
          muted
          autoPlay
          loop
          poster={backgroundImg}
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={dondAnimatedBg} type={'video/mp4'} />
        </video>
      )}
    </div>
  );
};

export default GameBackground;
