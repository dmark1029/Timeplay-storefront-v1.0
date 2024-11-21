enum TicketState {
  Pending = 'pending',
  Charged = 'charged',
}

enum PrizeState {
  NoPriz = 'no_prize',
  PrizeStatePending = 'pending',
  PrizeStateHeld = 'held',
  PrizeStatePaid = 'paid',
}

export enum LottoBallAnimation {
  ROLL = 'ballRollAnimation',
  SLIDE = 'ballShadowAnimation',
  FADE = 'lottoBallFadeOut',
}

export interface Ticket {
  id: number;
  user_id: string;
  state: TicketState;
  transaction_id?: string;
  draws: Draw[];
  lines: Line[];
}

// for display
export interface Draw {
  id: number;
  draw_time: Date;
  type: string;
  enabled: boolean;
  outcome: number[];
  fireball_outcome: number;
  player_count: number;
}

export interface Line {
  id: number;
  picks: number[];
  line_type: string;
  fireball_picked: boolean;
  stake: number;
  ticket_id: string;
  ticket?: Ticket;
  prizes?: Prize[];
}

export interface Prize {
  id: number;
  amount: number;
  cash_comp_prize_tags: string[];
  transaction_id: string;
  state: PrizeState;
  line_id: string;
  line?: Line;
  draw_id: number;
  draw?: Draw;
}

// check out
export interface CheckoutLine {
  picks: number[];
  line_type: string;
  fireball_picked: boolean;
  stake: number;
}

export interface PowerPicksPurchaseRequest {
  draws: number[];
  lines: CheckoutLine[];
  pin?: string;
  charge_type?: string;
}

export interface DrawResponse {
  type: string;
  data: Draw;
}