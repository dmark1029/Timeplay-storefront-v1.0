import { useEffect, useState } from 'react';

import { Button } from '@nextui-org/react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppContext } from '@/contexts/app-context';
import { useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { cn } from '@/utils/cn';
import { useIsFullScreen } from '@/utils/custom-hooks';
import { toggleFullScreen } from '@/utils/timeplay';
import { GamePaths } from '@/utils/types';

import {
  defaultCloseIcon,
  defaultExpandIcon,
  defaultGameInfoIcon,
  defaultHomeIcon,
  defaultMenuIcon,
  defaultMuteIcon,
  defaultShrinkIcon,
  defaultSoundIcon,
  dondCloseIcon,
  dondFullscreenIcon,
  dondGameInfoIcon,
  dondHomeIcon,
  dondMenuIcon,
  dondMuteIcon,
  dondShrinkIcon,
  dondSoundIcon,
} from '../assets/icons';
import { useStoreFrontContext } from '../layout';

const Navbar = () => {
  const { handleSetDialog } = useDialogContext();
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const { handleSelectGame, setIsUserMenuOpen, isUserMenuOpen, showGameInfo, gameId } =
    useStoreFrontContext();
  const { handleGenericClickAudio } = useAudioContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isFullScreen = useIsFullScreen();
  const pathname = location.pathname;
  const isNavVisible = pathname !== '/';
  const isLobby = pathname === '/lobby';
  const [infoVisible, setInfoVisible] = useState(false);
  const { getGames, isIOS } = useAppContext();
  const { toggleMuted, isMuted, stopAllAudio } = useAudioContext();

  const handleHomeClick = () => {
    console.log('Clicking home button');
    if (gameId) {
      handleGenericClickAudio(gameId);
    }

    if (isPathContainGameId(pathname) || pathname.includes('power-picks')) {
      handleSetDialog({
        type: 'exit-game',
        title: 'EXIT GAME',
        body: 'Are you sure you want to exit?',
        confirmButtonDisplay: 'Yes',
        onConfirm: () => {
          !isIOS && toggleFullScreen(false);
          handleSelectGame(null);
          stopAllAudio();
          setTimeout(() => {
            navigate('/lobby', { replace: true });
          }, 100);
        },
      });
    } else {
      navigate('/lobby', { replace: true });
    }
  };

  const isPathContainGameId = (pathname: string) => {
    const parts = pathname.split('/');
    const lastPath = parts[parts.length - 1] as GamePaths;
    return Object.values(GamePaths).includes(lastPath || 'lobby');
  };

  const handleThemeIcon = (
    gameId: string | null,
  ): {
    home: string;
    menu: string;
    close: string;
    sound: string;
    info: string;
    fullscreen: string;
    mute: string;
    shrink: string;
  } => {
    switch (gameId) {
      case 'dond-dbk':
        return {
          home: dondHomeIcon,
          menu: dondMenuIcon,
          sound: dondSoundIcon,
          info: dondGameInfoIcon,
          fullscreen: dondFullscreenIcon,
          shrink: dondShrinkIcon,
          mute: dondMuteIcon,
          close: dondCloseIcon,
        };
      default:
        return {
          home: defaultHomeIcon,
          menu: defaultMenuIcon,
          sound: defaultSoundIcon,
          mute: defaultMuteIcon,
          info: defaultGameInfoIcon,
          fullscreen: defaultExpandIcon,
          shrink: defaultShrinkIcon,
          close: defaultCloseIcon,
        };
    }
  };

  const icons = handleThemeIcon(gameId || 'default');

  const handleUserMenuClick = () => {
    console.log('User Menu');
    setIsUserMenuOpen(!isUserMenuOpen);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  const handleUserMuteClick = () => {
    console.log('User Mute');
    toggleMuted();
  };

  const handleUserInfoClick = () => {
    console.log('User Info');
    for (const g of getGames()) {
      if (g.name === gameId) {
        showGameInfo(g);
        if (gameId) {
          handleGenericClickAudio(gameId);
        }
        return;
      }
    }
    console.log('Game not found', gameId);
  };

  useEffect(() => {
    setIsBackgroundVisible(isLobby);
    setInfoVisible(pathname.startsWith('/games/instant-win'));
    // reset icons when redirected to /lobby
    if (pathname === '/lobby') {
      // reset gameId to null or a default value to reset icons
      handleSelectGame(null); // this assumes handleSelectGame updates the gameId state
    }
  }, [pathname]);

  return (
    <>
      {isNavVisible && (
        <nav
          className={`fixed z-50 flex justify-between gap-2 p-4 ${
            isBackgroundVisible
              ? 'left-0 right-0 top-0 bg-gradient-to-t from-user-menu-blue-gradient-light to-user-menu-blue-gradient-dark'
              : ' mx-auto w-full max-w-lg px-4 pt-4'
          }`}
        >
          {isBackgroundVisible && (
            <div className='flex flex-col py-2'>
              <h1 className='flex font-tempo text-2xl uppercase tracking-wider text-white'>
                Game Store
              </h1>
              <h2 className='flex font-bold leading-4 text-white'>Win Big At Sea!</h2>
            </div>
          )}
          <div className='fixed left-0 top-0 flex w-full flex-row justify-between p-4'>
            <div className={`flex flex-col gap-2`}>
              {!isLobby && <NavButton icon={icons.home} alt='Home' onClick={handleHomeClick} />}
              {!isIOS && pathname !== '/lobby' && (
                <FullScreenButton
                  isFullScreen={isFullScreen}
                  icons={{
                    fullscreen: icons.fullscreen,
                    shrink: icons.shrink,
                  }}
                />
              )}
            </div>
            <div className='flex flex-col justify-start gap-2'>
              <NavButton icon={icons.menu} alt='Toggle menu' onClick={handleUserMenuClick} />
              {!isLobby && (
                <NavButton
                  icon={isMuted ? icons.mute : icons.sound}
                  alt='Toggle sound'
                  onClick={handleUserMuteClick}
                />
              )}
              {infoVisible && (
                <NavButton icon={icons.info} alt='Game info' onClick={handleUserInfoClick} />
              )}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};
export default Navbar;

type ToggleFullScreenProps = {
  isFullScreen: boolean;
  icons: {
    fullscreen: string;
    shrink: string;
  };
};

const FullScreenButton: React.FC<ToggleFullScreenProps> = ({ isFullScreen, icons }) => {
  const { isIOS } = useAppContext();
  const handleFullScreenButtonClick = () => {
    console.log('handleFullScreenButtonClick');

    if (isIOS) {
      console.log('This is an iOS device, fullscreen is not supported');
      return;
    }

    toggleFullScreen();
  };

  return (
    <>
      {isFullScreen ? (
        <NavButton icon={icons.shrink} alt='Shrink screen' onClick={handleFullScreenButtonClick} />
      ) : (
        <NavButton
          icon={icons.fullscreen}
          alt='Expand screen'
          onClick={handleFullScreenButtonClick}
        />
      )}
    </>
  );
};

type NavButtonProps = {
  icon: string;
  alt: string;
  onClick: () => void;
};

const NavButton: React.FC<NavButtonProps> = ({ icon, alt, onClick }) => {
  const { gameId, navbarTheme } = useStoreFrontContext();

  return (
    <Button
      className={cn(
        'h-[30px] w-[30px] min-w-[30px] rounded-lg bg-nav-button-slate/80 p-0 shadow-user-menu-gray-shadow data-[focus-visible=true]:outline-red-500',
        gameId === 'dond-dbk' && 'bg-nav-button-dond/80 shadow-dond-shadow',
        navbarTheme === 'light' && 'data-[focus-visible=true]:outline-blue-800',
        navbarTheme === 'dark' && 'data-[focus-visible=true]:outline-white',
        navbarTheme === 'default' && 'data-[focus-visible=true]:outline-primary',
      )}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClick();
        }
      }}
    >
      <img src={icon} alt={alt} />
    </Button>
  );
};
