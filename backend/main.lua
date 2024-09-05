-- testSQL process - cNxJjUzpB8_5iUCbeO-xsCIDxbdIQF85pMorHeYW_bE
-- testSQL2.1 process - EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc
-- cron10sec - tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE


-- Island movement happens on the frontend. Users can move to any area and that screen gets rendered. No blockchain interaction needed.

local sqlite3 = require("lsqlite3")
db = db or sqlite3.open_memory()
dbAdmin = require("@rakis/DbAdmin").new(db)
local json = require("json")

local helpers = require("helpers")


local IslandTransferFee = 0.01 -- wAR



Handlers.add(
    'Users.AddNewUser',
    Handlers.utils.hasMatchingTag('Action', 'AddNewUser'),
    function(msg)
        local user_address = msg.From
        local nft_address = msg.NFT_ADDRESS

        local query = string.format([[
            SELECT * FROM Users WHERE ADDRESS = "%s" AND COALESCE(NFT_ADDRESS, '') = COALESCE('%s', '');
        ]], user_address, nft_address)

        local profiles = dbAdmin:exec(query)
        assert(#profiles > 0, "User already exists")

        -- create new user. NFT_ADDRESS can be null
        dbAdmin:exec(string.format([[
            INSERT INTO Users (ADDRESS, NFT_ADDRESS) VALUES ("%s", "%s");
        ]], user_address, nft_address))

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

Handlers.add("User.Info",
    Handlers.utils.hasMatchingTag('Action', 'User.Info'),
    function(msg)
        local user_address = msg.From

        local profiles = dbAdmin:exec(string.format([[
            SELECT * FROM Users WHERE ADDRESS = "%s";
        ]], user_address))

        ao.send({ Target = msg.From, Data = json.encode(profiles) })
    end
)

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

-- TODO: Do this on Credit Notice for wAR
Handlers.add("Users.SetCurrentIsland",
    Handlers.utils.hasMatchingTag('Action', 'SetCurrentIsland'),
    function(msg)
        local user_address = msg.From
        local user_id = msg.UserId
        local island_id = msg.Island_ID

        -- check if user exists
        local userData = helpers.CheckUserExists(user_id, msg.From)
        -- check if corrent amount of wAR was sent
        assert(msg.wAR == IslandTransferFee, "Incorrect amount of wAR sent")


        dbAdmin:exec(string.format([[
            UPDATE Users SET CURRENT_ISLAND = %f WHERE ADDRESS = "%s";
        ]], island_id, user_address))

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

Handlers.add("Bank.Info",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Info'),
    function(msg)
        assert(msg.Token == "GOLD" or msg.Token == "DUMZ", "Invalid bank type")
        assert(not msg.UserId, "Pass in user id")

        local bank = dbAdmin:exec(string.format([[
            SELECT * FROM Bank WHERE USER_ID = %f;
        ]], msg.UserId))

        ao.send({ Target = msg.From, Data = json.encode(bank) })
    end
)

-- Bank.Deposit
Handlers.add("Bank.Deposit",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Deposit'),
    function(msg)
        assert(msg.Token == "GOLD" or msg.Token == "DUMZ", "Invalid bank type")
        assert(msg.UserId, "Pass in user id")
        assert(msg.Amount, "Pass in amount")

        -- get user data
        local userData = helpers.CheckUserExists(msg.UserId, msg.From)

        -- check if user has enough balance
        if msg.Token == "GOLD" then
            assert(userData.GOLD_BALANCE >= msg.Amount, "User does not have enough GOLD balance")
        else
            assert(userData.DUMZ_BALANCE >= msg.Amount, "User does not have enough DUMZ balance")
        end

        -- add a bank transaction
        dbAdmin:exec(string.format([[
            INSERT INTO BankTransactions (USER_ID, AMOUNT, TOKEN_TYPE, TRANSACTION_TYPE) VALUES (%f, %f, "%s", "DEPOSIT");
        ]], msg.UserId, msg.Amount, msg.Token))

        -- update bank balance
        if msg.Token == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Bank SET GOLD_AMOUNT = GOLD_AMOUNT + %f WHERE USER_ID = %f;
            ]], msg.Amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Bank SET DUMZ_AMOUNT = DUMZ_AMOUNT + %f WHERE USER_ID = %f;
            ]], msg.Amount, msg.UserId))
        end

        -- update user balance
        if msg.Token == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET GOLD_BALANCE = %f WHERE ID = %f;
            ]], userData.GOLD_BALANCE - msg.Amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET DUMZ_BALANCE = %f WHERE ID = %f;
            ]], userData.DUMZ_BALANCE - msg.Amount, msg.UserId))
        end

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

-- Bank.Withdraw
Handlers.add("Bank.Withdraw",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Withdraw'),
    function(msg)
        assert(msg.Token == "GOLD" or msg.Token == "DUMZ", "Invalid bank type")
        assert(msg.UserId, "Pass in user id")
        assert(msg.Amount, "Pass in amount")

        -- get user data
        local userData = helpers.checkUserExists(msg.UserId, msg.From)

        -- fetch bank data
        local bank = dbAdmin:exec(string.format([[
            SELECT * FROM Bank WHERE USER_ID = %f;
        ]], msg.UserId))
        assert(#bank > 0, "You do not have any tokens in your bank")
        local bankData = bank[1]

        -- check if bank has enough balance
        if msg.Token == "GOLD" then
            assert(bankData.GOLD_AMOUNT >= msg.Amount,
                "Your bank does not have enough GOLD balance. You can only withdraw %f GOLD", bankData.GOLD_AMOUNT)
        else
            assert(bankData.DUMZ_AMOUNT >= msg.Amount,
                "You bank does not have enough DUMZ balance. You can only withdraw %f DUMZ", bankData.DUMZ_AMOUNT)
        end

        -- add a bank transaction
        dbAdmin:exec(string.format([[
            INSERT INTO BankTransactions (USER_ID, AMOUNT, TOKEN_TYPE, TRANSACTION_TYPE) VALUES (%f, %f, "%s", "WITHDRAW");
        ]], msg.UserId, msg.Amount, msg.Token))

        -- update bank balance
        if msg.Token == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Bank SET GOLD_AMOUNT = GOLD_AMOUNT - %f WHERE USER_ID = %f;
            ]], msg.Amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Bank SET DUMZ_AMOUNT = DUMZ_AMOUNT - %f WHERE USER_ID = %f;
            ]], msg.Amount, msg.UserId))
        end

        -- update user balance
        if msg.Token == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET GOLD_BALANCE = %f WHERE ID = %f;
            ]], userData.GOLD_BALANCE + msg.Amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET DUMZ_BALANCE = %f WHERE ID = %f;
            ]], userData.DUMZ_BALANCE + msg.Amount, msg.UserId))
        end

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

--[[
     Bank Airdrop has to manually added to the database. Can make a helper function later.
   ]]
--

--[[
     Bank Push Out should make a dumz transaction from game ID to user address.
     Bank Pull In should listen to credit notice from user address and make a bank transaction for that User ID. Bank transaction type should be PULL_IN
   ]]
--

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
