local helpers = require("helpers")
local json = require("json")
local utils = require(".utils")



-- equivalent function in frontend/src/lib/utils.ts
local function isValidSpotToMoveTo(currentSpot, targetSpot)
    if currentSpot == targetSpot then
        return true
    end

    local nextSpot = currentSpot + 1
    local previousSpot = currentSpot - 1
    local nextNextSpot = currentSpot + 2
    local previousPreviousSpot = currentSpot - 2

    local isNextSpotRest = utils.includes(nextSpot, REST_SPOTS)
    local isPreviousSpotRest = utils.includes(previousSpot, REST_SPOTS)

    return utils.includes(targetSpot, { nextSpot, previousSpot }) or (isNextSpotRest and targetSpot == nextNextSpot) or
        (isPreviousSpotRest and targetSpot == previousPreviousSpot)
end

Handlers.add("Combat.EnterNewCombat",
    Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'),
    function(msg)
        local user_id = msg.UserId
        local combat_level = tonumber(msg.Level)
        assert(combat_level, "Level is required")
        local userData = helpers.CheckUserExists(user_id, msg.From)
        local current_spot = userData.current_spot

        assert(userData.health > 0, "User must have health")
        assert(userData.stamina > 0, "User must have stamina")

        assert(combat_level, "Combat Level is required")
        -- combat level must not be a rest spot
        assert(not utils.includes(combat_level, REST_SPOTS), "Spot is a rest spot")

        assert(combat_level > 0, "Combat Level must be greater than 0")
        assert(isValidSpotToMoveTo(current_spot, combat_level),
            "Invalid spot to move to. Current spot: " .. current_spot .. " Combat Level: " .. combat_level)

        -- get equipped inventory items - for potions
        local equippedPotion = dbAdmin:exec(string.format([[
            SELECT id,item_id FROM Inventory WHERE USER_ID = %f AND item_type = 'POTION' LIMIT 1;
        ]], user_id))

        -- add equippedPotion to userData.potion, will remove the item from inventory after battle (if used)
        local potion = equippedPotion[1]
        userData.potion_used = false
        userData.potion = nil
        if potion then
            local health = ITEMS[potion.item_id].health
            userData.potion = {
                id = potion.id,
                item_id = potion.item_id,
                health = health
            }
        end

        local enemies = ENEMY_PER_LEVEL[combat_level]
        assert(enemies, "No enemies found for combat level: " .. combat_level)

        ao.send({
            Target = COMBAT_PROCESS_ID,
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
)

Handlers.add("Combat.EnteredNewCombat",
    Handlers.utils.hasMatchingTag('Action', 'Combat.EnteredNewCombat'),
    function(msg)
        assert(msg.From == COMBAT_PROCESS_ID, "Only Combat process can send this message")
        local user_id = msg.UserId
        local battle_id = tonumber(msg.BattleId)
        local level = tonumber(msg.Level)
        assert(battle_id, "BattleId is required")
        assert(level, "Level is required")

        -- update Users table with battle_id
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_battle_id = %d, stamina = stamina - 1 WHERE id = %f;
        ]], battle_id, user_id))
    end
)

Handlers.add("Combat.PlayerWon",
    Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerWon'),
    function(msg)
        assert(msg.From == COMBAT_PROCESS_ID, "Only Combat process can send this message")
        local user_id = msg.UserId
        local level = tonumber(msg.Level)
        local playerData = json.decode(msg.Data)

        -- update Users table with health, stamina, gold_balance, dumz_balance
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_battle_id = NULL, current_spot = %d, health = %f, gold_balance = %f, dumz_balance = %f WHERE id = %f;
        ]], level, playerData.health, playerData.gold_balance, playerData.dumz_balance,
            user_id))

        local potion = playerData.potion
        if potion and potion.id and playerData.potion_used then
            -- remove the potion from the inventory
            dbAdmin:exec(string.format([[
                DELETE FROM Inventory WHERE id = %d;
            ]], potion.id))
        end
    end
)

Handlers.add("Combat.PlayerRanAway",
    Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerRanAway'),
    function(msg)
        assert(msg.From == COMBAT_PROCESS_ID, "Only Combat process can send this message")
        local user_id = msg.UserId
        local playerData = json.decode(msg.Data)

        -- update Users table with health, stamina, gold_balance, dumz_balance
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_battle_id = NULL, health = %f, gold_balance = %f, dumz_balance = %f WHERE id = %f;
        ]], playerData.health, playerData.gold_balance, playerData.dumz_balance, user_id))

        local potion = playerData.potion
        if potion and potion.id and playerData.potion_used then
            -- remove the potion from the inventory
            dbAdmin:exec(string.format([[
                DELETE FROM Inventory WHERE id = %d;
            ]], potion.id))
        end
    end
)

Handlers.add("Combat.PlayerPerished",
    Handlers.utils.hasMatchingTag('Action', 'Combat.PlayerPerished'),
    function(msg)
        assert(msg.From == COMBAT_PROCESS_ID, "Only Combat process can send this message")
        local user_id = msg.UserId
        local playerData = json.decode(msg.Data)

        -- update Users table
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_battle_id = NULL, current_spot = 0, health = 0, gold_balance = 0, dumz_balance = 0 WHERE id = %f;
        ]], user_id))
        local potion = playerData.potion
        if potion and potion.id and playerData.potion_used then
            -- remove the potion from the inventory
            dbAdmin:exec(string.format([[
                DELETE FROM Inventory WHERE id = %d;
            ]], potion.id))
        end
    end
)

return {}
