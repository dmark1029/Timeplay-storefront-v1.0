import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';

import { useStoreFrontContext } from '@/apps/store-front';
import { useAppContext } from '@/contexts/app-context';
import { Sfx, useAudioContext } from '@/contexts/audio-context';
import { useDialogContext } from '@/contexts/dialog-context';
import { AccountType } from '@/utils/types';

import {
  generateMockInstantWinNumbers,
  generateMockInstantWinNumbersStates,
} from '../services/mock-data';
import {
  PurchaseError,
  UnauthorizedError,
  completeInstantWinInstance,
  getActiveInstantWinInstances,
  getActiveInstantWinSessions,
  purchaseInstantWin,
  revealInstantWinInstance,
  updateInstantWinNumber,
} from '../services/ships-service';
import {
  CompleteInstantWinInstanceConflictError,
  FeatureFlags,
  InstantWinCardConfig,
  InstantWinGameType,
  InstantWinInstance,
  InstantWinNumber,
  InstantWinNumberGroupType,
  InstantWinNumberStates,
  InstantWinState,
  LotteryGameSession,
} from '../types';
import { isCompleteInstantWinInstanceConflictError, isCompleteInstantWinInstanceHeldError } from '../util';

type GameContextType = {
  openLuckyNumber: (index: number) => void;
  luckyNumbers: InstantWinNumber[];
  openUserNumber: (index: number) => void;
  userNumbers: InstantWinNumber[];
  openMatch3Number: (index: number) => void;
  match3Numbers: InstantWinNumber[];
  openPrizeLot: (index: number) => void;
  prizeLotNumbers: InstantWinNumber[];
  topPrize: string;
  bonusNumbers: InstantWinNumber[];
  openBonusNumber: () => void;
  purchaseTicket: () => Promise<void>;
  purchaseCount: number;
  totalCost: number;
  changePurchaseCount: (forward: boolean) => void;
  changeCoupon: (couponID: string) => void;
  changeStake: (forward: boolean) => void;
  changeInstance: (forward: boolean) => void;
  animatedRevealAll: () => Promise<void>;
  remainingCards: number;
  instance: InstantWinInstance | null;
  isGame: boolean;
  betBarSession: LotteryGameSession;
  possibleStakes: number[];
  stake: number;
  stakeIndex: number;
  changeStakeAndSession: (newStakeIndex: number) => void;
  instanceIndex: number;
  instances: InstantWinInstance[];
  sessionIndex: number;
  autoPlay: boolean;
  setAutoPlay: (autoPlay: boolean) => void;
  hasMatch3Game: boolean;
  hasBonusGame: boolean;
  isFetchingData: boolean;
  isRevealingAll: boolean;
  setIsRevealingAll: React.Dispatch<React.SetStateAction<boolean>>;
  isInstanceCompleting: boolean;
  isInstanceCompleted: boolean;
  updateActiveInstantWinInstances: () => Promise<InstantWinInstance[]>;
  getNextInstance: () => void;
  gameState: GameStates;
  moveToGameState: (gameState: GameStates) => void;
  featureFlags: FeatureFlags;
  formatPrize: (input: number) => string;
  getSymbolAriaLabel: (input: number) => string;
  purchaseCountLimit: number;
  winLevel: WinLevels;
  dollarAmountWon: string | undefined;
  prefersReducedMotion: boolean;
  luckyNumbersStates: InstantWinNumberStates[];
  userNumbersStates: InstantWinNumberStates[];
  match3NumbersStates: InstantWinNumberStates[];
  prizeLotNumbersStates: InstantWinNumberStates[];
  bonusNumbersStates: InstantWinNumberStates[];
  revealAllError: boolean;
  completeError: boolean;
  revealAnimating: boolean;
  selectedAccountType: AccountType;
  setSelectedAccountType: (accountType: AccountType) => void;
  userPIN: string;
  setUserPIN: (pin: string) => void;
  openGenericMultiplier: () => void;
  genericMultiplier: InstantWinNumber | undefined;
  genericMultiplierState: InstantWinNumberStates;
  showIntroAnimation: boolean;
  setShowIntroAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  completeRevealAll: () => Promise<void>;
  allLuckyNumbersRevealed: boolean;
  alluserNumbersRevealed: boolean;
  allMatchNumbersRevealed: boolean;
  allBonusNumbersRevealed: boolean;
  genericMultiplierRevealed: boolean;
  groupRevealLuckyNumbers: () => void;
  groupRevealUserNumbers: () => void;
  groupRevealMatchNumbers: () => void;
  groupRevealBonusNumbers: () => void;
  groupRevealGenericMultiplier: () => void;
  setPurchaseCount: React.Dispatch<React.SetStateAction<number>>;
};

export enum GameStates {
  INITIALIZING,
  SETUP,
  STAND_BY,
  PLAYING,
  AUTO_PLAYING,
  REVEALED,
  GAME_OVER,
  WIN_ANIMATIONS,
}

export enum WinLevels {
  ZERO,
  NORMAL,
  BIG,
  SUPER,
  MEGA,
}

const GameContext = createContext<GameContextType | null>(null);

const initialLuckyNumbersStates: number[] = generateMockInstantWinNumbersStates(
  4,
  InstantWinNumberStates.CLOSED,
);
const initialUserNumbersStates: number[] = generateMockInstantWinNumbersStates(
  20,
  InstantWinNumberStates.CLOSED,
);
const initialMatch3NumbersStates: number[] = generateMockInstantWinNumbersStates(
  3,
  InstantWinNumberStates.CLOSED,
);
const initialPrizeLotNumbersStates: number[] = generateMockInstantWinNumbersStates(
  1,
  InstantWinNumberStates.CLOSED,
);
const initialBonusNumbersStates: number[] = generateMockInstantWinNumbersStates(
  1,
  InstantWinNumberStates.CLOSED,
);

const initialLuckyNumbers: InstantWinNumber[] = generateMockInstantWinNumbers(4);
const initialUserNumbers: InstantWinNumber[] = generateMockInstantWinNumbers(20);
const initialMatch3Numbers: InstantWinNumber[] = generateMockInstantWinNumbers(3);
const initialPrizeLotNumbers: InstantWinNumber[] = generateMockInstantWinNumbers(1);
const initialBonusNumbers: InstantWinNumber[] = generateMockInstantWinNumbers(1);
const initialTopPrize = '$30,000';
const initialFeatureFlags: FeatureFlags = {
  generic: true,
  match: true,
  reveal: true,
  genericMultiplier: false,
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const logPrefix = '[instant-win.game-context]';
  // this is the value of stake we want to start the bet bar on
  const defaultStakeValue = 5;

  const { handleSetErrorDialog } = useDialogContext();
  const { balance, updateBalance } = useAppContext();
  const { playSoundEffect, stopAllAudio } = useAudioContext();

  // auth data
  const { authAccount } = useAppContext();
  if (!authAccount.isValid) return null;
  const userId = authAccount.login?.user_info?.playerId || '';
  const token = authAccount.login?.token?.access_token || '';

  // active game data
  const { gameId } = useStoreFrontContext();
  const [gameState, setGameState] = useState<GameStates>(GameStates.INITIALIZING);
  const [incomingGameState, setIncomingGameState] = useState<GameStates | undefined>();
  const [winLevel, setWinLevel] = useState<WinLevels>(WinLevels.ZERO);

  const [isGameLoading, setIsGameLoading] = useState<boolean>(true);
  const [isInstanceCompleting, setIsInstanceCompleting] = useState<boolean>(false);
  const [isInstanceCompleted, setIsInstanceCompleted] = useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [instanceIndex, setInstanceIndex] = useState<number>(0);
  const [sessionIndex, setSessionIndex] = useState<number>(0);
  const [stakeIndex, setStakeIndex] = useState<number>(1);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(initialFeatureFlags);
  const [sessions, setSessions] = useState<LotteryGameSession[]>([]);
  const [instances, setInstances] = useState<InstantWinInstance[]>([]);
  const [remainingCards, setRemainingCards] = useState<number>(0);
  const [possibleStakes, setPossibleStakes] = useState<number[]>([]);
  const [revealAnimating, setRevealAnimating] = useState<boolean>(false);
  const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // gameplay states
  const [luckyNumbersStates, setLuckyNumbersStates] =
    useState<InstantWinNumberStates[]>(initialLuckyNumbersStates);
  const [userNumbersStates, setUserNumbersStates] =
    useState<InstantWinNumberStates[]>(initialUserNumbersStates);
  const [match3NumbersStates, setMatch3NumbersStates] = useState<InstantWinNumberStates[]>(
    initialMatch3NumbersStates,
  );
  const [prizeLotNumbersStates, setPrizeLotNumbersStates] = useState<InstantWinNumberStates[]>(
    initialPrizeLotNumbersStates,
  );
  const [bonusNumbersStates, setBonusNumbersStates] =
    useState<InstantWinNumberStates[]>(initialBonusNumbersStates);
  const [genericMultiplierState, setGenericMultiplierState] = useState<InstantWinNumberStates>(
    InstantWinNumberStates.CLOSED,
  );

  // gameplay data
  const [luckyNumbers, setLuckyNumbers] = useState<InstantWinNumber[]>(initialLuckyNumbers);
  const [userNumbers, setUserNumbers] = useState<InstantWinNumber[]>(initialUserNumbers);
  const [match3Numbers, setMatch3Numbers] = useState<InstantWinNumber[]>(initialMatch3Numbers);
  const [prizeLotNumbers, setPrizeLotNumbers] =
    useState<InstantWinNumber[]>(initialPrizeLotNumbers);
  const [bonusNumbers, setBonusNumbers] = useState<InstantWinNumber[]>(initialBonusNumbers);
  const [genericMultiplier, setGenericMultiplier] = useState<InstantWinNumber | undefined>(
    undefined,
  );

  const [topPrize, setTopPrize] = useState(initialTopPrize);

  const [purchaseCount, setPurchaseCount] = useState<number>(1);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(AccountType.Casino);
  const [userPIN, setUserPIN] = useState<string>('');

  const purchaseCountLimit = 100;
  const [coupon, setCoupon] = useState(''); // TODO these are not set up on backend.
  const [dollarAmountWon, setDollarAmountWon] = useState<string | undefined>('0');

  const [revealAllError, setRevealAllError] = useState<boolean>(false);
  const [completeError, setCompleteError] = useState<boolean>(false);

  const [isRevealingAll, setIsRevealingAll] = useState<boolean>(false);
  const [isResettingValues, setIsResettingValues] = useState<boolean>(false);

  // these refs are used to roll back states as some of the animation has to occur across functions to prevent race conditions
  const prevUserNumbersStates = useRef<InstantWinNumberStates[] | undefined>(undefined);
  const prevLuckyNumbersStates = useRef<InstantWinNumberStates[] | undefined>(undefined);
  const prevBonusNumbersStates = useRef<InstantWinNumberStates[] | undefined>(undefined);
  const prevMatch3NumbersStates = useRef<InstantWinNumberStates[] | undefined>(undefined);
  const prevPrizeLotNumbersStates = useRef<InstantWinNumberStates[] | undefined>(undefined);
  const prevGenericMultiplierState = useRef<InstantWinNumberStates | undefined>(undefined);

  const instance: InstantWinInstance = instances[instanceIndex];
  const isGame = !!instance;
  // note that this is the session selected and being used by the bet bar and is not necessarily the same as the session attached to the active instance
  const betBarSession = sessions[sessionIndex];
  const stake = possibleStakes[stakeIndex];
  const totalCost = stake * purchaseCount;
  const hasLuckyNumbersGame = featureFlags['generic'];
  const hasMatch3Game = featureFlags['match'];
  const hasBonusGame = featureFlags['reveal'];

  const allLuckyNumbersRevealed = luckyNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const alluserNumbersRevealed = userNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const allMatchNumbersRevealed =
    match3NumbersStates.every((state) => state !== InstantWinNumberStates.CLOSED) &&
    prizeLotNumbersStates[0] !== InstantWinNumberStates.CLOSED;
  const allBonusNumbersRevealed = bonusNumbersStates.every(
    (state) => state !== InstantWinNumberStates.CLOSED,
  );
  const genericMultiplierRevealed = genericMultiplierState !== InstantWinNumberStates.CLOSED;

  const updateNumber = async (numberID: string, revealed: boolean): Promise<boolean> => {
    try {
      await updateInstantWinNumber(userId, numberID, instance?.instance_id || '', revealed, token);
      return true;
    } catch (e) {
      if (e instanceof CompleteInstantWinInstanceConflictError) {
        try {
          handleSetErrorDialog({
            message: `This ticket was already completed.`,
          });

          setGameState(GameStates.INITIALIZING);

          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }
  };

  const checkGame = async () => {
    console.log(`${logPrefix} checking game`);
    const isGameCompleted = instance?.state === InstantWinState.InstantWinCompleted;
    const isGameOver = !isNumbersRemaining();
    console.log(`${logPrefix} isGameCompleted: ${isGameCompleted} isGameOver: ${isGameOver}`);

    if (isGameOver && !isGameCompleted) {
      setGameState(GameStates.REVEALED);
    }
  };

  const isNumbersRemaining = () => {
    const isUserNumbersRemaining =
      hasLuckyNumbersGame &&
      userNumbersStates.find((x) => x === InstantWinNumberStates.CLOSED) !== undefined;

    const isLuckyNumbersRemaining =
      hasLuckyNumbersGame &&
      luckyNumbersStates.find((x) => x === InstantWinNumberStates.CLOSED) !== undefined;
    const isMatch3NumbersRemaining =
      hasMatch3Game &&
      match3Numbers &&
      match3NumbersStates.find((x) => x === InstantWinNumberStates.CLOSED) !== undefined;

    const isPrizeLotNumbersRemaining =
      hasMatch3Game &&
      prizeLotNumbers &&
      prizeLotNumbersStates.find((x) => x === InstantWinNumberStates.CLOSED) !== undefined;
    const isBonusNumberRemaining =
      hasBonusGame &&
      bonusNumbersStates.find((x) => x === InstantWinNumberStates.CLOSED) !== undefined;

    const isGenericMultiplierRemaining =
      featureFlags.genericMultiplier && genericMultiplier && !genericMultiplier.revealed;

    const isNumbersRemaining =
      isUserNumbersRemaining ||
      isLuckyNumbersRemaining ||
      isBonusNumberRemaining ||
      isMatch3NumbersRemaining ||
      isPrizeLotNumbersRemaining ||
      isGenericMultiplierRemaining;

    return isNumbersRemaining;
  };

  const checkWins = () => {
    const cashWon = instance.gameplay_state.payout?.cash || 0;
    const dollarAmount = cashWon / 100;
    let formattedAmountWon = '';
    if (dollarAmount !== undefined) {
      formattedAmountWon =
        dollarAmount % 1 === 0 ? dollarAmount.toFixed(0) : dollarAmount.toFixed(2);
      setDollarAmountWon(formattedAmountWon);
    }
    const isWinner = winLevel !== WinLevels.ZERO;
    return isWinner;
  };

  // listens for when game needs to move to a particular state (ie. changed using moveToGameState),
  // and ensure dependent variables are set before moving forward
  useEffect(() => {
    switch (incomingGameState) {
      // check to see that call was made to set state to game over
      case GameStates.GAME_OVER:
        setIsInstanceCompleting(true);
        // once all the variables are set, move the state forward and turn this listener off
        if (isInstanceCompleting) {
          setGameState(GameStates.GAME_OVER);
          setIncomingGameState(undefined);
        }
        break;
      default:
        break;
    }
  }, [incomingGameState, isInstanceCompleting]);

  const moveToGameState = (gameState: GameStates) => {
    setIncomingGameState(gameState);
  };

  const completeGame: () => Promise<void> = async () => {
    console.log(`${logPrefix} completing game`);
    setCompleteError(false);

    // if we encounter an error here we check if its due to the game already being complete, if it is we continue. Otherwise return.
    try {
      await completeInstantWinInstance(userId, instance.instance_id, token);
    } catch (e) {
      console.log(`${logPrefix} unable to complete game ${e}`);
      if (isCompleteInstantWinInstanceConflictError(e)) {
        await updateActiveInstantWinInstances();
        const err = e as CompleteInstantWinInstanceConflictError;
        console.log(`${logPrefix} game already complete error ${err.state}`);
        if (err.state !== InstantWinState.InstantWinCompleted) {
          setIsInstanceCompleting(false);
          return;
        }
      } else if (isCompleteInstantWinInstanceHeldError(e)) {
        console.log(`${logPrefix} card is on hold, proceeding with completing the game as normal...`);
      } else {
        await updateActiveInstantWinInstances();
        setCompleteError(true);
        setIsInstanceCompleting(false);
        return;
      }
    }

    try {
      await updateBalance();
      instance.state = InstantWinState.InstantWinCompleted;
      setIsInstanceCompleted(true);
      const lastCard = instances.length === 1;
      setDollarAmountWon('');

      if (autoPlay && !lastCard) {
        await nextCardAfterDelay();
      } else if (autoPlay && lastCard) {
        setAutoPlay(false);
      }

      if (lastCard) {
        const delay = 2500;
        setTimeout(() => {
          console.log(`${logPrefix} setting game state to initializing in: ${delay}ms`);
          setGameState(GameStates.INITIALIZING);
        }, delay);
      }
    } catch (e) {
      console.log(`${logPrefix} unable to update balance ${e}`);
    } finally {
      setIsInstanceCompleting(false);
    }
  };

  const updateActiveInstantWinSessions = async (): Promise<LotteryGameSession[]> => {
    try {
      const sessions = await getActiveInstantWinSessions();
      console.log(`${logPrefix} fetched active instant win sessions:`, sessions);
      const filteredSessions = sessions.filter((x) => x.game_id === gameId);
      filteredSessions.sort((a, b) => a.price - b.price);
      setSessions(filteredSessions);

      return filteredSessions;
    } catch (e) {
      console.log(`${logPrefix} failed to fetch active instant win sessions: ${e}`);
      return [];
    }
  };

  const updateActiveInstantWinInstances = async (): Promise<InstantWinInstance[]> => {
    setIsFetchingData(true);
    setIsInstanceCompleted(false);
    try {
      const instances = await getActiveInstantWinInstances(userId, token);
      console.log(`${logPrefix} fetched active instant win instances: `, instances);
      const filteredInstances = instances.filter((x) => x.session.game_id === gameId);

      filteredInstances.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      setInstances(filteredInstances);
      setRemainingCards(filteredInstances.length);
      setIsFetchingData(false);
      return filteredInstances;
    } catch (e) {
      console.log(`${logPrefix} failed to fetch active instant win instances: ${e}`);
      setIsFetchingData(false);
      return [];
    }
  };

  const playSymbolRevealAudio = (game: string | null) => {
    if (game) {
      switch (game) {
        case 'ocean-treasure':
          playSoundEffect(Sfx.OTH_SYMBOL_REVEAL);
          break;
        case 'dond-dbk':
          playSoundEffect(Sfx.DOND_SYMBOL_REVEAL);
          break;
        case 'cruising-for-cash':
          playSoundEffect(Sfx.CFC_SYMBOL_REVEAL);
          break;
        default:
          break;
      }
    }
  };

  const openLuckyNumber = async (index: number) => {
    const prevLuckyNumbers = [...luckyNumbers];
    const prevLuckyNumbersStates = [...luckyNumbersStates];
    console.log(`${logPrefix} openLuckyNumber`, index);
    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    // return if the number is already open
    if (luckyNumbersStates[index] !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }

    const number = luckyNumbers[index];
    if (number.revealed) {
      console.error(`${logPrefix} lucky number with index: ${index} was already revealed`);
      return;
    }

    setIsGameLoading(true);

    // optimistic ui
    const updatedLuckyNumbers = [...luckyNumbers];
    updatedLuckyNumbers[index].revealed = true;
    setLuckyNumbers(updatedLuckyNumbers);

    const updatedLuckyNumbersStates = [...luckyNumbersStates];
    updatedLuckyNumbersStates[index] = InstantWinNumberStates.OPEN;
    setLuckyNumbersStates(updatedLuckyNumbersStates);
    playSymbolRevealAudio(gameId);
    const success = await updateNumber(number?.number_id, true);
    checkGame();
    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update lucky number with index: ${index}`);
      prevLuckyNumbers[index].revealed = false;
      setLuckyNumbers(prevLuckyNumbers);
      setLuckyNumbersStates(prevLuckyNumbersStates);
      setIsGameLoading(false);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const openUserNumber = async (index: number) => {
    const prevUserNumbers = [...userNumbers];
    const prevUserNumbersStates = [...userNumbersStates];
    console.log(`${logPrefix} openUserNumber`, index);
    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (userNumbersStates[index] !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }

    const number = userNumbers[index];
    if (number.revealed) {
      console.error(`${logPrefix} user number with index: ${index} was already revealed`);
      return;
    }

    setIsGameLoading(true);

    // optimistic ui
    const updatedUserNumbers = [...userNumbers];
    updatedUserNumbers[index].revealed = true;
    setUserNumbers(updatedUserNumbers);

    const updatedUserNumbersStates = [...userNumbersStates];
    updatedUserNumbersStates[index] = InstantWinNumberStates.OPEN;
    setUserNumbersStates(updatedUserNumbersStates);
    playSymbolRevealAudio(gameId);

    const success = await updateNumber(number?.number_id, true);
    checkGame();

    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update user number with index: ${index}`);
      prevUserNumbers[index].revealed = false;
      setUserNumbers(prevUserNumbers);
      setUserNumbersStates(prevUserNumbersStates);
      setIsGameLoading(false);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const openMatch3Number = async (index: number) => {
    const prevMatch3Numbers = [...match3Numbers];
    const prevMatch3NumbersStates = [...match3NumbersStates];
    console.log(`${logPrefix} openMatch3Number`, index);
    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (!hasMatch3Game) {
      console.error(`${logPrefix} instance does not have match 3 game`);
      return;
    }

    if (match3NumbersStates[index] !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }

    const number = match3Numbers[index];
    if (number.revealed) {
      console.error(`${logPrefix} match 3 number with index: ${index} was already revealed`);
      return;
    }

    setIsGameLoading(true);

    // optimistic ui
    const updatedMatch3Numbers = [...match3Numbers];
    updatedMatch3Numbers[index].revealed = true;
    setMatch3Numbers(updatedMatch3Numbers);

    const updatedMatch3NumbersStates = [...match3NumbersStates];
    updatedMatch3NumbersStates[index] = InstantWinNumberStates.OPEN;
    setMatch3NumbersStates(updatedMatch3NumbersStates);
    playSymbolRevealAudio(gameId);

    const success = await updateNumber(number?.number_id, true);
    checkGame();

    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update match 3 with index: ${index}`);
      prevMatch3Numbers[index].revealed = false;
      setMatch3Numbers(prevMatch3Numbers);
      setMatch3NumbersStates(prevMatch3NumbersStates);
      setIsGameLoading(false);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const openPrizeLot = async (index: number) => {
    console.log(`${logPrefix} openPrizeLot`, index);
    const prevPrizeLotNumbers = [...prizeLotNumbers];
    const prevPrizeLotNumbersStates = [...prizeLotNumbersStates];

    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (!hasMatch3Game) {
      console.error(`${logPrefix} instance does not have prize lot game`);
      return;
    }

    const number = prizeLotNumbers[index];
    if (number.revealed) {
      console.error(`${logPrefix} prize lot number with index: ${index} was already revealed`);
      return;
    }

    if (prizeLotNumbersStates[index] !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }

    setIsGameLoading(true);

    // optimistic ui
    const updatedPrizeLotNumbers = [...prizeLotNumbers];
    updatedPrizeLotNumbers[index].revealed = true;
    setPrizeLotNumbers(updatedPrizeLotNumbers);

    const updatedPrizeLotNumbersStates = [...prizeLotNumbersStates];
    updatedPrizeLotNumbersStates[index] = InstantWinNumberStates.OPEN;
    setPrizeLotNumbersStates(updatedPrizeLotNumbersStates);
    playSymbolRevealAudio(gameId);

    const success = await updateNumber(number?.number_id, true);
    checkGame();

    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update prizelot number with index: ${index}`);
      prevPrizeLotNumbers[index].revealed = false;
      setPrizeLotNumbers(prevPrizeLotNumbers);
      setPrizeLotNumbersStates(prevPrizeLotNumbersStates);
      setIsGameLoading(false);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const openBonusNumber = async () => {
    const prevBonusNumbers = [...bonusNumbers];
    const prevBonusNumbersStates = [...bonusNumbersStates];

    console.log(`${logPrefix} openBonusNumber`);
    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (!hasBonusGame) {
      console.error(`${logPrefix} instance does not have bonus game`);
      return;
    }

    if (bonusNumbers[0].revealed) {
      console.error(`${logPrefix} bonus number was already revealed`);
      return;
    }

    if (bonusNumbersStates[0] !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }

    setIsGameLoading(true);

    // optimistic ui
    const updatedBonusNumbers = [...bonusNumbers];
    updatedBonusNumbers[0].revealed = true;
    setBonusNumbers(updatedBonusNumbers);

    const updatedBonusNumbersStates = [...bonusNumbersStates];
    updatedBonusNumbersStates[0] = InstantWinNumberStates.OPEN;
    setBonusNumbersStates(updatedBonusNumbersStates);
    if (gameId !== 'cruising-for-cash') {
      playSymbolRevealAudio(gameId);
    }

    const success = await updateNumber(bonusNumbers[0]?.number_id, true);
    checkGame();

    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update bonus number`);
      prevBonusNumbers[0].revealed = false;
      setBonusNumbers(prevBonusNumbers);
      setBonusNumbersStates(prevBonusNumbersStates);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const openGenericMultiplier = async () => {
    console.log(`${logPrefix} openGenericMultiplier`);
    setGameState(GameStates.PLAYING);
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (!featureFlags.genericMultiplier || !genericMultiplier) {
      console.error(`${logPrefix} instance does not have a generic multiplier`);
      return;
    }

    if (genericMultiplier.revealed) {
      console.error(`${logPrefix} generic multiplier was already revealed`);
      return;
    }

    if (genericMultiplierState !== InstantWinNumberStates.CLOSED) {
      console.error(`${logPrefix} number is already open`);
      return;
    }
    const prevGenericMultiplier = { ...genericMultiplier } as InstantWinNumber;
    const prevGenericMultiplierState = genericMultiplierState;

    setIsGameLoading(true);

    // optimistic ui
    const updatedGenericMultiplier = { ...genericMultiplier };
    updatedGenericMultiplier.revealed = true;
    setGenericMultiplier(updatedGenericMultiplier);

    setGenericMultiplierState(InstantWinNumberStates.OPEN);
    playSymbolRevealAudio(gameId);

    const success = await updateNumber(genericMultiplier?.number_id, true);
    checkGame();

    // if the call fails, revert the state
    if (!success) {
      console.error(`${logPrefix} failed to update generic multiplier`);
      prevGenericMultiplier.revealed = false;
      setGenericMultiplier(prevGenericMultiplier);
      setGenericMultiplierState(prevGenericMultiplierState);
      return;
    } else {
      setIsGameLoading(false);
    }
  };

  const groupRevealLuckyNumbers = () => {
    // save state for rolling back
    prevLuckyNumbersStates.current = luckyNumbersStates;

    setLuckyNumbersStates((prev) => {
      const newStates = [...prev];
      newStates.forEach((_, index) => {
        newStates[index] = luckyNumbers[index]?.winner
          ? InstantWinNumberStates.SMALL_WIN
          : InstantWinNumberStates.LOSER;
      });
      return newStates;
    });
  };

  const groupRevealUserNumbers = () => {
    // save state for rolling back
    prevUserNumbersStates.current = userNumbersStates;

    setUserNumbersStates((prev) => {
      const newStates = [...prev];
      newStates.forEach((_, index) => {
        newStates[index] = userNumbers[index].winner
          ? InstantWinNumberStates.SMALL_WIN
          : InstantWinNumberStates.LOSER;
      });
      return newStates;
    });
  };

  const groupRevealMatchNumbers = () => {
    // save states for rolling back
    prevMatch3NumbersStates.current = match3NumbersStates;
    prevPrizeLotNumbersStates.current = prizeLotNumbersStates;

    if (featureFlags['match']) {
      setMatch3NumbersStates((prev) => {
        const newStates = [...prev];
        newStates.forEach((_, index) => {
          newStates[index] = match3Numbers[index].winner
            ? InstantWinNumberStates.SMALL_WIN
            : InstantWinNumberStates.LOSER;
        });
        return newStates;
      });
    }

    setPrizeLotNumbersStates((prev) => {
      const newStates = [...prev];
      newStates.forEach((_, index) => {
        newStates[index] = prizeLotNumbers[index].winner
          ? InstantWinNumberStates.SMALL_WIN
          : InstantWinNumberStates.LOSER;
      });
      return newStates;
    });
  };

  const groupRevealBonusNumbers = () => {
    // save state for rolling back
    prevBonusNumbersStates.current = bonusNumbersStates;

    if (featureFlags['reveal']) {
      setBonusNumbersStates((prev) => {
        const newStates = [...prev];
        newStates.forEach((_, index) => {
          newStates[index] = bonusNumbers[index].winner
            ? InstantWinNumberStates.SMALL_WIN
            : InstantWinNumberStates.LOSER;
        });
        return newStates;
      });
    }
  };

  const groupRevealGenericMultiplier = () => {
    if (featureFlags['genericMultiplier']) {
      setGenericMultiplierState(InstantWinNumberStates.OPEN);
    }
  };

  const rollbackNumberStates = () => {
    if (!!prevUserNumbersStates.current) {
      setUserNumbersStates(prevUserNumbersStates.current);
    }
    if (!!prevLuckyNumbersStates.current) {
      setLuckyNumbersStates(prevLuckyNumbersStates.current);
    }
    if (!!prevMatch3NumbersStates.current) {
      setMatch3NumbersStates(prevMatch3NumbersStates.current);
    }
    if (!!prevBonusNumbersStates.current) {
      setBonusNumbersStates(prevBonusNumbersStates.current);
    }
    if (!!prevPrizeLotNumbersStates.current) {
      setPrizeLotNumbersStates(prevPrizeLotNumbersStates.current);
    }
    if (!!prevGenericMultiplierState.current) {
      setGenericMultiplierState(prevGenericMultiplierState.current);
    }
  };

  const clearNumberStateRefs = () => {
    prevUserNumbersStates.current = undefined;
    prevLuckyNumbersStates.current = undefined;
    prevMatch3NumbersStates.current = undefined;
    prevBonusNumbersStates.current = undefined;
    prevPrizeLotNumbersStates.current = undefined;
    prevGenericMultiplierState.current = undefined;
  };

  const completeRevealAll = async () => {
    const logPrefix = "[completeRevealAll]"
    try {
      console.log(`${logPrefix} starting the reveal all request`);
      await revealInstantWinInstance(userId, instance.instance_id, token);
      console.log(`${logPrefix} succeeded the reveal all request`);
      setRemainingCards((prev) => prev - 1);
      setIsGameLoading(false);
      setGameState(GameStates.REVEALED);
      clearNumberStateRefs();
    } catch (e) {
      // if call failed, revert values
      await updateActiveInstantWinInstances();
      console.error(`${logPrefix} failed to reveal all numbers: ${e}`);
      rollbackNumberStates();
      clearNumberStateRefs();
    }
  };

  const animatedRevealAll = async () => {
    console.log(`${logPrefix} animated reveal all`);
    setRevealAllError(false);

    if (revealAnimating) {
      console.log(`${logPrefix} reveal animation already in progress, ignoring call`);
      return Promise.resolve();
    }

    if (gameState === GameStates.REVEALED) {
      console.error(`${logPrefix} game is already revealed`);
      moveToGameState(GameStates.GAME_OVER);
      return Promise.resolve();
    } else if (gameState === GameStates.GAME_OVER) {
      console.error(`${logPrefix} game is already over`);
      completeGame();
      return Promise.resolve();
    } else if (gameState === GameStates.WIN_ANIMATIONS) {
      console.error(`${logPrefix} game is already in win animations`);
      return Promise.resolve();
    }

    setRevealAnimating(true);
    try {
      await animatedRevealAllFunc();
    } catch (e) {
      console.error(`${logPrefix} animated reveal all failed: ${e}`);
      setRevealAllError(true);
    } finally {
      setRevealAnimating(false);
    }
  };

  const animatedRevealAllFunc = async () => {
    let offset = 0;
    const totalDelay = 50;

    if (gameState === GameStates.REVEALED) {
      console.error(`${logPrefix} game is already revealed`);
      return;
    } else if (gameState === GameStates.GAME_OVER) {
      console.error(`${logPrefix} game is already over`);
      return;
    }
    setIsGameLoading(true);

    switch (gameId) {
      case 'ocean-treasure':
        playSoundEffect(Sfx.OTH_REVEAL_ALL);
        break;
      case 'dond-dbk':
        playSoundEffect(Sfx.DOND_REVEAL_ALL);
        break;
      case 'cruising-for-cash':
        playSoundEffect(Sfx.CFC_REVEAL_ALL);
        break;
      default:
        break;
    }

    // original state ref for rolling back
    prevUserNumbersStates.current = userNumbersStates;
    prevLuckyNumbersStates.current = luckyNumbersStates;
    prevBonusNumbersStates.current = bonusNumbersStates;
    prevMatch3NumbersStates.current = match3NumbersStates;
    prevPrizeLotNumbersStates.current = prizeLotNumbersStates;
    prevGenericMultiplierState.current = genericMultiplierState;

    setGenericMultiplierState(
      genericMultiplier?.winner ? InstantWinNumberStates.SMALL_WIN : InstantWinNumberStates.LOSER,
    );

    const timeouts: Promise<void>[] = [];

    luckyNumbers.forEach((_, index) => {
      const promise = new Promise<void>((resolve) => {
        setTimeout(
          () => {
            setLuckyNumbersStates((prev) => {
              const newStates = [...prev];
              newStates[index] = luckyNumbers[index].winner
                ? InstantWinNumberStates.SMALL_WIN
                : InstantWinNumberStates.LOSER;
              return newStates;
            });
            resolve();
          },
          offset + totalDelay * index,
        );
      });
      timeouts.push(promise);
    });
    offset += luckyNumbers?.length * totalDelay;

    userNumbers.forEach((_, index) => {
      const promise = new Promise<void>((resolve) => {
        setTimeout(
          () => {
            setUserNumbersStates((prev) => {
              const newStates = [...prev];
              newStates[index] = userNumbers[index].winner
                ? InstantWinNumberStates.SMALL_WIN
                : InstantWinNumberStates.LOSER;
              return newStates;
            });
            resolve();
          },
          offset + totalDelay * index,
        );
      });
      timeouts.push(promise);
    });
    offset += userNumbers?.length * totalDelay;

    if (featureFlags['match']) {
      match3Numbers.forEach((_, index) => {
        const promise = new Promise<void>((resolve) => {
          setTimeout(
            () => {
              setMatch3NumbersStates((prev) => {
                const newStates = [...prev];
                newStates[index] = match3Numbers[index].winner
                  ? InstantWinNumberStates.SMALL_WIN
                  : InstantWinNumberStates.LOSER;
                return newStates;
              });
              resolve();
            },
            offset + totalDelay * index,
          );
        });
        timeouts.push(promise);
      });
      offset += match3Numbers?.length * totalDelay;

      prizeLotNumbers.forEach((_, index) => {
        const promise = new Promise<void>((resolve) => {
          setTimeout(
            () => {
              setPrizeLotNumbersStates((prev) => {
                const newStates = [...prev];
                newStates[index] = prizeLotNumbers[index].winner
                  ? InstantWinNumberStates.SMALL_WIN
                  : InstantWinNumberStates.LOSER;
                return newStates;
              });
              resolve();
            },
            offset + totalDelay * index,
          );
        });
        timeouts.push(promise);
      });
      offset += prizeLotNumbers?.length * totalDelay;
    }

    if (featureFlags['reveal']) {
      bonusNumbers.forEach((_, index) => {
        const promise = new Promise<void>((resolve) => {
          setTimeout(
            () => {
              setBonusNumbersStates((prev) => {
                const newStates = [...prev];
                newStates[index] = bonusNumbers[index].winner
                  ? InstantWinNumberStates.SMALL_WIN
                  : InstantWinNumberStates.LOSER;
                return newStates;
              });
              resolve();
            },
            offset + totalDelay * index,
          );
        });
        timeouts.push(promise);
      });
      offset += bonusNumbers?.length * totalDelay;
    }

    await Promise.all(timeouts);
    await completeRevealAll();
  };

  const createPossibleStakesSet = (sessions: LotteryGameSession[]) => {
    const allStakes = sessions.map((x) => x.price);
    const set = [...new Set([...allStakes])];
    set.sort((a, b) => a - b);
    return set;
  };

  const purchaseTicket = async () => {
    if (isPurchasing) {
      console.log(`${logPrefix} purchase process already in progress, ignoring call`);
      return Promise.resolve();
    }

    setIsPurchasing(true);
    try {
      await internalPurchaseTicket();
    } catch (e) {
      console.error(`${logPrefix} failed to purchase ticket: ${e}`);
      if (e instanceof Error) {
        if (e instanceof PurchaseError) {
          handleSetErrorDialog({
            title: e.details.title,
            message: e.details.description || "Please see casino staff.",
          });
        } else if (e instanceof UnauthorizedError) {
          handleSetErrorDialog({
            message:
              'Unable to confirm purchase. Please verify that you have entered the correct PIN and try again.',
          });
        } else {
          handleSetErrorDialog({
            message: 'Failed to purchase tickets. Please try again later.',
          });
        }
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const internalPurchaseTicket = async () => {
    if (!betBarSession) {
      console.error(`${logPrefix} session is undefined`);
      return;
    }

    // update the balance here just in case the user has won some money elsewhere
    await updateBalance();

    try {
      await purchaseInstantWin(userId, {
        charge_type: selectedAccountType,
        coupon_id: coupon,
        definition_id: betBarSession?.definition_id,
        quantity: purchaseCount,
        pin: userPIN,
      });

      switch (gameId) {
        case 'ocean-treasure':
          playSoundEffect(Sfx.OTH_BUY);
          break;
        case 'dond-dbk':
          playSoundEffect(Sfx.DOND_BUY);
          break;
        case 'cruising-for-cash':
          playSoundEffect(Sfx.CFC_BUY);
          break;
        default:
          break;
      }
      await updateActiveInstantWinInstances();
      await updateBalance();
      setGameState(GameStates.INITIALIZING);
    } catch (e) {
      console.error(`${logPrefix} failed to purchase ticket invalid session: ${betBarSession}`);
      throw e;
    }
  };

  const changeCoupon = (couponID: string) => {
    setCoupon(couponID);
  };

  const changeStake = (forward: boolean) => {
    let newStakeIndex = 0;
    if (forward) {
      newStakeIndex = stakeIndex + 1 >= possibleStakes.length ? 0 : stakeIndex + 1;
    } else {
      newStakeIndex = stakeIndex - 1 < 0 ? possibleStakes.length - 1 : stakeIndex - 1;
    }
    setStakeIndex(newStakeIndex);

    // get the session that matches this stake
    if (possibleStakes?.length) {
      const newSessionIndex = sessions?.findIndex((x) => x.price === possibleStakes[newStakeIndex]);
      setSessionIndex(newSessionIndex);
    } else {
      console.error(
        `${logPrefix} failed to find a session matching stake ${possibleStakes[newStakeIndex]}`,
      );
    }
  };

  const changeStakeAndSession = (newStakeIndex: number) => {
    setStakeIndex(newStakeIndex);

    // get the session that matches this stake
    if (possibleStakes?.length) {
      const newSessionIndex = sessions?.findIndex((x) => x.price === possibleStakes[newStakeIndex]);
      setSessionIndex(newSessionIndex);
    } else {
      console.error(
        `${logPrefix} failed to find a session matching stake ${possibleStakes[newStakeIndex]}`,
      );
    }
  };

  const changePurchaseCount = (forward: boolean) => {
    const limit = 100;
    if (forward) {
      setPurchaseCount(purchaseCount + 1 > limit ? 1 : purchaseCount + 1);
    } else {
      setPurchaseCount(purchaseCount - 1 < 1 ? limit : purchaseCount - 1);
    }
  };

  const changeInstance = (forward: boolean) => {
    if (!instance) {
      console.error(`${logPrefix} instance is null`);
      return;
    }
    console.log(`${logPrefix} changing instance`, 'forward:', forward);

    const currentInstanceIndex = instances.findIndex((x) => x.instance_id === instance.instance_id);
    if (currentInstanceIndex === -1) {
      console.error(
        `${logPrefix} could not find current instance in instances: ${instances} for instance: ${instance}`,
      );
      return;
    }

    if (forward) {
      const nextInstanceIndex =
        currentInstanceIndex === instances.length - 1 ? 0 : currentInstanceIndex + 1;
      setInstanceIndex(nextInstanceIndex);
    } else {
      const prevInstanceIndex =
        currentInstanceIndex === 0 ? instances.length - 1 : currentInstanceIndex - 1;
      setInstanceIndex(prevInstanceIndex);
    }
  };

  const initializeGame = async () => {
    console.log(`${logPrefix} initializing game`);
    setIsGameLoading(true);
    setRevealAllError(false);
    setCompleteError(false);
    await updateActiveInstantWinSessions();
    await updateActiveInstantWinInstances();
  };

  const setupGamePlayData = () => {
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }
    console.log(`${logPrefix} setting gameplay data for instances`, instance);

    // get base game data from instance
    const games = instance.gameplay_state.games;
    const baseGame = games.find((x) => x.type === InstantWinGameType.Generic);
    const matchGame = games.find((x) => x.type === InstantWinGameType.Match);
    const bonusGame = games.find((x) => x.type === InstantWinGameType.Reveal);

    const genericMultiplier = baseGame?.number_groups?.map(
      (x) => x.type === InstantWinNumberGroupType.Multiplier,
    );

    setFeatureFlags({
      generic: !!baseGame,
      match: !!matchGame,
      reveal: !!bonusGame,
      genericMultiplier: !!genericMultiplier,
    });
    console.log(`${logPrefix} feature flags set to:`, featureFlags);

    // set up base game
    if (baseGame) {
      const bank = baseGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.NumberBank,
      );
      const newBankNumbers = bank?.numbers.map((x) => {
        return {
          ...x,
        };
      });

      const newLuckyNumbersStates = bank?.numbers.map((x) => {
        if (x.revealed) {
          return InstantWinNumberStates.OPEN;
        } else {
          return InstantWinNumberStates.CLOSED;
        }
      });

      const userNumbers = baseGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.UsersNumbers,
      );

      const newUsersNumbers = userNumbers?.numbers.map((x) => {
        return {
          ...x,
        };
      });

      const newUserNumbersStates = userNumbers?.numbers.map((x) => {
        if (x.revealed) {
          return InstantWinNumberStates.OPEN;
        } else {
          return InstantWinNumberStates.CLOSED;
        }
      });

      const newGenericMultiplier = baseGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.Multiplier,
      )?.numbers[0];

      const newGenericMultiplierState = newGenericMultiplier?.revealed
        ? InstantWinNumberStates.OPEN
        : InstantWinNumberStates.CLOSED;

      if (!newBankNumbers || !newUsersNumbers || !newLuckyNumbersStates || !newUserNumbersStates) {
        console.error(`${logPrefix} failed to find bank or user numbers in base game`);
        return;
      } else {
        setLuckyNumbers(newBankNumbers);
        setUserNumbers(newUsersNumbers);
        setLuckyNumbersStates(newLuckyNumbersStates);
        setUserNumbersStates(newUserNumbersStates);
        setGenericMultiplier(newGenericMultiplier);
        setGenericMultiplierState(newGenericMultiplierState);
      }
    } else {
      console.error(`${logPrefix} failed to find base game in instance: ${instance}`);
      return;
    }

    if (matchGame) {
      const numbers = matchGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.UsersNumbers,
      );
      const newMatch3Numbers = numbers?.numbers.map((x) => {
        return {
          ...x,
        };
      });

      const newMatch3NumbersStates = numbers?.numbers.map((x) => {
        if (x.revealed) {
          return InstantWinNumberStates.OPEN;
        } else {
          return InstantWinNumberStates.CLOSED;
        }
      });

      const prizelot = matchGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.NumberBank,
      );

      const newPrizelotNumbers = prizelot?.numbers.map((x) => {
        return {
          ...x,
        };
      });

      const newPrizelotNumbersStates = prizelot?.numbers.map((x) => {
        if (x.revealed) {
          return InstantWinNumberStates.OPEN;
        } else {
          return InstantWinNumberStates.CLOSED;
        }
      });

      if (!newMatch3Numbers || !newMatch3NumbersStates) {
        console.error(`${logPrefix} failed to find match 3 numbers in match game`);
        return;
      } else {
        setMatch3Numbers(newMatch3Numbers);
        setMatch3NumbersStates(newMatch3NumbersStates);
      }
      setPrizeLotNumbers(newPrizelotNumbers || []);
      setPrizeLotNumbersStates(newPrizelotNumbersStates || []);
    } else {
      console.log(`${logPrefix} no match 3 game in instance:`);
      const newMatch3States = match3NumbersStates.map(() => InstantWinNumberStates.CLOSED);
      const newPrizeLotStates = prizeLotNumbersStates.map(() => InstantWinNumberStates.CLOSED);
      setMatch3NumbersStates(newMatch3States);
      setPrizeLotNumbersStates(newPrizeLotStates);
    }

    if (bonusGame) {
      const numbers = bonusGame.number_groups.find(
        (x) => x.type === InstantWinNumberGroupType.UsersNumbers,
      );
      const newBonusNumbers = numbers?.numbers.map((x) => {
        return {
          ...x,
        };
      });
      const newBonusNumbersStates = numbers?.numbers.map((x) => {
        if (x.revealed) {
          return InstantWinNumberStates.OPEN;
        } else {
          return InstantWinNumberStates.CLOSED;
        }
      });

      if (!newBonusNumbers || !newBonusNumbersStates) {
        console.error(`${logPrefix} failed to find bonus numbers in bonus game`);
        return;
      } else {
        setBonusNumbers(newBonusNumbers);
        setBonusNumbersStates(newBonusNumbersStates);
      }
    } else {
      console.log(`${logPrefix} no banker bonus in instance`);
      const newBonusStates = bonusNumbersStates.map(() => InstantWinNumberStates.CLOSED);
      setBonusNumbersStates(newBonusStates);
    }

    const winLevel = getWinLevel(
      instance?.gameplay_state?.payout?.cash || 0,
      instance?.session?.price || 0,
    );
    setWinLevel(winLevel);
  };

  const checkGamePlayStates = () => {
    // set up the states for the game
    if (!isGame) {
      console.error(`${logPrefix} game is not active`);
      return;
    }

    if (isGameLoading) {
      console.error(`${logPrefix} game is loading`);
      return;
    }

    console.log(`${logPrefix} checking game play states`);

    const newLuckyNumbersStates = [...luckyNumbersStates];
    const newUserNumbersStates = [...userNumbersStates];
    const newMatch3NumbersStates = [...match3NumbersStates];
    const newPrizeLotNumbersStates = [...prizeLotNumbersStates];
    const newBonusNumbersStates = [...bonusNumbersStates];

    for (let i = 0; i < userNumbers.length; i++) {
      const userNumber = userNumbers[i];
      if (!userNumber.revealed) {
        continue;
      }

      for (let j = 0; j < luckyNumbers.length; j++) {
        const luckyNumber = luckyNumbers[j];

        if (userNumber.number !== luckyNumber.number || !luckyNumber.revealed) {
          continue;
        }

        if (userNumber.revealed && luckyNumber.revealed) {
          newUserNumbersStates[i] = InstantWinNumberStates.SMALL_WIN;
          newLuckyNumbersStates[j] = InstantWinNumberStates.SMALL_WIN;
        }
      }
    }

    // Set open numbers to loser if all numbers are revealed
    const allUserNumbersRevealed = userNumbers.every((x) => x.revealed);
    const allLuckyNumbersRevealed = luckyNumbers.every((x) => x.revealed);

    if (allUserNumbersRevealed && allLuckyNumbersRevealed) {
      newLuckyNumbersStates.forEach((state, index) => {
        if (state === InstantWinNumberStates.OPEN) {
          newLuckyNumbersStates[index] = InstantWinNumberStates.LOSER;
        }
      });
      newUserNumbersStates.forEach((state, index) => {
        if (state === InstantWinNumberStates.OPEN) {
          newUserNumbersStates[index] = InstantWinNumberStates.LOSER;
        }
      });
    }

    setLuckyNumbersStates(newLuckyNumbersStates);
    setUserNumbersStates(newUserNumbersStates);

    const allMatch3NumbersRevealed = match3Numbers.every((x) => x.revealed);
    const prizeLotExists = prizeLotNumbers.length > 0;
    const prizeLotRevealed = prizeLotNumbers.length > 0 && prizeLotNumbers.every((x) => x.revealed);
    const match3NumberValues = match3Numbers.map((x) => x.number);
    const match3NumberPrize = match3Numbers.map((x) => x.prize.value);
    const match3PrizeSet = new Set(match3NumberPrize);
    const match3NumberSet = new Set(match3NumberValues);
    const isMatch3Winner =
      (!prizeLotExists ? match3PrizeSet.size === 1 : match3NumberSet.size === 1) &&
      allMatch3NumbersRevealed &&
      (!prizeLotExists || (prizeLotExists && prizeLotRevealed && match3PrizeSet.size === 1));

    match3Numbers.forEach((_, index) => {
      if (isMatch3Winner) {
        newMatch3NumbersStates[index] = InstantWinNumberStates.SMALL_WIN;
        newPrizeLotNumbersStates[0] = InstantWinNumberStates.SMALL_WIN;
        if (!isGameLoading) {
          if (gameId === 'ocean-treasure') {
            playSoundEffect(Sfx.OTH_MATCH3_WIN);
          }
        }
      }
      if (allMatch3NumbersRevealed && !isMatch3Winner && prizeLotExists && prizeLotRevealed) {
        newMatch3NumbersStates[index] = InstantWinNumberStates.LOSER;
        newPrizeLotNumbersStates[0] = InstantWinNumberStates.LOSER;
      } else if (!prizeLotExists && allMatch3NumbersRevealed && !isMatch3Winner) {
        newMatch3NumbersStates[index] = InstantWinNumberStates.LOSER;
      }
    });
    setMatch3NumbersStates(newMatch3NumbersStates);
    setPrizeLotNumbersStates(newPrizeLotNumbersStates);

    if (bonusNumbers[0].revealed && bonusNumbers[0].winner) {
      newBonusNumbersStates[0] = InstantWinNumberStates.SMALL_WIN;
    } else if (bonusNumbers[0].revealed && !bonusNumbers[0].winner) {
      newBonusNumbersStates[0] = InstantWinNumberStates.LOSER;
    }
    setBonusNumbersStates(newBonusNumbersStates);

    checkGame();
  };

  // gets the win level based on a factor of wager and payout
  const getWinLevel = (payout: number, wager: number) => {
    // if theres no payout or wager return zero
    if (!payout || !wager) {
      return WinLevels.ZERO;
    }

    // convert wager to cents since payout is
    const wagerInCents = wager * 100;

    switch (true) {
      case payout >= wagerInCents * 100:
        return WinLevels.MEGA;
      case payout >= wagerInCents * 35:
        return WinLevels.SUPER;
      case payout >= wagerInCents * 5:
        return WinLevels.BIG;
      case payout >= wagerInCents * 1:
        return WinLevels.NORMAL;
      default:
        return WinLevels.ZERO;
    }
  };

  const getNextInstance = () => {
    setGameState(GameStates.INITIALIZING);
  };

  const onGameStateChange = async () => {
    let hasWon = false;

    switch (gameState) {
      case GameStates.INITIALIZING:
        if (!initialized) {
          return;
        } else {
          console.log(`${logPrefix} game state: initializing`);
          await initializeGame();
        }
        // The gamestate now gets set to setup in a useEffect below after the values from previous game get reset.
        break;
      case GameStates.SETUP:
        console.log(`${logPrefix} game state: setup`);
        setupGamePlayData();
        setIsGameLoading(false);
        if (autoPlay) {
          setGameState(GameStates.AUTO_PLAYING);
        } else {
          setGameState(GameStates.STAND_BY);
        }
        break;
      case GameStates.STAND_BY:
        console.log(`${logPrefix} game state: stand by`);
        checkGamePlayStates();
        break;
      case GameStates.PLAYING:
        console.log(`${logPrefix} game state: playing`);
        break;
      case GameStates.REVEALED:
        console.log(`${logPrefix} game state: revealed`);
        hasWon = checkWins();
        if (hasWon) {
          setGameState(GameStates.WIN_ANIMATIONS);
        } else {
          moveToGameState(GameStates.GAME_OVER);
        }
        break;
      case GameStates.WIN_ANIMATIONS:
        console.log(`${logPrefix} game state: win animations`);
        break;
      case GameStates.AUTO_PLAYING:
        console.log(`${logPrefix} game state: auto playing, is instance completed?`, isInstanceCompleted);
        if (isInstanceCompleted) {
          await nextCardAfterDelay();
        } else if (!isRevealingAll) {
          console.log(`${logPrefix} switched to autoplay, but not currently revealing. reveal all`);
          await revealAfterDelay();
        }
        break;
      case GameStates.GAME_OVER:
        console.log(`${logPrefix} game state: game over`);
        await completeGame();
        break;
      default:
        break;
    }
  };

  const resetValues = () => {
    setUserNumbersStates(initialUserNumbersStates);
    setLuckyNumbersStates(initialLuckyNumbersStates);
    setMatch3NumbersStates(initialMatch3NumbersStates);
    setBonusNumbersStates(initialBonusNumbersStates);
    setPrizeLotNumbersStates(initialPrizeLotNumbersStates);
    setCompleteError(false);
    setRevealAllError(false);
    setIsResettingValues(true);
    setGenericMultiplierState(InstantWinNumberStates.CLOSED);
  };

  useEffect(() => {
    if (!isGameLoading) {
      checkGamePlayStates();
    }
  }, [isGameLoading]);

  // start up function for this context
  const initialize = async () => {
    const [filteredSessions, filteredInstances] = await Promise.all([
      updateActiveInstantWinSessions(),
      updateActiveInstantWinInstances(),
    ]);

    if (!filteredSessions || !filteredInstances) {
      console.error(`${logPrefix} failed to fetch sessions or instances`);
      return;
    }
    const newPossibleStakes = createPossibleStakesSet(filteredSessions);

    // set initial session to the session of the instance if it exists otherwise the session which matches the default stake
    let initialSessionIndex = 0;
    let initialStakeIndex = 0;
    if (!!filteredInstances.length) {
      const targetStake = filteredInstances[0].session?.price;
      initialSessionIndex = filteredSessions.findIndex((x) => x.price === targetStake);
      initialStakeIndex = newPossibleStakes.findIndex((x) => x === targetStake);
    } else {
      initialSessionIndex = filteredSessions.findIndex((x) => x.price === defaultStakeValue);
      initialStakeIndex = newPossibleStakes.findIndex((x) => x === defaultStakeValue);
    }
    setSessionIndex(initialSessionIndex === -1 ? 0 : initialSessionIndex);
    setStakeIndex(initialStakeIndex === -1 ? 0 : initialStakeIndex);

    setPossibleStakes(newPossibleStakes);
    const stake = newPossibleStakes[stakeIndex];
    console.log(`${logPrefix} stake set to ${stake}`);

    await updateBalance();
  };

  // Use effect gates whether the game initializes or not based on whether intro animation is showing, so the game won't run under the animation until the user has re entered the game properly
  useEffect(() => {
    const awaitInitialize = async () => {
      if (!showIntroAnimation) {
        await initialize();
        setInitialized(true);
      } else {
        setInitialized(false);
      }
    };
    awaitInitialize();
  }, [showIntroAnimation]);

  // Created a separate useEffect to stop all audio on game unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  useEffect(() => {
    onGameStateChange();
  }, [gameState]);

  const nextCardAfterDelay = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        getNextInstance();
        resolve();
      }, 2000);
    });
  };

  // const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const revealAfterDelay = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await animatedRevealAll();
        resolve();
      }, 1000);
    });
  };

  const setupFeatureFlags = () => {
    if (!betBarSession?.definition?.config) {
      console.log('couldnt find game def config');
      return;
    }

    const gameDefConfig = JSON.parse(betBarSession?.definition?.config) as InstantWinCardConfig;

    const generic = gameDefConfig?.games.find((x) => x.type === InstantWinGameType.Generic);
    const match = gameDefConfig?.games?.find((x) => x.type === InstantWinGameType.Match);
    const reveal = gameDefConfig?.games?.find((x) => x.type === InstantWinGameType.Reveal);
    const genericMultiplier = generic?.number_groups?.find(
      (x) => x.type === InstantWinNumberGroupType.Multiplier,
    );

    const newFeatureFlags: FeatureFlags = {
      generic: !!generic,
      match: !!match,
      reveal: !!reveal,
      genericMultiplier: !!genericMultiplier,
    };

    setFeatureFlags(newFeatureFlags);
  };

  useEffect(() => {
    console.log('autoPlay', autoPlay, 'isGameLoading', isGameLoading, 'gameState', gameState);
    if (isGameLoading) {
      return;
    }

    if (autoPlay) {
      setGameState(GameStates.AUTO_PLAYING);
    }
  }, [autoPlay]);

  // whenver the bet bar session changes update the top prize and the feature flags
  useEffect(() => {
    setTopPrize(betBarSession?.definition?.top_prize);
    setupFeatureFlags();
  }, [betBarSession]);

  useEffect(() => {
    if (gameState === GameStates.INITIALIZING) {
      if (!!instances.length) {
        resetValues();
      }
    }
  }, [instances]);

  // once all values have been reset, proceed to setup state.
  useEffect(() => {
    if (isResettingValues) {
      if (
        userNumbersStates.every((x) => x === InstantWinNumberStates.CLOSED) &&
        luckyNumbersStates.every((x) => x === InstantWinNumberStates.CLOSED) &&
        match3NumbersStates.every((x) => x === InstantWinNumberStates.CLOSED) &&
        bonusNumbersStates.every((x) => x === InstantWinNumberStates.CLOSED) &&
        !completeError &&
        !revealAllError
      ) {
        setIsResettingValues(false);
        setGameState(GameStates.SETUP);
      }
    }
  }, [
    isResettingValues,
    userNumbersStates,
    luckyNumbersStates,
    match3NumbersStates,
    bonusNumbersStates,
    completeError,
    revealAllError,
  ]);

  // accessibility query info
  const mediaQueryList = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const prefersReducedMotion = !mediaQueryList.matches;

  const gameContextValue = {
    openLuckyNumber,
    luckyNumbers,
    openUserNumber,
    userNumbers,
    openMatch3Number,
    match3Numbers,
    openPrizeLot,
    prizeLotNumbers,
    topPrize,
    bonusNumbers,
    isGame,
    openBonusNumber,
    purchaseTicket,
    purchaseCount,
    totalCost,
    changePurchaseCount,
    changeCoupon,
    changeStake,
    changeInstance,
    animatedRevealAll,
    remainingCards,
    instance,
    betBarSession,
    possibleStakes,
    stake,
    instanceIndex,
    instances,
    sessionIndex,
    autoPlay,
    setAutoPlay,
    hasMatch3Game,
    hasBonusGame,
    isFetchingData,
    stakeIndex,
    changeStakeAndSession,
    isRevealingAll,
    setIsRevealingAll,
    isInstanceCompleting,
    isInstanceCompleted,
    updateActiveInstantWinInstances,
    getNextInstance,
    gameState,
    moveToGameState,
    balance,
    featureFlags,
    formatPrize,
    getSymbolAriaLabel,
    purchaseCountLimit,
    winLevel,
    WinLevels,
    dollarAmountWon,
    prefersReducedMotion,
    luckyNumbersStates,
    userNumbersStates,
    match3NumbersStates,
    prizeLotNumbersStates,
    bonusNumbersStates,
    revealAllError,
    completeError,
    revealAnimating,
    selectedAccountType,
    setSelectedAccountType,
    userPIN,
    setUserPIN,
    openGenericMultiplier,
    genericMultiplier,
    genericMultiplierState,
    showIntroAnimation,
    setShowIntroAnimation,
    completeRevealAll,
    allLuckyNumbersRevealed,
    alluserNumbersRevealed,
    allMatchNumbersRevealed,
    allBonusNumbersRevealed,
    genericMultiplierRevealed,
    groupRevealLuckyNumbers,
    groupRevealUserNumbers,
    groupRevealMatchNumbers,
    groupRevealBonusNumbers,
    groupRevealGenericMultiplier,
    setPurchaseCount,
  };

  return <GameContext.Provider value={gameContextValue}>{children}</GameContext.Provider>;
};

export default GameContext;

export const useGameContext = (): GameContextType => useContext(GameContext)!;

function formatPrize(input: number) {
  let value = input;
  let output = '';
  if (value < 1000 && value > 0 && value % 1 !== 0) {
    output = value.toFixed(2);
  } else {
    if (value >= 1000000) {
      output = 'm';
      value = value / 1000000;
    } else if (value >= 1000) {
      output = 'k';
      value = value / 1000;
    }
    output = value + output;
  }
  return output;
}

function getSymbolAriaLabel(index: number) {
  const symbolLabels = [
    'old boot',
    'wad of cash',
    'treasure chest',
    'ruby earrings',
    'glasses',
    'gold coins',
    'gold watch',
    'treasure key',
    'clam with pearl',
    'diamond ring',
    'sand dollar',
    'silver coins',
  ]; /*
      TODO: Add a check for game ID in here to implement CFC bonus game symbols.
      I wrote out alt text for them but didn't get that working. Here they are for you:
      'sunglasses',
      'beach ball',
      'sunscreen',
      'ruby earrings',
      'glass bottle',
      'binoculars',
      'sandals',
      'snorkel',
      'silver card',
      'bikini',
      'baseball cap',
      'ice cream',
      'beach towels',
      'martini',
      'book',
      'AM radio',
      'camera',
    */
  return symbolLabels[index];
}
