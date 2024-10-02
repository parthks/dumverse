local helpers = require("game.helpers")
require('utils.globals')
local json = require("json")
local constants = require("utils.constants")

local function shopInfoHandler(msg: Message)
    ao.send({
        Target = msg.From,
        Status = "Success",
        Data = json.encode({
            items = constants.ALL_ITEMS
        })
    })
end

local function shopBuyItemHandler(msg: Message)
    local tokenType = msg.Tags.TokenType as TokenType
    assert(tokenType == "GOLD" or tokenType == "DUMZ", "Invalid token type")

    local user_id = tonumber(msg.Tags.UserId)
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)

    local item_id = msg.Tags.ItemId
    assert(item_id, "ItemId is required")

    -- Find the item in the appropriate category
    local item = helpers.GetItemDetails(item_id)
    assert(item, "Item does not exist")

    -- Check if item has the correct price type
    if tokenType == "GOLD" then
        assert(item.gold_price, "Item does not have a gold price")
    else
        assert(item.dumz_price, "Item does not have a dumz price")
    end

    -- Check if user has enough balance
    
    if tokenType == "GOLD" then
        assert(userData.gold_balance >= item.gold_price, "You do not have enough GOLD balance")
    else
        assert(userData.dumz_balance >= item.dumz_price, "You do not have enough DUMZ balance")
    end

    -- Update inventory (unequip previous item of the same type if exists)
    local inventory = dbAdmin:exec(string.format([[
        SELECT * FROM Inventory WHERE user_id = %d AND equipped = TRUE AND item_type = "%s";
    ]], user_id, item.type))

    if #inventory > 0 then
        dbAdmin:exec(string.format([[
            UPDATE Inventory SET equipped = FALSE WHERE id = %d;
        ]], inventory[1].id))
    end

    -- Add new item to inventory
    dbAdmin:exec(string.format([[
        INSERT INTO Inventory (user_id, item_id, item_type, equipped) VALUES (%d, "%s", "%s", TRUE);
    ]], user_id, item_id, item.type))

    -- Update user balance
    local newBalance: number
    if tokenType == "GOLD" then
        newBalance = userData.gold_balance - item.gold_price
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %f WHERE id = %d;
        ]], newBalance, user_id))
    else
        newBalance = userData.dumz_balance - item.dumz_price
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = %f WHERE id = %d;
        ]], newBalance, user_id))
    end

    -- Update user stats
    local baseStats = helpers.CalculateUserBaseStats(userData)
    if item.type == "WEAPON" then
        local weaponItem = item as WeaponItem
        dbAdmin:exec(string.format([[
            UPDATE Users SET damage = %f WHERE id = %d;
        ]], baseStats.damage + weaponItem.damage, user_id))
    elseif item.type == "ARMOR" then
        local armorItem = item as ArmorItem
        dbAdmin:exec(string.format([[
            UPDATE Users SET defense = %f WHERE id = %d;
        ]], baseStats.defense + armorItem.defense, user_id))
    end

    ao.send({ Target = msg.From, Status = "Success" })
end

-- Add handlers
Handlers.add("Shop.Info", Handlers.utils.hasMatchingTag('Action', 'Shop.Info'), shopInfoHandler)
Handlers.add("Shop.BuyItem", Handlers.utils.hasMatchingTag('Action', 'Shop.BuyItem'), shopBuyItemHandler)

-- TODO: Implement selling items from inventory

return {}