require "lsqlite3"

require("utils.combat")
-- Define types
-- local sqlite3 = require("lsqlite3")
global DB: db 
require("utils.utils.dbAdmin")
global dbAdmin: dbAdminType
global ISLAND_TRANSFER_FEE = 0.01 -- wAR


-- Enums
global enum ItemType
    "ARMOR"
    "WEAPON"
    "POTION"
    "FOOD"
    "ENERGY"
    "SPECIAL_ITEMS"
    "NFT"
end

global enum PotionIds
    "POTION_1" 
end


global enum FoodIds
    "FOOD_1"
    "FOOD_2"
end
global enum EnergyIds
    "ENERGY_1"
end
global enum ArmorIds
    "ARMOR_1"
    "ARMOR_2"
    "ARMOR_3"
    "ARMOR_4"
end
global enum WeaponIds
    "WEAPON_1"
    "WEAPON_2"
    "WEAPON_3"
    "WEAPON_4"
end

-- Define the base type for all items


global enum TokenType
   "GOLD"
   "DUMZ"
   "TRUNK"
end

global enum TransactionType
    "DEPOSIT"
    "WITHDRAW"
    "CLAIM_AIRDROP"
    "AIRDROP"
    "PULL_OUT"
    "PULL_IN"
end

-- User type
global type UserData = record
    id: integer
    name: string
    address: string
    nft_address: string | nil
    nft_special_trait: string | nil
    current_island: integer | nil
    gold_balance: number
    dumz_balance: number
    trunk_balance: number
    has_Claimed_All_Trunk_Tokens: number
    health: number
    total_health: number
    stamina: number
    total_stamina: number
    last_regenerate_time: integer
    damage: number
    defense: number
    current_spot: integer
    current_battle_id: integer | nil
    special_item_key: integer | nil -- becomes 0 when user accepts quest
    special_item_thread: integer | nil -- becomes 0 when user accepts quest
    special_item_bark: integer| nil -- becomes 0 when user accepts quest
    special_item_heart: integer| nil -- becomes 0 when user accepts quest
    special_item_kitten: integer| nil -- becomes 0 when user accepts quest
end

global type EnemyData = record
    id: string
    name: string
    total_health: number
    health: number
    damage: number | {number}
    difficulty: string
    gold_reward: number | nil
    dumz_reward: number | nil
    trunk_reward: number | nil
end

-- Inventory item type
global type InventoryItem = record
    id: integer
    user_id: integer
    item_id: string
    item_type: string
    item_health: integer
    total_item_health: integer
    equipped: boolean
    created_at: integer
end
global type BaseItem = record
    id: string
    name: string
    type: string
    gold_price: number | nil
    dumz_price: number | nil
end

-- Bank account type
global type BankAccountData = record
    id: integer
    user_id: integer
    gold_amount: number
    dumz_amount: number
    trunk_amount: number
    nft_gold_amount: number
    nft_dumz_amount: number
end

-- Bank transaction type
global type BankTransaction = record
    id: integer
    user_id: integer
    amount: number
    token_type: TokenType
    transaction_type: TransactionType
    created_at: integer
end

global type Leaderboard = record
    address: string
    name: string
    nft_address: string | nil
    gold_earned: number
    -- token_earned: number
    gold_lost: number
    -- token_lost: number
    battle_win: number
    battle_lost: number
    enemy_killed: number
    player_death: number
    death_streak: number
    death_streak_ended: boolean
    -- player_with_nft: number
end

return {}