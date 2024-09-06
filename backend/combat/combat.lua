local utils = require(".utils")

local combat_helper = require("combat.combat_helper")
local SimulateCombat = combat_helper.SimulateCombat

-- TODO: Distribute earnings after ending battle. Also if one player dies mid battle, the other player should get the earnings

count = count or 0
-- CronTick handler will get called every 10 seconds
Handlers.add("CronTick",
    Handlers.utils.hasMatchingTag("Action", "Cron"), -- handler pattern to identify cron message
    function(msg)
        count = count + 1
        -- need to check all ongoing battles to see if a player has not attacked in the last 30 seconds
        for _, battle in pairs(Battles) do
            if not battle.ended then
                local npcs_alive = battle.npcs_alive
                for npc_id, _ in pairs(npcs_alive) do
                    if battle.last_npc_attack_timestamp[npc_id] + (30 * 1000) < msg.Timestamp then
                        -- if player has not attacked in the last 30 seconds, the NPC will attack
                        NPCAttack(npc_id, battle.id, msg.Timestamp)
                    end
                end
            end
        end
        return { Count = count }
    end
)

MAX_PLAYERS_IN_BATTLE = 2

Battles = {} -- table of battles with id as key and battle as value

Handlers.add("Battle.NewUserJoin",
    Handlers.utils.hasMatchingTag("Action", "Battle.NewUserJoin"), -- handler pattern to identify cron message
    function(msg)
        assert(msg.UserId, "UserId is required")
        assert(msg.Player, "Player is required")

        -- check lastest open battle and add user to it
        local battle = Battles.getLatestOpenBattle()
        if not battle then
            battle = Battles.new(msg.Timestamp)
        end
        Battles.addPlayer(battle.id, msg.Player)
        return { Battle = battle }
    end
)

Handlers.add("Battle.Info",
    Handlers.utils.hasMatchingTag("Action", "Battle.Info"),
    function(msg)
        VerifyUserInBattle(msg.UserId, msg.BattleId)
        ao.send({ Targets = msg.From, Data = Battles.get(msg.BattleId) })
    end
)

Handlers.add("Battle.UserAttack",
    Handlers.utils.hasMatchingTag("Action", "Battle.UserAttack"),
    function(msg)
        VerifyUserInBattle(msg.UserId, msg.BattleId)
        VerifyBattleIsOnGoing(msg.BattleId)
        local attackEntityId = msg.AttackEntityId
        assert(attackEntityId, "AttackEntityId is required")

        local playerUserIds = Battles.getAlivePlayerUserIds(msg.BattleId)
        local npcIds = Battles.getAliveNPCIds(msg.BattleId)
        -- assert that attackEntityId is in playerUserIds or npcIds
        assert(utils.includes(attackEntityId, playerUserIds) or utils.includes(attackEntityId, npcIds),
            "AttackEntityId is not in playerUserIds or npcIds")

        -- check if the UserId is in the players_attacked list
        local battle = Battles.get(msg.BattleId)
        assert(not utils.includes(msg.UserId, battle.players_attacked), "Player has already attacked")

        if (npcIds[attackEntityId]) then
            -- Player attacking NPC
            local log, defender_health = SimulateCombat(battle.players[msg.UserId], "player", battle.npcs
                [attackEntityId], "npc", msg.Timestamp)
            Battles.addLogs(msg.BattleId, log)
            if defender_health <= 0 then
                -- remove npc from battle
                table.remove(battle.npcs_alive, attackEntityId)
                Battles.update(msg.BattleId, battle)
            end
        else
            -- Player attacking Player
            local log, defender_health = SimulateCombat(battle.players[msg.UserId], "player", battle.players
                [attackEntityId], "player", msg.Timestamp)
            Battles.addLogs(msg.BattleId, log)
            if defender_health <= 0 then
                -- remove player from battle
                table.remove(battle.players_alive, attackEntityId)
                Battles.update(msg.BattleId, battle)
            end
        end

        table.insert(battle.players_attacked, msg.UserId)
        Battles.update(msg.BattleId, battle)

        if #battle.players_attacked >= #battle.players_alive then -- greater than or equal to in case a player has died
            -- all players have attacked, so NPC should attack
            print("All players have attacked. NPC should attack")
            local battle = Battles.get(msg.BattleId)
            -- loop through all npcs and attack
            for npc_id, _ in pairs(battle.npcs_alive) do
                NPCAttack(npc_id, battle.id, msg.Timestamp)
            end
        end

        if Battles.checkIfBattleShouldEnd(battle.id) then
            Battles.endBattle(battle.id, msg.UserId)
        end

        ao.send({ Targets = msg.From, Data = { data = battle } })
    end
)

Handlers.add("Battle.UserRun",
    Handlers.utils.hasMatchingTag("Action", "Battle.UserRun"),
    function(msg)
        VerifyUserInBattle(msg.UserId, msg.BattleId)
        VerifyBattleIsOnGoing(msg.BattleId)
        local battle = Battles.get(msg.BattleId)

        local dice_roll = math.random(1, 6)
        if dice_roll <= 4 then
            -- player runs successfully
            Battles.log(msg.BattleId, msg.Timestamp,
                "Player " .. msg.UserId .. " rolled a " .. dice_roll .. " and ran away")
            table.remove(battle.players_alive, msg.UserId)
            Battles.update(msg.BattleId, battle)
            ao.send({ Targets = msg.From, Data = { data = battle, run_away = true } })
            return
        end

        battle.player_id_tried_running = msg.UserId
        Battles.update(msg.BattleId, battle)

        -- find random NPC and attack
        local npc_id = math.random(#battle.npcs_alive)
        local npc = battle.npcs[npc_id]
        local log, defender_health = SimulateCombat(npc, "npc", battle.players[msg.UserId], "player", msg.Timestamp)
        Battles.addLogs(msg.BattleId, log)

        -- player runs unsuccessfully
        ao.send({ Targets = msg.From, Data = { data = battle, run_away = false } })
    end
)
function VerifyUserInBattle(user_id, battle_id)
    assert(user_id, "UserId is required")
    assert(battle_id, "BattleId is required")
    local battle = Battles.get(battle_id)
    assert(battle, "Battle not found")
    for _, player in ipairs(battle.players) do
        if player == user_id then
            return true
        end
    end
    assert(false, "User not in battle")
end

function VerifyBattleIsOnGoing(battle_id)
    local battle = Battles.get(battle_id)
    assert(battle, "Battle not found")
    assert(not battle.ended, "Battle already ended")
    return battle
end

function NPCAttack(npc_id, battle_id, timestamp)
    local battle = Battles.get(battle_id)

    -- pick random player and attack
    local alive_players = Battles.getAlivePlayerUserIds(battle.id)
    local player_id = alive_players[math.random(#alive_players)]

    local log, defender_health = SimulateCombat(battle.npcs[npc_id], "npc", battle.players
        [player_id], "player", timestamp)
    Battles.addLogs(battle.id, log)
    battle.last_npc_attack_timestamp[npc_id] = timestamp
    battle.players_attacked = {} -- reset player attacked list, so that all players can attack again
    Battles.update(battle.id, battle)

    if defender_health <= 0 then
        -- remove player from battle
        table.remove(battle.players_alive, player_id)
        Battles.update(battle.id, battle)
        if Battles.checkIfBattleShouldEnd(battle.id) then
            Battles.endBattle(battle.id, npc_id)
        end
    end
end

Battles.checkIfBattleShouldEnd = function(battle_id)
    local battle = Battles.get(battle_id)
    if #battle.npcs_alive == 0 or #battle.players_alive == 0 then
        return true
    end
    return false
end

Battles.endBattle = function(battle_id, winner_id)
    local battle = Battles.get(battle_id)

    battle.winner = winner_id
    battle.ended = true
    Battles.update(battle_id, battle)
end

Battles.getLatestOpenBattle = function()
    for _, battle in pairs(Battles) do
        if not battle.ended and #battle.players < MAX_PLAYERS_IN_BATTLE then
            return battle
        end
    end
    return nil
end

Battles.getAlivePlayerUserIds = function(battle_id)
    local battle = Battles.get(battle_id)
    return battle.players_alive
end

Battles.getAliveNPCIds = function(battle_id)
    local battle = Battles.get(battle_id)
    return battle.npcs_alive
end

Battles.addPlayer = function(battle_id, player)
    local battle = Battles.get(battle_id)
    battle.players[player.user_id] = player
    table.insert(battle.players_alive, player.user_id)
    Battles.update(battle_id, battle)
end

Battles.log = function(battle_id, timestamp, message)
    local battle = Battles.get(battle_id)
    table.insert(battle.log, {
        timestamp = timestamp,
        message = message
    })
    Battles.update(battle_id, battle)
end

Battles.addLogs = function(battle_id, logs)
    local battle = Battles.get(battle_id)
    for _, log in ipairs(logs) do
        table.insert(battle.log, log)
    end
    Battles.update(battle_id, battle)
end

Battles.new = function(timestamp)
    -- check last battle id and add 1
    local lastBattle = Battles[#Battles]
    local id = lastBattle.id + 1
    local battle = {
        id = id,
        player_id_tried_running = nil,  -- last player that tried to run. NPC will attack critical damage
        players_attacked = {},          -- list of userIds that have attacked (only after all players have attacked, NPC should attack or after 30 seconds cron tick)
        players_alive = {},             -- list of userIds
        npcs_alive = {},                -- list of npc ids
        players = {},                   -- dictionary of users from the user db directly, key is user_id
        npcs = {},                      -- dictionary of npc enemy data from constants.lua. key is npc_id
        log = {},                       -- list of battle logs
        last_npc_attack_timestamp = {}, -- key is npc_id, value is timestamp
        ended = false,
        winner = nil,                   -- npc_id, or a user_id
        created_at = timestamp
    }
    Battles[battle.id] = battle
    return battle
end

Battles.get = function(id)
    return Battles[id]
end

Battles.update = function(id, battle)
    Battles[id] = battle
end
