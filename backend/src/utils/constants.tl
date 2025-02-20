-- old combat process id - uln9Hp5_AE_rbDwDJYmv2s4A8Z0NLu-669x_I0aUmGI
local COMBAT_PROCESS_ID = "Byl2hF1lJSNHvGM5--Cd8kl_xbTJmupvk8IHgE20v_0" --"6jy_Ai9mInmMg1t6HPlSWKLcxYBFUe81DEpeuq5fP9k" --"8zkx7rgZ6q9SBf1aM5uJ9A_4j6twWSEM2YpsWUhAjqA"--"iB636YMO3EvqdZ5FWSjSw_oqVIQSO9f9XrGYY8u-Vc4"--"B3OVMP1sY_wA_nh7YGhRtsXsHP2NB9zacYAGlix6Ink" 
local DUMZ_TOKEN_PROCESS_ID = "mdZ4A4RJpd47KEmirFTyjRuTFxc52g2UYahrsmAe-dk"
local TRUNK_TOKEN_PROCESS_ID = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ"
local HISTORY_PROCESS_ID = ""
local GAME_PROCESS_ID =  "he0A-CykeH69PeXYa9AErO297hDeIORAteTGZLLc_Kk"   -- "_-h1jIlG-9BotgyC9CoikKrU0JbS5Pf8yBr6Nhm1YDA"
local RECORD_PROCESS_ID =  "HJFBaDD69-BbZ7SiL4FNSeXze_AaOJyevFhgDtv8MI0"  --"89fSDpPCsPx-B26ih5pqsjxhb_5PpcAuckdjYJsr97A"
local BACKUP_PROCESS_ID = "3wGAfN8l852iuIt6Kc8kjR6G5opcTa92jKP1aAv2iWY"
local BANK_PROCESS_ID = "Aoa2ZMDFrJdB_bPrCF_eUSCVKfXgx3e5nbVt6PmA870"
local BLACKJACK_PROCESS_ID = "xKVv6No7XcNotVXXpGXlLmY4za-Gh5ENtKJp6RDr3dg"

local REST_SPOTS = {0, 9, 18, 27, 36, 45, 54, 63, 72, 81}

require "utils.globals"

local ONE_OF_ONE_ASSET_IDS: {string} = {
    "A8ucm402DGkcJWydu1iibXGvpsDSnI5rj3Z-zP7JjB4",
    "XYkNDhHBAPF85xy7E56mmZR4VJTS8os0JbxNh_fdRZE",
    "2UMirpNKMZ9MDpApI3gI0Dy0975fC-vOK3UoIeMM2yg",
    "5U-KMM4rJ2x19xEEgSIHVdDopxuTXgCjaQgTUrNFiKE",
}

-- duplicated in weapons and armors tables
local SPECIAL_ITEMS = {
    WAND = {
        id = "WAND",
        name = "Wand",
        gold_price = 15000,
        -- damage = 5,
        damage = 6,
        type = "WEAPON",
        material = "MAGIC",
    },
    MAGIC_ROBE = {
        id = "MAGIC_ROBE",
        name = "Magic Robe",
        -- gold_price = 12000,
        gold_price = 15000,
        -- defense = 5,
        defense = 11,
        type = "ARMOR",
        material = "MAGIC",
    },
    RARE_NFT = {
        id = "RARE_NFT",
        name = "Rare NFT",
        dumz_price = 2500,
        nft_address = "y6atUgqwrW7dTD6Z2F_0L_Qybk5K2M-9KrIgYL9WjiQ",
        type = "NFT",
    },
}

local WEAPONS = {
    WEAPON_1 = {
        id = "WEAPON_1",
        name = "Wood Slingshot",
        gold_price = 1250,
        damage = 1,
        type = "WEAPON",
        material = "WOOD",
    },
    WEAPON_2 = {
        id = "WEAPON_2",
        name = "Iron Slingshot",
        gold_price = 2500,
        damage = 2,
        type = "WEAPON",
        material = "IRON",
    },
    WEAPON_3 = {
        id = "WEAPON_3",
        name = "Gold Slingshot",
        gold_price = 6000,
        damage = 3,
        type = "WEAPON",
        material = "GOLD",
    },
    WEAPON_4 = {
        id = "WEAPON_4",
        name = "Diamond Slingshot",
        gold_price = 12000,
        -- damage = 4,
        damage = 6,
        type = "WEAPON",
        material = "DIAMOND",
    },
    WAND = {
        id = "WAND",
        name = "Wand",
        gold_price = 15000,
        -- damage = 5,
        damage = 6,
        type = "WEAPON",
        material = "MAGIC",
    },
}
global type WeaponItem = record
    {BaseItem}
    damage: number
    material: string
end
local ARMORS = {
    ARMOR_1 = {
        id = "ARMOR_1",
        name = "Wood Armor",
        gold_price = 1000,
        defense = 1,
        type = "ARMOR",
        material = "WOOD",
    },
    ARMOR_2 = {
        id = "ARMOR_2",
        name = "Iron Armor",
        gold_price = 2000,
        -- defense = 2,
        defense = 3,
        type = "ARMOR",
        material = "IRON",
    },
    ARMOR_3 = {
        id = "ARMOR_3",
        name = "Gold Armor",
        gold_price = 5000,
        -- defense = 3,
        defense = 5,
        type = "ARMOR",
        material = "GOLD",
    },
    ARMOR_4 = {
        id = "ARMOR_4",
        name = "Diamond Armor",
        gold_price = 10000,
        -- defense = 4,
        defense = 11,
        type = "ARMOR",
        material = "DIAMOND",
    },
    MAGIC_ROBE = {
        id = "MAGIC_ROBE",
        name = "Magic Robe",
        -- gold_price = 12000,
        gold_price = 15000,
        -- defense = 5,
        defense = 11,
        type = "ARMOR",
        material = "MAGIC",
    },
}
global type ArmorItem = record
    {BaseItem}
    defense: number
    material: string
end
local POTIONS = {
    POTION_1 = {
        id = "POTION_1",
        name = "Health Potion",
        gold_price = 50,
        health = 1,
        type = "POTION",
    },
}
global type PotionItem = record
    {BaseItem}
    health: number
end
local ENERGY = {
    ENERGY_1 = {
        id = "ENERGY_1",
        name = "Joose",
        dumz_price = 15,
        energy = 2,
        type = "ENERGY",
    },
}
global type EnergyItem = record
    {BaseItem}
    energy: number
end
local FOOD = {
    FOOD_1 = {
        id = "FOOD_1",
        name = "Cake",
        gold_price = 10,
        health = 2,
        type = "FOOD",
    },
    FOOD_2 = {
        id = "FOOD_2",
        name = "Whole Cake",
        gold_price = 100,
        health = 10,
        type = "FOOD",
    },
}
global type FoodItem = record
    {BaseItem}
    id: string
    type: string
    health: number
end

local ALL_ITEMS: {string:BaseItem} = {}
for _, item in pairs(ARMORS as {string:BaseItem}) do
    ALL_ITEMS[item.id] = item
end
for _, item in pairs(POTIONS as {string:BaseItem}) do
    ALL_ITEMS[item.id] = item
end
for _, item in pairs(ENERGY as {string:BaseItem}) do
    ALL_ITEMS[item.id] = item
end
for _, item in pairs(FOOD as {string:BaseItem}) do
    ALL_ITEMS[item.id] = item
end
for _, item in pairs(WEAPONS as {string:BaseItem}) do
    ALL_ITEMS[item.id] = item
end

-- local ITEMS = {
--     WEAPON_1 = {
--         id = "WEAPON_1",
--         name = "Wood Slingshot",
--         gold_price = 5000,
--         damage = 2,
--         type = "WEAPON",
--     },
--     ARMOR_1 = {
--         id = "ARMOR_1",
--         name = "Wood Armor",
--         gold_price = 6000,
--         defense = 1,
--         type = "ARMOR",
--     },
--     POTION_1 = {
--         id = "POTION_1",
--         name = "Health Potion",
--         gold_price = 1000,
--         health = 1,
--         type = "POTION",
--     },
--     ENERGY_1 = {
--         id = "ENERGY_1",
--         name = "Joose",
--         dumz_price = 40,
--         energy = 2,
--         type = "ENERGY",
--     },
--     FOOD_1 = {
--         id = "FOOD_1",
--         name = "Cake",
--         gold_price = 10,
--         health = 2,
--         type = "FOOD",
--     },
-- }

local ENEMIES: {EnemyData} = {
    {
        id = "NPC_1",
        name = "Doe Eyed Deer",
        total_health = 1,
        health = 1,
        damage = 1,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_2",
        name = "Sad Hedgehog",
        total_health = 1,
        health = 1,
        damage = 1,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_3",
        name = "Intense Owl",
        total_health = 2,
        health = 2,
        -- damage = 1,
        damage = {1,2},
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_4",
        name = "Pill taking rabbit",
        -- total_health = 1,
        total_health = 2,
        -- health = 1,
        health = 2,
        -- damage = 2,
        damage = {1,2},
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_5",
        name = "Adorable Red Panda",
        total_health = 2,
        health = 2,
        -- damage = 2,
        damage = 1,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_6",
        name = "Nyanz Cat",
        -- total_health = 2,
        total_health = 5,
        -- health = 2,
        health = 5,
        -- damage = 2,
        damage = {2,3},
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_7",
        name = "Teaz Kermit",
        -- total_health = 3,
        total_health = 6,
        -- health = 3,
        health = 6,
        -- damage = 2,
        damage = {2,3},
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_8",
        name = "Mocking Llama",
        -- total_health = 2,
        total_health = 5,
        -- health = 2,
        health = 5,
        -- damage = 4,
        damage = {2,4},
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_9",
        name = "Always Down Bear",
        -- total_health = 4,
        total_health = 6,
        -- health = 4,
        health = 6,
        -- damage = 3,
        damage = {2,4},
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_10",
        name = "Joosed Up Squirrel",
        -- total_health = 4,
        total_health = 7,
        -- health = 4,
        health = 7,
        -- damage = 4,
        damage = {3,5},
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    {
        id = "NPC_11",
        name = "Fearful Flower",
        -- total_health = 4,
        total_health = 8,
        -- health = 4,
        health = 8,
        -- damage = 4,
        damage = {3,5},
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    {
        id = "NPC_12",
        name = "Angry Beaver",
        -- total_health = 5,
        total_health = 7,
        -- health = 5,
        health = 7,
        -- damage = 5,
        damage = {3,6},
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    -- {
    --     id = "NPC_13",
    --     name = "Agent Trunk",
    --     total_health = 9,
    --     health = 9,
    --     -- damage = 5,
    --     damage = {7,13},
    --     difficulty = "HARD",
    --     gold_reward = 20,
    --     dumz_reward = 5,
    --     trunk_reward = 1,
    -- },
     {
        id = "NPC_13",
        name = "Goat",
        total_health = 8,
        health = 8,
        -- damage = 5,
        damage = {3,6},
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
}



local SPECIAL_ENEMIES = {
    SHIBA = {
        id = "SHIBA",
        name = "Shiba Inu",
        -- total_health = 6,
        total_health = 9,
        -- health = 6,
        health = 9,
        -- damage = 2,
        damage = {1,2},
        difficulty = "SPECIAL",
    },
    LEPERCHAUN = {
        id = "LEPERCHAUN",
        name = "Made it Leperchaun",
        -- total_health = 4,
        total_health = 6,
        -- health = 4,
        health = 6,
        -- damage = 4,
        damage = {3,5},
        difficulty = "SPECIAL",
        gold_reward = 500,
    },
    PEACOCK = {
        id = "PEACOCK",
        name = "Devilish Peacock",
        -- total_health = 6,
        total_health = 8,
        -- health = 6,
        health = 8,
        -- damage = 6,
        damage = {3,6},
        difficulty = "SPECIAL",
    },
    TREE = {
        id = "TREE",
        name = "Aggravated Tree",
        -- total_health = 5,
        total_health = 7,
        -- health = 5,
        health = 7,
        -- damage = 4,
        damage = {4,5},
        difficulty = "SPECIAL",
    },
    MOUSE = {
        id = "MOUSE",
        name = "Stealthy Mouse",
        -- total_health = 5,
        total_health = 7,
        -- health = 5,
        health = 7,
        -- damage = 2,
        damage = {4,5},
        difficulty = "SPECIAL",
    },
    DUMZ = {
        id = "DUMZ",
        name = "DumDumz Maxi",
        -- total_health = 12,
        total_health = 9,
        -- health = 12,
        health = 9,
        -- damage = 6,
        damage = {7,13},
        difficulty = "SPECIAL",
        dumz_reward = 200,
    },
    BLACK_SWAN = {
        id = "BLACK_SWAN",
        name = "Black Swan Event",
        -- total_health = 18,
        total_health = 22,
        -- health = 18,
        health = 22,
        -- damage = 8,
        damage = {6,12},
        difficulty = "SPECIAL",
        dumz_reward = 500,
        gold_reward = 8000,
    },
    AGENT_TRUNK =   {
        id = "AGENT_TRUNK",
        name = "Agent Trunk",
        total_health = 9,
        health = 9,
        -- damage = 5,
        damage = {7,13},
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5,
        trunk_reward = 1,
    },
}

-- 9, 18, 27 are rest spots
-- local ENEMY_PER_LEVEL = {
--     [1] = { ENEMIES[1] },
--     [2] = { ENEMIES[2] },
--     [3] = { ENEMIES[3] },
--     [4] = { ENEMIES[4] },
--     [5] = { ENEMIES[5] },
--     [6] = { ENEMIES[2], ENEMIES[3] },
--     [7] = { ENEMIES[3], ENEMIES[4] },
--     [8] = { ENEMIES[4], ENEMIES[5] },
--     -- [9] is a rest spot
--     [10] = { ENEMIES[6] },
--     [11] = { ENEMIES[7] },
--     [12] = { ENEMIES[8] },
--     [13] = { ENEMIES[9] },
--     [14] = { ENEMIES[6], ENEMIES[2] },
--     [15] = { ENEMIES[7], ENEMIES[3] },
--     [16] = { ENEMIES[8], ENEMIES[4] },
--     [17] = { ENEMIES[9], ENEMIES[5] },
--     -- [18] is a rest spot
--     [19] = { ENEMIES[10] },
--     [20] = { ENEMIES[11] },
--     [21] = { ENEMIES[12] },
--     [22] = { ENEMIES[13] },
--     [23] = { ENEMIES[10], ENEMIES[6] },
--     [24] = { ENEMIES[11], ENEMIES[7] },
--     [25] = { ENEMIES[12], ENEMIES[8] },
--     [26] = { ENEMIES[13], ENEMIES[9] },
--     -- [27] is a rest spot
-- }

return {
    COMBAT_PROCESS_ID = COMBAT_PROCESS_ID,
    DUMZ_TOKEN_PROCESS_ID = DUMZ_TOKEN_PROCESS_ID,
    TRUNK_TOKEN_PROCESS_ID = TRUNK_TOKEN_PROCESS_ID,
    HISTORY_PROCESS_ID = HISTORY_PROCESS_ID,
    GAME_PROCESS_ID = GAME_PROCESS_ID,
    RECORD_PROCESS_ID = RECORD_PROCESS_ID,
    BACKUP_PROCESS_ID = BACKUP_PROCESS_ID,
    BANK_PROCESS_ID = BANK_PROCESS_ID,
    BLACKJACK_PROCESS_ID = BLACKJACK_PROCESS_ID,
    ONE_OF_ONE_ASSET_IDS = ONE_OF_ONE_ASSET_IDS,
    REST_SPOTS = REST_SPOTS,
    SPECIAL_ITEMS = SPECIAL_ITEMS,
    WEAPONS = WEAPONS,
    ARMORS = ARMORS,
    POTIONS = POTIONS,
    ENERGY = ENERGY,
    FOOD = FOOD,
    ALL_ITEMS = ALL_ITEMS,
    ENEMIES = ENEMIES,
    SPECIAL_ENEMIES = SPECIAL_ENEMIES
    -- ENEMY_PER_LEVEL = ENEMY_PER_LEVEL,
}
