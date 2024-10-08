local helpers = require("game.helpers")
local json = require("json")
local utils = require("utils.utils.tl-utils")

local constants = require("utils.constants")


local function removeUsedPotion(playerData: CombatUserData)
    if playerData.potion_used and playerData.potion then
        local potion = playerData.potion as CombatPotionData
        local potion_id = potion.id
        if potion_id then
            -- remove the potion from the inventory
            dbAdmin:exec(string.format([[
                DELETE FROM Inventory WHERE id = %d;
            ]], potion_id))
        end
    end
end

-- equivalent function in frontend/src/lib/utils.ts
local function isValidSpotToMoveTo(currentSpot: integer, targetSpot: integer): boolean
    if currentSpot == targetSpot then
        return true
    end

    local nextSpot = currentSpot + 1
    local previousSpot = currentSpot - 1
    local nextNextSpot = currentSpot + 2
    local previousPreviousSpot = currentSpot - 2

    local isNextSpotRest = utils.includes(nextSpot, constants.REST_SPOTS)
    local isPreviousSpotRest = utils.includes(previousSpot, constants.REST_SPOTS)

    return utils.includes(targetSpot, { nextSpot, previousSpot }) or 
           (isNextSpotRest and targetSpot == nextNextSpot) or
           (isPreviousSpotRest and targetSpot == previousPreviousSpot)
end

local function enterNewCombatHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local combat_level = tonumber(msg.Tags.Level) as integer
    assert(type(combat_level) == "number", "Level is required")
    assert(type(combat_level) == "number" and math.floor(combat_level) == combat_level, "Combat level must be an integer")

    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    local current_spot = userData.current_spot

    assert(userData.health > 0, "User must have health")
    assert(userData.stamina > 0, "User must have stamina")

    assert(combat_level, "Combat Level is required")
    -- combat level must not be a rest spot
    assert(not utils.includes(combat_level, constants.REST_SPOTS), "Spot is a rest spot")

    assert(combat_level > 0, "Combat Level must be greater than 0")
    assert(isValidSpotToMoveTo(current_spot, combat_level),
        "Invalid spot to move to. Current spot: " .. current_spot .. " Combat Level: " .. combat_level)

    -- get equipped inventory items - for potions
    local equippedPotion = dbAdmin:exec(string.format([[
        SELECT id,item_id FROM Inventory WHERE USER_ID = %f AND item_type = 'POTION' LIMIT 1;
    ]], user_id))
    -- add equippedPotion to userData.potion, will remove the item from inventory after battle (if used)
    local combatUserData: CombatUserData = userData as CombatUserData
    -- convert id to string
    combatUserData.id = tostring(combatUserData.id)
    local potion = equippedPotion[1] as InventoryItem
    combatUserData.potion_used = false
    combatUserData.potion = nil
    
    if potion then
        local potion_id = potion.item_id as PotionIds
        local item = constants.POTIONS[potion_id]
        local health = item.health

        combatUserData.potion = {
            id = potion.id,
            item_id = potion.item_id,
            health = health
        }
    end

    -- local enemies = constants.ENEMY_PER_LEVEL[combat_level]
    local enemy_index: integer;
    if combat_level <= 8 then
        -- Easy: enemies 1-5
        enemy_index = math.random(1, 5)
     elseif combat_level <= 17 then
        -- Medium: enemies 6-9
        enemy_index = math.random(6, 9)
     elseif combat_level <= 25 then
        -- Hard: enemies 10-12
        enemy_index = math.random(10, 12)
     else
        -- Boss: enemy 13 (for level 26+)
        enemy_index = 13
     end
     
    local enemies = {constants.ENEMIES[enemy_index]}
    assert(enemies, "No enemies found for combat level: " .. combat_level)

    ao.send({
        Target = constants.COMBAT_PROCESS_ID,
        Action = "Battle.NewUserJoin",
        UserId = tostring(user_id),
        Level = tostring(combat_level),
        Status = "Success",
        Data = json.encode({
            npcs = json.encode(enemies),
            player = json.encode(userData),
        }),
    })
end

local function enteredNewCombatHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local battle_id = tonumber(msg.Tags.BattleId)
    local level = tonumber(msg.Tags.Level)
    assert(battle_id, "BattleId is required")
    assert(level, "Level is required")

    -- update Users table with battle_id
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = %d, stamina = stamina - 1 WHERE id = %f;
    ]], battle_id, user_id))
end

local function playerWonHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local level = tonumber(msg.Tags.Level)
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

    -- update Users table with health, stamina, gold_balance, dumz_balance
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = %d, health = %f, gold_balance = %f, dumz_balance = %f WHERE id = %f;
    ]], level, playerData.health, playerData.gold_balance, playerData.dumz_balance,
        user_id))

    removeUsedPotion(playerData)
end

local function playerRanAwayHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData
   
    -- update Users table with health, stamina, gold_balance, dumz_balance
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, health = %f, gold_balance = %f, dumz_balance = %f WHERE id = %f;
    ]], playerData.health, playerData.gold_balance, playerData.dumz_balance, user_id))

    removeUsedPotion(playerData)
end

local function playerPerishedHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

    -- update Users table
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = 0, health = 0, gold_balance = 0, dumz_balance = 0 WHERE id = %f;
    ]], user_id))

    removeUsedPotion(playerData)
end

-- Add handlers
Handlers.add("Combat.EnterNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'), enterNewCombatHandler)
Handlers.add("Combat.EnteredNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnteredNewCombat'), enteredNewCombatHandler)
Handlers.add("Combat.PlayerWon", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerWon'), playerWonHandler)
Handlers.add("Combat.PlayerRanAway", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerRanAway'), playerRanAwayHandler)
Handlers.add("Combat.PlayerPerished", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerPerished'), playerPerishedHandler)

return {}