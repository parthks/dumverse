
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
    health: number
    total_health: number
    stamina: number
    total_stamina: number
    last_regenerate_time: integer
    damage: number
    defense: number
    current_spot: integer
    current_battle_id: integer | nil
    
    -- Additional fields specific to CombatUserData
    potion_used: boolean
    potion: CombatPotionData | nil
    added_at_timestamp: integer
end