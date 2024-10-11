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

local function VerifyUserInBattle(user_id: string, battle_id: integer): boolean
    assert(user_id, "UserId is required")
    assert(battle_id, "BattleId is required")
    local battle = BattleHelpers.get(battle_id)
    assert(battle, "Battle not found")
    for _, player in pairs(battle.players) do
        if tostring(player.id) == tostring(user_id) then
            return true
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

local function NPCAttack(npc_id: string, battle_id: integer, timestamp: integer, player_id_tried_running: string)
    local battle = BattleHelpers.get(battle_id)
    battle.last_npc_attack_timestamp[npc_id] = timestamp
    BattleHelpers.update(battle_id, battle)

    -- filter out attacking npc_id from npcs_alive
    local npcs_alive = utils.filter(function(val: string): boolean
        return val ~= npc_id
    end, battle.npcs_alive)
    -- pick random npc to attack
    local random_npc_id: string | nil = nil
    if #npcs_alive > 0 then
        random_npc_id = npcs_alive[math.random(#npcs_alive)]
    end

    -- pick random player to attack
    local alive_players = battle.players_alive
    local player_id = player_id_tried_running or alive_players[math.random(#alive_players)]

    -- 15 % chance to attack a random npc
    local npcShouldAttackNPC = random_npc_id ~= nil and math.random() < 1

    if (npcShouldAttackNPC) then
        print("NPC " .. npc_id .. " attacking NPC " .. random_npc_id)
        local log, defender_health, _ = NPCAttacksNPC(battle.npcs[npc_id], battle.npcs[random_npc_id], timestamp)
        battle.npcs[random_npc_id].health = defender_health
        BattleHelpers.addLogs(battle.id, log)
        if defender_health <= 0 then
            -- remove npc from battle
            BattleHelpers.killNPC(battle_id, random_npc_id, npc_id, timestamp)
        end
    else 
        print("NPC " .. npc_id .. " attacking player " .. player_id)
        local log, defender_health, defender_defense = NPCAttacksPlayer(battle.npcs[npc_id], battle.players[player_id], timestamp)
        battle.players[player_id].defense = defender_defense
        battle.players[player_id].health = defender_health
        BattleHelpers.addLogs(battle.id, log)
        if defender_health <= 0 then
            -- remove player from battle
            BattleHelpers.killPlayer(battle.id, player_id, npc_id, timestamp)
        end
    end
    
    battle.players_attacked = {} -- reset player attacked list, so that all players can attack again
    BattleHelpers.update(battle.id, battle)

    BattleHelpers.checkIfBattleShouldEnd(battle.id, npc_id, timestamp)
end


local function CronTick(msg: Message, npcTimer: integer)
    CRON_TICK_COUNT = CRON_TICK_COUNT + 1
    -- need to check all ongoing battles to see if a player has not attacked in the last 10 seconds
    for _, battle in pairs(Battles) do
        -- print("Checking battle " .. battle.id)
        if not battle.ended and #battle.players_alive > 0 then
            -- print("Battle " .. battle.id .. " is ongoing")
            local npcs_alive = battle.npcs_alive
            for _, npc_id in ipairs(npcs_alive) do
                -- print("NPC " .. npc_id .. " alive")
                -- print("NPC " .. npc_id .. " last attack timestamp " .. battle.last_npc_attack_timestamp[npc_id])
                battle = BattleHelpers.get(battle.id)
                if (battle.last_npc_attack_timestamp[npc_id] or 0) + (npcTimer * 1000) < msg.Timestamp then
                    -- if player has not attacked in the last 10 seconds, the NPC will attack
                    -- print("NPC " .. npc_id .. " attacking player")
                    NPCAttack(npc_id, battle.id, msg.Timestamp)
                end
            end

            -- for pvp, if no npcs are alive, if a player has not attacked in the last 10 seconds, all players should attack
            if #battle.npcs_alive == 0 then
                for _, player_id in ipairs(battle.players_alive) do
                    if not battle.last_player_attack_timestamp[player_id] or battle.last_player_attack_timestamp[player_id] + (10 * 1000) < msg.Timestamp then
                        -- if player has not attacked in the last 10 seconds, players allowed to attack
                        battle.players_attacked = {}
                        battle.last_player_attack_timestamp[player_id] = msg.Timestamp
                        BattleHelpers.update(battle.id, battle)
                    end
                end
            end
        end
    end
end


    
local function newUserJoinHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local level = msg.Tags.Level
    local data = json.decode(msg.Data) as {string: string}

    print("Battle.NewUserJoin - " .. msg.From .. " " .. GAME_PROCESS_ID)
    assert(msg.From == GAME_PROCESS_ID, "Only Game process can send this message")
    assert(user_id, "UserId is required")
    assert(level, "Combat Level is required")

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
        local battle = BattleHelpers.getLatestSuitableOpenBattle(player, tonumber(level)) as Battle

        if not battle then
            battle = BattleHelpers.new(msg.Timestamp)
            battle.level = tonumber(level)
            battle.npcs = {}
            battle.last_npc_attack_timestamp = {}
            for _, npc in ipairs(npcs) do
                npc.extra_gold = NPCS_EXTRA_GOLD[npc.id] or 0
                battle.npcs[npc.id] = npc
                table.insert(battle.npcs_alive, npc.id)
                battle.last_npc_attack_timestamp[npc.id] = msg.Timestamp
                NPCS_EXTRA_GOLD[npc.id] = nil
            end
            BattleHelpers.update(battle.id, battle)
        end
        player.added_at_timestamp = msg.Timestamp
        BattleHelpers.addPlayer(battle.id, player)

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
    VerifyUserInBattle(user_id, battle_id)
    local battle = VerifyBattleIsOnGoing(battle_id)

    local potion_used = battle.players[user_id].potion_used
    assert(not potion_used, "Potion already used")

    local potion = battle.players[user_id].potion as CombatPotionData
    assert(potion ~= nil, "Potion not found")
    
    battle.players[user_id].health = battle.players[user_id].health + potion.health
    battle.players[user_id].potion_used = true

    BattleHelpers.update(battle_id, battle)
    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(battle) })
end


local function userAttackHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local user_id = msg.Tags.UserId
    VerifyUserInBattle(user_id, battle_id)
    local battle = VerifyBattleIsOnGoing(battle_id)

    local attackEntityId = msg.Tags.AttackEntityId
    assert(attackEntityId, "AttackEntityId is required")

    local playerUserIds = battle.players_alive
    local npcIds = battle.npcs_alive

    -- assert that attackEntityId is in playerUserIds or npcIds - already checking in the if conditions
    -- assert(utils.includes(attackEntityId, playerUserIds) or utils.includes(attackEntityId, npcIds),
    --     "AttackEntityId is not in playerUserIds or npcIds")

    -- check if the UserId is in the players_attacked list
    battle = BattleHelpers.get(battle_id)
    assert(not utils.includes(user_id, battle.players_attacked), "Player has already attacked")
    battle.last_player_attack_timestamp[user_id] = msg.Timestamp
    BattleHelpers.update(battle_id, battle)

    if (utils.includes(attackEntityId, npcIds)) then
        print("Player " .. user_id .. " attacking NPC " .. attackEntityId)
        -- Player attacking NPC
        local log, defender_health, _ = PlayerAttacksNPC(battle.players[user_id], battle.npcs[attackEntityId], msg.Timestamp)
        BattleHelpers.addLogs(battle_id, log)
        if defender_health <= 0 then
            -- remove npc from battle
            BattleHelpers.killNPC(battle_id, attackEntityId, user_id, msg.Timestamp)
        end
    elseif (utils.includes(attackEntityId, playerUserIds)) then
        print("Player " .. user_id .. " attacking Player " .. attackEntityId)
        -- Player attacking Player
        local log, defender_health, defender_defense = PlayerAttacksPlayer(battle.players[user_id], battle.players[attackEntityId], msg.Timestamp)
        battle.players[attackEntityId].defense = defender_defense
        battle.players[attackEntityId].health = defender_health
        
        BattleHelpers.addLogs(battle_id, log)
        if defender_health <= 0 then
            -- remove player from battle
            BattleHelpers.killPlayer(battle.id, attackEntityId, user_id, msg.Timestamp)
        end
    else
        -- assert(false, "AttackEntityId is not in playerUserIds or npcIds")
        -- race condition from the UI, do nothing
        ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(battle) })
        return
    end

    table.insert(battle.players_attacked, user_id)
    BattleHelpers.update(battle_id, battle)

    if #battle.players_attacked >= #battle.players_alive then -- greater than or equal to in case a player has died
        -- all players have attacked, so NPC should attack
        print("All players have attacked. NPC should attack")
        battle = BattleHelpers.get(battle_id)
        -- loop through all npcs and attack
        for _, npc_id in ipairs(battle.npcs_alive) do
            NPCAttack(npc_id, battle.id, msg.Timestamp)
        end
        -- reset players attacked, in case there are no npcs alive and all players have attacked
        if #battle.npcs_alive == 0 then
            -- players should be allowed to attack one at a time
            battle.players_attacked = {user_id}
        end
        BattleHelpers.update(battle_id, battle)
    end

    BattleHelpers.checkIfBattleShouldEnd(battle.id, user_id, msg.Timestamp)

    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(battle) })
end


local function userRunHandler(msg: Message)
    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local user_id = msg.Tags.UserId
    VerifyUserInBattle(user_id, battle_id)
    VerifyBattleIsOnGoing(battle_id)
    local battle = BattleHelpers.get(battle_id)

    local dice_roll = math.random(1, 6)
    BattleHelpers.log(battle_id, msg.Timestamp, user_id,
        "attempts to run away")
    if dice_roll < 4 then
        -- player runs successfully
        BattleHelpers.playerRanAway(battle.id, user_id, msg.Timestamp)
        BattleHelpers.checkIfBattleShouldEnd(battle.id, nil, msg.Timestamp)
        ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(battle) })
        return
    end
    -- BattleHelpers.log(battle_id, msg.Timestamp, user_id,
    --     "runs away unsuccessfully")
    BattleHelpers.update(battle_id, battle)

    -- find random NPC and attack player
    local npc_id = battle.npcs_alive[math.random(#battle.npcs_alive)]
    local npc = battle.npcs[npc_id]
    -- NPC will attack critial damage to user_id
    NPCAttack(npc.id, battle_id, msg.Timestamp, user_id)

    -- player runs unsuccessfully
    ao.send({ Target = msg.From, Action = "Battle.Data", Data = json.encode(battle) })
end


-- Add handlers
Handlers.add("Battle.NewUserJoin", Handlers.utils.hasMatchingTag("Action", "Battle.NewUserJoin"), newUserJoinHandler)
Handlers.add("Battle.GetOpenBattles", Handlers.utils.hasMatchingTag("Action", "Battle.GetOpenBattles"), getOpenBattlesHandler)
Handlers.add("Battle.Info", Handlers.utils.hasMatchingTag("Action", "Battle.Info"), battleInfoHandler)
Handlers.add("Battle.DrinkPotion", Handlers.utils.hasMatchingTag("Action", "Battle.DrinkPotion"), drinkPotionHandler)
Handlers.add("Battle.UserAttack", Handlers.utils.hasMatchingTag("Action", "Battle.UserAttack"), userAttackHandler)
Handlers.add("Battle.UserRun", Handlers.utils.hasMatchingTag("Action", "Battle.UserRun"), userRunHandler)

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