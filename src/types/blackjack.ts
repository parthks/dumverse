export type Round = {
  id: number;
  players: Record<number, Player>;
  dealer: DealerType;
  deck: Card[];
  logs: BlackjackGameLogEntry[];
  started: boolean;
  ended: boolean;
  winner: string[];
  created_at: number;
};

export type Player = {
  user_id: number;
  address: string;
  nft_address: string | null;
  betAmount: number;
  betPlaced: boolean;
  cards: Card[];
  value: number;
  hasDoubleDown: boolean;
  hasBust: boolean;
  hasStood: boolean;
  status: string | null;
  gold_balance: number;
  added_at: number;
};

export type Card = {
  rank: string;
  suit: string;
  value: number | number[];
};

export type DealerType = {
  address: string;
  balance: number;
  hiddenCard: Card;
  visibleCard: Card[];
  hasBust: boolean;
  winnigAmount: number | null;
  status: string | null;
};

export type BlackjackGameLogEntry = {
  from: string;
  message: string;
  timestamp: number;
};
