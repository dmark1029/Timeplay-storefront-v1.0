// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';

import { Button } from '@nextui-org/react';
import { MdOutlineQuestionMark } from 'react-icons/md';
import { useLocation, useParams, useRoutes } from 'react-router-dom';

import { AnimateTransition } from '@/components';
import { useAppContext } from '@/contexts/app-context';
import { cn } from '@/utils/cn';
import { usdFormatter } from '@/utils/util';

import InfoModal from './components/info-modal';
import PowerPicksWrapper from './components/power-picks-wrapper';
import { GameProvider, useGameContext } from './context/game-context';
import PicksPage from './pages/checkout-page';
import ChooseGamePage from './pages/choose-game-page';
import DrawsPage from './pages/draws-page';
import HomePage from './pages/home-page';
import LiveDrawPage from './pages/live-draw-page';
import PickLinesPage from './pages/pick-lines-page';
import PurchasePage from './pages/purchase-picks-page';

const PowerPicksLayout = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

const AppContent = () => {
  const routes = useRoutes([
    { path: '/', element: <ChooseGamePage /> },
    {
      path: '/:category',
      children: [
        { path: '', element: <PowerPicksWrapper WrappedElement={HomePage} /> },
        { path: 'draws', element: <PowerPicksWrapper WrappedElement={DrawsPage} /> },
        { path: 'lines', element: <PowerPicksWrapper WrappedElement={PicksPage} /> },
        { path: 'purchase', element: <PowerPicksWrapper WrappedElement={PurchasePage} /> },
        { path: 'livedraw/:drawID', element: <PowerPicksWrapper WrappedElement={LiveDrawPage} /> },
      ],
    },
  ]);

  const { balance, updateBalance } = useAppContext();
  const { title, category, setTitle, setCategory } = useGameContext();
  const params = useParams();
  const location = useLocation();
  const [infoVisible, setInfoVisible] = useState(false);

  if (params.category !== category) {
    switch (params.category) {
      case 'pick3':
        setTitle('POWER PICK3');
        setCategory('pick3');
        break;
      case 'pick4':
        setTitle('POWER PICK4');
        setCategory('pick4');
        break;
      default:
        setTitle('GAME');
        setCategory(undefined);
        break;
    }
  }

  useEffect(() => {
    const updateBal = async () => {
      await updateBalance();
    };
    updateBal();
  }, [location]);

  return (
    <>
      <InfoModal visible={infoVisible} setVisible={setInfoVisible} category={category} />
      <Button
        className='absolute right-[38px] z-50 m-4 h-[30px] min-w-[30px] max-w-[30px] rounded-lg bg-nav-button-slate p-0 text-pp-text-dark opacity-80 shadow-user-menu-gray-shadow'
        onClick={() => setInfoVisible(true)}
      >
        <MdOutlineQuestionMark size={'1rem'} />
      </Button>
      <div className={cn('flex h-full w-full flex-col bg-pp-background')}>
        <div
          className={cn(
            'z-20 flex min-h-[100px] w-full flex-col items-center justify-center bg-gradient-to-t from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark text-white',
          )}
        >
          <div className='flex flex-row gap-2 font-tempo'>
            <h1 className='text-2xl font-bold'>{title}</h1>
          </div>
          <div className=''>
            Balance: {usdFormatter.format(balance?.cmas?.casinoBankBalance || 0)}
          </div>
        </div>
        <div className='h-[calc(100%-100px)]'>{routes}</div>
      </div>
    </>
  );
};

export default PowerPicksLayout;
