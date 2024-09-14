-- cron10sec - tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE

GAME_PROCESS_ID = "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc"

local utils = require(".utils")
local json = require("json")

local combat_helper = require("combat_helper")
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
            -- print("Checking battle " .. battle.id)
            if not battle.ended and #battle.players_alive > 0 then
                -- print("Battle " .. battle.id .. " is ongoing")
                local npcs_alive = battle.npcs_alive
                for _, npc_id in ipairs(npcs_alive) do
                    -- print("NPC " .. npc_id .. " alive")
                    -- print("NPC " .. npc_id .. " last attack timestamp " .. battle.last_npc_attack_timestamp[npc_id])
                    if battle.last_npc_attack_timestamp[npc_id] + (30 * 1000) < msg.Timestamp then
                        -- if player has not attacked in the last 30 seconds, the NPC will attack
                        -- print("NPC " .. npc_id .. " attacking player")
                        NPCAttack(npc_id, battle.id, msg.Timestamp)
                    end
                end
            end
        end
        -- return { Count = count }
    end
)

MAX_PLAYERS_IN_BATTLE = 1

BattleHelpers = {}
Battles = Battles or {} -- table of battles with id as key and battle as value
NPCS_EXTRA_GOLD = {}    -- table of npcs with id as key and extra gold as value, taken from perished players

Handlers.add("Battle.NewUserJoin",
    Handlers.utils.hasMatchingTag("Action", "Battle.NewUserJoin"), -- handler pattern to identify cron message
    function(msg)
        print("Battle.NewUserJoin - " .. msg.From .. " " .. GAME_PROCESS_ID)
        assert(msg.From == GAME_PROCESS_ID, "Only Game process can send this message")
        assert(msg.UserId, "UserId is required")
        assert(msg.Level, "Combat Level is required")
        local data = json.decode(msg.Data)

        local battles = GetOpenBattlesOfUser(msg.From)
        if #battles > 0 then
            -- user is already in a battle
            print("user is already in a battle")
            -- ao.send({ Target = msg.From, Data = { battle = battles[1] } })
            ao.send({
                Target = GAME_PROCESS_ID,
                UserId = msg.UserId,
                BattleId = tostring(battles[1].id),
                Action = "Combat.EnteredNewCombat",
                Data = json.encode(battles[1])
            })
            return
        end

        local player = json.decode(data.player)
        local npcs = json.decode(data.npcs)

        -- check lastest open battle and add user to it
        local battle = BattleHelpers.getLatestOpenBattle()
        if not battle then
            battle = BattleHelpers.new(msg.Timestamp)
            battle.level = tonumber(msg.Level)
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
        BattleHelpers.addPlayer(battle.id, player)

        local user_address = player.address
        print("adding user " .. user_address .. " to battle " .. battle.id .. "of level " .. battle.level)
        ao.send({
            Target = GAME_PROCESS_ID,
            UserId = msg.UserId,
            BattleId = tostring(battle.id),
            Level = tostring(battle.level),
            Action = "Combat.EnteredNewCombat",
            Data = json.encode(battle)
        })
    end
)

function GetOpenBattlesOfUser(user_address)
    local battles = {}
    for _, battle in pairs(Battles) do
        if not battle.ended then
            local user_addresses = {}
            for _, player in pairs(battle.players) do
                print("player " .. player.id .. " address " .. player.address)
                table.insert(user_addresses, player.address)
            end
            print("user_address " .. user_address)
            if not battle.ended and utils.includes(user_address, user_addresses) then
                print("battle " .. battle.id .. " is open")
                table.insert(battles, battle)
            end
        end
    end
    return battles
end

Handlers.add("Battle.GetOpenBattles",
    Handlers.utils.hasMatchingTag("Action", "Battle.GetOpenBattles"),
    function(msg)
        local battles = GetOpenBattlesOfUser(msg.From)
        Send({ Target = msg.From, Data = battles })
    end
)

Handlers.add("Battle.Info",
    Handlers.utils.hasMatchingTag("Action", "Battle.Info"),
    function(msg)
        local user_id = msg.UserId
        local battle_id = tonumber(msg.BattleId)
        -- VerifyUserInBattle(user_id, battle_id)
        Send({ Target = msg.From, Data = BattleHelpers.get(battle_id) })
    end
)

Handlers.add("Battle.UserAttack",
    Handlers.utils.hasMatchingTag("Action", "Battle.UserAttack"),
    function(msg)
        local battle_id = tonumber(msg.BattleId)
        VerifyUserInBattle(msg.UserId, battle_id)
        local battle = VerifyBattleIsOnGoing(battle_id)

        local attackEntityId = msg.AttackEntityId
        assert(attackEntityId, "AttackEntityId is required")

        local playerUserIds = battle.players_alive
        local npcIds = battle.npcs_alive
        print("User Attack - playerUserIds " .. tostring(playerUserIds))
        print("User Attack - npcIds " .. tostring(npcIds))

        -- assert that attackEntityId is in playerUserIds or npcIds - already checking in the if conditions
        -- assert(utils.includes(attackEntityId, playerUserIds) or utils.includes(attackEntityId, npcIds),
        --     "AttackEntityId is not in playerUserIds or npcIds")

        -- check if the UserId is in the players_attacked list
        local battle = BattleHelpers.get(battle_id)
        assert(not utils.includes(msg.UserId, battle.players_attacked), "Player has already attacked")

        print("User Attack - all checks passed, attacking now")
        if (utils.includes(attackEntityId, npcIds)) then
            -- Player attacking NPC
            local log, defender_health = SimulateCombat(battle.players[msg.UserId], "player", battle.npcs
                [attackEntityId], "npc", msg.Timestamp)
            BattleHelpers.addLogs(battle_id, log)
            if defender_health <= 0 then
                -- remove npc from battle
                BattleHelpers.killNPC(battle_id, attackEntityId, msg.UserId, msg.Timestamp)
            end
        elseif (utils.includes(attackEntityId, playerUserIds)) then
            -- Player attacking Player
            local log, defender_health = SimulateCombat(battle.players[msg.UserId], "player", battle.players
                [attackEntityId], "player", msg.Timestamp)
            BattleHelpers.addLogs(battle_id, log)
            if defender_health <= 0 then
                -- remove player from battle
                BattleHelpers.killPlayer(battle.id, attackEntityId, msg.UserId, msg.Timestamp)
            end
        else
            -- assert(false, "AttackEntityId is not in playerUserIds or npcIds")
            -- race condition from the UI, do nothing
            ao.send({ Target = msg.From, Data = battle })
            return
        end

        table.insert(battle.players_attacked, msg.UserId)
        BattleHelpers.update(battle_id, battle)

        if #battle.players_attacked >= #battle.players_alive then -- greater than or equal to in case a player has died
            -- all players have attacked, so NPC should attack
            print("All players have attacked. NPC should attack")
            local battle = BattleHelpers.get(battle_id)
            -- loop through all npcs and attack
            for _, npc_id in ipairs(battle.npcs_alive) do
                NPCAttack(npc_id, battle.id, msg.Timestamp)
            end
        end

        if BattleHelpers.checkIfBattleShouldEnd(battle.id) then
            BattleHelpers.endBattle(battle.id, msg.UserId, msg.Timestamp)
        end

        ao.send({ Target = msg.From, Data = battle })
    end
)

Handlers.add("Battle.UserRun",
    Handlers.utils.hasMatchingTag("Action", "Battle.UserRun"),
    function(msg)
        local battle_id = tonumber(msg.BattleId)
        VerifyUserInBattle(msg.UserId, battle_id)
        VerifyBattleIsOnGoing(battle_id)
        local battle = BattleHelpers.get(battle_id)

        local dice_roll = math.random(1, 6)
        BattleHelpers.log(battle_id, msg.Timestamp, msg.UserId,
            "attempts to run away")
        if dice_roll < 4 then
            -- player runs successfully
            BattleHelpers.playerRanAway(battle.id, msg.UserId, msg.Timestamp)
            if BattleHelpers.checkIfBattleShouldEnd(battle.id) then
                BattleHelpers.endBattle(battle.id, nil, msg.Timestamp)
            end
            BattleHelpers.update(battle_id, battle)
            ao.send({ Target = msg.From, Data = battle })
            return
        end
        -- BattleHelpers.log(battle_id, msg.Timestamp, msg.UserId,
        --     "runs away unsuccessfully")
        BattleHelpers.update(battle_id, battle)

        -- find random NPC and attack player
        local npc_id = battle.npcs_alive[math.random(#battle.npcs_alive)]
        local npc = battle.npcs[npc_id]
        -- NPC will attack critial damage to msg.UserId
        NPCAttack(npc.id, battle_id, msg.Timestamp, msg.UserId)

        -- player runs unsuccessfully
        ao.send({ Target = msg.From, Data = battle })
    end
)
function VerifyUserInBattle(user_id, battle_id)
    assert(user_id, "UserId is required")
    assert(battle_id, "BattleId is required")
    local battle = BattleHelpers.get(battle_id)
    assert(battle, "Battle not found")
    for _, player in pairs(battle.players) do
        if player.id == user_id then
            return true
        end
    end
    assert(false, "User not in battle")
end

function VerifyBattleIsOnGoing(battle_id)
    local battle = BattleHelpers.get(battle_id)
    assert(battle, "Battle not found")
    assert(not battle.ended, "Battle already ended")
    return battle
end

function NPCAttack(npc_id, battle_id, timestamp, player_id_tried_running)
    local battle = BattleHelpers.get(battle_id)

    -- pick random player and attack
    local alive_players = battle.players_alive
    local player_id = player_id_tried_running or alive_players[math.random(#alive_players)]

    local log, defender_health = SimulateCombat(battle.npcs[npc_id], "npc", battle.players
        [player_id], "player", timestamp, player_id_tried_running)
    BattleHelpers.addLogs(battle.id, log)
    battle.last_npc_attack_timestamp[npc_id] = timestamp
    battle.players_attacked = {} -- reset player attacked list, so that all players can attack again
    BattleHelpers.update(battle.id, battle)

    if defender_health <= 0 then
        -- remove player from battle
        BattleHelpers.killPlayer(battle.id, player_id, npc_id, timestamp)

        if BattleHelpers.checkIfBattleShouldEnd(battle.id) then
            BattleHelpers.endBattle(battle.id, npc_id, timestamp)
        end
    end
end

BattleHelpers.checkIfBattleShouldEnd = function(battle_id)
    local battle = BattleHelpers.get(battle_id)
    if #battle.npcs_alive == 0 or #battle.players_alive == 0 then
        return true
    end
    return false
end

BattleHelpers.endBattle = function(battle_id, winner_id, timestamp)
    local battle = BattleHelpers.get(battle_id)
    -- TODO: Archive battle to SQL table and delete from memory

    battle.winner = winner_id
    battle.ended = true
    local winning_message = ''
    if winner_id then
        assert(battle.players[winner_id] or battle.npcs[winner_id],
            "Winner id " .. winner_id .. " not found in players or npcs")
        if battle.players[winner_id] and #battle.npcs_alive == 0 then
            -- players have won the battle
            winning_message = "has won the battle"

            -- send message to all players that they have won the battle
            for _, player_id in ipairs(battle.players_alive) do
                ao.send({
                    Target = GAME_PROCESS_ID,
                    UserId = player_id,
                    Action = "Combat.PlayerWon",
                    Data = json.encode(battle.players[player_id])
                })
            end
        elseif battle.npcs[winner_id] and #battle.players_alive == 0 then
            winning_message = "has won the battle"
            -- add extra gold of npcs back to NPCS_EXTRA_GOLD table for future battles
            for _, npc_id in ipairs(battle.npcs_alive) do
                local npc = battle.npcs[npc_id]
                if npc.extra_gold > 0 then
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

BattleHelpers.getLatestOpenBattle = function()
    for _, battle in pairs(Battles) do
        if not battle.ended and #utils.keys(battle.players) < MAX_PLAYERS_IN_BATTLE then
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

BattleHelpers.killNPC = function(battle_id, npc_id, attacker_id, timestamp)
    local battle = BattleHelpers.get(battle_id)
    local npc = battle.npcs[npc_id]

    battle.npcs_alive = utils.filter(function(val)
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

BattleHelpers.killPlayer = function(battle_id, player_id, attacker_id, timestamp)
    local battle = BattleHelpers.get(battle_id)
    battle.players_alive = utils.filter(function(val)
        return val ~= player_id
    end, battle.players_alive)
    BattleHelpers.log(battle.id, timestamp, player_id, "Player has Perished")

    -- transfer player gold
    local player = battle.players[player_id]
    -- if attacker_id is a npc, add player gold to npc extra gold
    if battle.npcs[attacker_id] then
        battle.npcs[attacker_id].extra_gold = (battle.npcs[attacker_id].extra_gold or 0) + player.gold_balance
    else
        -- if attacker_id is a player, give the gold to the other player
        if battle.players[attacker_id] then
            battle.players[attacker_id].gold_balance = (battle.players[attacker_id].gold_balance or 0) +
                player.gold_balance
        end
    end
    -- intentionally not updating the player gold_balance, to keep the histroy. ok since player has been removed from players_alive

    BattleHelpers.update(battle_id, battle)
    local player = battle.players[player_id]
    ao.send({ Target = GAME_PROCESS_ID, UserId = player.id, Action = "Combat.PlayerPerished" })
end

BattleHelpers.playerRanAway = function(battle_id, player_id, timestamp)
    local battle = BattleHelpers.get(battle_id)
    BattleHelpers.log(battle_id, timestamp, player_id,
        "runs away successfully")
    battle.players_alive = utils.filter(function(val)
        return val ~= player_id
    end, battle.players_alive)
    BattleHelpers.update(battle_id, battle)
    local player = battle.players[player_id]
    ao.send({
        Target = GAME_PROCESS_ID,
        UserId = player.id,
        Action = "Combat.PlayerRanAway",
        Data = json.encode(player)
    })
end

BattleHelpers.addPlayer = function(battle_id, player)
    local battle = BattleHelpers.get(battle_id)
    player.id = tostring(player.id)
    battle.players[player.id] = player
    table.insert(battle.players_alive, player.id)
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.log = function(battle_id, timestamp, from, message)
    local battle = BattleHelpers.get(battle_id)
    table.insert(battle.log, {
        from = from,
        message = message,
        timestamp = timestamp
    })
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.addLogs = function(battle_id, logs)
    local battle = BattleHelpers.get(battle_id)
    for _, log in ipairs(logs) do
        table.insert(battle.log, log)
    end
    BattleHelpers.update(battle_id, battle)
end

BattleHelpers.new = function(timestamp)
    -- check last battle id and add 1
    local lastBattle = Battles[#Battles] or { id = 0 }
    local id = lastBattle.id + 1
    local battle = {
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
        ended = false,
        winner = nil,                   -- npc_id, or a user_id
        created_at = timestamp
    }
    Battles[battle.id] = battle
    return battle
end

BattleHelpers.get = function(id)
    return Battles[id]
end

BattleHelpers.update = function(id, battle)
    Battles[id] = battle
end
