local helpers = require("game.helpers")
require('utils.globals')



local function bankAcceptQuestHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update user quest data
    dbAdmin:exec(string.format([[
        UPDATE Users SET special_item_key = 0 WHERE id = %d;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function nftShopAcceptQuestHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update user quest data
    dbAdmin:exec(string.format([[
        UPDATE Users SET special_item_thread = 0 WHERE id = %d;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function weaponAcceptQuestHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update user quest data
    dbAdmin:exec(string.format([[
        UPDATE Users SET special_item_bark = 0 WHERE id = %d;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function shopAcceptQuestHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update user quest data
    dbAdmin:exec(string.format([[
        UPDATE Users SET special_item_heart = 0 WHERE id = %d;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end

local function denAcceptQuestHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update user quest data
    dbAdmin:exec(string.format([[
        UPDATE Users SET special_item_kitten = 0 WHERE id = %d;
    ]], user_id))

    ao.send({ Target = msg.From, Status = "Success" })
end


-- local constants = require("utils.constants")
-- local function shopQuestHeartInfo(msg: Message)
--     assert(msg.From== constants.COMBAT_PROCESS_ID,"You can't call this handler")
--     local user_id = tonumber(msg.Tags.UserId)
--     local user_address=msg.Tags.UserAddress
--     local total_heart=tonumber(msg.Tags.TotalHeart)
--     helpers.CheckUserExists(user_id, user_address)

--     dbAdmin:exec(string.format([[
--         UPDATE Users SET special_item_heart = %d WHERE address = %s
--     ]],total_heart, user_address))

--     if total_heart==4 then
--         local results = dbAdmin:exec(string.format([[
--             SELECT * FROM Users WHERE address = %s ;
--         ]], user_address))
--         local users_info = results[1] as UserData
--         local new_health = users_info.total_health + 1
--         dbAdmin:exec(string.format([[
--             UPDATE Users SET total_health = %d WHERE address = %s;
--         ]],new_health, user_address))
--     end

--     ao.send({ Target = msg.From, Status = "Success" })
-- end



Handlers.add("Quest.BankQuestAccept", Handlers.utils.hasMatchingTag('Action', 'Quest.BankQuestAccept'), bankAcceptQuestHandler)
Handlers.add("Quest.NFTShopQuestAccept", Handlers.utils.hasMatchingTag('Action', 'Quest.NFTShopQuestAccept'), nftShopAcceptQuestHandler)
Handlers.add("Quest.WeaponQuestAccept", Handlers.utils.hasMatchingTag('Action', 'Quest.WeaponQuestAccept'), weaponAcceptQuestHandler)
Handlers.add("Quest.ShopQuestAccept", Handlers.utils.hasMatchingTag('Action', 'Quest.ShopQuestAccept'), shopAcceptQuestHandler)
Handlers.add("Quest.DenQuestAccept", Handlers.utils.hasMatchingTag('Action', 'Quest.DenQuestAccept'), denAcceptQuestHandler)
-- Handlers.add("Quest.ShopHeartQuest", Handlers.utils.hasMatchingTag('Action', 'Quest.ShopHeartQuest'), shopQuestHeartInfo)

return {}