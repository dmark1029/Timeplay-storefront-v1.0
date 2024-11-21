import { jwtDecode } from 'jwt-decode';
import { AccountLoginResponse, ContentAvatarData } from 'ships-service-sdk';

import { accountApi } from '@/services/ships-service';

const ACCOUNT_STORAGE_KEY = 'account';
const CARD_NUMBER_STORAGE_KEY = 'cardNumber';
const AVATAR_STORAGE_KEY = 'avatar';
const AVATAR_ID_STORAGE_KEY = 'avatarId';
const DOND_TEMP_STORAGE_KEY = 'dondTemp';
const ONBOARD_LOCATION_STORAGE_KEY = 'onboard_location';
const LAST_ACTIVITY_KEY = 'last_activity_timestamp';
const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export class AuthAccount {
  login?: AccountLoginResponse;
  cardNumber?: string;
  isValid: boolean = false;
}

export type DONDUserLoginCredentialsType = {
  cardNumber?: string;
  pin?: string;
  folio?: string;
  bookNo?: string;
  seqNo?: string;
  cabin?: string;
  firstName?: string;
  birthYear?: string;
};

export type dondTempType = {
  sessionId: number;
  sessionDay: number;
  sessionName: string;
  sessionScheduledStart: string;
  userLoginCredentials: DONDUserLoginCredentialsType;
  updated: boolean;
};

export const redirectToLogin = async () => {
  if (window.location.pathname !== '/') {
    const url = window.location.origin;
    console.warn(`attempted to redirect to host root ${url}`);
    window.location.href = url;
  }
};

export const saveAuthAccount = (data: AccountLoginResponse | undefined, cardNumber?: string) => {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(data));

  if (cardNumber) localStorage.setItem(CARD_NUMBER_STORAGE_KEY, cardNumber);
};

export const checkAuthAccount = async (): Promise<AuthAccount> => {
  const json = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  if (!json) {
    return new AuthAccount();
  }
  const account = new AuthAccount();
  account.login = JSON.parse(json);

  const cardNumber = localStorage.getItem(CARD_NUMBER_STORAGE_KEY);
  if (cardNumber) account.cardNumber = cardNumber;

  if (account.login?.token?.access_token) {
    const decoded = jwtDecode(account.login.token.access_token);
    if (!decoded) {
      console.warn(`token is invalid`);
      return new AuthAccount();
    }

    const exp = decoded.exp! * 1000;
    const curr = new Date().getTime();

    if (exp < curr) {
      // refresh token
      try {
        const resp = await accountApi.token({
          userID: account.login.user_info?.playerId || '',
          payload: {
            device_id: account.login.user_info?.deviceId || '',
            refresh_token: account.login.token.refresh_token || '',
          },
        });
        saveAuthAccount(resp.data.data);
        account.login = resp.data.data;
      } catch (err) {
        // invalidate the saved account, requires the user to login again
        clearAuthAccount();
        return new AuthAccount();
      }
    }

    account.isValid = true;
    return account;
  }

  console.warn(`no token found`);
  return new AuthAccount();
};

export const clearAuthAccount = async () => {
  console.log(`Clearing local storage ${ACCOUNT_STORAGE_KEY}`);
  localStorage.removeItem(ACCOUNT_STORAGE_KEY);

  console.log(`Clearing local storage ${CARD_NUMBER_STORAGE_KEY}`);
  localStorage.removeItem(CARD_NUMBER_STORAGE_KEY);
};

type ToggleFullScreen = (toggle?: boolean) => void;
export const toggleFullScreen: ToggleFullScreen = (toggle) => {
  if (import.meta.env.VITE_DEBUG) {
    console.log('Debug mode enabled, ignoring fullscreen toggle');
    return;
  }

  const doc: any = document;
  const elem = document.documentElement as any;

  // Check if document is already in fullscreen
  const isFullscreen: boolean =
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement;

  if (!isFullscreen && toggle !== false) {
    // Enter fullscreen
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else if (isFullscreen && toggle !== true) {
    // Exit fullscreen
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
};

type GetDeviceType = () => 'mobile' | 'desktop';
export const getDeviceType: GetDeviceType = () => {
  const userAgent: string = navigator.userAgent || navigator.vendor;

  // Patterns to detect mobile devices
  const mobileRegex: RegExp =
    /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/;

  // Check if the user agent matches mobile patterns
  if (mobileRegex.test(userAgent)) {
    console.log('getDeviceType: mobile');
    return 'mobile';
  } else {
    console.log('getDeviceType: desktop');
    return 'desktop';
  }
};

type CheckIsIos = () => boolean;
export const checkIsIos: CheckIsIos = () => {
  const userAgent: string = navigator.userAgent || navigator.vendor;
  const isIOS =
    userAgent.includes('iPhone') ||
    userAgent.includes('iPad') ||
    userAgent.includes('iPod') ||
    userAgent.includes('Mac');

  return isIOS;
};

export const saveAvatar = (avatar: ContentAvatarData) => {
  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
  localStorage.setItem(AVATAR_ID_STORAGE_KEY, avatar.avatar_id || '0');
};

export const getAvatar = (): ContentAvatarData | undefined => {
  try {
    const json = localStorage.getItem(AVATAR_STORAGE_KEY);
    return JSON.parse(json || '');
  } catch (err) {
    return undefined;
  }
};

export const saveDondTemp = (dondTemp: dondTempType) => {
  localStorage.setItem(DOND_TEMP_STORAGE_KEY, JSON.stringify(dondTemp));
};

export const saveOnboardLocation = (location: string) => {
  localStorage.setItem(ONBOARD_LOCATION_STORAGE_KEY, location);
};

export const getOnboardLocation = (): string | null => {
  return localStorage.getItem(ONBOARD_LOCATION_STORAGE_KEY);
};

export const updateLastActivity = () => {
  const timestamp = new Date().getTime();
  localStorage.setItem(LAST_ACTIVITY_KEY, timestamp.toString());
};

export const clearActivityTimeout = () => {
  localStorage.removeItem(LAST_ACTIVITY_KEY);
};

export const isActivityTimeout = (): boolean => {
  const lastActivityTimestamp = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (lastActivityTimestamp) {
    const currentTime = new Date().getTime();
    const timeSinceLastActivity = currentTime - parseInt(lastActivityTimestamp, 10);
    if (timeSinceLastActivity > IDLE_TIMEOUT) {
      return true;
    }
  }
  return false;
};
