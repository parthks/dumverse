local helpers = require("helpers")

-- Handlers.add("test",
--     Handlers.utils.hasMatchingTag('Action', 'test'),
--     function(msg)
--         print(ITEMS)
--     end
-- )

-- TODO: Implement selling items from inventory

Handlers.add("Shop.Info",
    Handlers.utils.hasMatchingTag('Action', 'Shop.Info'),
    function(msg)
        return Send({
            Target = msg.From,
            Status = "Success",
            Data = {
                items = ITEMS,
            }
        })
    end
)

-- TODO: make sql queries a transaction. Users can submit multiple messages in quick succession and buy multiple items without any checks.
Handlers.add("Shop.BuyItem",
    Handlers.utils.hasMatchingTag('Action', 'Shop.BuyItem'),
    function(msg)
        local user_id = msg.UserId
        local item_id = msg.ItemId
        assert(item_id, "ItemId is required")
        -- local amount = 1
        local token_type = msg.TokenType -- "GOLD" or "DUMZ"
        assert(token_type == "GOLD" or token_type == "DUMZ", "Invalid token type")

        -- check if item exists
        local item = ITEMS[item_id]
        assert(item, "Item does not exist")

        -- check if user has enough balance
        local userData = helpers.CheckUserExists(user_id, msg.From)
        if token_type == "GOLD" then
            assert(userData.gold_balance >= item.gold_price, "You does not have enough GOLD balance")
        else
            assert(userData.dumz_balance >= item.dumz_price, "You does not have enough DUMZ balance")
        end

        -- select inventory items and set equipped to true for new item
        local inventory = dbAdmin:exec(string.format([[
            SELECT * FROM Inventory WHERE user_id = %f AND equipped = TRUE AND item_type = "%s";
        ]], user_id, item.type))

        -- only one item can be equipped at a time
        if #inventory > 0 then
            dbAdmin:exec(string.format([[
                UPDATE Inventory SET equipped = FALSE WHERE id = %f;
            ]], inventory[1].id))
        end

        -- update inventory
        dbAdmin:exec(string.format([[
            INSERT INTO Inventory (user_id, item_id, equipped, item_type) VALUES (%f, "%s", %f, TRUE, "%s");
        ]], user_id, item_id, item.type))

        -- update user balance
        if token_type == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET gold_balance = %f WHERE ID = %f;
            ]], userData.gold_balance - item.gold_price, user_id))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET dumz_balance = %f WHERE ID = %f;
            ]], userData.dumz_balance - item.dumz_price, user_id))
        end

        -- update user stats
        local baseStats = helpers.CalculateUserBaseStats(userData)
        if (item.damage) then
            dbAdmin:exec(string.format([[
                UPDATE Users SET damage = %f WHERE ID = %f;
            ]], baseStats.damage + item.damage, user_id))
        end
        if (item.defense) then
            dbAdmin:exec(string.format([[
                UPDATE Users SET defense = %f WHERE ID = %f;
            ]], baseStats.defense + item.defense, user_id))
        end
        if (item.health) then
            dbAdmin:exec(string.format([[
                UPDATE Users SET health = %f WHERE ID = %f;
            ]], baseStats.health + item.health, user_id))
        end
        if (item.stamina) then
            dbAdmin:exec(string.format([[
                UPDATE Users SET stamina_balance = %f WHERE ID = %f;
            ]], baseStats.stamina + item.stamina, user_id))
        end

        return Send({ Target = msg.From, Status = "Success" })
    end
)

return {}
