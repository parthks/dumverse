COMBAT_PROCESS_ID = "tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE"
GAME_PROCESS_ID = "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc"

REST_SPOTS = { 0, 9, 18, 27 }

ITEMS = {
    ["WEAPON_1"] = {
        id = "WEAPON_1",
        name = "Wood Slingshot",
        gold_price = 5000,
        damage = 2,
        type = "WEAPON",
    },
    ["ARMOR_1"] = {
        id = "ARMOR_1",
        name = "Wood Armor",
        gold_price = 6000,
        defense = 1,
        type = "ARMOR",
    },
    ["POTION_1"] = {
        id = "POTION_1",
        name = "Health Potion",
        gold_price = 1000,
        health = 1,
        type = "POTION",
    },
    ["ENERGY_1"] = {
        id = "ENERGY_1",
        name = "Joose",
        dumz_price = 40,
        energy = 2,
        type = "ENERGY",
    },
    ["FOOD_1"] = {
        id = "FOOD_1",
        name = "Cake",
        gold_price = 10,
        health = 2,
        type = "FOOD",
    },

}

ENEMIES = {
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
ENEMY_PER_LEVEL = {
    [1] = { ENEMIES[1] },
    [2] = { ENEMIES[2] },
    [3] = { ENEMIES[3] },
    [4] = { ENEMIES[4] },
    [5] = { ENEMIES[5] },
    [6] = { ENEMIES[1], ENEMIES[2] },
    [7] = { ENEMIES[3], ENEMIES[4] },
    [8] = { ENEMIES[5], ENEMIES[5] },
    -- [9] is a rest spot
    [10] = { ENEMIES[6] },
    [11] = { ENEMIES[7] },
    [12] = { ENEMIES[8] },
    [13] = { ENEMIES[9] },
    [14] = { ENEMIES[6], ENEMIES[2] },
    [15] = { ENEMIES[7], ENEMIES[3] },
    [16] = { ENEMIES[8], ENEMIES[4] },
    [17] = { ENEMIES[9], ENEMIES[5] },
    -- [18] is a rest spot
    [19] = { ENEMIES[10] },
    [20] = { ENEMIES[11] },
    [21] = { ENEMIES[12] },
    [22] = { ENEMIES[13] },
    [23] = { ENEMIES[10], ENEMIES[6] },
    [24] = { ENEMIES[11], ENEMIES[7] },
    [25] = { ENEMIES[12], ENEMIES[8] },
    [26] = { ENEMIES[13], ENEMIES[9] },
    -- [27] is a rest spot
}

return {}
