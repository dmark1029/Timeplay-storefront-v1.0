// import { useState } from 'react';
import shrineGates from '../assets/lucky-dragon-bg.png';
import backgroundImg from '../assets/lucky-dragon-primary-bg.png';

const GameBackground = () => {
  // const [videoError, setVideoError] = useState<boolean>(false);

  return (
    <div className='absolute -z-50 flex h-full w-full max-w-lg grow flex-col items-center'>
      {/* {videoError ? ( */}
      <img className={'absolute -z-10 h-full w-full object-cover'} src={backgroundImg} />
      <img className={'absolute h-full w-full object-contain'} src={shrineGates} />
      {/* ) : (
      <img className={'h-full w-full object-conver'} src={backgroundImg} />
        <video
          className={'absolute inset-0 -z-10 h-full w-full object-contain'}
          muted
          autoPlay
          loop
          poster={shrineGates}
          playsInline
          onError={() => setVideoError(true)}
        >
        <source src={dondAnimatedBg} type={'video/mp4'} />
        </video> 
      )}*/}
    </div>
  );
};

export default GameBackground;
