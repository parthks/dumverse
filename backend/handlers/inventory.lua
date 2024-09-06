local json = require("json")
local helpers = require("helpers")

-- Not needed, inventory is fetched in User.Info
Handlers.add("Inventory.Info",
    Handlers.utils.hasMatchingTag('Action', 'Inventory.Info'),
    function(msg)
        local user_id = msg.UserId
        local userData = helpers.CheckUserExists(user_id, msg.From)

        local inventory = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE USER_ID = %f;
        ]], user_id))

        ao.send({ Target = msg.From, Data = json.encode(inventory) })
    end
)

return {}
