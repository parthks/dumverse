export type LamaPosition = {
  x: number;
  y: number;
  src: "STAND_LEFT" | "STAND_RIGHT" | "WALKING_LEFT" | "WALKING_RIGHT";
};

export type GameUser = {
  id: number;
  name: string;
  address: string;
  nft_address?: string;
  nft_special_trait?: string;
  current_island?: number;
  gold_balance: number;
  dumz_balance: number;
  health: number;
  total_health: number;
  stamina: number;
  total_stamina: number;
  damage: number;
  defense: number;
  current_spot: number;
  current_battle_id?: number;
  inventory: Inventory[];
};

export type Inventory = {
  id: number;
  user_id: number;
  item_id: string;
  item_type: ItemType;
  amount: number;
  equipped: boolean;
  created_at: string;
};

export type ItemType = "ARMOR" | "WEAPON" | "POTION" | "FOOD" | "ENERGY";

export type Item = {
  id: string;
  name: string;
  gold_price?: number; // either one of these
  dumz_price?: number; // either one of these
  type: ItemType;
  defense: number;
  damage: number;
};

export type Shop = {
  items: Item[];
};

export type Bank = {
  id: number;
  user_id: number;
  gold_amount: number;
  dumz_amount: number;
  nft_gold_amount: number;
  nft_dumz_amount: number;
};

export type TokenType = "GOLD" | "DUMZ";

export type BankTransaction = {
  id: number;
  user_id: number;
  amount: number;
  token_type: TokenType;
  transaction_type: "DEPOSIT" | "WITHDRAW" | "CLAIM_AIRDROP" | "AIRDROP" | "PULL_OUT" | "PULL_IN";
  created_at: string;
};
