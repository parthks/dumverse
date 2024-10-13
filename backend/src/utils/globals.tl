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
end

global enum PotionIds
    "POTION_1" 
end


global enum FoodIds
    "FOOD_1"
end
global enum EnergyIds
    "ENERGY_1"
end
global enum ArmorIds
    "ARMOR_1"
end
global enum WeaponIds
    "WEAPON_1"
end

-- Define the base type for all items


global enum TokenType
   "GOLD"
   "DUMZ"
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
    health: number
    total_health: number
    stamina: number
    total_stamina: number
    last_regenerate_time: integer
    damage: number
    defense: number
    current_spot: integer
    current_battle_id: integer | nil
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

return {}