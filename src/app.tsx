import { useEffect, useRef } from 'react';

import { NextUIProvider } from '@nextui-org/react';
import { useNavigate, useRoutes } from 'react-router-dom';

import {
  BreakTheBankPage,
  CruisingForCashPage,
  InstantWinLayout,
  LuckyDragonPage,
  OceanTreasurePage,
} from './apps/instant-win/index.ts';
import {
  PowerPicksBigScreenCountDownPage,
  PowerPicksBigScreenHomePage,
} from './apps/power-picks-big-screen/index.ts';
import PowerPicksBigScreenLayout from './apps/power-picks-big-screen/layout.tsx';
import PowerPicksWrapper from './apps/power-picks/components/power-picks-wrapper.tsx';
import {
  PowerPicksCheckoutPage,
  PowerPicksChooseGamePage,
  PowerPicksDrawsPage,
  PowerPicksLiveDrawPage,
  PowerPicksPurchasePage,
} from './apps/power-picks/index.ts';
import PowerPicksLayout from './apps/power-picks/layout.tsx';
import { LobbyPage, LoginPage, StoreFrontLayout } from './apps/store-front';
import { rotate } from './assets/images/index.ts';
import { AppProvider, useAppContext } from './contexts/app-context.tsx';
import { AudioProvider } from './contexts/audio-context.tsx';
import { DialogProvider } from './contexts/dialog-context.tsx';
import useOrientationPopup, { DeviceOrientation } from './hooks/useOrientationPopup.tsx';
import { GamesLayout, NotFoundPage } from './pages';

function App() {
  // Prevent text and image selection and opening of context menu
  useEffect(() => {
    console.log(`ships-web-client v${import.meta.env.VITE_VERSION}`);
    if (import.meta.env.VITE_DEBUG) {
      console.log('NOTE: Debug mode is currently enabled via VITE_DEBUG environment variable');
    }
    const preventDefault = (event: Event) => event.preventDefault();
    if (!import.meta.env.VITE_DEBUG) {
      document.addEventListener('contextmenu', preventDefault);
    }
    document.addEventListener('selectstart', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    return () => {
      if (!import.meta.env.VITE_DEBUG) {
        document.removeEventListener('contextmenu', preventDefault);
      }
      document.removeEventListener('selectstart', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
    };
  }, []);

  const navigate = useNavigate();

  return (
    <NextUIProvider
      navigate={navigate}
      className='no-select flex h-full w-full items-center justify-center bg-stone-500'
    >
      <AudioProvider>
        <DialogProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </DialogProvider>
      </AudioProvider>
    </NextUIProvider>
  );
}

export default App;

const AppContent = () => {
  const { appTheme } = useAppContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const orientationPopup = useOrientationPopup({
    mode: DeviceOrientation.PORTRAIT,
    popupContent: (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#21211B]'>
        <img src={rotate} alt='Rotate Device' />
      </div>
    ),
    contentRef: contentRef,
  });

  const routes = useRoutes([
    {
      path: '/',
      element: <StoreFrontLayout />,
      children: [
        { index: true, element: <LoginPage /> },
        { path: 'lobby', element: <LobbyPage /> },
        {
          path: 'games',
          element: <GamesLayout />,
          children: [
            {
              path: 'instant-win',
              element: <InstantWinLayout />,
              children: [
                { index: true, element: <InstantWinLayout /> },
                { path: 'break-the-bank', element: <BreakTheBankPage /> },
                { path: 'cruising-for-cash', element: <CruisingForCashPage /> },
                { path: 'lucky-dragon', element: <LuckyDragonPage /> },
                { path: 'ocean-treasure-hunt', element: <OceanTreasurePage /> },
              ],
            },
            {
              path: 'power-picks/*',
              element: <PowerPicksLayout />,
              children: [
                { index: true, element: <PowerPicksChooseGamePage /> },
                {
                  path: ':category',
                  element: <PowerPicksLayout />,
                  children: [
                    {
                      path: 'draws',
                      element: <PowerPicksWrapper WrappedElement={PowerPicksDrawsPage} />,
                    },
                    {
                      path: 'lines',
                      element: <PowerPicksWrapper WrappedElement={PowerPicksCheckoutPage} />,
                    },
                    {
                      path: 'purchase',
                      element: <PowerPicksWrapper WrappedElement={PowerPicksPurchasePage} />,
                    },
                    {
                      path: 'livedraw/:drawID',
                      element: <PowerPicksWrapper WrappedElement={PowerPicksLiveDrawPage} />,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: 'big-screen',
      children: [
        {
          path: 'power-picks',
          element: <PowerPicksBigScreenLayout />,
          children: [
            { path: '', element: <PowerPicksBigScreenHomePage /> },
            { path: 'count-down', element: <PowerPicksBigScreenCountDownPage /> },
          ],
        },
      ],
    },
    { path: '*', element: <NotFoundPage /> },
  ]);
  if (!routes) return null;
  return (
    <>
      <main
        className={`relative mx-auto flex h-full max-h-lg w-full max-w-lg bg-white shadow-lg drop-shadow-lg sm:rounded-lg ${appTheme}`}
        ref={contentRef}
      >
        {routes}
      </main>
      {orientationPopup()}
    </>
  );
};
