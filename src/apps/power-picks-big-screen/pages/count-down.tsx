// @ts-nocheck
import { useEffect, useState } from 'react';

import { ContextProvider, useAppContext } from '../context';
import { GameStatesEnum } from '../types';

const CountDownPage = () => {
  const {
    drawTime,
    countdown,
    isDrawn,
    drawnNumbers,
    setDrawTime,
    setCountdown,
    setIsDrawn,
    setDrawnNumbers,
    setGameState,
  } = useAppContext();
  return (
    <div className='h-full w-full'>
      <h1>Draw Time: {drawTime}</h1>
      <h1>Countdown: {countdown}</h1>
      <div className='flex w-full justify-center gap-5 font-bold'>
        {isDrawn && drawnNumbers.map((number) => <div key={number}>{number}</div>)}
      </div>
    </div>
  );
};
export default CountDownPage;
