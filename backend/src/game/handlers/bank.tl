local helpers = require("game.helpers")
require('utils.globals')
local constants = require("utils.constants")


local function transferFundsToBankHandler(msg: Message)
    assert(msg.Tags.TokenType == "GOLD" or msg.Tags.TokenType == "DUMZ" or msg.Tags.TokenType == "TRUNK", "Invalid bank type")
    assert(msg.Tags.UserId, "Pass in user id")
    assert(msg.Tags.Amount, "Pass in amount")
    local user_id = tonumber(msg.Tags.UserId)
    local tokenType = msg.Tags.TokenType as TokenType
    local amount = tonumber(msg.Tags.Amount)
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
        
    -- check if user has enough balance
    if tokenType == "GOLD" then
        assert(userData.gold_balance >= amount, "User does not have enough GOLD balance")
    elseif tokenType == "TRUNK" then
        assert(userData.trunk_balance >= amount, "User does not have enough TRUNK balance")
    else
        assert(userData.dumz_balance >= amount, "User does not have enough DUMZ balance")
    end

     -- update user balance
     if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %f WHERE id = %f;
        ]], userData.gold_balance - amount, msg.Tags.UserId))
    elseif tokenType == "TRUNK" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET trunk_balance = %f WHERE id = %f;
        ]], userData.trunk_balance - amount, msg.Tags.UserId))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = %f WHERE id = %f;
        ]], userData.dumz_balance - amount, msg.Tags.UserId))
    end

    ao.send({Target=constants.BANK_PROCESS_ID,Action="Bank.Deposit", UserId = tostring(user_id), TokenType = tokenType, Amount = tostring(amount)})
    ao.send({ Target = msg.From, Status = "Success" })
end

local function withdrawlFundsFromBankHandler(msg: Message)
    assert(constants.BANK_PROCESS_ID == msg.From, "You cant access this handler")
    local user_id = tonumber(msg.Tags.UserId)
    local tokenType = msg.Tags.TokenType as TokenType
    local amount = tonumber(msg.Tags.Amount)
    -- local userData: UserData = helpers.CheckUserExists(user_id, msg.From)

    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = gold_balance + %f WHERE id = %f;
        ]], amount, user_id))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = dumz_balance + %f WHERE id = %f;
        ]],  amount, user_id))
    end

end

local function bankAirdropHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local tokenType = msg.Tags.TokenType as TokenType
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    assert(tokenType == "GOLD" or tokenType == "DUMZ", "Invalid token type")
    assert(userData.nft_address,"You cant access the NFT Vault")
    ao.send({Target=constants.BANK_PROCESS_ID,Action="Bank.ClaimAirdrop", UserId = tostring(user_id), TokenType = tokenType})
    ao.send({ Target = msg.From, Status = "Success" })
end

Handlers.add("Game.TransferFundsToBank", Handlers.utils.hasMatchingTag('Action', 'Game.TransferFundsToBank'), transferFundsToBankHandler)
Handlers.add("Game.WithdrawlFundsFromBank", Handlers.utils.hasMatchingTag('Action', 'Game.WithdrawlFundsFromBank'), withdrawlFundsFromBankHandler)
Handlers.add("Game.BankAirdrop", Handlers.utils.hasMatchingTag('Action', 'Game.BankAirdrop'), bankAirdropHandler)


return {}