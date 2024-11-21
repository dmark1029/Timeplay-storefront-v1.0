import { useEffect, useState } from 'react';

export const useIsFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenChange = () => {
    const bool = document.fullscreenElement !== null;
    setIsFullScreen(bool);
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return isFullScreen;
};
