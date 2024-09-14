local helpers = require("helpers")
local json = require("json")


Handlers.add("Bank.Info",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Info'),
    function(msg)
        assert(msg.UserId, "Pass in user id")

        local bank = dbAdmin:exec(string.format([[
            SELECT * FROM Bank WHERE user_id = %f;
        ]], msg.UserId, msg.UserId))
        assert(#bank > 0, "User does not have a bank account")

        local bankTransactions = dbAdmin:exec(string.format([[
            SELECT * FROM BankTransactions WHERE user_id = %f;
        ]], msg.UserId))

        Send({ Target = msg.From, Data = json.encode({ bank = bank[1], transactions = bankTransactions }) })
    end
)

-- Bank.Deposit
Handlers.add("Bank.Deposit",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Deposit'),
    function(msg)
        assert(msg.TokenType == "GOLD" or msg.TokenType == "DUMZ", "Invalid bank type")
        assert(msg.UserId, "Pass in user id")
        assert(msg.Amount, "Pass in amount")
        local amount = tonumber(msg.Amount)

        -- get user data
        local userData = helpers.CheckUserExists(msg.UserId, msg.From)

        -- check if user has enough balance
        if msg.TokenType == "GOLD" then
            assert(userData.gold_balance >= amount, "User does not have enough GOLD balance")
        else
            assert(userData.dumz_balance >= amount, "User does not have enough DUMZ balance")
        end

        -- add a bank transaction
        dbAdmin:exec(string.format([[
            INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%f, %f, "%s", "DEPOSIT", %f);
        ]], msg.UserId, amount, msg.TokenType, msg.Timestamp))

        -- update bank balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Bank SET gold_amount = gold_amount + %f WHERE user_id = %f;
            ]], amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Bank SET dumz_amount = dumz_amount + %f WHERE user_id = %f;
            ]], amount, msg.UserId))
        end

        -- update user balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET gold_balance = %f WHERE id = %f;
            ]], userData.gold_balance - amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET dumz_balance = %f WHERE id = %f;
            ]], userData.dumz_balance - amount, msg.UserId))
        end

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

-- Bank.Withdraw
Handlers.add("Bank.Withdraw",
    Handlers.utils.hasMatchingTag('Action', 'Bank.Withdraw'),
    function(msg)
        assert(msg.TokenType == "GOLD" or msg.TokenType == "DUMZ", "Invalid bank type")
        assert(msg.UserId, "Pass in user id")
        assert(msg.Amount, "Pass in amount")
        local amount = tonumber(msg.Amount)

        -- get user data
        local userData = helpers.CheckUserExists(msg.UserId, msg.From)

        -- fetch bank data
        local bank = dbAdmin:exec(string.format([[
            SELECT * FROM Bank WHERE user_id = %f;
        ]], msg.UserId))
        assert(#bank > 0, "You do not have any tokens in your bank")
        local bankData = bank[1]

        -- check if bank has enough balance
        if msg.TokenType == "GOLD" then
            assert(bankData.gold_amount >= amount,
                "Your bank does not have enough GOLD balance. You can only withdraw %f GOLD", bankData.gold_amount)
        else
            assert(bankData.dumz_amount >= amount,
                "You bank does not have enough DUMZ balance. You can only withdraw %f DUMZ", bankData.dumz_amount)
        end



        -- update bank balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Bank SET gold_amount = gold_amount - %f WHERE user_id = %f;
            ]], amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Bank SET dumz_amount = dumz_amount - %f WHERE user_id = %f;
            ]], amount, msg.UserId))
        end

        -- update user balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET gold_balance = %f WHERE id = %f;
            ]], userData.gold_balance + amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET dumz_balance = %f WHERE id = %f;
            ]], userData.dumz_balance + amount, msg.UserId))
        end

        -- add a bank transaction
        dbAdmin:exec(string.format([[
                    INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%f, %f, "%s", "WITHDRAW", %f);
        ]], msg.UserId, amount, msg.TokenType, msg.Timestamp))

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

-- Claim Airdrop
Handlers.add("Bank.ClaimAirdrop",
    Handlers.utils.hasMatchingTag('Action', 'Bank.ClaimAirdrop'),
    function(msg)
        assert(msg.TokenType == "GOLD" or msg.TokenType == "DUMZ", "Invalid bank type")
        assert(msg.UserId, "Pass in user id")

        -- get user data
        local userData = helpers.CheckUserExists(msg.UserId, msg.From)

        -- fetch bank data
        local bank = dbAdmin:exec(string.format([[
            SELECT * FROM Bank WHERE user_id = %f;
        ]], msg.UserId))
        assert(#bank > 0, "You do not have any tokens in your bank")
        local bankData = bank[1]

        -- check if bank has enough balance
        if msg.TokenType == "GOLD" then
            assert(bankData.nft_gold_amount ~= 0, "You do not have any GOLD airdrop available")
        else
            assert(bankData.nft_dumz_amount ~= 0, "You do not have any DUMZ airdrop available")
        end

        -- get airdrop amount
        local amount = bankData.nft_gold_amount
        if msg.TokenType == "DUMZ" then
            amount = bankData.nft_dumz_amount
        end

        -- update bank balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Bank SET nft_gold_amount = 0 WHERE user_id = %f;
            ]], msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Bank SET nft_dumz_amount = 0 WHERE user_id = %f;
            ]], msg.UserId))
        end

        -- update user balance
        if msg.TokenType == "GOLD" then
            dbAdmin:exec(string.format([[
                UPDATE Users SET gold_balance = gold_balance + %f WHERE id = %f;
            ]], amount, msg.UserId))
        else
            dbAdmin:exec(string.format([[
                UPDATE Users SET dumz_balance = dumz_balance + %f WHERE id = %f;
            ]], amount, msg.UserId))
        end

        -- add a bank transaction
        dbAdmin:exec(string.format([[
            INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%f, %f, "%s", "CLAIM_AIRDROP", %f);
        ]], msg.UserId, amount, msg.TokenType, msg.Timestamp))

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
