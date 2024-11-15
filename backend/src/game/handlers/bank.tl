local helpers = require("game.helpers")
require('utils.globals')
local json = require("json")
local constants = require("utils.constants")


local function bankInfoHandler(msg: Message)
    assert(msg.Tags.UserId, "Pass in user id")

    local bank = dbAdmin:exec(string.format([[
        SELECT * FROM Bank WHERE user_id = %f;
    ]], msg.Tags.UserId))
    assert(#bank > 0, "User does not have a bank account")

    local bankTransactions = dbAdmin:exec(string.format([[
        SELECT * FROM BankTransactions WHERE user_id = %f;
    ]], msg.Tags.UserId))

    ao.send({ Target = msg.From, Data = json.encode({ bank = bank[1], transactions = bankTransactions }) })
end

local function bankDepositHandler(msg: Message)
    assert(msg.Tags.TokenType == "GOLD" or msg.Tags.TokenType == "DUMZ", "Invalid bank type")
    assert(msg.Tags.UserId, "Pass in user id")
    assert(msg.Tags.Amount, "Pass in amount")
    local amount = tonumber(msg.Tags.Amount)
    local user_id = tonumber(msg.Tags.UserId)

    -- get user data
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    local tokenType = msg.Tags.TokenType as TokenType


    -- check if user has enough balance
    if tokenType == "GOLD" then
        assert(userData.gold_balance >= amount, "User does not have enough GOLD balance")
    else
        assert(userData.dumz_balance >= amount, "User does not have enough DUMZ balance")
    end

    -- add a bank transaction
    dbAdmin:exec(string.format([[
        INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%d, %f, "%s", "DEPOSIT", %f);
    ]], user_id, amount, tokenType, msg.Timestamp))

    -- update bank balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Bank SET gold_amount = gold_amount + %f WHERE user_id = %f;
        ]], amount, msg.Tags.UserId))
    else
        dbAdmin:exec(string.format([[
            UPDATE Bank SET dumz_amount = dumz_amount + %f WHERE user_id = %f;
        ]], amount, msg.Tags.UserId))
    end

    -- update user balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %f WHERE id = %f;
        ]], userData.gold_balance - amount, msg.Tags.UserId))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = %f WHERE id = %f;
        ]], userData.dumz_balance - amount, msg.Tags.UserId))
    end

    ao.send({ Target = msg.From, Status = "Success" })
end

local function bankWithdrawHandler(msg: Message)
    local tokenType = msg.Tags.TokenType as TokenType
    assert(tokenType == "GOLD" or tokenType == "DUMZ", "Invalid bank type")
    assert(msg.Tags.UserId, "Pass in user id")
    assert(msg.Tags.Amount, "Pass in amount")
    local amount = tonumber(msg.Tags.Amount)
    local user_id = tonumber(msg.Tags.UserId)

    -- get user data
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)

    -- fetch bank data
    local bank = dbAdmin:exec(string.format([[
        SELECT * FROM Bank WHERE user_id = %d;
    ]], user_id))
    assert(#bank > 0, "You do not have any tokens in your bank")
    local bankData: BankAccountData = bank[1] as BankAccountData
    

    -- check if bank has enough balance
    if tokenType == "GOLD" then
        assert(bankData.gold_amount >= amount,
            string.format("Your bank does not have enough GOLD balance. You can only withdraw %f GOLD", bankData.gold_amount))
    else
        assert(bankData.dumz_amount >= amount,
            string.format("Your bank does not have enough DUMZ balance. You can only withdraw %f DUMZ", bankData.dumz_amount)   )
    end

    -- update bank balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Bank SET gold_amount = gold_amount - %f WHERE user_id = %f;
        ]], amount, msg.Tags.UserId))
    else
        dbAdmin:exec(string.format([[
            UPDATE Bank SET dumz_amount = dumz_amount - %f WHERE user_id = %f;
        ]], amount, msg.Tags.UserId))
    end

    -- update user balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %f WHERE id = %f;
        ]], userData.gold_balance + amount, msg.Tags.UserId))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = %f WHERE id = %f;
        ]], userData.dumz_balance + amount, msg.Tags.UserId))
    end

    -- add a bank transaction
    dbAdmin:exec(string.format([[
        INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%f, %f, "%s", "WITHDRAW", %f);
    ]], msg.Tags.UserId, amount, tokenType, msg.Timestamp))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function bankClaimAirdropHandler(msg: Message)
    local tokenType = msg.Tags.TokenType as TokenType
    local user_id = tonumber(msg.Tags.UserId)
    assert(tokenType == "GOLD" or tokenType == "DUMZ", "Invalid bank type")

    -- check user data
    helpers.CheckUserExists(user_id, msg.From)

    -- fetch bank data
    local bank = dbAdmin:exec(string.format([[
        SELECT * FROM Bank WHERE user_id = %d;
    ]], user_id))
    assert(#bank > 0, "You do not have any tokens in your bank")
    local bankData: BankAccountData = bank[1] as BankAccountData

    -- check if bank has enough balance
    if tokenType == "GOLD" then
        assert(bankData.nft_gold_amount ~= 0, "You do not have any GOLD airdrop available")
    else
        assert(bankData.nft_dumz_amount ~= 0, "You do not have any DUMZ airdrop available")
    end

    -- get airdrop amount
    local amount = bankData.nft_gold_amount
    if tokenType == "DUMZ" then
        amount = bankData.nft_dumz_amount
    end

    -- update bank balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Bank SET nft_gold_amount = 0 WHERE user_id = %d;
        ]], user_id))
    else
        dbAdmin:exec(string.format([[
            UPDATE Bank SET nft_dumz_amount = 0 WHERE user_id = %d;
        ]], user_id))
    end

    -- update user balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = gold_balance + %f WHERE id = %d;
        ]], amount, user_id))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = dumz_balance + %f WHERE id = %d;
        ]], amount, user_id))
    end

    -- add a bank transaction
    dbAdmin:exec(string.format([[
        INSERT INTO BankTransactions (user_id, amount, token_type, transaction_type, created_at) VALUES (%d, %f, "%s", "CLAIM_AIRDROP", %f);
    ]], user_id, amount, tokenType, msg.Timestamp))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function bankPushOutHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)
    local amount = tonumber(msg.Tags.Amount)

    -- fetch bank data
    local bank = dbAdmin:exec(string.format([[
        SELECT * FROM Bank WHERE user_id = %d;
    ]], user_id))
    assert(#bank > 0, "You do not have any tokens in your bank")
    local bankData: BankAccountData = bank[1] as BankAccountData

    -- check if bank has enough balance
    assert(bankData.dumz_amount >= amount,
        string.format("Your bank does not have enough DUMZ balance. You can only transfer out %f DUMZ", bankData.dumz_amount))

    -- update bank balance
    dbAdmin:exec(string.format([[
        UPDATE Bank SET dumz_amount = dumz_amount - %f WHERE user_id = %d;
    ]], amount, user_id))

    -- send dumz to user address
    ao.send({ Target = constants.DUMZ_TOKEN_PROCESS_ID, Action = "Transfer", Recipient = msg.From, ["X-UserId"] = tostring(user_id), Quantity = tostring(amount) })
    ao.send({ Target = msg.From, Status = "Success" })
end

local function bankPushInHandler(msg: Message)
    assert(msg.From == constants.DUMZ_TOKEN_PROCESS_ID, "Invalid sender. Expected Dumz Token Process ID.")

    local user_id = tonumber(msg.Tags["X-UserId"])
    local fromAddress = msg.Tags.Sender
    local amount = tonumber(msg.Tags.Quantity)
    helpers.CheckUserExists(user_id, fromAddress)

    -- update bank balance
    dbAdmin:exec(string.format([[
        UPDATE Bank SET dumz_amount = dumz_amount + %f WHERE user_id = %d;
    ]], amount, user_id))

    -- send dumz to user address
    ao.send({ Target = fromAddress, Status = "Success" })
end

-- local function bankAcceptQuestHandler(msg: Message)
--     local user_id = tonumber(msg.Tags.UserId)
--     helpers.CheckUserExists(user_id, msg.From)

--     -- update user quest data
--     dbAdmin:exec(string.format([[
--         UPDATE Users SET special_item_key = 0 WHERE id = %d;
--     ]], user_id))

--     ao.send({ Target = msg.From, Status = "Success" })
-- end

-- Add handlers
Handlers.add("Bank.Info", Handlers.utils.hasMatchingTag('Action', 'Bank.Info'), bankInfoHandler)
Handlers.add("Bank.Deposit", Handlers.utils.hasMatchingTag('Action', 'Bank.Deposit'), bankDepositHandler)
Handlers.add("Bank.Withdraw", Handlers.utils.hasMatchingTag('Action', 'Bank.Withdraw'), bankWithdrawHandler)
Handlers.add("Bank.ClaimAirdrop", Handlers.utils.hasMatchingTag('Action', 'Bank.ClaimAirdrop'), bankClaimAirdropHandler)

--[[
     Bank Airdrop has to manually added to the database. Can make a helper function later.
   ]]
--

--[[
     Bank Push Out should make a dumz transaction from game ID to user address.
     Bank Pull In should listen to credit notice from user address and make a bank transaction for that User ID. Bank transaction type should be PULL_IN
   ]]
--
Handlers.add("Bank.PushOut", Handlers.utils.hasMatchingTag('Action', 'Bank.PushOut'), bankPushOutHandler)
Handlers.add("Bank.PushIn", Handlers.utils.hasMatchingTag('Action', 'Credit-Notice'), bankPushInHandler)
-- Handlers.add("Bank.AcceptQuest", Handlers.utils.hasMatchingTag('Action', 'Bank.AcceptQuest'), bankAcceptQuestHandler)

return {}