local helpers = require("game.helpers")
require('utils.globals')
local json = require("json")

local function inventoryInfoHandler(msg: Message)
    assert(msg.Tags.UserId, "Pass in user id")
    local user_id = tonumber(msg.Tags.UserId)

    helpers.CheckUserExists(user_id, msg.From)

    local inventory = dbAdmin:exec(string.format([[
        SELECT * FROM Inventory WHERE USER_ID = %f;
    ]], user_id))

    ao.send({ Target = msg.From, Data = json.encode(inventory) })
end

local function inventoryUseItemHandler(msg: Message)
    assert(msg.Tags.UserId, "Pass in user id")
    assert(msg.Tags.InventoryId, "Pass in inventory id")
    local user_id = tonumber(msg.Tags.UserId)
    local inventory_id = tonumber(msg.Tags.InventoryId)

    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    -- local current_spot = userData.current_spot
    -- check if current_spot is in REST_SPOTS
    assert(helpers.IsInRestSpot(userData), "User is not at a rest spot")

    local results = dbAdmin:exec(string.format([[
        SELECT * FROM Inventory WHERE id = %d AND user_id = %f LIMIT 1;
    ]], inventory_id, user_id))
    local item = results[1] as InventoryItem
    assert(item, "Item not found")

    local item_id = item.item_id
    local itemDetails = helpers.GetItemDetails(item_id)
    assert(itemDetails, "Item details not found")

    if itemDetails.type == "POTION" then
        local potionItem = itemDetails as PotionItem
        -- increase health, but not exceeding total_health
        local new_health = math.min(userData.health + potionItem.health, userData.total_health)
        dbAdmin:exec(string.format([[
            UPDATE Users
            SET health = %d
            WHERE id = %d;
        ]], new_health, user_id))

    elseif itemDetails.type == "FOOD" then
        local foodItem = itemDetails as FoodItem
        -- increase health
        local new_health = userData.health
        if foodItem.id == "FOOD_1" then
            new_health = userData.health + 1
        elseif foodItem.id == "FOOD_2" then
            -- new_health = math.min(userData.health + foodItem.health, userData.total_health)
            new_health = userData.total_health
        end
        dbAdmin:exec(string.format([[
            UPDATE Users SET health = %d WHERE id = %d;
        ]], new_health, user_id))

    elseif itemDetails.type == "ENERGY" then
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

local function inventoryRepairItemHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local inventory_id = tonumber(msg.Tags.InventoryId)
    assert(inventory_id, "Pass in inventory_id")
    helpers.CheckUserExists(user_id, msg.From)

    dbAdmin:exec(string.format([[
        UPDATE Inventory SET item_health = total_item_health WHERE id = %d AND user_id = %f;
    ]], inventory_id, user_id))

    dbAdmin:exec(string.format([[
        UPDATE Users SET dumz_balance = dumz_balance - 5 WHERE id = %f;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end

-- Add handlers
Handlers.add("Inventory.Info", Handlers.utils.hasMatchingTag('Action', 'Inventory.Info'), inventoryInfoHandler)
Handlers.add("Inventory.UseItem", Handlers.utils.hasMatchingTag('Action', 'Inventory.UseItem'), inventoryUseItemHandler)
Handlers.add("Inventory.RepairItem", Handlers.utils.hasMatchingTag('Action', 'Inventory.RepairItem'), inventoryRepairItemHandler)

return {}