require('utils.globals')
local helpers = require("game.helpers")
local json = require("json")
local utils = require("utils.utils.tl-utils")
local constants = require("utils.constants")


global subProcesses: {string:number}
if not subProcesses then
    subProcesses = {
        ["RKmxozEoTs8aCES_ptQQh5U-N9xUD03D6ehVjlCxgQ8"]=0,
        ["az0JoqhwyXh07WBv_sbg4AkBmQoAxQ63haPsGnBh1SQ"]=0,
        ["sWi_nf6QGU-3gyLs2I7jRrWjmXGoy56gFJCn3tJP4n4"]=0,
        ["z0wbZelnj4JOA53hNZ4QicfQt6NpmLy4lXWFMrPew2E"]=0,
        ["s-tC1AQ9zpdFI6IYhOeEAg0-FuYVkSTiKsg2-AmqLuM"]=0,
    }
end

local record DataRelatingSubProcessAssignToUser
    user_id: number
    level: number
    subProcess: string
    timestamp: integer
end

global subProcessAssignToUsers: {number:DataRelatingSubProcessAssignToUser}
if not subProcessAssignToUsers then
    subProcessAssignToUsers = {}
end

local function assignSubProcessToUser(user_id:number, level: number, timestamp: integer) : string

    if subProcessAssignToUsers then
        -- Cleanup old process assignments (remove if more than 5:30 minutes old)
        for user, assignProcessData in pairs(subProcessAssignToUsers) do
            if (assignProcessData.timestamp + 330000) < timestamp then
                dbAdmin:exec(string.format([[UPDATE Users SET current_battle_id = NULL where id = %f]], user))
                subProcessAssignToUsers[user] = nil
            end
        end 
    end

    if subProcessAssignToUsers[user_id] ~= nil then
        return subProcessAssignToUsers[user_id].subProcess
    end

    if subProcessAssignToUsers then
        -- Try reusing an existing process at the same level (must be within the last 1 minute)
        for _, assignProcessData in pairs(subProcessAssignToUsers) do
            if assignProcessData.level == level and assignProcessData.user_id ~= user_id and (timestamp - assignProcessData.timestamp) <= 60000 then  -- Must be from last 1 minute
                subProcessAssignToUsers[user_id] = {
                    user_id = user_id,
                    level = level,
                    subProcess = assignProcessData.subProcess,
                    timestamp = timestamp  -- Set the new timestamp for this user
                }            
                return assignProcessData.subProcess
            end
        end 
    end
    

    local minValue = math.huge  -- Set initial minimum to a large value
    local minKey : string | nil = nil  -- Variable to store the key with the smallest value

    -- Loop through the subProcesses table to find the key with the smallest value
    for key, value in pairs(subProcesses) do
        if value < minValue then
            minValue = value
            minKey = key
        end
    end

    -- Assign the user to the subprocess with the smallest value
    if minKey then
        -- subProcessAssignToUsers[user_id].subProcess = minKey
        subProcessAssignToUsers[user_id]={
            user_id = user_id,
            level = level,
            subProcess = minKey,
            timestamp = timestamp 
        }            
        -- Optionally, increment the value for the assigned subprocess
        subProcesses[minKey] = subProcesses[minKey] + 1
    end
  return subProcessAssignToUsers[user_id].subProcess
end


local function removeUsedPotion(playerData: CombatUserData, userId: string)

    local user_data = dbAdmin:exec(string.format([[SELECT * FROM Users where id = %f;]], userId)) [1] as UserData

    if playerData.special_item_heart == 4  and user_data.special_item_heart ~= 4 and playerData.has_collected_all_hearts == true then
        playerData.total_health = playerData.total_health + 1
        -- ao.send({Target="_-h1jIlG-9BotgyC9CoikKrU0JbS5Pf8yBr6Nhm1YDA",Action="Quest.ShopHeartQuest",UserId=tostring(Battles[battle_id].players[attacker_id].id),UserAddress=Battles[battle_id].players[attacker_id].address,TotalHeart=tostring(Battles[battle_id].players[attacker_id].special_item_heart)})
       
        dbAdmin:exec(string.format([[
            UPDATE Users SET total_health = %f WHERE id = %f;
        ]], playerData.total_health, userId))
    end

    if playerData.special_item_kitten == 1  and user_data.special_item_kitten ~= 1 and playerData.has_collected_kitten == true then
        playerData.gold_balance = playerData.gold_balance + 10000

        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %d WHERE id = %f;
        ]], playerData.gold_balance, userId))
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
    local overwrite_the_battle_on_same_spot = msg.Tags.OverWriteTheBattleOnSameSpot
    assert(type(combat_level) == "number", "Level is required")
    assert(type(combat_level) == "number" and math.floor(combat_level) == combat_level, "Combat level must be an integer")

    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    local current_spot = userData.current_spot

    if overwrite_the_battle_on_same_spot == "yes" and userData.current_battle_id then
        local assignSubProcessData = subProcessAssignToUsers[user_id]
        -- local player_battle_id = dbAdmin:exec(string.format([[SELECT current_battle_id from Users WHERE id = %d]], user_id)) [1]
        ao.send({Target= assignSubProcessData.subProcess, Action="Battle.ForceDeleteBattle", BattleId= tostring(userData.current_battle_id)})
        subProcessAssignToUsers[user_id] = nil
        dbAdmin:exec(string.format([[UPDATE Users SET current_battle_id = NULL WHERE id = %d]], user_id)) 
        print("Overwrite")
    else
        assert(combat_level > current_spot, "Battle is complete for this spot")
    end
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
        -- elseif level <= 63 then
        --     -- Hard enemies (10-13) (13->Goat)
        --     enemy_index = math.random(10, 12)
        else
            -- Hard enemies (10-13) (13->Goat)
            enemy_index = math.random(10, 13)
            -- if enemy_index == 13 then
            --     enemy_index = math.random(1, 10) == 10 and 13 or math.random(10, 12)
            -- end
        end
        return enemy_index
    end

    local function getRandomSpecialEnemy(user: UserData, level: integer): EnemyData | nil
        -- 10% chance to get a Leperchaun enemy
        if (level > 45 and level < 55) and math.random(1, 10) == 1 then
            return constants.SPECIAL_ENEMIES["LEPERCHAUN"]
        end
        -- 5% chance to get a dumz maxi
        if (level > 72 and level < 82) and math.random(1, 20) == 1 and user.special_item_kitten > -1 and user.special_item_kitten < 1 then
            return constants.SPECIAL_ENEMIES["DUMZ"]
        end
        
        if (level > 45 and level < 55) and user.nft_address and user.special_item_key > -1 and user.special_item_key < 3 then
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

            -- 10% chance to get Agent Trunk enemy at high levels
        if (level > 63 and level < 82) and math.random(1, 10) == 1 then
            return constants.SPECIAL_ENEMIES["AGENT_TRUNK"]
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
    local special_enemy: EnemyData | nil = getRandomSpecialEnemy(userData, combat_level)

    if special_enemy then

        if (special_enemy as EnemyData).id == "AGENT_TRUNK" and math.random(1, 3) == 1 then
            table.insert(enemies, special_enemy)   
        else
            enemies = {special_enemy} -- Replace with only Agent Trunk
        end

    -- if utils.includes(combat_level, doubleEnemies) then
    elseif (combat_level >= 18 and combat_level <= 27) or (combat_level >= 45 and combat_level <= 54) or (combat_level >= 72) then
        -- double the enemies randomly, if no special enemy
        if #enemies ~= 2 and math.random(1, 2) == 1 then
            table.insert(enemies, constants.ENEMIES[getRandomEnemyIndex(combat_level)])
        end
    end

    assert(enemies, "No enemies found for combat level: " .. combat_level)

     local subProcess = assignSubProcessToUser(user_id, combat_level, msg.Timestamp) 
     local userAddress = dbAdmin:exec(string.format([[
        SELECT address FROM Users WHERE id = %f;
    ]], user_id))

    -- print("Ashu2MIt-" .. tostring(userAddress[1].address))
    
    if type(userAddress[1].address) == "string" then
        local data=json.encode({subprocess=subProcess})
    ao.send({Target=tostring(userAddress[1].address), Data=data})
    end

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(user_id, user_data)
    ao.send({
        Target = subProcess,
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
    -- assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
  local found = false
    for key, _ in pairs(subProcesses) do
        if key == msg.From then
            found = true
            break 
        end
    end

    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

    local user_id = msg.Tags.UserId
    local battle_id = tonumber(msg.Tags.BattleId)
    local level = tonumber(msg.Tags.Level)
    assert(battle_id, "BattleId is required")
    assert(level, "Level is required")

    -- update Users table with battle_id 
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = %d, stamina = stamina - 1, last_regenerate_time = %f WHERE id = %f;
    ]], battle_id, msg.Timestamp, user_id))
    
    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(user_id), user_data)
    -- local userAddress = dbAdmin:exec(string.format([[
    --     SELECT address FROM Users WHERE id = %f;
    -- ]], user_id))

    -- print("Ashu" .. tostring(userAddress[1].address))
    
    -- if type(userAddress[1].address) == "string" then
    --     local data=json.encode({subprocess=msg.From})
    -- ao.send({Target=tostring(userAddress[1].address), Data=data})
    -- end
end

local function playerWonHandler(msg: Message)
    -- assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
  local found = false
    for key, _ in pairs(subProcesses) do
        if key == msg.From then
            found = true
            break 
        end
    end

    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

    local user_id = tonumber(msg.Tags.UserId)
    local level = tonumber(msg.Tags.Level)
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData
    local number_of_enemies: number = tonumber(msg.Tags.NumberOfEnemies)
    local number_of_players: number = tonumber(msg.Tags.NumberOfPlayers) or 0
    local gold_win_in_pvp: number = tonumber(msg.Tags.GoldWinInPvP)
    local dumz_win_in_pvp: number = tonumber(msg.Tags.DumzWinInPvP)
    

    -- processPlayerData(tonumber(user_id), playerData, true, number_of_enemies)
    -- local leaderboard = processPlayerData(tonumber(user_id), playerData, true, number_of_enemies) as Leaderboard

    -- ao.send({Target = constants.RECORD_PROCESS_ID,Action = "Record.insertOrUpdateDataInLeaderBorad", Data = json.encode(leaderboard), UserId = tostring(user_id)})

    local UserLeaderboardData = dbAdmin:exec(string.format([[
             SELECT * from Leaderboard WHERE user_id = %d;
        ]], user_id))

    local playerOriginalData = dbAdmin:exec(string.format([[
            SELECT * from Users WHERE id = %f;
        ]], user_id))[1] as UserData 

      if #UserLeaderboardData == 0 then
        dbAdmin:exec(string.format([[
                INSERT INTO Leaderboard (user_id, name, nft_address, address ) VALUES (%d, "%s", %s, "%s");
           ]], user_id, playerOriginalData.name, playerOriginalData.nft_address and string.format("'%s'", playerOriginalData.nft_address) or "NULL", playerOriginalData.address))
    end 
    
    if number_of_players > 1 then
      dbAdmin:exec(string.format([[
            UPDATE Leaderboard SET gold_earned = gold_earned + %d, battle_win = battle_win + 1, enemy_killed = enemy_killed + %d, death_streak = death_streak + 1, gold_win_in_pvp = gold_win_in_pvp + %d, dumz_win_in_pvp = dumz_win_in_pvp + %d, pvp_wins = pvp_wins + 1 WHERE user_id = %d ;
        ]], playerData.gold_balance - playerOriginalData.gold_balance, number_of_enemies , gold_win_in_pvp - playerOriginalData.gold_balance, dumz_win_in_pvp - playerOriginalData.dumz_balance, user_id))
    else
        dbAdmin:exec(string.format([[
            UPDATE Leaderboard SET gold_earned = gold_earned + %d, battle_win = battle_win + 1, enemy_killed = enemy_killed + %d, death_streak = death_streak + 1 WHERE user_id = %d ;
        ]], playerData.gold_balance - playerOriginalData.gold_balance, number_of_enemies ,user_id))
    end

    -- update Users table with health, stamina, gold_balance, dumz_balance
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = %d, health = %f, gold_balance = %f, dumz_balance = %f, trunk_balance = %f, total_trunk_token = %f,
        special_item_kitten = %d, special_item_key = %d, special_item_thread = %d, special_item_bark = %d, special_item_heart = %d
        WHERE id = %f;
    ]], level, playerData.health, playerData.gold_balance, playerData.dumz_balance, playerData.trunk_balance or 0.0, playerData.total_trunk_token,
    playerData.special_item_kitten,
    playerData.special_item_key,
    playerData.special_item_thread,
    playerData.special_item_bark,
    playerData.special_item_heart,
    user_id))
    
    removeUsedPotion(playerData,tostring(user_id))
    local subProcessAssigned =  subProcessAssignToUsers[user_id].subProcess
    subProcesses[subProcessAssigned]= subProcesses[subProcessAssigned] - 1
    if subProcesses[subProcessAssigned] < 0 then
        subProcesses[subProcessAssigned]= 0
    end
    subProcessAssignToUsers[user_id]=nil

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(user_id, user_data)
end

local function playerRanAwayHandler(msg: Message)
   -- assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
  local found = false
    for key, _ in pairs(subProcesses) do
        if key == msg.From then
            found = true
            break 
        end
    end

    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

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
    local USER_ID = tonumber(user_id)
    local subProcessAssigned =  subProcessAssignToUsers[USER_ID].subProcess
    subProcesses[subProcessAssigned]= subProcesses[subProcessAssigned] - 1
    if subProcesses[subProcessAssigned] < 0 then
        subProcesses[subProcessAssigned]= 0
    end
    subProcessAssignToUsers[USER_ID]=nil

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(user_id), user_data)
end

local function playerPerishedHandler(msg: Message)
  --  assert(msg.From == constants.COMBAT_PROCESS_ID, "Only Combat process can send this message")
  local found = false
    for key, _ in pairs(subProcesses) do
        if key == msg.From then
            found = true
            break 
        end
    end

    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

    local user_id = tonumber(msg.Tags.UserId)
    local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData

--     local playerOrginalData = dbAdmin:exec(string.format([[
--         SELECT * from Users WHERE id = %f;
--      ]], user_id))[1]

--      local leaderboard = {
--         gold_lost: integer = (playerOrginalData.gold_balance as integer),
--         token_lost: integer = (playerOrginalData.dumz_balance as integer),
-- battle_lost: integer = 1,
-- player_death: integer = 1 ,
-- -- pvp
-- -- number_of_token_burn
-- death_streak: integer = 0,
-- death_streak_ende: boolean= true,
-- player_with_nft: integer= 0,
-- -- player_without nft 
--     }
 
--      local numberOfNFTsID = dbAdmin:exec(string.format([[
--         SELECT * from Users WHERE address = %s;
--      ]], playerOrginalData.address))

--      local hasNFT = isNestedTableNotEmpty(numberOfNFTsID)

--      if hasNFT then
--         leaderboard.player_with_nft = #numberOfNFTsID 
--      end
    
    -- local leaderboard = processPlayerData(tonumber(user_id), playerData, true)

    -- local leaderboardJson = json.encode(leaderboard)

    -- ao.send({Target = constants.RECORD_PROCESS_ID, Action = "Record.insertOrUpdateDataInLeaderBorad", UserId = tostring(user_id), Data = leaderboardJson})

    -- processPlayerData(tonumber(user_id), playerData, false) 
    -- local leaderboard = processPlayerData(tonumber(user_id), playerData, false) as Leaderboard

    -- ao.send({Target = constants.RECORD_PROCESS_ID,Action = "Record.insertOrUpdateDataInLeaderBorad", Data = json.encode(leaderboard), UserId = tostring(user_id)})

    local UserLeaderboardData = dbAdmin:exec(string.format([[
           SELECT * from Leaderboard WHERE user_id = %d;
        ]], user_id))

    local playerOriginalData = dbAdmin:exec(string.format([[
            SELECT * from Users WHERE id = %f;
        ]], user_id))[1] as UserData 

    if #UserLeaderboardData == 0 then
            dbAdmin:exec(string.format([[
                INSERT INTO Leaderboard (user_id, name, nft_address, address ) VALUES (%d, "%s", %s, "%s");
             ]], user_id, playerOriginalData.name, playerOriginalData.nft_address and string.format("'%s'", playerOriginalData.nft_address) or "NULL", playerOriginalData.address))
    end 

    dbAdmin:exec(string.format([[
            UPDATE Leaderboard SET gold_lost = gold_lost + %d, dumz_lost = dumz_lost + %d, battle_lost = battle_lost + 1, player_death = player_death + 1, death_streak = 0 WHERE user_id = %d ;
        ]],  playerOriginalData.gold_balance, playerOriginalData.dumz_balance, user_id))
     
    -- update Users table
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL, current_spot = 0, health = 0, stamina = 0, gold_balance = 0, dumz_balance = 0, last_regenerate_time = %f WHERE id = %f;
    ]], msg.Timestamp, user_id))

    removeUsedPotion(playerData,tostring(user_id))
    -- local USER_ID = tonumber(user_id)
    local subProcessAssigned =  subProcessAssignToUsers[user_id].subProcess
    subProcesses[subProcessAssigned]= subProcesses[subProcessAssigned] - 1
    if subProcesses[subProcessAssigned] < 0 then
        subProcesses[subProcessAssigned]= 0
    end
    subProcessAssignToUsers[user_id]=nil

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(user_id, user_data)
end

local function removePlayerFromBattleHandler(msg: Message)
    local found = false
    for key, _ in pairs(subProcesses) do
        if key == msg.From then
            found = true
            break 
        end
    end

    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

    local user_id = tonumber(msg.Tags.UserId)
    -- local playerData: CombatUserData = json.decode(msg.Data) as CombatUserData


    dbAdmin:exec(string.format([[
        UPDATE Users SET current_battle_id = NULL WHERE id = %f;
    ]], user_id))

    local USER_ID = tonumber(user_id)
    -- local subProcessAssigned =  subProcessAssignToUsers[USER_ID]
    -- subProcesses[subProcessAssigned]= subProcesses[subProcessAssigned] - 1
    subProcessAssignToUsers[USER_ID]=nil

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(user_id), user_data)

end

local function resetSubprocessesHandler(msg:Message)
   assert(msg.From==ao.id,"You can not call this handler")
   print("Starttt")
   subProcesses = {
    ["RKmxozEoTs8aCES_ptQQh5U-N9xUD03D6ehVjlCxgQ8"]=0,
    ["az0JoqhwyXh07WBv_sbg4AkBmQoAxQ63haPsGnBh1SQ"]=0,
    ["sWi_nf6QGU-3gyLs2I7jRrWjmXGoy56gFJCn3tJP4n4"]=0,
    ["z0wbZelnj4JOA53hNZ4QicfQt6NpmLy4lXWFMrPew2E"]=0,
    ["s-tC1AQ9zpdFI6IYhOeEAg0-FuYVkSTiKsg2-AmqLuM"]=0,
   }
   print("Endddd")

end

-- Add handlers
Handlers.add("Combat.EnterNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'), enterNewCombatHandler)
Handlers.add("Combat.EnteredNewCombat", Handlers.utils.hasMatchingTag('Action', 'Combat.EnteredNewCombat'), enteredNewCombatHandler)
Handlers.add("Combat.PlayerWon", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerWon'), playerWonHandler)
Handlers.add("Combat.PlayerRanAway", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerRanAway'), playerRanAwayHandler)
Handlers.add("Combat.PlayerPerished", Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerPerished'), playerPerishedHandler)
Handlers.add("Combat.RemovePlayerFromBattle", Handlers.utils.hasMatchingTag('Action', 'Combat.RemovePlayerFromBattle'), removePlayerFromBattleHandler)
Handlers.add("Combat.ResetSubprocesses", Handlers.utils.hasMatchingTag('Action', 'Combat.ResetSubprocesses'), resetSubprocessesHandler)

return {}
