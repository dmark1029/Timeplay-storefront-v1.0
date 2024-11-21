import { useEffect } from 'react';

import { useAppContext } from '@/contexts/app-context';
import { useAudioContext } from '@/contexts/audio-context';

const useIOSVideoLoop = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const { isIOS } = useAppContext();
  const { appHidden } = useAudioContext();

  const checkAndPlayVideo = () => {
    const video = videoRef.current;
    if (video && (video.paused || video.readyState < 4)) {
      video.play().catch((error) => {
        console.log('Error playing video: ', error);
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (isIOS && video) {
      video.addEventListener('pause', checkAndPlayVideo);
      video.addEventListener('ended', checkAndPlayVideo);

      return () => {
        video.removeEventListener('pause', checkAndPlayVideo);
        video.removeEventListener('ended', checkAndPlayVideo);
      };
    }
  }, [isIOS]);

  useEffect(() => {
    if (!appHidden) {
      checkAndPlayVideo();
    }
  }, [appHidden]);
};

export default useIOSVideoLoop;
