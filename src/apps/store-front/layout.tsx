import { createContext, useContext, useEffect, useState } from 'react';

import { Spinner } from '@nextui-org/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import { ActivityTimeout, UserFeedback, UserMenu } from '@/apps/store-front/components';
import { Game } from '@/apps/store-front/types';
import { useAppContext } from '@/contexts/app-context';
import { useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { useAccountHold, useCasinoHours, useGameEnabled, useServerError } from '@/hooks';
import { activityApi, sessionApi } from '@/services/ships-service';
import { gameLocations, getCashCompTitleFromTag } from '@/utils';
import { AuthAccount, clearActivityTimeout, saveOnboardLocation } from '@/utils/timeplay';
import {
  AccountHold,
  AccountHoldReason,
  ActivityType,
  EntSession,
  GameCategory,
  GameId,
  GameIds,
} from '@/utils/types';

import { getInstantWinInstance } from '../instant-win/services/ships-service';
import { ships_service } from '../power-picks/services/ships-service';
import Navbar from './components/navbar';
import TOSModal, { CURRENT_TOS_VERSION } from './components/tos-modal';
import UnderAgePopup from './components/underage-popup';

type StoreFrontContextType = {
  user: string;
  selectedGame: Game | null;
  showGame: Game | null;
  gameId: GameId | null;
  handleSelectGame: (game: Game | null) => void;
  showGameInfo: (game: Game | null) => void;
  activeSessions: EntSession[];
  getActiveSessions: () => Promise<EntSession[]>;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (isOpen: boolean) => void;
  gamesList: Game[];
  setGamesList: React.Dispatch<React.SetStateAction<Game[]>>;
  getGameData: (gameID: string) => Game | undefined;
  instantWinSummary: Map<string, number>;
  setInstantWinSummary: (summary: Map<string, number>) => void;
  navbarTheme: NavbarTheme;
  setNavbarTheme: (theme: NavbarTheme) => void;
};

type NavbarTheme = 'dark' | 'light' | 'default';

const StoreFrontContext = createContext<StoreFrontContextType>({} as StoreFrontContextType);

const StoreFrontLayout = () => {
  const {
    handleSetDialog,
    handleSetAccountHoldDialog,
    handleSetGameInfoDialog,
    handleSetCasinoHoursDialog,
    handleSetGameEnabledDialog,
    handleSetErrorDialog,
  } = useDialogContext();

  const [user, _] = useState('user');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTOSOpen, setIsTOSOpen] = useState(false);
  const [isUserFeedbackOpen, setIsUserFeedbackOpen] = useState(false);
  const [activityHasTimeout, setActivityHasTimeout] = useState(false);
  const [underAgePopupOpen, setUnderagePopupOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [gameId, setGameId] = useLocalStorage<GameId | null>('gameId', null);
  const [activeSessions, setActiveSessions] = useState<EntSession[]>([]);
  const [instantWinSummary, setInstantWinSummary] = useState<Map<string, number>>(new Map());

  const [navbarTheme, setNavbarTheme] = useState<NavbarTheme>('dark');

  const [gamesList, setGamesList] = useState<Game[]>([]);

  const [showGame, setShowGame] = useState<Game | null>(null);

  const {
    authAccount,
    logoutPlayerForce,
    isLoading,
    userIsMinor,
    isIOS,
    updateBalance,
  } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hasAuthAccount = authAccount && authAccount.isValid;
  //   const { stopMusic } = useAudioContext();

  // adds interceptors and handling for account hold response for axios calls
  const { setOnToggle: setAccountHoldPopupToggle } = useAccountHold();
  const { setOnToggle: setCasinoHoursPopupToggle } = useCasinoHours();
  const { setOnToggle: setGameEnabledPopupToggle } = useGameEnabled();
  const { setOnToggle: setErrorPopupToggle } = useServerError();
  const { handleGenericClickAudio } = useAudioContext();

  const handleSelectGame = (game: Game | null) => {
    console.log('handleSelectGame', game);
    setSelectedGame(game);

    if (game) {
      setGameId(game.name as GameId);
    } else {
      setGameId(null); // explicity set gameId to null when no game is selected
    }
  };

  const showGameInfo = (game: Game | null) => {
    const gameID = game?.name as GameIds;
    const gameLocation = gameLocations[gameID];

    handleSetGameInfoDialog({
      game: game,
      onPlay: !!gameLocation
        ? () => {
            handleSelectGame(game);
            navigate(gameLocation);
          }
        : undefined,
      type: 'game-info',
      isIOS: isIOS,
    });
    setShowGame(game);
  };

  const handleCloseMenu = () => {
    setIsUserMenuOpen(false);
    if (gameId) {
      handleGenericClickAudio(gameId);
    }
  };

  const handleCloseTOS = () => {
    setIsTOSOpen(false);
  };

  const handleCloseUnderAgePopup = () => {
    setUnderagePopupOpen(false);
  };

  const getActiveSessions = async (): Promise<EntSession[]> => {
    const allSessions: EntSession[] = [];

    try {
      const sessionResp = await sessionApi.getEntertainmentSessions({
        active: true,
      });
      const sessions =
        sessionResp.data.data?.filter((x: any) => x.snapshot?.bus && x.snapshot?.gameRoom) || [];
      allSessions.push(...sessions);
    } catch (err) {
      console.error(`[getActiveSessions] failed to get sessions: ${err}`);
    }

    try {
      const dondResp = await sessionApi.getDONDSessions({
        headers: { 'x-background-request': 'true' },
      });
      const dondSessions = dondResp.data.data || [];
      allSessions.push(...dondSessions);
    } catch (err) {
      console.error(`[getActiveSessions] failed to get dond sessions: ${err}`);
    }

    setActiveSessions(allSessions);
    return allSessions;
  };

  // this is the function that useAccountHold will call when the appropriate response is intercepted
  const toggleAccountHold = (hold: AccountHold) => {
    if (!hold) {
      return;
    }
    switch (hold.category) {
      case GameCategory.ScratchCard:
        toggleInstantWinAccountHold(hold);
        break;
      case GameCategory.PowerPick:
        togglePowerPickAccountHold(hold);
        break;
      default:
        console.error(`popup for account hold category ${hold.category} not implemented`);
    }
  };

  const toggleInstantWinAccountHold = async (hold: AccountHold) => {
    const userID = authAccount.login?.user_info?.playerId || '';
    const token = authAccount.login?.token?.access_token || '';

    try {
      const instance = await getInstantWinInstance(userID, hold.instance_id, token);
      let title = 'Account Locked';
      const body = `Please visit a customer support desk.`;

      const holdDisplay = `${hold?.hold_id}`;
      const isTaxThresholdExceeded =
        hold?.reasons?.includes(AccountHoldReason.TaxThreshold) || false;
      const isCashCompPrize = hold?.reasons?.includes(AccountHoldReason.CashCompensation) || false;
      const payout = instance?.gameplay_state?.payout?.cash || 0;
      const cashCompPrizeTags = instance?.gameplay_state?.payout?.cash_comp_prize_tags || [];
      const prizeDisplay = getInstantWinPrizeDisplay(
        payout,
        cashCompPrizeTags,
        isTaxThresholdExceeded,
        isCashCompPrize,
      );

      if (isTaxThresholdExceeded || isCashCompPrize) {
        title = isCashCompPrize ? 'Congratulations!' : 'Hand Pay Jackpot';

        handleSetAccountHoldDialog({
          type: 'account-hold',
          title: title,
          body: body,
          holdDisplay: holdDisplay,
          prizeDisplay: prizeDisplay,
        });
      }
    } catch (e) {
      console.log('failed to set up instant win account hold popup ', e);
    }
  };

  const togglePowerPickAccountHold = async (hold: AccountHold) => {
    const userID = authAccount.login?.user_info?.playerId || '';
    const token = authAccount.login?.token?.access_token || '';

    try {
      const lineID = hold.powerpick_line_id;
      if (!lineID) {
        throw new Error('invalid line ID');
      }

      const line = await ships_service.getLineByID(userID, lineID, token);
      if (!line.prizes || line.prizes.length <= 0) {
        throw new Error('prize not found');
      }
      const prize = line.prizes[0];

      let title = 'Account Locked';
      const body = `Please visit a customer support desk.`;

      const holdDisplay = `${hold?.hold_id}`;
      const isTaxThresholdExceeded =
        hold?.reasons?.includes(AccountHoldReason.TaxThreshold) || false;
      const isCashCompPrize = hold?.reasons?.includes(AccountHoldReason.CashCompensation) || false;
      const payout = prize.amount * 100; // convert to cents
      const cashCompPrizeTags = prize.cash_comp_prize_tags || [];
      const prizeDisplay = getInstantWinPrizeDisplay(
        payout,
        cashCompPrizeTags,
        isTaxThresholdExceeded,
        isCashCompPrize,
      );

      if (isTaxThresholdExceeded || isCashCompPrize) {
        title = isCashCompPrize ? 'Congratulations!' : 'Hand Pay Jackpot';

        handleSetAccountHoldDialog({
          type: 'account-hold',
          title: title,
          body: body,
          holdDisplay: holdDisplay,
          prizeDisplay: prizeDisplay,
        });
      }
    } catch (e) {
      console.log('failed to set up powerpick account hold popup ', e);
    }
  };

  const getInstantWinPrizeDisplay = (
    payout: number,
    compPrizeTags: string[],
    isTaxThresholdExceeded: boolean,
    isCashCompPrize: boolean,
  ): string => {
    const prizeDisplay: string[] = ['You won '];
    if (!!payout) {
      prizeDisplay.push(
        (payout / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
      );
      if (isCashCompPrize) {
        prizeDisplay.push(', ');
      }
    }

    compPrizeTags?.forEach((x, idx) => {
      const lastPrize = compPrizeTags.length - 1 === idx;
      if (lastPrize && (isTaxThresholdExceeded || compPrizeTags.length > 1)) {
        prizeDisplay.push('and ');
      }
      prizeDisplay.push(`${getCashCompTitleFromTag(x)}`);
      if (!lastPrize) {
        prizeDisplay.push(', ');
      }
    });

    prizeDisplay.push('.');

    return prizeDisplay.join('');
  };

  // returns game data based on gameid
  const getGameData = (gameID: string): Game | undefined => {
    return gamesList?.find((x) => x.name === gameID);
  };

  useEffect(() => {
    if (activityHasTimeout) {
      // prevent redirect to login view until user confirm timeout popup
      return;
    }

    if (isLoading) {
      return;
    }

    if (!hasAuthAccount && pathname !== '/') {
      console.log('No auth account, redirecting to login');
      navigate('/');
    } else if (hasAuthAccount && userIsMinor) {
      // User is a minor, redirect to login page
      // the pop up is controlled from the app.tsx
      setUnderagePopupOpen(true);
      console.log('User is a minor, logging out');
      logoutPlayerForce();
    } else if (hasAuthAccount && pathname === '/') {
      console.log('Auth account exists, redirecting to lobby');
      navigate('/lobby');
    }
  }, [hasAuthAccount, pathname, activityHasTimeout, isLoading]);

  useEffect(() => {
    // checkIdleStatus();

    // Set up event listener to detect visibility change and browser focus
    document.addEventListener('visibilitychange', refreshBalance);
    window.addEventListener('focus', refreshBalance);

    // Set up event listener to detect user activity
    // document.addEventListener('mousedown', checkIdleStatus);
    // document.addEventListener('mousemove', checkIdleStatus);
    // document.addEventListener('keydown', checkIdleStatus);
    // document.addEventListener('touchstart', checkIdleStatus);
    // document.addEventListener('scroll', checkIdleStatus);

    return () => {
      // Clean up event listener when component unmounts
      document.removeEventListener('visibilitychange', refreshBalance);
      window.removeEventListener('focus', refreshBalance);

      //   document.removeEventListener('mousedown', checkIdleStatus);
      //   document.removeEventListener('mousemove', checkIdleStatus);
      //   document.removeEventListener('keydown', checkIdleStatus);
      //   document.removeEventListener('touchstart', checkIdleStatus);
      //   document.removeEventListener('scroll', checkIdleStatus);
    };
  }, [authAccount]);

  const refreshBalance = async () => {
    try {
      if (document.hidden) {
        return;
      }
      if (!hasAuthAccount) {
        return;
      }
      await updateBalance();
    } catch (err) {
      console.error(`[layout.refreshBalance] ${err}`);
    }
  };

  //   const checkIdleStatus = async () => {
  //     try {
  //       if (document.hidden) {
  //         return;
  //       }
  //       if (!hasAuthAccount) {
  //         return;
  //       }

  //       if (isActivityTimeout()) {
  //         console.info(`[layout.checkIdleStatus] isActivityTimeout: true`);
  //         setIsUserMenuOpen(false);
  //         setActivityHasTimeout(true);
  //         stopMusic();
  //         logoutPlayerForce();
  //         return;
  //       }

  //       updateLastActivity();
  //     } catch (err) {
  //       console.error(`[layout.checkIdleStatus] ${err}`);
  //     }
  //   };

  const handleCloseActivityTimeout = async () => {
    clearActivityTimeout();
    setActivityHasTimeout(false);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    setAccountHoldPopupToggle(() => toggleAccountHold);
  }, [authAccount]);

  useEffect(() => {
    setCasinoHoursPopupToggle(() => handleSetCasinoHoursDialog);
    setGameEnabledPopupToggle(() => handleSetGameEnabledDialog);
    setErrorPopupToggle(() => handleSetErrorDialog);
  }, []);

  useEffect(() => {
    // authAccount can be set multiple times while loading, wait for loading to complete
    // no need to check TOS acceptance if on the login page or if the user is not logged in
    if (!isLoading && pathname !== '/' && authAccount.isValid) {
      parseLocation(authAccount);
      checkTOSAcceptance(authAccount);
    } else {
      // if the page is the login page, if the user isn't logged in or if the page is still loading
      // close the TOS modal
      setIsTOSOpen(false);
    }
  }, [authAccount, isLoading, pathname]);

  const parseLocation = async (authAccount: AuthAccount) => {
    try {
      let url = new URL(window.location.href);

      const paramName = 'location';

      // Check if the query parameter exists
      if (url.searchParams.has(paramName)) {
        let locationVal = url.searchParams.get(paramName) || '';
        console.log(`[parseLocation] user visiting from location: ${locationVal}`);

        // Remove the query parameter
        url.searchParams.delete(paramName);

        // Update the URL without reloading the page
        window.history.replaceState({}, document.title, url.pathname + url.search);

        saveOnboardLocation(locationVal);

        if (authAccount.isValid) {
          await activityApi.createUserActivity({
            userID: authAccount.login?.user_info?.playerId || '',
            payload: {
              activity_type: ActivityType.Visit,
              location: locationVal,
            },
          });
        } else {
          await activityApi.createUserActivityPublic({
            payload: {
              activity_type: ActivityType.Visit,
              location: locationVal,
            },
          });
        }
      }
    } catch (err) {
      console.error(`[layout.parseLocation] ${err}`);
    }
  };

  const checkTOSAcceptance = async (authAccount: AuthAccount) => {
    const logPrefix = '[StoreFrontLayout.checkTOSAcceptance]';
    if (authAccount.isValid) {
      // Check if user accepted the TOS before
      const userId = authAccount.login?.user_info?.playerId || '';

      let tosAcceptanceActivity;
      try {
        tosAcceptanceActivity = await activityApi.getLastActivity({
          userID: userId,
          type: ActivityType.TOSAccept,
        });
      } catch (e) {
        console.error(`${logPrefix} failed to fetch previous TOS acceptances: ${e}`);
        setIsTOSOpen(true);
        return;
      }

      if (
        !tosAcceptanceActivity.data.data?.length ||
        tosAcceptanceActivity.data.data?.length === 0
      ) {
        setIsTOSOpen(true);
      } else {
        // Check if ToS last accepted was a previous version
        if (
          !tosAcceptanceActivity.data.data[0].meta ||
          !tosAcceptanceActivity.data.data[0].meta['tosVersion'] ||
          tosAcceptanceActivity.data.data[0].meta['tosVersion'] < CURRENT_TOS_VERSION
        ) {
          handleSetDialog({
            type: 'info',
            title: 'Terms and Conditions Updated',
            body: 'The Terms and Conditions have been updated. Please accept the new Terms and Conditions before you can continue.',
            onClose: () => {
              setIsTOSOpen(true);
            },
          });
        }
      }
    }
  };

  const StoreFrontContextValue = {
    user,
    selectedGame,
    showGame,
    gameId,
    handleSelectGame,
    showGameInfo,
    activeSessions,
    getActiveSessions,
    isUserMenuOpen,
    setIsUserMenuOpen,
    gamesList,
    setGamesList,
    getGameData,
    instantWinSummary,
    setInstantWinSummary,
    navbarTheme,
    setNavbarTheme,
  };

  return (
    <StoreFrontContext.Provider value={StoreFrontContextValue}>
      <Navbar />
      <UnderAgePopup
        isOpen={underAgePopupOpen && !isLoading}
        handleCloseMenu={handleCloseUnderAgePopup}
      />
      <TOSModal isOpen={isTOSOpen} handleCloseMenu={handleCloseTOS} />
      <UserMenu isOpen={isUserMenuOpen} handleCloseMenu={handleCloseMenu} />
      <UserFeedback isOpen={isUserFeedbackOpen} onOpenChange={setIsUserFeedbackOpen} />
      <ActivityTimeout isOpen={activityHasTimeout} handleCloseMenu={handleCloseActivityTimeout} />
      {isLoading ? <Spinner size='lg' className='h-full w-full' /> : <Outlet />}
    </StoreFrontContext.Provider>
  );
};

export default StoreFrontLayout;

export const useStoreFrontContext = () => useContext(StoreFrontContext);
