import { createContext, useContext, useEffect, useState } from 'react';

export enum GameStatesEnum {
  STAND_BY = 'STAND_BY',
  PRE_DRAW = 'PRE_DRAW',
  DRAWING = 'DRAWING',
  POST_DRAW = 'POST_DRAW',
}

export type GameStates = `${GameStatesEnum}`;

type ContextType = {
  drawTime: number;
  countdown: number;
  isDrawn: boolean;
  drawnNumbers: number[];
  gameState: GameStates;
  setDrawTime: (drawTime: number) => void;
  setCountdown: (countdown: number) => void;
  setIsDrawn: (isDrawn: boolean) => void;
  setDrawnNumbers: (drawnNumbers: number[]) => void;
  setGameState: (gameState: GameStates) => void;
};

const AppContext = createContext<ContextType | undefined>(undefined);

type ContextProviderProps = {
  children: React.ReactNode;
};

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [drawTime, setDrawTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isDrawn, setIsDrawn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [drawnNumbers, setDrawnNumbers] = useState([1, 2, 3, 4]);
  const [gameState, setGameState] = useState<GameStates>(GameStatesEnum.STAND_BY);

  // simulate a draw time of 5 seconds from now
  useEffect(() => {
    const newDrawTime = new Date().getTime() + 5000;
    setDrawTime(newDrawTime);
    initializeCountdown(newDrawTime);
    setIsLoading(false);
  }, []);

  const initializeCountdown = (drawTime: number) => {
    const now = new Date().getTime();
    const timeLeft = drawTime - now;
    setCountdown(Math.ceil(timeLeft / 1000));
    return timeLeft;
  };

  const startCountdown = () => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = drawTime - now;
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setIsDrawn(true);
        console.log('Draw initiated');
      } else {
        setCountdown(Math.ceil(timeLeft / 1000));
      }
    }, 1000);
    return interval;
  };

  useEffect(() => {
    let countdownInterval: any;
    if (countdown > 0) {
      countdownInterval = startCountdown();
    }
    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  const onGameStateChange = () => {
    switch (gameState) {
      case GameStatesEnum.STAND_BY:
        // setGameState(GameStatesEnum.PRE_DRAW);
        break;
      case GameStatesEnum.PRE_DRAW:
        // setGameState(GameStatesEnum.DRAWING);
        break;
      case GameStatesEnum.DRAWING:
        // setGameState(GameStatesEnum.POST_DRAW);
        break;
      case GameStatesEnum.POST_DRAW:
        // setGameState(GameStatesEnum.STAND_BY);
        break;
      default:
      // setGameState(GameStatesEnum.STAND_BY);
    }
  };

  useEffect(() => {
    console.log('Game State:', gameState);
    onGameStateChange();
  }, [gameState]);

  const contextValues = {
    drawTime,
    countdown,
    isDrawn,
    drawnNumbers,
    gameState,
    setDrawTime,
    setCountdown,
    setIsDrawn,
    setDrawnNumbers,
    setGameState,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {isLoading ? <div>Loading...</div> : children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const contextValue = useContext(AppContext);
  if (contextValue === undefined) {
    throw new Error('useContext must be used within a ContextProvider');
  }
  return contextValue;
};
