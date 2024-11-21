import { createContext, useContext, useEffect, useRef, useState } from 'react';

import {
  AccountBalance,
  AccountLoginRequest,
  PartnerMockGuest,
  PublicPublicConfig,
} from 'ships-service-sdk';
import useLocalStorage from 'use-local-storage';

import { Game } from '@/apps/store-front/types';
import { accountApi, defaultApi, mockGuestApi, sessionApi } from '@/services/ships-service';
import {
  AuthAccount,
  checkAuthAccount,
  checkIsIos,
  clearAuthAccount,
  getOnboardLocation,
  saveAuthAccount,
} from '@/utils/timeplay';
import { AccountType, ShipsPartner } from '@/utils/types';

import { useDialogContext } from './dialog-context';

const LEGAL_AGE = 18;

type ShipsActiveSession = {
  string: any;
};

type AppContextType = {
  isLoading: boolean;
  error: Error;
  setError: (error: Error) => void;
  appConfig: any;
  authAccount: AuthAccount;
  handlePlayerLogin: (payload: any) => void;
  logoutPlayer: (callback?: () => void) => void;
  logoutPlayerForce: () => void;
  resetApp: () => void;
  shipsActiveSessions: ShipsActiveSession[];
  handleEnterSession: (session: any) => void;
  handleSelectSession: (session: any) => void;
  isIOS: boolean;
  stackConfig: PublicPublicConfig;
  mockGuest: PartnerMockGuest;
  appTheme: string;
  setAppTheme: (theme: string) => void;
  partner: ShipsPartner;
  setPartner: (partner: ShipsPartner) => void;
  userIsMinor: boolean;
  setUserIsMinor: (isMinor: boolean) => void;
  balance: AccountBalance | undefined;
  transferBalanceToLottery: (
    amount: number,
    chargeType: AccountType,
    pin: string,
  ) => Promise<AccountBalance>;
  updateBalance: () => Promise<void>;
  getGames: () => Game[];
  prevCasinoBalance: React.MutableRefObject<number>;
};

type Error = {
  message: string;
  callback?: () => void;
} | null;

export type LoginRequestCombined = {
  firstname: string;
  folio: string;
  pin: string;
  session_key: string;
  dob: string;
  stateroom: string;
  lastname: string;
  cardNumber?: string;
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>(null);
  const [appConfig, setAppConfig] = useState<any>({});
  const [partner, setPartner] = useState<ShipsPartner>(ShipsPartner.Carnival);
  const [stackConfig, setShipsConfig] = useState<PublicPublicConfig>({});
  const [mockGuest, setMockGuest] = useState<PartnerMockGuest>({ enabled: false });
  const [isIOS, setIsIOS] = useState<boolean>(true);
  const [shipsActiveSessions, _] = useState<ShipsActiveSession[]>([]);
  const [appTheme, setAppTheme] = useLocalStorage('app-theme', 'light'); // ['light', 'dark']
  const [userIsMinor, setUserIsMinor] = useState<boolean>(false);
  const [balance, setBalance] = useState<AccountBalance | undefined>(undefined);
  const prevCasinoBalance = useRef<number>(0);

  const [authAccount, setAuthAccount] = useState<AuthAccount>({
    isValid: false,
  });
  let authAccountCheckInterval: any | null = null;
  let sessionsCheckInterval: any | null = null;

  const { handleSetDialog, handleSetPreviewDialog, handleSetErrorDialog } = useDialogContext();

  function checkAuthAccountAtInterval(duration: number) {
    authAccountCheckInterval = setInterval(async () => {
      const updatedAuthAccount = await checkAuthAccount();
      checkIfUserMinor(updatedAuthAccount);
      if (!updatedAuthAccount.isValid) {
        setAuthAccount({ isValid: false });
        clearInterval(authAccountCheckInterval);
      }
    }, duration);
  }

  // function checkActiveSessionsAtInterval(duration: number) {
  //   sessionsCheckInterval = setInterval(async () => {
  //     await handleGetActiveShipsSessions();
  //   }, duration);
  // }

  async function handlePlayerLogin(req: LoginRequestCombined) {
    console.log('handleLogin', req);
    setIsLoading(true);
    try {
      const config = await defaultApi.config();
      const partner = config.data.data?.ships?.stack_partner;

      var payload: AccountLoginRequest = {
        location: getOnboardLocation() || '',
      };
      if (partner == ShipsPartner.Carnival) {
        payload.carnival = {
          firstname: req.firstname,
          folio: req.folio,
          pin: req.pin,
          session_key: req.session_key,
        };
      } else if (partner == ShipsPartner.Celebrity) {
        payload.celebrity = {
          firstname: req.firstname,
          dob: req.dob,
          room: req.stateroom,
          folio: req.folio,
        };
      } else if (partner == ShipsPartner.NCL) {
        payload.ncl = {
          firstname: req.firstname,
          dob: req.dob,
          room: req.stateroom,
          folio: req.folio,
        };
      } else if (partner == ShipsPartner.Timeplay) {
        payload.timeplay = {
          firstname: req.firstname,
          lastname: req.lastname,
        };
      } else {
        throw new Error('invalid partner');
      }

      const resp = await accountApi.login({
        payload: payload,
      });
      setPartner(partner);
      saveAuthAccount(resp.data.data, req.cardNumber);
      const newAuthAccount: AuthAccount = await checkAuthAccount();
      setAuthAccount(newAuthAccount);
      checkAuthAccountAtInterval(10000);
      checkIfUserMinor(newAuthAccount);
    } catch (error) {
      setAuthAccount({ isValid: false });
      setError({ message: 'Login failed. Please try again.' });
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function logoutPlayer(callback?: () => void) {
    console.log('handleLogout');
    handleSetDialog({
      type: 'confirm',
      title: 'Log Out',
      body: 'Do you want to log out?',
      onConfirm: () => {
        setIsLoading(true);
        accountApi
          .logout({
            payload: {
              device_id: authAccount.login?.user_info?.deviceId || '',
              refresh_token: authAccount.login?.token?.refresh_token || '',
            },
          })
          .finally(() => {
            setIsLoading(false);
            logoutPlayerForce();
            if (callback) {
              callback();
            }
          });
      },
    });
  }

  function logoutPlayerForce() {
    setAuthAccount({ isValid: false });
    clearInterval(authAccountCheckInterval);
    clearInterval(sessionsCheckInterval);
    clearAuthAccount();
  }

  function handleSelectSession(session: any) {
    console.log('handleSelectSession', session);

    handleSetPreviewDialog({
      title: session.title,
      image: 'https://via.placeholder.com/150',
      onPlay: () => handleEnterSession(session),
    });
  }

  function handleEnterSession(session: any) {
    console.log('handleEnterSession', session);
    sessionApi.enterSession({
      payload: {
        session_id: session,
      },
    });
  }

  function resetApp() {
    console.log('resetting app');
    setAuthAccount({ isValid: false });
    setAppConfig({});
    setIsLoading(true);
    setError(null);
  }

  // async function handleGetActiveShipsSessions() {
  //   const sessions = await getActiveSessions();
  //   setShipsActiveSessions(sessions);
  //   console.log('handleGetActiveShipsSessions', sessions);
  // }

  const transferBalanceToLottery = async (
    amount: number,
    chargeType: AccountType,
    pin: string,
  ): Promise<AccountBalance> => {
    const userId = authAccount.login?.user_info?.playerId || '';
    const resp = await accountApi.downloadToLotteryBalance({
      userID: userId,
      payload: {
        amount: amount,
        charge_type: chargeType,
        meta: {},
        pin: pin,
      },
    });

    // update the prev balance. this is used for animating the bet bar
    prevCasinoBalance.current = balance?.casino_available_balance || 0;
    setBalance(resp.data.data);
    return resp.data.data || {};
  };

  const updateBalance = async () => {
    try {
      const userId = authAccount.login?.user_info?.playerId || '';
      const resp = await accountApi.getBalance({
        userID: userId,
      });

      // if balance hasnt been set yet, prevBalance gets set to response (initial value) otherwise set to balance before changing
      if (!!balance) {
        prevCasinoBalance.current = balance.casino_available_balance || 0;
      } else {
        prevCasinoBalance.current = resp.data.data?.casino_available_balance || 0;
      }

      setBalance(resp.data.data);
    } catch (e) {
      console.error(`failed to get balance ${e}`);
    }
  };

  const getGames = (): Game[] => {
    const games: Game[] = [];

    const gameGroups = Object.values(stackConfig.game_group || {});
    for (const group of gameGroups) {
      for (const [_, category] of Object.entries(group.category || {})) {
        for (const [_, catGames] of Object.entries(category.game || {})) {
          games.push(catGames);
        }
      }
    }

    return games;
  };

  // Setup app
  useEffect(() => {
    const setup = async () => {
      try {
        console.log('AppProvider setup');

        const isIOS = checkIsIos();
        setIsIOS(isIOS);

        const newAuthAccount: AuthAccount = await checkAuthAccount();
        console.log('authAccount', newAuthAccount);
        if (newAuthAccount.isValid) {
          checkIfUserMinor(newAuthAccount);
          setAuthAccount(newAuthAccount);
          checkAuthAccountAtInterval(10000);
        } else {
          setAuthAccount({ isValid: false });
        }

        const mockGuest = await mockGuestApi.getMockGuest();
        const stackConfig = await defaultApi.config();
        console.log('mockGuest', mockGuest);
        console.log('stackConfig', stackConfig);

        if (stackConfig.data) {
          setShipsConfig(stackConfig.data.data || {});
        } else {
          setError({ message: 'Failed to load ships config' });
          setShipsConfig({});
        }

        if (mockGuest.data) {
          setMockGuest(mockGuest.data.data || {});
        } else {
          setError({ message: 'Failed to load mock guest config' });
          setMockGuest({ enabled: false });
        }

        // TODO: Uncomment when ready
        // await handleGetActiveShipsSessions();
        // checkActiveSessionsAtInterval(5000);
      } catch (err) {
        setError({ message: 'Server not available. Please try again later.' });
        console.error('[app-context.setup]', err);
      } finally {
        setIsLoading(false);
      }
    };

    setup();
  }, []);

  const checkIfUserMinor = (account: AuthAccount) => {
    const age = account.login?.passenger?.age;
    if (account.isValid && age) {
      setUserIsMinor(age < LEGAL_AGE);
    } else {
      console.log('unable to determine user age. setting to false');
      setUserIsMinor(false);
    }
  };

  // Show spinner when loading
  useEffect(() => {
    if (isLoading) {
      handleSetDialog({
        type: 'spinner',
        title: 'Loading',
        body: 'Please wait...',
      });
    } else {
      handleSetDialog(null);
    }
  }, [isLoading]);

  // Show error dialog when error occurs
  useEffect(() => {
    if (error) {
      handleSetErrorDialog({
        message: error.message,
        onClose: () => {
          if (error.callback) {
            error.callback();
          }
          setError(null);
        },
      });
    } else {
      handleSetDialog(null);
    }
  }, [error]);

  // get an initial balance on load
  useEffect(() => {
    if (!authAccount.isValid) {
      return;
    }

    const setupBalance = async () => {
      await updateBalance();
    };

    setupBalance();
  }, [authAccount]);

  const appContextValue = {
    isLoading,
    error,
    setError,
    appConfig,
    authAccount,
    handlePlayerLogin,
    logoutPlayer,
    logoutPlayerForce,
    resetApp,
    shipsActiveSessions,
    handleEnterSession,
    handleSelectSession,
    isIOS,
    stackConfig,
    mockGuest,
    appTheme,
    setAppTheme,
    partner,
    setPartner,
    userIsMinor,
    setUserIsMinor,
    balance,
    transferBalanceToLottery,
    updateBalance,
    getGames,
    prevCasinoBalance,
  };

  return <AppContext.Provider value={appContextValue}>{children}</AppContext.Provider>;
};

export default AppContext;

export const useAppContext = () => useContext(AppContext);
