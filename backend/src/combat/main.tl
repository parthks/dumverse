-- cron10sec - tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE


local utils = require("utils.utils.tl-utils")
local json = require("json")

require("combat.globals")
local combat_helper = require("combat.combat_helper")
local PlayerAttacksNPC = combat_helper.PlayerAttacksNPC
local NPCAttacksPlayer = combat_helper.NPCAttacksPlayer
local PlayerAttacksPlayer = combat_helper.PlayerAttacksPlayer
local NPCAttacksNPC = combat_helper.NPCAttacksNPC

local BattleHelpers = require("combat.battle_helpers")

-- TODO: Distribute earnings after ending battle. Also if one player dies mid battle, the other player should get the earnings


local function GetOpenBattlesOfUser(user_address: string): {Battle}
    local battles = {}
    for _, battle in pairs(Battles) do
        if not battle.ended then
            local user_addresses = {}
            -- get all player addresses in open battle
            for _, player in pairs(battle.players) do
                table.insert(user_addresses, player.address)
            end
            if not battle.ended and utils.includes(user_address, user_addresses) then
                print("battle " .. battle.id .. " is open for user " .. user_address)
                table.insert(battles, battle)
            end
        end
    end
    return battles
end

local function VerifyUserInBattle(user_id: string, battle_id: integer): CombatUserData
    assert(user_id, "UserId is required")
    assert(battle_id, "BattleId is required")
    local battle = BattleHelpers.get(battle_id)
    assert(battle, "Battle not found")
    for _, player in pairs(battle.players) do
        if tostring(player.id) == tostring(user_id) then
            return player
        end
    end
    assert(false, "User not in battle")
end

local function VerifyBattleIsOnGoing(battle_id: integer): Battle
    local battle = BattleHelpers.get(battle_id)
    assert(battle, "Battle not found")
    assert(not battle.ended, "Battle already ended")
    return battle
end

local function NPCAttack(npc_id: string, battle_id: integer, timestamp: integer, player_id_tried_running: string | nil)
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].last_npc_attack_timestamp[npc_id] = timestamp
    BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack", "Started NPCAttack. Updated NPC ".. npc_id .. " last attack time to "..timestamp)

    -- filter out attacking npc_id from npcs_alive
    local npcs_alive = utils.filter(function(val: string): boolean
        return val ~= npc_id
    end, Battles[battle_id].npcs_alive)

    -- pick random npc to attack
    local random_npc_id: string | nil = nil
    if #npcs_alive > 0 then
        random_npc_id = npcs_alive[math.random(#npcs_alive)]
    end

    -- pick random player to attack
    local alive_players = Battles[battle_id].players_alive
    local player_id = player_id_tried_running or alive_players[math.random(#alive_players)]

    -- 15 % chance to attack a random npc
    local npcShouldAttackNPC = random_npc_id ~= nil and math.random() < 0.15 and player_id_tried_running == nil

    -- Log random target selection
    BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack - target selection", 
        "Random NPC target: " .. (random_npc_id or "none") .. 
        ", Player target: " .. player_id .. 
        ", NPC should attack NPC: " .. tostring(npcShouldAttackNPC))

    if (npcShouldAttackNPC) then
        print("NPC " .. npc_id .. " attacking NPC " .. random_npc_id)
        BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack - attacking", "NPC " .. npc_id .. " attacking NPC " .. random_npc_id..". Defending NPC health is: ".. Battles[battle_id].npcs[random_npc_id].health)
        local log, defender_health, _ = NPCAttacksNPC(Battles[battle_id].npcs[npc_id], Battles[battle_id].npcs[random_npc_id], timestamp)
        BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack - attacking finished", "Defending NPC " .. random_npc_id .. " health reduced from ".. Battles[battle_id].npcs[random_npc_id].health .." to "..defender_health)
        Battles[battle_id].npcs[random_npc_id].health = defender_health

        -- battle.npcs[random_npc_id].health = defender_health
        BattleHelpers.addLogs(Battles[battle_id].id, log)
        if defender_health <= 0 then
            -- remove npc from battle
            BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack", "NPC ".. random_npc_id .. " died.")
            BattleHelpers.killNPC(battle_id, random_npc_id, npc_id, timestamp)
        end
    else 
        -- print("NPC " .. npc_id .. " attacking player " .. player_id)
        BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack - attacking", "NPC " .. npc_id .. " attacking Player " .. player_id..". Defending player health is: ".. Battles[battle_id].players[player_id].health ..", with defense: ".. Battles[battle_id].players[player_id].defense)
        local log, defender_health, defender_defense = NPCAttacksPlayer(Battles[battle_id].npcs[npc_id], Battles[battle_id].players[player_id], timestamp, player_id_tried_running ~= nil)
        BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack - attacking finished", "Defending Player " .. player_id.." health reduced from ".. Battles[battle_id].players[player_id].health .." to ".. defender_health .." and defense reduced from ".. Battles[battle_id].players[player_id].defense .. " to ".. defender_defense)
        Battles[battle_id].players[player_id].defense = defender_defense
        Battles[battle_id].players[player_id].health = defender_health
        
        BattleHelpers.addLogs(battle_id, log)
        if defender_health <= 0 then
            -- remove player from battle
            BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack", "Player ".. player_id .. " died.")
            BattleHelpers.killPlayer(battle_id, player_id, npc_id, timestamp)
        end
    end
    
    -- battle.players_attacked = {} -- reset player attacked list, so that all players can attack again
    Battles[battle_id].players_attacked = {}
    BattleHelpers.internalLog(battle_id, timestamp, "NPCAttack", "Have Reset Players Attacked Table")

    BattleHelpers.checkIfBattleShouldEnd(battle_id, npc_id, timestamp)
    if Battles[battle_id].ended then
        local battle_data = BattleHelpers.get(battle_id)
        sendBatteDataToHistoryProcess(battle_id,battle_data,"no")
    -- Battles[battle_id] = nil
    end
end


local function CronTick(msg: Message,npcTimer:integer)
    CRON_TICK_COUNT = CRON_TICK_COUNT + 1
    -- need to check all ongoing battles to see if a player has not attacked in the last 10 seconds
    for _, battle in pairs(Battles) do
        -- print("Checking battle " .. battle.id)
        battle = BattleHelpers.get(battle.id)
        if not battle.ended and #battle.players_alive > 0 then
            -- print("Battle " .. battle.id .. " is ongoing")
            local npcs_alive = battle.npcs_alive
            for _, npc_id in ipairs(npcs_alive) do
                -- print("NPC " .. npc_id .. " alive")
                -- print("NPC " .. npc_id .. " last attack timestamp " .. battle.last_npc_attack_timestamp[npc_id])
                battle = BattleHelpers.get(battle.id)
                -- if battle.started then
                     if ((battle.last_npc_attack_timestamp[npc_id] or 0) + (npcTimer * 1000) < msg.Timestamp) and battle.started then
                        -- if player has not attacked in the last 10 seconds, the NPC will attack
                        print("battle " .. battle.id .. " - AUTO ATTACK: NPC " .. npc_id .. " attacking player")
                        BattleHelpers.internalLog(battle.id, msg.Timestamp, "CronTick - NPCAttack", "Last NPC Attack Timestamp: ".. battle.last_npc_attack_timestamp[npc_id]..". Seconds after last attack: ".. npcTimer..".")
                        NPCAttack(npc_id, battle.id, msg.Timestamp, nil)
                     end
                     if not battle.started then
                         battle.last_npc_attack_timestamp[npc_id]=msg.Timestamp
                     end
                -- end
            end

            -- for pvp, if no npcs are alive, if a player has not attacked in the last 10 seconds, all players should attack
            battle = BattleHelpers.get(battle.id)
            if #battle.npcs_alive == 0 then
                for _, player_id in ipairs(battle.players_alive) do
                    if not battle.last_player_attack_timestamp[player_id] or battle.last_player_attack_timestamp[player_id] + (10 * 1000) < msg.Timestamp then
                        -- if player has not attacked in the last 10 seconds, players allowed to attack
                        print("battle " .. battle.id .. " - AUTO PLAYER UNBLOCKED ATTACK: " .. player_id)
                        Battles[battle.id].players_attacked = {}
                        Battles[battle.id].last_player_attack_timestamp[player_id] = msg.Timestamp
                        
                    end
                end
                -- race condition that hangs the game
                if #battle.players_alive == 1 then
                    BattleHelpers.checkIfBattleShouldEnd(battle.id,battle.players_alive[1], msg.Timestamp)  
                end
            end

            local INACTIVITY_LIMIT = 5 * 60 * 1000
            if (battle.created_at + INACTIVITY_LIMIT) < msg.Timestamp then
                print("battle " .. battle.id .. " - ENDED DUE TO PLAYER INACTIVITY " )
                BattleHelpers.internalLog(
                    battle.id,
                    msg.Timestamp,
                    "CronTick - BattleEnded",
                    "Battle ended due to player inactivity. Last active timestamp: " .. battle.created_at
                )
                battle.ended = true
                print("Inactive Loop Start: " .. battle.id)
                for key ,_ in pairs(battle.players) do
                    print("Inactive player: " .. key)
                    print("Inactive player Address: " .. GAME_PROCESS_ID)
                    ao.send({
                        Target = GAME_PROCESS_ID,
                        UserId = tostring(key),
                        Action = "Combat.RemovePlayerFromBattle",
                    })
                    local battle_data = BattleHelpers.get(battle.id)
                    sendBatteDataToHistoryProcess(battle.id,battle_data,"yes")
                end
            end
        end
    end
end

    
local function newUserJoinHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local level_input = msg.Tags.Level
    local data = json.decode(msg.Data) as {string: string}

    print("Battle.NewUserJoin - user " .. user_id)
    print(GAME_PROCESS_ID)
    assert(msg.From == GAME_PROCESS_ID, "Only Game process can send this message")
    assert(user_id, "UserId is required")
    assert(level_input, "Combat Level is required")
    -- check if level is a integer
    assert(tonumber(level_input) as integer, "Combat Level is not a integer")
    local level = tonumber(level_input) as integer


    local battles = GetOpenBattlesOfUser(msg.From)
    if #battles > 0 then
        -- user is already in a battle
        print("user is already in a battle")
            -- ao.send({ Target = msg.From, Data = { battle = battles[1] } })
            ao.send({
                Target = GAME_PROCESS_ID,
                UserId = user_id,
                BattleId = tostring(battles[1].id),
                Action = "Combat.EnteredNewCombat",
                Data = json.encode(battles[1])
            })
            return
        end

        local player = json.decode(data.player) as CombatUserData
        local npcs = json.decode(data.npcs) as {CombatEnemyData}

        -- check lastest open battle and add user to it
        local battle = BattleHelpers.getLatestSuitableOpenBattle(player, level) as Battle

        if not battle then
            battle = BattleHelpers.new(msg.Timestamp)
            battle.level = level
            battle.npcs = {}
            battle.last_npc_attack_timestamp = {}
            for _, npc in ipairs(npcs) do
                npc.extra_gold = NPCS_EXTRA_GOLD[npc.id] or 0
                battle.npcs[npc.id] = npc
                table.insert(battle.npcs_alive, npc.id)
                battle.last_npc_attack_timestamp[npc.id] = msg.Timestamp
                NPCS_EXTRA_GOLD[npc.id] = nil
            end
            Battles[battle.id] = battle
        end
        player.added_at_timestamp = msg.Timestamp
        BattleHelpers.addPlayer(battle.id, player)
        BattleHelpers.internalLog(battle.id, msg.Timestamp, "newUserJoinHandler", "Player "..player.id .. " added to battle")
         -- send message to game process to confirm user has been added to a new battle
        local user_address = player.address
        print("adding user " .. user_address .. " to battle " .. battle.id .. "of level " .. battle.level)
        ao.send({
            Target = GAME_PROCESS_ID,
            UserId = user_id,
            BattleId = tostring(battle.id),
            Level = tostring(battle.level),
            Action = "Combat.EnteredNewCombat",
            Data = json.encode(battle)
        })
end



local function getOpenBattlesHandler(msg: Message)
    local battles = GetOpenBattlesOfUser(msg.From)
    ao.send({ Target = msg.From, Data = json.encode(battles) })
end


local function battleInfoHandler(msg: Message)
    -- local user_id = msg.Tags.UserId
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    -- VerifyUserInBattle(user_id, battle_id)
    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })
    end


local function drinkPotionHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local user_id = msg.Tags.UserId

    assert(Battles[battle_id].started==true,"Battle has not started yet")

    VerifyUserInBattle(user_id, battle_id)
    VerifyBattleIsOnGoing(battle_id)

    local potion_used = Battles[battle_id].players[user_id].potion_used
    assert(not potion_used, "Potion already used")

    local potion = Battles[battle_id].players[user_id].potion as CombatPotionData
    assert(potion ~= nil, "Potion not found")

    local set_new_health =  Battles[battle_id].players[user_id].health + potion.health

    if (set_new_health >= Battles[battle_id].players[user_id].total_health) then
        Battles[battle_id].players[user_id].health = Battles[battle_id].players[user_id].total_health
     else      
        Battles[battle_id].players[user_id].health = set_new_health
     end
    Battles[battle_id].players[user_id].potion_used = true

    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })
end


local function userAttackHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local user_id = msg.Tags.UserId
    local attackEntityId = msg.Tags.AttackEntityId

    assert(Battles[battle_id].started==true,"Battle has not started yet")

    BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler - started", 
        "Attacking User: " .. user_id .. ", Target: " .. attackEntityId)

    VerifyUserInBattle(user_id, battle_id)
    VerifyBattleIsOnGoing(battle_id)

    assert(attackEntityId, "AttackEntityId is required")

    local playerUserIds = Battles[battle_id].players_alive
    local npcIds = Battles[battle_id].npcs_alive

    -- assert that attackEntityId is in playerUserIds or npcIds - already checking in the if conditions
    -- assert(utils.includes(attackEntityId, playerUserIds) or utils.includes(attackEntityId, npcIds),
    --     "AttackEntityId is not in playerUserIds or npcIds")

    -- check if the UserId is in the players_attacked list
    -- battle = BattleHelpers.get(battle_id)
    assert(not utils.includes(user_id, Battles[battle_id].players_attacked), "Player has already attacked")
    Battles[battle_id].last_player_attack_timestamp[user_id] = msg.Timestamp

    if (utils.includes(attackEntityId, npcIds)) then
        print("Player " .. user_id .. " attacking NPC " .. attackEntityId)
        -- Player attacking NPC
        BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler - attacking", "Player " .. user_id .. " attacking NPC " .. attackEntityId..". Defending NPC health is: ".. Battles[battle_id].npcs[attackEntityId].health)
        local log, defender_health, _ = PlayerAttacksNPC(Battles[battle_id].players[user_id], Battles[battle_id].npcs[attackEntityId], msg.Timestamp)
        BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler - attacking finished", "Defending NPC " .. attackEntityId.." health reduced from ".. Battles[battle_id].npcs[attackEntityId].health .." to ".. defender_health)
        
        BattleHelpers.addLogs(battle_id, log)
        Battles[battle_id].npcs[attackEntityId].health = defender_health
        if defender_health <= 0 then
            -- remove npc from battle
            BattleHelpers.killNPC(battle_id, attackEntityId, user_id, msg.Timestamp)
        end
    elseif (utils.includes(attackEntityId, playerUserIds)) then
        print("Player " .. user_id .. " attacking Player " .. attackEntityId)
        -- Player attacking Player
        BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler - attacking", "Player " .. user_id .. " attacking Player " .. attackEntityId..". Defending player health is: ".. Battles[battle_id].players[attackEntityId].health ..", with defense: ".. Battles[battle_id].players[attackEntityId].defense)
        local log, defender_health, defender_defense = PlayerAttacksPlayer(Battles[battle_id].players[user_id], Battles[battle_id].players[attackEntityId], msg.Timestamp)
        BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler - attacking finished", "Defending Player " .. attackEntityId.." health reduced from ".. Battles[battle_id].players[attackEntityId].health .." to ".. defender_health .." and defense reduced from ".. Battles[battle_id].players[attackEntityId].defense .. " to ".. defender_defense)
        Battles[battle_id].players[attackEntityId].defense = defender_defense
        Battles[battle_id].players[attackEntityId].health = defender_health
        
        BattleHelpers.addLogs(battle_id, log)
        if defender_health <= 0 then
            -- remove player from battle
            BattleHelpers.killPlayer(battle_id, attackEntityId, user_id, msg.Timestamp)
        end
    else
        -- assert(false, "AttackEntityId is not in playerUserIds or npcIds")
        -- race condition from the UI, do nothing
        ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })

        return
    end

    table.insert(Battles[battle_id].players_attacked, user_id)

    -- cron will call this, can case race conditions...
    if #Battles[battle_id].players_attacked >= #Battles[battle_id].players_alive then -- greater than or equal to in case a player has died
        -- all players have attacked, so NPC should attack
        print("All players have attacked. NPC should attack")
        BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler", "All players have attacked. NPCs should attack")
        -- battle = BattleHelpers.get(battle_id)
        -- loop through all npcs and attack
        for _, npc_id in ipairs(Battles[battle_id].npcs_alive) do
            BattleHelpers.internalLog(battle_id, msg.Timestamp, "userAttackHandler", "Initiating NPC "..npc_id .." attack")
            NPCAttack(npc_id, battle_id, msg.Timestamp, nil)
        end
        -- reset players attacked, in case there are no npcs alive and all players have attacked
        if #Battles[battle_id].npcs_alive == 0 then
            -- players should be allowed to attack one at a time
            Battles[battle_id].players_attacked = {user_id}
        end
    end

    BattleHelpers.checkIfBattleShouldEnd(battle_id, user_id, msg.Timestamp)
    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })
    if Battles[battle_id].ended then
        local battle_data = BattleHelpers.get(battle_id)
        sendBatteDataToHistoryProcess(battle_id,battle_data,"no")
    -- Battles[battle_id] = nil
    end
end


local function userRunHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local user_id = msg.Tags.UserId

    assert(Battles[battle_id].started==true,"Battle has not started yet")

    local user = VerifyUserInBattle(user_id, battle_id)
    VerifyBattleIsOnGoing(battle_id)

    local dice_roll = math.random(1, 6)
    BattleHelpers.log(battle_id, msg.Timestamp, user_id,
        "attempts to run away")
    local isOneOfOne = utils.includes(user.nft_address, ONE_OF_ONE_ASSET_IDS)
    local runaway_successful = (isOneOfOne and dice_roll ~= 6) or dice_roll < 4
    print("runaway dice roll " .. dice_roll .. " - " .. (runaway_successful and "successful" or "unsuccessful"))

    if runaway_successful then
        -- player runs successfully
        BattleHelpers.playerRanAway(battle_id, user_id, msg.Timestamp)
        BattleHelpers.checkIfBattleShouldEnd(battle_id, nil, msg.Timestamp)
        ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })
        return
    end
    BattleHelpers.log(battle_id, msg.Timestamp, user_id,
        "runs away unsuccessfully")

    -- find random NPC and attack player
    local npc_id = Battles[battle_id].npcs_alive[math.random(#Battles[battle_id].npcs_alive)]
    local npc = Battles[battle_id].npcs[npc_id]
    -- NPC will attack critial damage to user_id
    NPCAttack(npc.id, battle_id, msg.Timestamp, user_id)

    -- player runs unsuccessfully
    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(BattleHelpers.get(battle_id)) })
    if Battles[battle_id].ended then
        local battle_data = BattleHelpers.get(battle_id)
        sendBatteDataToHistoryProcess(battle_id,battle_data,"no")
    -- Battles[battle_id] = nil
    end
end

local function userIsReadyHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    
    local battle=Battles[battle_id]
    local npcs = battle.npcs as {CombatEnemyData}
    for _, npc in ipairs(npcs) do
        battle.last_npc_attack_timestamp[npc.id] = msg.Timestamp
    end
    battle.started=true
    ao.send({Target=msg.From,Data=json.encode({hasBattleBegun=true})})
end    


-- Add handlers
Handlers.add("Battle.NewUserJoin", Handlers.utils.hasMatchingTag("Action", "Battle.NewUserJoin"), newUserJoinHandler)
Handlers.add("Battle.GetOpenBattles", Handlers.utils.hasMatchingTag("Action", "Battle.GetOpenBattles"), getOpenBattlesHandler)
Handlers.add("Battle.Info", Handlers.utils.hasMatchingTag("Action", "Battle.Info"), battleInfoHandler)
Handlers.add("Battle.DrinkPotion", Handlers.utils.hasMatchingTag("Action", "Battle.DrinkPotion"), drinkPotionHandler)
Handlers.add("Battle.UserAttack", Handlers.utils.hasMatchingTag("Action", "Battle.UserAttack"), userAttackHandler)
Handlers.add("Battle.UserRun", Handlers.utils.hasMatchingTag("Action", "Battle.UserRun"), userRunHandler)
Handlers.add("Battle.UserIsReady", Handlers.utils.hasMatchingTag("Action", "Battle.UserIsReady"), userIsReadyHandler)


-- CronTick handler will get called every 10 seconds
-- Finalize Auction Handler

-- only in case frontend is not open and no other messages are sent
-- TODO: change cron on process to like x minutes
Handlers.add("CronTick", Handlers.utils.hasMatchingTag("Action", "Cron"), function(msg: Message)
    CronTick(msg, 30)
end)

-- frontend calls Battle.Info every 2 seconds, so NPC will attack on time
Handlers.prepend("CheckNPCAttacks", 
function(): string
    return "continue"
end, function(msg: Message)
CronTick(msg, 10)

end)

return {}