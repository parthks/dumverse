require("combat.types")
require("combat.globals")
require("utils.combat")

local utils = require("utils.utils.tl-utils")
local json = require("json")

local BattleHelpers: BattleHelpersType = {}

BattleHelpers.checkIfBattleShouldEnd = function(battle_id: integer): boolean
    local battle = BattleHelpers.get(battle_id)
    -- NPC wins if no players are alive
    if #battle.players_alive == 0 then
        return true
    end
    -- NPCs are all dead and only 1 player is alive
    if #battle.npcs_alive == 0 and #battle.players_alive == 1 then
        return true
    end
    return false
end

BattleHelpers.endBattle = function(battle_id: integer, winner_id: string, timestamp: integer)
    local battle = BattleHelpers.get(battle_id)
    -- when user attacks, after NPC attacks if NPC ends the battle then this function is called twice
    if (battle.ended) then
        return
    end
    -- TODO: Archive battle to SQL table and delete from memory, does it help?

    battle.winner = winner_id
    battle.ended = true
    local winning_message = ''
    if winner_id then
        assert(battle.players[winner_id] ~= nil or battle.npcs[winner_id] ~= nil,
            "Winner id " .. winner_id .. " not found in players or npcs")
        if battle.players[winner_id] ~= nil and #battle.npcs_alive == 0 then
            -- players have won the battle
            winning_message = "has won the battle"

            -- send message to all players that they have won the battle
            for _, player_id in ipairs(battle.players_alive) do
                ao.send({
                    Target = GAME_PROCESS_ID,
                    UserId = player_id,
                    Level = tostring(battle.level),
                    Action = "Combat.PlayerWon",
                    Data = json.encode(battle.players[player_id])
                })
            end
        elseif battle.npcs[winner_id] and #battle.players_alive == 0 then
            winning_message = "has won the battle"
            -- add extra gold of npcs back to NPCS_EXTRA_GOLD table for future battles
            for _, npc_id in ipairs(battle.npcs_alive) do
                local npc = battle.npcs[npc_id]
                if npc.extra_gold ~= nil and npc.extra_gold > 0 then
                    NPCS_EXTRA_GOLD[npc_id] = npc.extra_gold
                end
            end
        end
        BattleHelpers.log(battle_id, timestamp, winner_id, winning_message)
        -- else
        --     BattleHelpers.log(battle_id, timestamp, nil, "No winner, battle ended. All players successfully ran away")
    end
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.getLatestSuitableOpenBattle = function(player: CombatUserData, level: integer): Battle | nil
    -- all players in same battle should have same defense (level of armor)
    for _, battle in pairs(Battles) do
        if not battle.ended and battle.level == level and #utils.keys(battle.players) < MAX_PLAYERS_IN_BATTLE and utils.values(battle.players)[1].defense == player.defense then
            return battle
        end
    end
    return nil
end

-- BattleHelpers.getAlivePlayerUserIds = function(battle_id)
--     local battle = BattleHelpers.get(battle_id)
--     return battle.players_alive
-- end

-- BattleHelpers.getAliveNPCIds = function(battle_id)
--     local battle = BattleHelpers.get(battle_id)
--     return battle.npcs_alive
-- end

BattleHelpers.killNPC = function(battle_id: integer, npc_id: string, attacker_id: string, timestamp: integer)
    local battle = BattleHelpers.get(battle_id)
    local npc = battle.npcs[npc_id]

    battle.npcs_alive = utils.filter(function(val: string): boolean
        return val ~= npc_id
    end, battle.npcs_alive)

    -- player gets npc gold + extra gold
    battle.players[attacker_id].gold_balance = (battle.players[attacker_id].gold_balance or 0) + npc.gold_reward +
        npc.extra_gold
    battle.players[attacker_id].dumz_balance = (battle.players[attacker_id].dumz_balance or 0) + npc.dumz_reward
    -- intentionally not updating the npc gold reward and extra gold, to keep the histroy. ok since npc has been removed from npcs_alive

    BattleHelpers.log(battle.id, timestamp, attacker_id, "has slain " .. npc.name)
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.killPlayer = function(battle_id: integer, player_id: string, attacker_id: string, timestamp: integer)
    local battle = BattleHelpers.get(battle_id)
    battle.players_alive = utils.filter(function(val: string): boolean
        return val ~= player_id
    end, battle.players_alive)
    BattleHelpers.log(battle.id, timestamp, player_id, "Player has Perished")

    -- transfer player gold
    local player = battle.players[player_id]
    -- if attacker_id is a npc, add player gold to npc extra gold
    if battle.npcs[attacker_id] then
        battle.npcs[attacker_id].extra_gold = (battle.npcs[attacker_id].extra_gold or 0) + player.gold_balance
        -- players dumz gets burned
    else
        -- if attacker_id is a player, give the gold to the other player
        if battle.players[attacker_id] then
            battle.players[attacker_id].gold_balance = (battle.players[attacker_id].gold_balance or 0) +
                player.gold_balance
            battle.players[attacker_id].dumz_balance = (battle.players[attacker_id].dumz_balance or 0) +
                player.dumz_balance
        end
    end
    -- need to set to 0, in case this player also kills the other player at the same time, so then
    -- the gold and dumz balance is not duplicated
    battle.players[player_id].gold_balance = 0
    battle.players[player_id].dumz_balance = 0

    BattleHelpers.update(battle_id, battle)
    player = battle.players[player_id]
    ao.send({
        Target = GAME_PROCESS_ID,
        UserId = tostring(player.id),
        Action = "Combat.PlayerPerished",
        Data = json.encode(player)
    })
end

BattleHelpers.playerRanAway = function(battle_id: integer, player_id: string, timestamp: integer)
    local battle = BattleHelpers.get(battle_id)
    BattleHelpers.log(battle_id, timestamp, player_id,
        "runs away successfully")
    battle.players_alive = utils.filter(function(val: string): boolean
        return val ~= player_id
    end, battle.players_alive)
    BattleHelpers.update(battle_id, battle)
    local player = battle.players[player_id]
    ao.send({
        Target = GAME_PROCESS_ID,
        UserId = tostring(player.id),
        Action = "Combat.PlayerRanAway",
        Data = json.encode(player)
    })
end

BattleHelpers.addPlayer = function(battle_id: integer, player: CombatUserData)
    local battle = BattleHelpers.get(battle_id)
    battle.players[tostring(player.id)] = player
    table.insert(battle.players_alive, tostring(player.id))
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.log = function(battle_id: integer, timestamp: integer, from: string, message: string)
    local battle = BattleHelpers.get(battle_id)
    table.insert(battle.log, {
        from = from,
        message = message,
        timestamp = timestamp
    })
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.addLogs = function(battle_id: integer, logs: {BattleLogEntry})
    local battle = BattleHelpers.get(battle_id)
    for _, log in ipairs(logs) do
        table.insert(battle.log, log)
    end
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.new = function(timestamp: integer): Battle
    -- check last battle id and add 1
    -- local lastBattle = Battles[#Battles] or { id = 0 }
    local id = BATTLE_COUNT + 1
    BATTLE_COUNT = id
    local battle: Battle = {
        id = id,
        level = nil,
        -- player_id_tried_running = nil,  -- last player that tried to run. NPC will attack critical damage
        players_attacked = {},          -- list of userIds that have attacked (only after all players have attacked, NPC should attack or after 30 seconds cron tick)
        players_alive = {},             -- list of userIds
        npcs_alive = {},                -- list of npc ids
        players = {},                   -- dictionary of users from the user db directly, key is user_id
        npcs = {},                      -- dictionary of npc enemy data from constants.lua. key is npc_id
        log = {},                       -- list of battle logs
        last_npc_attack_timestamp = {}, -- key is npc_id, value is timestamp
        last_player_attack_timestamp = {}, -- key is player_id, value is timestamp
        ended = false,
        winner = nil,                   -- npc_id, or a user_id
        created_at = timestamp,


    }
    Battles[battle.id] = battle
    return battle
end

BattleHelpers.get = function(id: integer): Battle
    return Battles[id]
end

BattleHelpers.update = function(id: integer, battle: Battle)
    Battles[id] = battle
end


return BattleHelpers