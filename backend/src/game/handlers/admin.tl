require('utils.globals')
local helpers = require("game.helpers")
local json = require("json")

-- Send({Target = ao.id, Action = "Admin.Regenerate", UserId = "1"})
local function adminRegenerateHandler(msg: Message)
    assert(msg.From == ao.id, "Only the game server can regenerate users")
    local user_id = tonumber(msg.Tags.UserId)

    dbAdmin:exec(string.format([[
        UPDATE Users SET health = total_health, gold_balance = 10000, dumz_balance = 100, stamina = total_stamina WHERE id = %f;
    ]], user_id))

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(user_id), user_data)

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function adminSetCurrentSpotHandler(msg: Message)
    assert(msg.From == ao.id, "Only the game server can dynamically set the current spot")
    local user_id = tonumber(msg.Tags.UserId)
    local current_spot = tonumber(msg.Tags.CurrentSpot)
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_spot = %d WHERE id = %d;
    ]], current_spot, user_id))

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function sendUserAndBankData(msg: Message)
    assert(msg.From == ao.id, "Only the game server can dynamically set the current spot")
    local data = dbAdmin:exec(string.format([[SELECT * FROM Users]]))
    local data2 = dbAdmin:exec(string.format([[SELECT * FROM Bank]]))
    local data3 = dbAdmin:exec(string.format([[SELECT * FROM BankTransactions]]))

    for _, val in ipairs(data) do
       ao.send({Target="3wGAfN8l852iuIt6Kc8kjR6G5opcTa92jKP1aAv2iWY", Action="Backup.addAndUpdateUsers", UserId=tostring(val.id), Data=json.encode(val) })
    end
    for _, val in ipairs(data2) do
        ao.send({Target="3wGAfN8l852iuIt6Kc8kjR6G5opcTa92jKP1aAv2iWY", Action="Backup.addAndUpdateBank", Id=tostring(val.id), UserId=tostring(val.user_id), Data=json.encode(val) })
        ao.send({Target="Aoa2ZMDFrJdB_bPrCF_eUSCVKfXgx3e5nbVt6PmA870", Action="Bank.MainBankDataAddAndUpdate", Id=tostring(val.id), UserId=tostring(val.user_id), Data=json.encode(val) })
     end
     for _, val in ipairs(data3) do
        ao.send({Target="3wGAfN8l852iuIt6Kc8kjR6G5opcTa92jKP1aAv2iWY", Action="Backup.addAndUpdateBankTransactions", Id=tostring(val.id), UserId=tostring(val.user_id), Data=json.encode(val) })
        ao.send({Target="Aoa2ZMDFrJdB_bPrCF_eUSCVKfXgx3e5nbVt6PmA870", Action="Bank.MainBankTransactionsDataAddAndUpdate", Id=tostring(val.id), UserId=tostring(val.user_id), Data=json.encode(val) })
     end
end

Handlers.add("Admin.Regenerate", Handlers.utils.hasMatchingTag('Action', 'Admin.Regenerate'), adminRegenerateHandler)
Handlers.add("Admin.SetCurrentSpot", Handlers.utils.hasMatchingTag('Action', 'Admin.SetCurrentSpot'), adminSetCurrentSpotHandler)
Handlers.add("Admin.SendUserAndBankData", Handlers.utils.hasMatchingTag('Action', 'Admin.SendUserAndBankData'), sendUserAndBankData)

return {}