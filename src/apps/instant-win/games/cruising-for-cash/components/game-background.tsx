import { useRef, useState } from 'react';

import useIOSVideoLoop from '@/hooks/useIOSVideoLoop';

import { backgroundImg } from '../assets';
import { mainBgMp4 } from '../assets/animation-assets';

const GameBackground = () => {
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  useIOSVideoLoop(videoRef);

  return (
    <div className='absolute inset-0 -z-50 mx-auto max-w-lg bg-background'>
      {videoError ? (
        <img className={'h-full w-full object-cover'} src={backgroundImg} alt='' />
      ) : (
        <video
          className={'absolute inset-0 -z-10 h-full w-full object-cover'}
          ref={videoRef}
          muted
          autoPlay
          loop
          poster={backgroundImg}
          playsInline
          onError={() => {
            setVideoError(true);
          }}
        >
          <source src={mainBgMp4} type={'video/mp4'} />
        </video>
      )}
    </div>
  );
};

export default GameBackground;
