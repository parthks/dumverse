local helpers = require("helpers")
local json = require("json")

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

return {}
