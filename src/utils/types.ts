import { SessionDONDSession, SessionData } from 'ships-service-sdk';

export enum ShipsPartner {
  Carnival = 'carnival',
  Celebrity = 'celebrity',
  NCL = 'ncl',
  Timeplay = 'timeplay',
}

export enum AccountType {
  Casino = 'CASINO_BANK',
  Room = 'ACCOUNT',
  Lottery = 'LOTTERY',
}

export enum TransactionType {
  Charge = 'CHARGE',
  Payment = 'PAYMENT',
  Refund = 'REFUND',
}

export enum TransactionState {
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Confirmed = 'CONFIRMED',
  Error = 'ERROR',
  Refund = 'REFUND',
}

export enum ActivityType {
  // lottery activity timeout
  Timeout = 'TIMEOUT',
  // loading the ships client
  Visit = 'VISIT',
  // login into ships client
  Login = 'LOGIN',
  // user is accessing lottery endpoints
  Play = 'PLAY',
  // user is accepting terms of service
  TOSAccept = 'TOS_ACCEPT',
}

export enum GameGroups {
  InstantWin = 'instant-win',
  Lotto = 'lotto',
  Entertainment = 'entertainment',
}

export enum GameCategory {
  ScratchCard = 'scratch-card',
  PowerPick = 'powerpick',
  Bingo = 'bingo',
  Dond = 'dond',
  FamilyFeud = 'family-feud',
  Trivia = 'trivia',
  Wof = 'wof',
}

export enum GameVertical {
  Entertainment = 'entertainment',
  Casino = 'casino',
}

export interface GameDefinition {
  definition_id: string;
  game_id: string;
  category: string;
  config: string;
  price: string;
  top_prize: string;
  created_at: number;
  version: number;
}

export enum GameIds {
  Trivia = 'trivia',
  Bingo = 'bingo',
  WheelOfFortune = 'wof',
  FamilyFeud = 'family-feud',
  DealOrNoDeal = 'dond',
  BreakTheBank = 'dond-dbk',
  CruisingForCash = 'cruising-for-cash',
  LuckyDragon = 'lucky-dragon',
  OceanTreasure = 'ocean-treasure',
  Pick3 = 'pick3',
  Pick4 = 'pick4',
}

export type GameId = `${GameIds}`;

export enum LotteryActivityType {
  Timeout = 'TIMEOUT',
}

export type EntSession = SessionData | SessionDONDSession;

export type AccountHold = {
  hold_id: string;
  user_Id: string;
  created_at: Date;
  updated_at: Date;
  state: AccountHoldState;
  reasons: AccountHoldReason[];
  category: GameCategory;
  transaction_id: string;
  instance_id: string;
  powerpick_line_id?: number;
  game_id: string;
  game_group: string;
  game_vertical: string;
};

export enum AccountHoldState {
  Unresolved = 'unresolved',
  Resolved = 'resolved',
}

export enum AccountHoldReason {
  TaxThreshold = 'tax_threshold',
  CashCompensation = 'cash_compensation',
}

export type HTTPAccountHoldsError = {
  type: string;
  message: string;
  data: AccountHold[];
};

export enum GamePaths {
  CruisingForCash = 'cruising-for-cash',
  Trivia = 'trivia',
  Bingo = 'bingo',
  WheelOfFortune = 'wheel-of-fortune',
  FamilyFeud = 'family-feud',
  BreakTheBank = 'break-the-bank',
  LuckyDragon = 'lucky-dragon',
  OceanTreasureHunt = 'ocean-treasure-hunt',
  Pick3 = 'pick3',
  Pick4 = 'pick4',
}

export enum CashCompPrizeTag {
  FreeCruise = 'free_cruise',
}

export interface Animation {
  tag: string;
  duration: number;
  playing: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete?: () => void;
}
