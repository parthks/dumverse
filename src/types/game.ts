import { number } from "zod";

export type LamaPosition = {
  x: number;
  y: number;
  src: "STAND_LEFT" | "STAND_RIGHT" | "WALKING_LEFT" | "WALKING_RIGHT";
};

export type GameUser = {
  id: number;
  name: string;
  last_updated_at: number;
  address: string;
  nft_address?: string;
  nft_special_trait?: string;
  current_island?: number;
  gold_balance: number;
  dumz_balance: number;
  trunk_balance: number;
  total_trunk_token: number;
  health: number;
  total_health: number;
  stamina: number;
  total_stamina: number;
  damage: number;
  defense: number;
  current_spot: number;
  current_battle_id?: number;
  special_item_key: number;
  special_item_thread: number;
  special_item_bark: number;
  special_item_heart: number;
  special_item_kitten: number;
  inventory: Inventory[];
};

export type Inventory = {
  id: number;
  user_id: number;
  item_id: string;
  item_type: ItemType;
  item_health: number;
  total_item_health: number;
  equipped: boolean;
  created_at: string;
};

export type ItemType = "ARMOR" | "WEAPON" | "POTION" | "FOOD" | "ENERGY" | "SPECIAL_ITEMS";

export type Item = {
  id: string;
  name: string;
  gold_price?: number; // either one of these
  dumz_price?: number; // either one of these
  type: ItemType;
  defense: number; // only for armor
  material: string; // only for weapons and armor
  damage: number; // only for weapons
  energy?: number; // for energy items
  health?: number; // for food and potion items
};

export type Shop = {
  items: Item[];
};

export type Bank = {
  id: number;
  user_id: number;
  gold_amount: number;
  dumz_amount: number;
  trunk_amount: number;
  nft_gold_amount: number;
  nft_dumz_amount: number;
};

export type TokenType = "GOLD" | "DUMZ" | "TRUNK";

export type BankTransaction = {
  id: number;
  user_id: number;
  amount: number;
  token_type: TokenType;
  transaction_type: "DEPOSIT" | "WITHDRAW" | "CLAIM_AIRDROP" | "AIRDROP" | "PULL_OUT" | "PULL_IN";
  created_at: string;
};

type DailyGoldWishesLogType={
  message: string,
  timestamp: number
}
 
export type DailyGoldWishes={
  user_id: number,
  timestamp: number,
  gold: number,
  logs: DailyGoldWishesLogType[]
}

export type UserAirdrop = {
  id: number,
  user_id: number,
  name: string,
  address: string,
  nft_address: string,
  cascade: number,
  claimed_nft_gold: boolean,
  claimed_nft_dumz: boolean
}