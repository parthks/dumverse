local helpers = require("helpers")

-- Handlers.add("test",
--     Handlers.utils.hasMatchingTag('Action', 'test'),
--     function(msg)
--         print(ITEMS)
--     end
-- )

Handlers.add("Shop.BuyItem",
    Handlers.utils.hasMatchingTag('Action', 'Shop.BuyItem'),
    function(msg)
        local user_id = msg.UserId
        local item_id = msg.Item_ID
        assert(item_id, "Item_ID is required")
        local amount = msg.Amount or 1
        local token_type = msg.Token_Type -- "GOLD" or "DUMZ"
        assert(token_type == "GOLD" or token_type == "DUMZ", "Invalid token type")

        -- check if item exists
        local item = ITEMS[item_id]
        assert(item, "Item does not exist")

        -- check if user has enough balance
        local userData = helpers.CheckUserExists(user_id, msg.From)
        if token_type == "GOLD" then
            assert(userData.GOLD_BALANCE >= item.gold_price * amount, "You does not have enough GOLD balance")
        else
            assert(userData.DUMZ_BALANCE >= item.dumz_price * amount, "You does not have enough DUMZ balance")
        end

        -- select inventory items and set equipped to true for new item
        local inventory = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE USER_ID = %f AND EQUIPPED = TRUE AND ITEM_TYPE = "%s";
        ]], user_id, item.type))

        -- only one item can be equipped at a time
        if #inventory > 0 then
            dbAdmin:exec(string.format([[
                UPDATE Inventory SET EQUIPPED = FALSE WHERE ID = %f;
            ]], inventory[1].ID))
        end

        -- update inventory
        dbAdmin:exec(string.format([[
            INSERT INTO Inventory (USER_ID, ITEM_ID, AMOUNT, EQUIPPED) VALUES (%f, "%s", %f, TRUE);
        ]], user_id, item_id, amount))

        -- update user balance
        if token_type == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET GOLD_BALANCE = %f WHERE ID = %f;
            ]], userData.GOLD_BALANCE - item.gold_price * amount, user_id))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET DUMZ_BALANCE = %f WHERE ID = %f;
            ]], userData.DUMZ_BALANCE - item.dumz_price * amount, user_id))
        end

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

return {}
