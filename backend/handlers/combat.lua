local helpers = require("helpers")

Handlers.add("Combat.Start",
    Handlers.utils.hasMatchingTag('Action', 'Combat.Start'),
    function(msg)
        local user_id = msg.UserId
        local combat_location = msg.Combat_Location
        assert(combat_location, "Combat_location is required")
        local userData = helpers.CheckUserExists(user_id, msg.From)

        -- get equipped inventory items
        local equippedItems = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE USER_ID = %f AND EQUIPPED = TRUE;
        ]], user_id))

        -- based on combat location, send Combat.Register to that combat process ID
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
