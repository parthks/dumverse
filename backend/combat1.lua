count = count or 0
-- CronTick handler will get called every 10 seconds
Handlers.add("CronTick",
    Handlers.utils.hasMatchingTag("Action", "Cron"), -- handler pattern to identify cron message
    function(msg)
        count = count + 1
        -- need to check all ongoing battles to see if a player has not attacked in the last 30 seconds
        for _, battle in pairs(Battles) do
            if not battle.ended then
                if battle.last_npc_attack_timestamp + (30 * 1000) < msg.Timestamp then
                    -- if player has not attacked in the last 30 seconds, so NPC will attack
                    NPCAttack(battle.id, msg.Timestamp)
                end
            end
        end
        return { Count = count }
    end
)

MAX_PLAYERS_IN_BATTLE = 2

Battles = {} -- table of battles with id as key and battle as value

Handlers.add("Battle1.NewUserJoin",
    Handlers.utils.hasMatchingTag("Action", "Battle1.NewUserJoin"), -- handler pattern to identify cron message
    function(msg)
        -- check lastest open battle and add user to it
        local battle = Battles.getLatestOpenBattle()
        if not battle then
            battle = Battles.new(msg.Timestamp)
        end
        table.insert(battle.playerUserIds, msg.UserId)
        Battles.update(battle.id, battle)
        return { Battle = battle }
    end
)

Handlers.add("Battle1.Info",
    Handlers.utils.hasMatchingTag("Action", "Battle1.Info"),
    function(msg)
        VerifyUserInBattle(msg.UserId, msg.BattleId)
        ao.send({ Targets = msg.From, Data = Battles.get(msg.BattleId) })
    end
)

Handlers.add("Battle1.UserAttack",
    Handlers.utils.hasMatchingTag("Action", "Battle1.Attack"),
    function(msg)
        VerifyUserInBattle(msg.UserId, msg.BattleId)
        VerifyBattleIsOnGoing(msg.BattleId)
        local attackEntity = msg.AttackEntity
        assert(attackEntity, "AttackEntity is required")
        local playerUserIds = Battles.getPlayerUserIds(msg.BattleId)
        -- check if attackEntity is in playerUserIds
        assert(attackEntity ~= "NPC" and playerUserIds[attackEntity], "AttackEntity is not a valid player UserId")

        if (attackEntity == "NPC") then
            Battles.log(msg.BattleId, msg.Timestamp, "Player " .. msg.UserId .. " attacked NPC")
        else
            local attackedUserId = playerUserIds[attackEntity]
            local attackerUserId = msg.UserId
            Battles.log(msg.BattleId, msg.Timestamp, "Player " .. attackerUserId .. " attacked player " .. attackedUserId)
        end

        NPCAttack(msg.BattleId, msg.Timestamp)
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
end

function NPCAttack(battle_id, timestamp)
    local battle = Battles.get(battle_id)
    if battle.ended then
        print("Battle already ended. Exiting NPCAttack")
        return
    end
    -- pick random player and attack
    local player = battle.players[math.random(#battle.players)]
    print("NPC attacking player " .. player)
    Battles.log(battle_id, timestamp, "NPC attacked player " .. player)
    battle.last_npc_attack_timestamp = timestamp
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

Battles.getPlayerUserIds = function(battle_id)
    local battle = Battles.get(battle_id)
    return battle.playerUserIds
end

Battles.log = function(battle_id, timestamp, message)
    local battle = Battles.get(battle_id)
    table.insert(battle.log, {
        timestamp = timestamp,
        message = message
    })
    Battles.update(battle_id, battle)
end

Battles.new = function(timestamp)
    -- check last battle id and add 1
    local lastBattle = Battles[#Battles]
    local id = lastBattle.id + 1
    local battle = {
        id = id,
        playerUserIds = {},
        log = {},
        last_npc_attack_timestamp = timestamp,
        ended = false,
        winner = nil, -- NPC, or a player UserId
        timestamp = timestamp
    }
    return battle
end

Battles.add = function(battle)
    Battles[battle.id] = battle
end

Battles.get = function(id)
    return Battles[id]
end

Battles.remove = function(id)
    Battles[id] = nil
end

Battles.update = function(id, battle)
    Battles[id] = battle
end
