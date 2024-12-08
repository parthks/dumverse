local helpers = require("game.helpers")
local json = require("json")
local utils = require("utils.utils.tl-utils")

local constants = require("utils.constants")


local function removeUsedPotion(playerData: CombatUserData, userId: string)

    if playerData.special_item_heart == 4  and playerData.has_collected_all_hearts == true then
        playerData.total_health = playerData.total_health + 1
        -- ao.send({Target="_-h1jIlG-9BotgyC9CoikKrU0JbS5Pf8yBr6Nhm1YDA",Action="Quest.ShopHeartQuest",UserId=tostring(Battles[battle_id].players[attacker_id].id),UserAddress=Battles[battle_id].players[attacker_id].address,TotalHeart=tostring(Battles[battle_id].players[attacker_id].special_item_heart)})
       
        dbAdmin:exec(string.format([[
            UPDATE Users SET total_health = %f WHERE id = %f;
        ]], playerData.total_health, userId))
    end

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

    if currentSpot == 0 and targetSpot == 28 then
        return true
    end
    if currentSpot == 0 and targetSpot == 55 then
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
    assert(combat_level ~= current_spot, "Battle is complete for this spot")

    assert(userData.health > 0, "User must have health")
    assert(userData.stamina > 0, "User must have stamina")

    assert(combat_level, "Combat Level is required")
    -- combat level must not be a rest spot
    assert(not utils.includes(combat_level, constants.REST_SPOTS), "Spot is a rest spot")

    assert(combat_level > 0, "Combat Level must be greater than 0")
    assert(isValidSpotToMoveTo(current_spot, combat_level),
        "Invalid spot to move to. Current spot: " .. current_spot .. " Combat Level: " .. combat_level)

    -- get equipped inventory items - for potions
    local inventoryItems = dbAdmin:exec(string.format([[
        SELECT id,item_id,item_type,item_health,equipped FROM Inventory WHERE USER_ID = %f;
    ]], user_id))
    -- add equippedPotion to userData.potion, will remove the item from inventory after battle (if used)
    local combatUserData: CombatUserData = userData as CombatUserData
    -- convert id to string
    combatUserData.id = tostring(combatUserData.id)

    -- local potion = equippedPotion[1] as InventoryItem
    combatUserData.potion_used = false
    combatUserData.potion = nil
    combatUserData.inventory_weapon_id = nil
    combatUserData.inventory_armor_id = nil

    -- recalculate stats for damage and defense, in case item has 0 health
    local baseStats = helpers.CalculateUserBaseStats(userData)

    local weapon_item_id = ""
    local armor_item_id = ""

    for _, item in ipairs(inventoryItems as {InventoryItem}) do
        -- print("item.item_type " .. item.item_type.. " " .. item.item_id .. " " .. tostring(item.equipped))

        if item.item_type == 'POTION' then
            local potion_id = item.item_id as PotionIds
            local potionData = constants.POTIONS[potion_id]
            combatUserData.potion = {
                id = item.id,
                item_id = item.item_id,
                health = potionData.health
            }
        
        elseif item.item_type == 'ARMOR' and tostring(item.equipped) == "1" and item.item_health > 0 then
            combatUserData.inventory_armor_id = tostring(item.id)
            armor_item_id=item.item_id
            local armorData = constants.ARMORS[item.item_id as ArmorIds]
            baseStats.defense = baseStats.defense + armorData.defense
        elseif item.item_type == 'WEAPON' and tostring(item.equipped) == "1" and item.item_health > 0 then
            combatUserData.inventory_weapon_id = tostring(item.id)
            weapon_item_id=item.item_id
            local weaponData = constants.WEAPONS[item.item_id as WeaponIds]
            baseStats.damage = baseStats.damage + weaponData.damage
        end
    end

    combatUserData.defense = baseStats.defense
    combatUserData.damage = baseStats.damage

    -- if armor or weapon is equipped, decrement item_health by 1
    if combatUserData.inventory_armor_id and combatUserData.inventory_armor_id ~= "MAGIC_ROBE" and armor_item_id ~= "MAGIC_ROBE"  then
        dbAdmin:exec(string.format([[
            UPDATE Inventory SET item_health = item_health - 1 WHERE id = %s;
        ]], combatUserData.inventory_armor_id))
    end
    
    if combatUserData.inventory_weapon_id and combatUserData.inventory_weapon_id ~= "WAND" and weapon_item_id ~= "WAND" then
        dbAdmin:exec(string.format([[
            UPDATE Inventory SET item_health = item_health - 1 WHERE id = %s;
        ]], combatUserData.inventory_weapon_id))
    end
    
    -- if potion then
    --     local potion_id = potion.item_id as PotionIds
    --     local item = constants.POTIONS[potion_id]
    --     local health = item.health

    --     combatUserData.potion = {
    --         id = potion.id,
    --         item_id = potion.item_id,
    --         health = health
    --     }
    -- end

    -- local enemies = constants.ENEMY_PER_LEVEL[combat_level]
    local function getRandomEnemyIndex(level: integer): integer
        local enemy_index: integer;
        if level <= 27 then
            -- Easy: enemies 1-5
            enemy_index = math.random(1, 5)
        elseif level <= 54 then
            -- Medium: enemies 6-9
            enemy_index = math.random(6, 9)
        elseif level <= 63 then
            -- Hard: enemies 10-12
            enemy_index = math.random(10, 12)
        else
            -- Hard enemies including the Boss (enemy 13)
            enemy_index = math.random(10, 13)
        end
        return enemy_index
    end

    local function getRandomSpecialEnemy(user: UserData, level: integer): EnemyData | nil
        -- 10% chance to get a Leperchaun enemy
        if ((level > 18 and level < 28) or (level > 45 and level < 55)) and math.random(1, 10) == 1 then
            return constants.SPECIAL_ENEMIES["LEPERCHAUN"]
        end
        -- 5% chance to get a dumz maxi
        if (level > 72 and level < 82) and math.random(1, 20) == 1 then
            return constants.SPECIAL_ENEMIES["DUMZ"]
        end
        
        if ((level > 18 and level < 28) or (level > 45 and level < 55)) and user.nft_address and user.special_item_key > -1 and user.special_item_key < 3 then
            -- 20% chance to get a shiba enemy
            if math.random(1, 5) == 1 then
                return constants.SPECIAL_ENEMIES["SHIBA"]
            end
        end
        if (level > 45 and level < 55) and user.nft_address and user.special_item_thread > -1 and user.special_item_thread < 8 then
            -- 20% chance to get a mouse enemy
            if math.random(1, 5) == 1 then
                return constants.SPECIAL_ENEMIES["MOUSE"]
            end
        end
        if (level > 45 and level < 55) and user.nft_address and user.special_item_bark > -1 and user.special_item_bark < 6 then
            -- 20% chance to get a heart enemy
            if math.random(1, 5) == 1 then
                return constants.SPECIAL_ENEMIES["TREE"]
            end
        end
        if (level > 63 and level < 82) and user.nft_address and user.special_item_heart > -1 and user.special_item_heart < 4 then
            -- 20% chance to get a heart enemy
            if math.random(1, 5) == 1 then
                return constants.SPECIAL_ENEMIES["PEACOCK"]
            end
        end

        -- 1% chance to get a black swan enemy
        if (level > 72 and level < 82) and math.random(1, 100) == 1 then
            return constants.SPECIAL_ENEMIES["BLACK_SWAN"]
        end
        return nil
    end
     
    local enemies = {constants.ENEMIES[getRandomEnemyIndex(combat_level)]}
    -- local doubleEnemies = {6,7,8,14,15,16,17,23,24,25}
    -- add special enemies
    local special_enemy = getRandomSpecialEnemy(userData, combat_level)
    if special_enemy then
        table.insert(enemies, special_enemy)

    -- if utils.includes(combat_level, doubleEnemies) then
    elseif (combat_level >= 18 and combat_level <= 27) or (combat_level >= 45 and combat_level <= 54) or (combat_level >= 72) then
        -- double the enemies randomly, if no special enemy
        if #enemies ~= 2 and math.random(1, 2) == 1 then
            table.insert(enemies, constants.ENEMIES[getRandomEnemyIndex(combat_level)])
        end
    end

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
        UPDATE Users SET current_battle_id = %d, stamina = stamina - 1, last_regenerate_time = %f WHERE id = %f;
    ]], battle_id, msg.Timestamp, user_id))
end

local function playerWonHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local level = tonumber(msg.Tags.Level)
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

    -- update Users table with health, stamina, gold_balance, dumz_balance
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = %d, health = %f, gold_balance = %f, dumz_balance = %f,
        special_item_kitten = %d, special_item_key = %d, special_item_thread = %d, special_item_bark = %d, special_item_heart = %d
        WHERE id = %f;
    ]], level, playerData.health, playerData.gold_balance, playerData.dumz_balance,
    playerData.special_item_kitten,
    playerData.special_item_key,
    playerData.special_item_thread,
    playerData.special_item_bark,
    playerData.special_item_heart,
    user_id))

    removeUsedPotion(playerData,user_id)
end

local function playerRanAwayHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

    -- update Users table with health, stamina, gold_balance, dumz_balance
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, 
        health = %f, gold_balance = %f, dumz_balance = %f,
        special_item_kitten = %d, special_item_key = %d, special_item_thread = %d, special_item_bark = %d, special_item_heart = %d
        WHERE id = %f;
    ]], 
    playerData.health, playerData.gold_balance, playerData.dumz_balance,
    playerData.special_item_kitten,
    playerData.special_item_key,
    playerData.special_item_thread,
    playerData.special_item_bark,
    playerData.special_item_heart,
    user_id))

    removeUsedPotion(playerData,user_id)
end

local function playerPerishedHandler(msg: Message)
    assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
    local user_id = msg.Tags.UserId
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

    -- update Users table
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = 0, health = 0, stamina = 0, gold_balance = 0, dumz_balance = 0, last_regenerate_time = %f WHERE id = %f;
    ]], msg.Timestamp, user_id))

    removeUsedPotion(playerData,user_id)
end

-- Add handlers
Handlers.add("Combat.EnterNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'), enterNewCombatHandler)
Handlers.add("Combat.EnteredNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnteredNewCombat'), enteredNewCombatHandler)
Handlers.add("Combat.PlayerWon", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerWon'), playerWonHandler)
Handlers.add("Combat.PlayerRanAway", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerRanAway'), playerRanAwayHandler)
Handlers.add("Combat.PlayerPerished", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerPerished'), playerPerishedHandler)

return {}