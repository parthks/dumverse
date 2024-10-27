require('utils.globals')

-- Send({Target = ao.id, Action = "Admin.Regenerate", UserId = "1"})
local function adminRegenerateHandler(msg: Message)
    assert(msg.From == ao.id, "Only the game server can regenerate users")
    local user_id = tonumber(msg.Tags.UserId)

    dbAdmin:exec(string.format([[
        UPDATE Users SET health = total_health, gold_balance = 10000, dumz_balance = 100, stamina = total_stamina WHERE id = %f;
    ]], user_id))

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

Handlers.add("Admin.Regenerate", Handlers.utils.hasMatchingTag('Action', 'Admin.Regenerate'), adminRegenerateHandler)
Handlers.add("Admin.SetCurrentSpot", Handlers.utils.hasMatchingTag('Action', 'Admin.SetCurrentSpot'), adminSetCurrentSpotHandler)

return {}