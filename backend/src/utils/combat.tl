
global type CombatPotionData = record
    id: integer
    item_id: string
    health: number
end

global type CombatUserData = record
    -- Include all fields from UserData
    id: string
    name: string
    address: string
    nft_address: string | nil
    nft_special_trait: string | nil
    current_island: integer | nil
    gold_balance: integer
    dumz_balance: integer
    trunk_balance: integer
    total_trunk_token: integer
    health: number
    total_health: number
    stamina: number
    total_stamina: number
    last_regenerate_time: integer
    damage: number
    defense: number
    current_spot: integer
    current_battle_id: integer | nil
    current_blackjack_id: integer | nil
    special_item_key: integer -- default -1, becomes 0 when user accepts quest
    special_item_thread: integer -- default -1, becomes 0 when user accepts quest
    special_item_bark: integer  -- default -1, becomes 0 when user accepts quest
    special_item_heart: integer -- default -1, becomes 0 when user accepts quest
    special_item_kitten: integer -- default -1, becomes 0 when user accepts quest
    
    -- Additional fields specific to CombatUserData
    potion_used: boolean
    potion: CombatPotionData | nil
    added_at_timestamp: integer
    inventory_weapon_id: string | nil
    inventory_armor_id: string | nil

    -- User Quest's Completion Data
    has_collected_all_hearts : boolean | nil
    has_collected_kitten : boolean | nil
    -- gold_earned : integer   
    -- gold_lost : integer   
    -- enemy_killed : integer   
    -- player_death : integer   
    -- death_streak : integer   
    -- pvp : integer  
end