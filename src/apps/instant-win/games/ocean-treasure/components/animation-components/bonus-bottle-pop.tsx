import { useEffect } from 'react';

import { Sfx, useAudioContext } from '@/contexts/audio-context';

import '../../animation-code/animations.css';
import { bottleOpen, bottleOpeniOS } from '../../assets';

export const BonusBottlePop = (props: { prize: string }) => {
  const { prize } = props;
  const { playSoundEffect } = useAudioContext();

  useEffect(() => {
    playSoundEffect(Sfx.OTH_BONUS_BOTTLE2);
  }, []);

  return (
    <div className={'bottlePopAnimationContainer'}>
      <video
        className={'absolute inset-0 left-0 top-0 z-30 h-full w-full object-fill'}
        muted
        autoPlay
        playsInline
      >
        <source src={bottleOpeniOS} type={'video/quicktime'} />
        <source src={bottleOpen} type={'video/webm'} />
      </video>
      <h2 className={'absolute z-30 text-[2em]'}>{prize}</h2>
    </div>
  );
};

export default BonusBottlePop;
