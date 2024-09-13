local helpers = require("helpers")
local json = require("json")

Handlers.add("Combat.EnterNewCombat",
    Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'),
    function(msg)
        local user_id = msg.UserId
        local combat_level = tonumber(msg.Level)
        assert(combat_level, "Level is required")
        local userData = helpers.CheckUserExists(user_id, msg.From)
        local current_spot = userData.current_spot

        -- if the current spot has to be +1 or -1 from the combat_level
        assert(combat_level, "Combat Level is required")
        assert(combat_level > 0, "Combat Level must be greater than 0")
        assert(combat_level < 10, "Combat Level must be less than 10")
        if current_spot < combat_level then
            assert(combat_level - current_spot == 1, "Current spot must be only 1 less than combat level")
            current_spot = current_spot + 1
        elseif current_spot > combat_level then
            assert(current_spot - combat_level == 1, "Current spot must be only 1 more than combat level")
            current_spot = current_spot - 1
        end

        -- get equipped inventory items - for potions
        -- local equippedItems = dbAdmin:exec(string.format([[
        --     SELECT * FROM Inventory WHERE USER_ID = %f AND EQUIPPED = TRUE;
        -- ]], user_id))

        -- update Users table with current_spot
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_spot = %d WHERE id = %f;
        ]], combat_level, user_id))

        ao.send({
            Target = COMBAT_PROCESS_ID,
            Action = "Battle.NewUserJoin",
            NPCs = json.encode({ ENEMIES[1], ENEMIES[2] }),
            UserId = user_id,
            Player = json.encode(userData),
        })
    end
)


-- death notice
Handlers.add("Combat.DeathNotice",
    Handlers.utils.hasMatchingTag('Action', 'Combat.DeathNotice'),
    function(msg)
        local user_id = msg.UserId
        local userData = helpers.CheckUserExists(user_id, msg.From)
    end
)

return {}
