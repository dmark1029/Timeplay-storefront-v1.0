export enum InstantWinState {
  InstantWinPaymentPending = 'payment_pending',
  InstantWinInitialized = 'initialized',
  InstantWinCompleted = 'completed',
  InstantWinInvalidated = 'invalidated',
}

export enum InstantWinGameType {
  Generic = 0,
  Match = 1,
  Reveal = 2,
}

export enum InstantWinNumberGroupType {
  NumberBank = 0,
  UsersNumbers = 1,
  Multiplier = 2,
}

export type LotteryGameSession = {
  session_id: string;
  created_at: number;
  ended_at?: number;
  game_id: string;
  price: number;
  definition_id: string;
  definition: GameDefinition;
};

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

export type InstantWinInstance = {
  instance_id: string;
  user_id: string;
  state: InstantWinState;
  gameplay_state_id: string;
  gameplay_state: InstantWinGameplayState;
  session_id: string;
  session: LotteryGameSession;
  created_at: string;
  updated_at: string;
};

export type InstantWinCardConfig = {
  games: InstantWinGameConfig[];
  prize_table_ids: string[];
};

export type InstantWinGameConfig = {
  type: InstantWinGameType;
  number_groups: InstantWinNumberGroupConfig[];
};

export type InstantWinNumberGroupConfig = {
  type: InstantWinNumberGroupType;
  match_amount: number;
  min_draw_amount: number;
  max_draw_amount: number;
  min_draw_value: number;
  max_draw_value: number;
};

export type InstantWinGameplayState = {
  gameplay_state_id: string;
  game_state_updated_at: Date;
  games: InstantWinGame[];
  payout: Payout;
};

export type Payout = {
  cash: number;
  cash_comp_prize_tags: string[];
};

export type InstantWinGame = {
  game_id: string;
  gameplay_state_id: string;
  sort_order: number;
  type: InstantWinGameType;
  number_groups: InstantWinNumberGroup[];
  prizes: Prize[];
  multiplier: number;
};

export type InstantWinNumberGroup = {
  group_id: string;
  game_id: string;
  sort_order: number;
  type: InstantWinNumberGroupType;
  numbers: InstantWinNumber[];
  prizes: Prize[];
};

export type InstantWinNumber = {
  number_id: string;
  group_id: string;
  sort_order: number;
  number: number;
  prize_id: string;
  prize: Prize;
  revealed: boolean;
  winner: boolean;
};

export enum InstantWinNumberStates {
  CLOSED = 0, // this is the default state for an instant win number item
  OPEN = 1, // this is the state when the number is clicked and the prize is revealed
  PRECOG = 3, // this is the state when an item randomly shimmers to indicate a potential win
  HIGHLIGHT = 4, // this state is not implemented yet
  SMALL_WIN = 5, // this is the state when a number is revealed and the prize is a small win, currently all wins are small wins
  NORMAL_WIN = 6, // this is not implemented yet
  BIG_WIN = 7, // this is not implemented yet
  LOSER = 8, // this is the state when a number is revealed and it's not a winner
}

export type InstantWinNumberStateType = `${InstantWinNumberStates}`;

export type Prize = {
  id: string;
  value: string;
  tag: string; // this is the cash comp prize tag
  multiplier: number;
};

export type TsRange = {
  start_timestamp: number;
  end_timestamp: number;
};

export type FeatureFlags = {
  generic: boolean;
  match: boolean;
  reveal: boolean;
  genericMultiplier: boolean; //whether or not the main game has a scratachble multiplier area
};

export type PurchaseInstantWinRequest = {
  definition_id: string;
  quantity: number;
  coupon_id: string;
  pin: string;
  charge_type: string;
};

export enum SwipeMode {
  Automatic = 0,
  Manual = 1,
}

//export type CompleteInstantWinInstanceConflictError = Error & { state: InstantWinState };

export type CompleteInstantWinInstanceConflictResponse = {
  type: string;
  data: InstantWinState;
};

export class CompleteInstantWinInstanceConflictError extends Error {
  state: InstantWinState;
  constructor(m: string, s: InstantWinState) {
    super(m);
    this.state = s;
  }
}

export class CompleteInstantWinInstanceHeldError extends Error {
  constructor(m: string) {
    super(m);
  }
}
