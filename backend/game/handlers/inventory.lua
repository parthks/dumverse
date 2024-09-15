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

        local results = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE id = %d AND user_id = %d LIMIT 1;
        ]], tonumber(inventory_id), tonumber(user_id)))
        local item = results[1]
        assert(item, "Item not found")

        local item_id = item.item_id
        local item = ITEMS[item_id]
        assert(item, "Item details not found")

        if item.type == "POTION" or item.type == "FOOD" then
            -- increase health, but not exceeding total_health
            local new_health = math.min(userData.health + item.health, userData.total_health)
            dbAdmin:exec(string.format([[
                UPDATE Users
                SET health = %d
                WHERE id = %d;
            ]], new_health, user_id))
        elseif item.type == "ENERGY" then
            -- increase energy
            dbAdmin:exec(string.format([[
                UPDATE Users SET stamina = total_stamina WHERE id = %d;
            ]], user_id))
        end

        -- delete item from inventory
        dbAdmin:exec(string.format([[
            DELETE FROM Inventory WHERE id = %d;
        ]], inventory_id))

        ao.send({ Target = msg.From, Status = "Success" })
    end
)

return {}
