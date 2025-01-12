require("combat.types")
require("combat.globals")
require("utils.combat")
-- local constants = require("utils.constants")

local utils = require("utils.utils.tl-utils")
local json = require("json")

local BattleHelpers: BattleHelpersType = {}

-- local function endBattle(battle_id: integer, winner_id: string, timestamp: integer)
--     local battle = BattleHelpers.get(battle_id)
--     -- when user attacks, after NPC attacks if NPC ends the battle then this function is called twice
--     if (battle.ended) then
--         return
--     end
--     -- TODO: Archive battle to SQL table and delete from memory, does it help?

   
--     local function playerWon(player_id: string)
--         ao.send({
--             Target = GAME_PROCESS_ID,
--             UserId = player_id,
--             Level = tostring(battle.level),
--             Action = "Combat.PlayerWon",
--             Data = json.encode(battle.players[player_id])
--         })
--     end 

--     local function npcsWon(npcs_alive: {string})
--         for _, npc_id in ipairs(npcs_alive) do
--             local npc = battle.npcs[npc_id]
--             if npc.extra_gold ~= nil and npc.extra_gold > 0 then
--                 NPCS_EXTRA_GOLD[npc_id] = npc.extra_gold
--             end
--         end
--     end

--     battle.winner = winner_id
--     battle.ended = true
--     local winning_message = ''

--     -- if player won
--     if battle.players[winner_id] and #battle.npcs_alive == 0 then
--         -- player has won the battle
--         winning_message = "has won the battle"
--         playerWon(winner_id)

--     elseif battle.npcs[winner_id] and #battle.players_alive == 0 then
--             winning_message = "has won the battle"
--             -- add extra gold of npcs back to NPCS_EXTRA_GOLD table for future battles
--             for _, npc_id in ipairs(battle.npcs_alive) do
--                 local npc = battle.npcs[npc_id]
--                 if npc.extra_gold ~= nil and npc.extra_gold > 0 then
--                     NPCS_EXTRA_GOLD[npc_id] = npc.extra_gold
--                 end
--             end
--         BattleHelpers.log(battle_id, timestamp, winner_id, winning_message)
--         -- else
--         --     BattleHelpers.log(battle_id, timestamp, nil, "No winner, battle ended. All players successfully ran away")
    
--     else
--         -- try and figure out the winner
--         -- if all players are dead, then NPC wins
--         if #battle.players_alive == 0 and #battle.npcs_alive > 0 then
--             winning_message = "has won the battle"
--         end
--     end

--     BattleHelpers.update(battle_id, battle)
-- end


BattleHelpers.checkIfBattleShouldEnd = function(battle_id: integer, attacker_id: string, timestamp: integer): boolean
    -- attacker_id is nil if player ran away
    
    local battle = BattleHelpers.get(battle_id)
    if battle.ended then
        return true
    end

    local function playerWon(player_id: string)

        local number_of_enemies = 0
        for _ in pairs(battle.npcs) do
            number_of_enemies = number_of_enemies + 1
        end

        ao.send({
            Target = GAME_PROCESS_ID,
            UserId = player_id,
            Level = tostring(battle.level),
            Action = "Combat.PlayerWon",
            Data = json.encode(battle.players[player_id]),
            NumberOfEnemies = tostring(number_of_enemies)
        })
        -- ao.send({
        --     Target = constants.HISTORY_PROCESS_ID,
        --     Action = "Record.SavedToHistory",
        --     Data = json.encode(BattleHelpers.get(battle_Id)),
        --     SubProcess = tostring(ao.id),
        --     ErrorStatus = "no",
        --     BattleId = tostring(battle_Id)
        -- })
        -- local battle_data = BattleHelpers.get(battle_Id)
        -- sendBatteDataToHistoryProcess(battle_Id,battle_data,"no")
    end 

    local function npcsWon(npcs_alive: {string})
        for _, npc_id in ipairs(npcs_alive) do
            local npc = battle.npcs[npc_id]
            if npc.extra_gold ~= nil and npc.extra_gold > 0 then
                NPCS_EXTRA_GOLD[npc_id] = npc.extra_gold
            end
        end
    end

    local winning_message = "has won the battle"
    local shouldEnd = false

    -- Add more detailed logging for each end condition
    if not attacker_id and #battle.players_alive == 0 then
        -- player ran away
        winning_message = "Battle ended. No players left in battle"
        BattleHelpers.log(battle_id, timestamp, attacker_id, winning_message)
        BattleHelpers.internalLog(battle_id, timestamp, "checkIfBattleShouldEnd", winning_message)
        shouldEnd = true

    -- player ran away, only one player left
    elseif not attacker_id and #battle.players_alive == 1 then
        -- player ran away
        winning_message = "Battle ended. Only player left"
        attacker_id = battle.players_alive[1]
        BattleHelpers.log(battle_id, timestamp, attacker_id, winning_message)
        BattleHelpers.internalLog(battle_id, timestamp, "checkIfBattleShouldEnd", winning_message)
        shouldEnd = true

    -- NPC wins if no players are alive
    elseif #battle.players_alive == 0 and #battle.npcs_alive > 0 then
        npcsWon(battle.npcs_alive)
        -- check if attacker_id is in npcs_alive, in case both players killed themselves
        if not utils.includes(attacker_id, battle.npcs_alive) then
            winning_message = "has won the battle. All players perished"
            attacker_id = battle.npcs_alive[1]
        end
        BattleHelpers.log(battle_id, timestamp, attacker_id, winning_message)
        BattleHelpers.internalLog(battle_id, timestamp, "checkIfBattleShouldEnd", winning_message)
        shouldEnd = true

    -- NPCs are all dead and only 1 player is alive
    elseif #battle.npcs_alive == 0 and #battle.players_alive == 1 then
        assert(battle.players_alive[1] == attacker_id)
        playerWon(attacker_id)
        BattleHelpers.log(battle_id, timestamp, attacker_id, winning_message)
        BattleHelpers.internalLog(battle_id, timestamp, "checkIfBattleShouldEnd", winning_message)
        shouldEnd = true

    elseif (#battle.players_alive == 0 and #battle.npcs_alive == 0) then
        -- both players and npcs are dead
        winning_message = "Battle ended. Both players and npcs perished"
        BattleHelpers.log(battle_id, timestamp, nil, winning_message)
        BattleHelpers.internalLog(battle_id, timestamp, "checkIfBattleShouldEnd", winning_message)
        shouldEnd = true
    end

    if shouldEnd then
        battle.ended = true
        battle.winner = attacker_id
    end
    BattleHelpers.update(battle_id, battle)
end


BattleHelpers.getLatestSuitableOpenBattle = function(player: CombatUserData, level: integer): Battle | nil
    -- all players in same battle should have same defense (level of armor)
    for _, battle in pairs(Battles) do
        if not battle.ended then
            print("checking battle " .. battle.id .. " - level " .. battle.level .. " - players " .. #utils.keys(battle.players) .. " - defense " .. utils.values(battle.players)[1].defense .. " - player defense " .. player.defense)
            if battle.level == level and #utils.keys(battle.players) < MAX_PLAYERS_IN_BATTLE and utils.values(battle.players)[1].defense == player.defense then
                return battle
            end
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

    Battles[battle_id].npcs[npc_id].health = 0

    -- if attacker_id is a player (npc count be attacking another npc as well)
    if (Battles[battle_id].players[attacker_id] ~= nil) then
        -- player gets npc gold + extra gold
            Battles[battle_id].players[attacker_id].dumz_balance = (battle.players[attacker_id].dumz_balance or 0) + (npc.dumz_reward or 0)
            Battles[battle_id].players[attacker_id].gold_balance = (battle.players[attacker_id].gold_balance or 0) + (npc.gold_reward or 0) +
            (npc.extra_gold or 0)

            -- Battles[battle_id].players[attacker_id].gold_earned = (battle.players[attacker_id].gold_earned or 0) + (npc.gold_reward or 0) +
            -- (npc.extra_gold or 0)

        -- intentionally not updating the npc gold reward and extra gold, to keep the histroy. ok since npc has been removed from npcs_alive
        -- give player special items if npc is special enemy
        if npc.id == "SHIBA" then
            Battles[battle_id].players[attacker_id].special_item_key = (Battles[battle_id].players[attacker_id].special_item_key or 0) + 1
        end
        if npc.id == "MOUSE" then
            Battles[battle_id].players[attacker_id].special_item_thread = (Battles[battle_id].players[attacker_id].special_item_thread or 0) + 1
        end
        if npc.id == "TREE" then
            Battles[battle_id].players[attacker_id].special_item_bark = (Battles[battle_id].players[attacker_id].special_item_bark or 0) + 1
        end
        if npc.id == "PEACOCK" then
            Battles[battle_id].players[attacker_id].special_item_heart = (Battles[battle_id].players[attacker_id].special_item_heart or 0) + 1
            if Battles[battle_id].players[attacker_id].special_item_heart == 4 and Battles[battle_id].players[attacker_id].has_collected_all_hearts == nil then
                Battles[battle_id].players[attacker_id].has_collected_all_hearts = true
            end
            
        end
        if npc.id == "DUMZ" and (Battles[battle_id].players[attacker_id].special_item_kitten or 0) < 1 then
            Battles[battle_id].players[attacker_id].special_item_kitten = 1
        end
        if npc.id == "NPC_13"  then
            Battles[battle_id].players[attacker_id].trunk_balance = Battles[battle_id].players[attacker_id].trunk_balance + npc.trunk_reward
        end
    end
    BattleHelpers.log(battle_id, timestamp, attacker_id, "has slain " .. npc.name)
    -- BattleHelpers.update(battle_id, battle)
end

BattleHelpers.killPlayer = function(battle_id: integer, player_id: string, attacker_id: string, timestamp: integer)
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].players_alive = utils.filter(function(val: string): boolean
        return val ~= player_id
    end, Battles[battle_id].players_alive)

    BattleHelpers.log(battle_id, timestamp, player_id, "Player has Perished")

    -- transfer player gold
    local player = Battles[battle_id].players[player_id]
    -- if attacker_id is a npc, add player gold to npc extra gold
    if Battles[battle_id].npcs[attacker_id] then
        if attacker_id ~= "SHIBA" and attacker_id ~= "MOUSE" and attacker_id ~= "TREE" and attacker_id ~= "DUMZ" and attacker_id ~= "PEACOCK" then
            Battles[battle_id].npcs[attacker_id].extra_gold = (Battles[battle_id].npcs[attacker_id].extra_gold or 0) + player.gold_balance
        end
        -- players dumz gets burned
    else
        -- if attacker_id is a player, give the gold to the other player
        if Battles[battle_id].players[attacker_id] then
            local attacker_player = Battles[battle_id].players[attacker_id]
            Battles[battle_id].players[attacker_id].gold_balance = (attacker_player.gold_balance or 0) +
                player.gold_balance
                Battles[battle_id].players[attacker_id].dumz_balance = (attacker_player.dumz_balance or 0) +
                player.dumz_balance
        end
    end
    -- need to set to 0, in case this player also kills the other player at the same time, so then
    -- the gold and dumz balance is not duplicated
    Battles[battle_id].players[player_id].gold_balance = 0
    Battles[battle_id].players[player_id].dumz_balance = 0

    -- BattleHelpers.update(battle_id, battle)
    player = Battles[battle_id].players[player_id]

    ao.send({
        Target = GAME_PROCESS_ID,
        UserId = tostring(player.id),
        Action = "Combat.PlayerPerished",
        Data = json.encode(player)
    })
    -- ao.send({
    --     Target = constants.HISTORY_PROCESS_ID,
    --     Action = "Record.SavedToHistory",
    --     Data = json.encode(BattleHelpers.get(battle_id)),
    --     SubProcess = tostring(ao.id),
    --     ErrorStatus = "no",
    --     BattleId = tostring(battle_id)
    -- })
    -- local battle_data = BattleHelpers.get(battle_id)
    -- sendBatteDataToHistoryProcess(battle_id,battle_data,"no")
end

BattleHelpers.playerRanAway = function(battle_id: integer, player_id: string, timestamp: integer)
    -- local battle = BattleHelpers.get(battle_id)
    BattleHelpers.log(battle_id, timestamp, player_id, "runs away successfully")
    BattleHelpers.internalLog(battle_id, timestamp, "playerRanAway", "Player".. player_id .. "runs away successfully")
    Battles[battle_id].players_alive = utils.filter(function(val: string): boolean
        return val ~= player_id
    end, Battles[battle_id].players_alive)
    -- BattleHelpers.update(battle_id, battle)
    local player = Battles[battle_id].players[player_id]
    ao.send({
        Target = GAME_PROCESS_ID,
        UserId = tostring(player.id),
        Action = "Combat.PlayerRanAway",
        Data = json.encode(player)
    })

    -- ao.send({
    --     Target = constants.HISTORY_PROCESS_ID,
    --     Action = "Record.SavedToHistory",
    --     Data = json.encode(BattleHelpers.get(battle_id)),
    --     SubProcess = tostring(ao.id),
    --     ErrorStatus = "no",
    --     BattleId = tostring(battle_id)
    -- })
    -- local battle_data = BattleHelpers.get(battle_id)
    -- sendBatteDataToHistoryProcess(battle_id,battle_data,"no")
end

BattleHelpers.addPlayer = function(battle_id: integer, player: CombatUserData)
    local battle = BattleHelpers.get(battle_id)
    battle.players[tostring(player.id)] = player
    table.insert(battle.players_alive, tostring(player.id))
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.log = function(battle_id: integer, timestamp: integer, from: string, message: string)
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].log = Battles[battle_id].log or {}
    table.insert(Battles[battle_id].log, {
        from = from,
        message = message,
        timestamp = timestamp
    })
    -- BattleHelpers.update(battle_id, battle)
end

BattleHelpers.addLogs = function(battle_id: integer, logs: {BattleLogEntry})
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].log = Battles[battle_id].log or {}
    for _, log in ipairs(logs) do
        table.insert(Battles[battle_id].log, log)
    end
    -- BattleHelpers.update(battle_id, battle)
end

BattleHelpers.internalLog = function(battle_id: integer, timestamp: integer, from: string, message: string)
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].internal_logs = Battles[battle_id].internal_logs or {}
    table.insert(Battles[battle_id].internal_logs, {
        from = from,
        message = message,
        timestamp = timestamp
    })
    -- BattleHelpers.update(battle_id, battle)
end
BattleHelpers.addInternalLogs = function(battle_id: integer, logs: {BattleLogEntry})
    -- local battle = BattleHelpers.get(battle_id)
    Battles[battle_id].internal_logs = Battles[battle_id].internal_logs or {}
    for _, log in ipairs(logs) do
        table.insert(Battles[battle_id].internal_logs, log)
    end
    -- BattleHelpers.update(battle_id, battle)
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
        internal_logs = {},              -- list of battle logs for internal use only
        last_npc_attack_timestamp = {}, -- key is npc_id, value is timestamp
        last_player_attack_timestamp = {}, -- key is player_id, value is timestamp
        started=false,
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