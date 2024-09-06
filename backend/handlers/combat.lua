local helpers = require("helpers")
local json = require("json")

Handlers.add("Combat.EnterNewCombat",
    Handlers.utils.hasMatchingTag('Action', 'Combat.EnterNewCombat'),
    function(msg)
        local user_id = msg.UserId
        local combat_level = msg.Level
        assert(combat_level, "Level is required")
        local userData = helpers.CheckUserExists(user_id, msg.From)

        -- get equipped inventory items - for potions
        -- local equippedItems = dbAdmin:exec(string.format([[
        --     SELECT * FROM Inventory WHERE USER_ID = %f AND EQUIPPED = TRUE;
        -- ]], user_id))

        ao.send({
            Target = COMBAT_PROCESS_ID,
            Action = "Battle.NewUserJoin",
            NPCs = json.encode({ ENEMIES[1] }),
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
