-- old combat process id - uln9Hp5_AE_rbDwDJYmv2s4A8Z0NLu-669x_I0aUmGI
local COMBAT_PROCESS_ID = "BzQAmLBXwHvzCGPFHw1TlTbS8ramHzCniFT8bgE2ERU" 
local DUMZ_TOKEN_PROCESS_ID = "mdZ4A4RJpd47KEmirFTyjRuTFxc52g2UYahrsmAe-dk"

local REST_SPOTS = { 0, 9, 18, 27 }

require "utils.globals"

-- duplicated in weapons and armors tables
local SPECIAL_ITEMS = {
    WAND = {
        id = "WAND",
        name = "Wand",
        gold_price = 15000,
        damage = 5,
        type = "WEAPON",
        material = "MAGIC",
    },
    MAGIC_ROBE = {
        id = "MAGIC_ROBE",
        name = "Magic Robe",
        gold_price = 12000,
        defense = 5,
        type = "ARMOR",
        material = "MAGIC",
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
        damage = 4,
        type = "WEAPON",
        material = "DIAMOND",
    },
    WAND = {
        id = "WAND",
        name = "Wand",
        gold_price = 15000,
        damage = 5,
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
        defense = 2,
        type = "ARMOR",
        material = "IRON",
    },
    ARMOR_3 = {
        id = "ARMOR_3",
        name = "Gold Armor",
        gold_price = 5000,
        defense = 3,
        type = "ARMOR",
        material = "GOLD",
    },
    ARMOR_4 = {
        id = "ARMOR_4",
        name = "Diamond Armor",
        gold_price = 10000,
        defense = 4,
        type = "ARMOR",
        material = "DIAMOND",
    },
    MAGIC_ROBE = {
        id = "MAGIC_ROBE",
        name = "Magic Robe",
        gold_price = 12000,
        defense = 5,
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
        gold_price = 1000,
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
        dumz_price = 40,
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

local ENEMIES = {
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
        damage = 1,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_4",
        name = "Pill taking rabbit",
        total_health = 1,
        health = 1,
        damage = 2,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_5",
        name = "Adorable Red Panda",
        total_health = 2,
        health = 2,
        damage = 2,
        difficulty = "EASY",
        gold_reward = 5,
        dumz_reward = 1
    },
    {
        id = "NPC_6",
        name = "Nyanz Cat",
        total_health = 2,
        health = 2,
        damage = 2,
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_7",
        name = "Teaz Kermit",
        total_health = 3,
        health = 3,
        damage = 2,
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_8",
        name = "Mocking Llama",
        total_health = 2,
        health = 2,
        damage = 3,
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_9",
        name = "Always Down Bear",
        total_health = 4,
        health = 4,
        damage = 2,
        difficulty = "MEDIUM",
        gold_reward = 10,
        dumz_reward = 3
    },
    {
        id = "NPC_10",
        name = "Joosed Up Squirrel",
        total_health = 4,
        health = 4,
        damage = 3,
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    {
        id = "NPC_11",
        name = "Fearful Flower",
        total_health = 4,
        health = 4,
        damage = 4,
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    {
        id = "NPC_12",
        name = "Angry Beaver",
        total_health = 5,
        health = 5,
        damage = 4,
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
    },
    {
        id = "NPC_13",
        name = "Agent Trunk",
        total_health = 5,
        health = 5,
        damage = 5,
        difficulty = "HARD",
        gold_reward = 20,
        dumz_reward = 5
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
    REST_SPOTS = REST_SPOTS,
    SPECIAL_ITEMS = SPECIAL_ITEMS,
    WEAPONS = WEAPONS,
    ARMORS = ARMORS,
    POTIONS = POTIONS,
    ENERGY = ENERGY,
    FOOD = FOOD,
    ALL_ITEMS = ALL_ITEMS,
    ENEMIES = ENEMIES,
    -- ENEMY_PER_LEVEL = ENEMY_PER_LEVEL,
}
