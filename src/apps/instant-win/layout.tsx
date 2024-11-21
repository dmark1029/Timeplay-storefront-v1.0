import { useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useStoreFrontContext } from '@/apps/store-front';

import { AnimationProvider } from './context/animation-context';
import { GameProvider } from './context/game-context';

const InstantWinLayout = () => {
  const { gameId } = useStoreFrontContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) {
      console.warn('No game id, navigating to home');
      navigate('/');
      return;
    }
  }, [gameId]);
  if (!gameId) return <div>Redirecting...</div>;

  return (
    <GameProvider>
      <AnimationProvider>
        <Outlet />
      </AnimationProvider>
    </GameProvider>
  );
};

export default InstantWinLayout;
