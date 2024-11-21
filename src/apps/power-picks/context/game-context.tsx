import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { ShipsPowerPickPowerPickTicketPurchaseApiPurchasePowerPickTicketRequest } from 'ships-service-sdk';

import { useAppContext } from '@/contexts/app-context.tsx';
import { powerpicksTicketPurchaseApi } from '@/services/ships-service.ts';
import { AccountType } from '@/utils/types.ts';

import calcPermutations from '../scripts/calculate_permutations.ts';
import { ships_service } from '../services/ships-service.ts';
import { CheckoutLine, Draw, Line, PowerPicksPurchaseRequest, Ticket } from '../types.ts';

type GameContextType = {
  // draws and lines for diplaying
  draws: Draw[] | null;
  setDraws: (draws: Draw[]) => void;
  userPaticipatingdraws: Draw[] | null;
  setPaticipatingDraws: (draws: Draw[]) => void;
  lines: Line[] | null;
  setLines: (lines: Line[]) => void;

  // categorizing which power picks player is playing
  title: string;
  setTitle: (title: string) => void;
  category: string;
  setCategory: (category: string) => void;

  // checkout states for pick 3
  p3LinesCheckout: CheckoutLine[];
  setP3LinesCheckout: (lines: CheckoutLine[]) => void;

  p3DrawsCheckout: string[]; // draw IDs selected for purchase
  setP3DrawsCheckout: (draws: string[]) => void;

  // checkout states for pick 3
  p4LinesCheckout: CheckoutLine[];
  setP4LinesCheckout: (lines: CheckoutLine[]) => void;

  p4DrawsCheckout: string[]; // draw IDs selected for purchase
  setP4DrawsCheckout: (draws: string[]) => void;

  updateCheckoutLine: (line: CheckoutLine, lineIndex: number, pickType: string) => void;

  // checkout functions
  calculateLineValue: (line: CheckoutLine) => number;
  calculateTicketValue: (lines: CheckoutLine[]) => number;
  calcPermutations: (numbers: number[]) => number;
  addLinesToCheckout: (lines: CheckoutLine[], pickType: string) => void;
  deleteLine: (lines: CheckoutLine[], idx: number, pickType: string) => void;
  purchaseTicket: (
    purchaseForm: PowerPicksPurchaseRequest,
    charge_type: AccountType,
    PIN: string,
  ) => any;
  purchasedTicket: Ticket;
  setPurchasedTicket: (ticket: Ticket) => void;
  purchaseSuccessVisible: boolean;
  setPurchaseSuccessVisible: (visible: boolean) => void;
  purchaseRequestForm: PowerPicksPurchaseRequest;
  setPurchaseRequestForm: (reqForm: PowerPicksPurchaseRequest) => void;
  isPurchasing: boolean;
  setIsPurchasing: (purchasing: boolean) => void;

  getUserTickets: (drawID: number) => Promise<any[]>;
  getUserParticipatingDraws: (pickType: string) => Promise<any[]>;

  liveDrawTickets: Ticket[];
  setLiveDrawTickets: (tickets: Ticket[]) => void;

  // draws page selection
  selectedDraw: string | undefined;
  setSelectedDraw: (drawID: string) => void;
  // checkout draws selection
  selectedDraws: string[];
  setSelectedDraws: (drawIDs: string[]) => void;

  toLongDate: (date: Date) => string;

  selectedAccountType: AccountType;
  setSelectedAccountType: (accountType: AccountType) => void;
  userPIN: string;
  setUserPIN: (pin: string) => void;
};

const GameContext = createContext<GameContextType | null>(null);

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const logPrefix = '[powerpicks.game-context]';

  // auth data
  const { authAccount } = useAppContext();
  if (!authAccount.isValid) return null;
  const userID = authAccount.login?.user_info?.playerId || '';
  const token = authAccount.login?.token?.access_token || '';

  // general powerpicks data
  const [draws, setDraws] = useState<Draw[] | null>(null);
  const [userPaticipatingdraws, setPaticipatingDraws] = useState<Draw[] | null>(null);
  const [lines, setLines] = useState<Line[] | null>(null);
  const [title, setTitle] = useState<string>('GAME');
  const [category, setCategory] = useState<string>('');

  const [selectedDraw, setSelectedDraw] = useState<string>();
  const [selectedDraws, setSelectedDraws] = useState<string[]>([]);

  const [p3LinesCheckout, setP3LinesCheckout] = useState<CheckoutLine[]>(() => {
    const savedCheckout = localStorage.getItem('pick3_checkout');
    return savedCheckout ? JSON.parse(savedCheckout) : [];
  });
  const [p3DrawsCheckout, setP3DrawsCheckout] = useState<string[]>([]);

  const [p4LinesCheckout, setP4LinesCheckout] = useState<CheckoutLine[]>(() => {
    const savedCheckout = localStorage.getItem('pick4_checkout');
    return savedCheckout ? JSON.parse(savedCheckout) : [];
  });
  const [p4DrawsCheckout, setP4DrawsCheckout] = useState<string[]>([]);

  const [liveDrawTickets, setLiveDrawTickets] = useState<Ticket[]>([]);

  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(AccountType.Casino);
  const [userPIN, setUserPIN] = useState<string>('');

  const [purchasedTicket, setPurchasedTicket] = useState<Ticket>({} as Ticket);
  const [purchaseSuccessVisible, setPurchaseSuccessVisible] = useState<boolean>(false);
  const [purchaseRequestForm, setPurchaseRequestForm] = useState<PowerPicksPurchaseRequest>(
    {} as PowerPicksPurchaseRequest,
  );
  const [isPurchasing, setIsPurchasing] = useState(false);

  // persistent checkout
  useEffect(() => {
    localStorage.setItem('pick3_checkout', JSON.stringify(p3LinesCheckout));
  }, [p3LinesCheckout]);

  useEffect(() => {
    localStorage.setItem('pick4_checkout', JSON.stringify(p4LinesCheckout));
  }, [p4LinesCheckout]);

  // functions

  const addLinesToCheckout = (lines: CheckoutLine[], pickType: string) => {
    console.log(logPrefix, `adding ${lines.length} lines...`);
    switch (pickType) {
      case 'pick3':
        let p3newLines = [...p3LinesCheckout];
        p3newLines = p3newLines.concat(lines);
        setP3LinesCheckout(p3newLines);
        break;
      case 'pick4':
        let p4newLines = [...p4LinesCheckout];
        p4newLines = p4newLines.concat(lines);
        setP4LinesCheckout(p4newLines);
        break;
      default:
        break;
    }
  };

  const updateCheckoutLine = (line: CheckoutLine, lineIndex: number, pickType: string) => {
    switch (pickType) {
      case 'pick3':
        let p3newLines = [...p3LinesCheckout];
        p3newLines[lineIndex] = line;
        setP3LinesCheckout(p3newLines);
        break;
      case 'pick4':
        let p4newLines = [...p4LinesCheckout];
        p4newLines[lineIndex] = line;
        setP4LinesCheckout(p4newLines);
        break;
      default:
        break;
    }
  };

  const deleteLine = (lines: CheckoutLine[], idx: number, pickType: string) => {
    console.log(logPrefix, `deleting line [${idx}]: ${lines[idx]}`);
    switch (pickType) {
      case 'pick3':
        let p3newLines = [...p3LinesCheckout];
        p3newLines.splice(idx, 1);
        setP3LinesCheckout(p3newLines);
        break;
      case 'pick4':
        let p4newLines = [...p4LinesCheckout];
        p4newLines.splice(idx, 1);
        setP4LinesCheckout(p4newLines);
        break;
      default:
        break;
    }
  };

  const calculateLineValue = (line: CheckoutLine | Line): number => {
    let picks = [...line.picks] as (number | null)[]; //fail safe check for null values in line
    if (picks.includes(null)) return 0;
    let lineValue;
    let stake = 0;
    if (line.stake && !isNaN(line.stake)) {
      stake = line.stake;
    }

    if (line.line_type === 'combo') {
      lineValue = calcPermutations(line.picks) * stake;
    } else {
      lineValue = stake;
    }

    if (line.fireball_picked) {
      lineValue *= 2;
    }

    return lineValue;
  };

  const calculateTicketValue = (lines: CheckoutLine[] | Line[]): number => {
    return lines.reduce((accumulator, line) => accumulator + calculateLineValue(line), 0);
  };

  const purchaseTicket = async (
    purchaseForm: PowerPicksPurchaseRequest,
    charge_type: AccountType,
    PIN: string,
  ) => {
    purchaseForm.pin = PIN;
    purchaseForm.charge_type = charge_type;
    const req = {
      pick: category,
      userID: userID,
      ticket: purchaseForm,
    } as ShipsPowerPickPowerPickTicketPurchaseApiPurchasePowerPickTicketRequest;
    const res = await powerpicksTicketPurchaseApi.purchasePowerPickTicket(req);
    return res;
  };

  const getUserTickets = async (drawID: number): Promise<any[]> => {
    let data = await ships_service.getTickets(userID, token, drawID);
    return data;
  };

  const getUserParticipatingDraws = async (pickType: string): Promise<any[]> => {
    let data = await ships_service.getUserParticipatingDraws(userID, token, pickType);
    return data;
  };

  const toLongDate = (date: Date) => {
    return date
      .toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'long',
      })
      .replace(/\s\w*$/, ''); // Remove the timezone part
  };

  const gameContextValue = {
    draws,
    setDraws,
    userPaticipatingdraws,
    setPaticipatingDraws,
    lines,
    setLines,
    title,
    setTitle,
    category,
    setCategory,
    p3LinesCheckout,
    setP3LinesCheckout,
    p3DrawsCheckout,
    setP3DrawsCheckout,
    p4LinesCheckout,
    setP4LinesCheckout,
    p4DrawsCheckout,
    setP4DrawsCheckout,
    calculateLineValue,
    calculateTicketValue,
    calcPermutations,
    addLinesToCheckout,
    deleteLine,
    purchaseTicket,
    purchasedTicket,
    setPurchasedTicket,
    purchaseSuccessVisible,
    setPurchaseSuccessVisible,
    purchaseRequestForm,
    setPurchaseRequestForm,
    isPurchasing,
    setIsPurchasing,
    getUserTickets,
    getUserParticipatingDraws,
    updateCheckoutLine,
    selectedDraw,
    setSelectedDraw,
    selectedDraws,
    setSelectedDraws,
    liveDrawTickets,
    setLiveDrawTickets,
    toLongDate,
    selectedAccountType,
    setSelectedAccountType,
    userPIN,
    setUserPIN,
  };

  return <GameContext.Provider value={gameContextValue}>{children}</GameContext.Provider>;
};

export default GameContext;

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
