export type GameUser = {
  id: number;
  name: string;
  address: string;
  nft_address: string;
  nft_special_trait: string;
  current_island: number;
  gold_balance: number;
  dumz_balance: number;
  health: number;
  stamina_balance: number;
  damage: number;
  defense: number;
  inventory: Inventory[];
};

export type Inventory = {
  id: number;
  user_id: number;
  item_id: string;
  item_type: "ARMOR" | "WEAPON" | "POTION" | string;
  amount: number;
  equipped: boolean;
  created_at: string;
};

export type Bank = {
  id: number;
  user_id: number;
  gold_amount: number;
  dumz_amount: number;
};

export type BankTransaction = {
  id: number;
  user_id: number;
  amount: number;
  token_type: "GOLD" | "DUMZ";
  transaction_type: "DEPOSIT" | "WITHDRAW" | "AIRDROP" | "PULL_OUT" | "PULL_IN";
  created_at: string;
};
