local json = require("json")
local helpers = require("helpers")
local utils = require(".utils")

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

Handlers.add("Inventory.UseItem",
    Handlers.utils.hasMatchingTag('Action', 'Inventory.UseItem'),
    function(msg)
        local user_id = msg.UserId
        local userData = helpers.CheckUserExists(user_id, msg.From)
        local current_spot = userData.current_spot
        -- check if current_spot is in REST_SPOTS
        assert(utils.includes(current_spot, REST_SPOTS), "User is not at a rest spot")

        local inventory_id = tonumber(msg.InventoryId)
        assert(inventory_id, "InventoryId is required")
        local item = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE id = %d;
        ]], inventory_id))
        assert(item, "Item not found")
        assert(item.user_id == user_id, "Item does not belong to user")
        local item_id = item.item_id
        local item = ITEMS[item_id]
        assert(item, "Item not found")

        if item.type == "POTION" then
            -- increase health
            dbAdmin:exec(string.format([[
                UPDATE Users SET health = health + %d WHERE id = %d;
            ]], item.health, user_id))
        elseif item.type == "FOOD" then
            -- increase health
            dbAdmin:exec(string.format([[
                UPDATE Users SET health = health + %d WHERE id = %d;
            ]], item.health, user_id))
        elseif item.type == "ENERGY" then
            -- increase energy
            dbAdmin:exec(string.format([[
                UPDATE Users SET stamina = stamina + %d WHERE id = %d;
            ]], item.energy, user_id))
        end

        -- delete item from inventory
        dbAdmin:exec(string.format([[
            DELETE FROM Inventory WHERE id = %d;
        ]], inventory_id))

        ao.send({ Target = msg.From, Status = "Success" })
    end
)

return {}
