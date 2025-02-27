local json = require("json")
local helpers = require("game.helpers")
local constants = require("utils.constants")
local utils = require("utils.utils.tl-utils")

local REST_SPOTS = constants.REST_SPOTS;

global ClaimedNFTs: {string}
if not ClaimedNFTs then
    ClaimedNFTs = {}
end

local record Daily_Daily_Gold_user_log_entry
    message: string
    timestamp: integer
end

local record Daily_Gold_user_dataType 
  user_id: number
  timestamp: number
  logs: {Daily_Daily_Gold_user_log_entry}
  gold: number
end


global Daily_Gold: {number:Daily_Gold_user_dataType}
if not Daily_Gold then
    Daily_Gold = {}
end

local function setCurrentIslandHandler(msg: Message)
    local user_address = msg.From
    local user_id = tonumber(msg.Tags.UserId)
    local island_id = msg.Tags.Island_ID

    -- check if user exists
    helpers.CheckUserExists(user_id, msg.From)
    -- check if correct amount of wAR was sent
    -- assert(msg.wAR == ISLAND_TRANSFER_FEE, "Incorrect amount of wAR sent")

    dbAdmin:exec(string.format([[
        UPDATE Users SET CURRENT_ISLAND = %f WHERE address = "%s";
    ]], island_id, user_address))

    ao.send({ Target = msg.From, Status = "Success" })
end

-- local function setCurrentLocationHandler(msg: Message)
--     local user_id = tonumber(msg.Tags.UserId)
--     local location_level = tonumber(msg.Tags.Level)

--     -- check if user exists
--     helpers.CheckUserExists(user_id, msg.From)

--     assert(location_level, "Location level is required")
--     assert(location_level == 0 or location_level == 28 or location_level == 55, "Can only travel to locations 28 or 55")

--     dbAdmin:exec(string.format([[
--         UPDATE Users SET current_spot = %f WHERE id = %f;
--     ]], location_level, user_id))

--     ao.send({ Target = msg.From, Status = "Success" })
-- end

local function OneOfOnesSpecialItemsHandler(nft_address: string, user_id: number)
    if utils.includes(nft_address, constants.ONE_OF_ONE_ASSET_IDS) then
        -- 10 cake, 5 potions, 4 joose
        print("Granting special items to 1/1 NFT user")
        for _ = 1, 10 do
            dbAdmin:exec(string.format([[
                INSERT INTO Inventory (user_id, item_id, item_type) VALUES (%d, "%s", "%s");
            ]], user_id, "FOOD_1", "FOOD"))
        end
        for _ = 1, 5 do
            dbAdmin:exec(string.format([[
                INSERT INTO Inventory (user_id, item_id, item_type) VALUES (%d, "%s", "%s");
            ]], user_id, "POTION_1", "POTION"))
        end
        for _ = 1, 4 do
            dbAdmin:exec(string.format([[
                INSERT INTO Inventory (user_id, item_id, item_type) VALUES (%d, "%s", "%s");
            ]], user_id, "ENERGY_1", "ENERGY"))
        end
    end
end

local function addNewUserHandler(msg: Message)
    local user_address = msg.From
    local nft_address = msg.Tags.NFT_Address
    local name = msg.Tags.Name
    assert(name and name ~= "", "Name is required")
    
    local nft_already_claimed: boolean = false
    local getUserQuery: string
    if nft_address then
        for _, value in ipairs(ClaimedNFTs) do
            if nft_address == value then
                nft_already_claimed = true
                break
            end
        end

        if not nft_already_claimed then
             table.insert(ClaimedNFTs, nft_address)
        end
        
        getUserQuery = string.format([[
            SELECT * FROM Users WHERE address = "%s" AND nft_address = "%s";
        ]], user_address, nft_address)
    else
        getUserQuery = string.format([[
            SELECT * FROM Users WHERE address = "%s";
        ]], user_address)
    end

    local profiles = dbAdmin:exec(getUserQuery)
    assert(#profiles == 0, "User already exists")

    local nft_dumz_amount: number
    local nft_gold_amount: number

    if not nft_already_claimed then
     nft_dumz_amount, nft_gold_amount = helpers.getNFTBankAmountForNFT(nft_address)
    else
         nft_dumz_amount = 0
         nft_gold_amount = 0
    end
    
    local starting_gold = 0
    local starting_dumz = 0
    local bank_gold_amount = 0
    local bank_dumz_amount = 0

    -- Insert new user
    local tempUserData = {
        nft_address = nft_address,
    }
    local baseStats = helpers.CalculateUserBaseStats(tempUserData)

    dbAdmin:exec(string.format([[
        INSERT INTO Users (address, name, nft_address, gold_balance, dumz_balance, damage, defense, health, stamina, total_health, total_stamina)
        VALUES ('%s', '%s', %s, %f, %f, %f, %f, %f, %f, %f, %f);
    ]], user_address, name, nft_address and string.format("'%s'", nft_address) or "NULL", starting_gold,
        starting_dumz, baseStats.damage, baseStats.defense, baseStats.health, baseStats.stamina,
        baseStats.total_health, baseStats.total_stamina))

        -- dbAdmin:exec(string.format([[
        --     INSERT INTO Leaderboard (address, name, nft_address, gold_earned, gold_lost, enemy_killed, player_death, death_streak, pvp)
        --     VALUES ('%s', '%s', %s, %d, %d, %d, %d, %d, %d);
        -- ]], user_address, name, "NULL",0,0,0,0,0,0))

    -- Get the last inserted ID
    local insert_user_result = dbAdmin:exec(getUserQuery)

    assert(insert_user_result and #insert_user_result > 0, "Failed to insert new user")
    local newUserId = insert_user_result[1].id

    -- -- Insert into Bank
    -- local insert_bank_result = dbAdmin:exec(string.format([[
    --     INSERT INTO Bank (user_id, gold_amount, dumz_amount, nft_gold_amount, nft_dumz_amount)
    --     VALUES (%d, %f, %f, %f, %f);
    -- ]], newUserId, bank_gold_amount, bank_dumz_amount, nft_gold_amount, nft_dumz_amount))

    -- assert(insert_bank_result, "Failed to insert into Bank")

    ao.send({Target = constants.BANK_PROCESS_ID, Action = "Bank.InsertDataIntoMainBank", UserId = tostring(newUserId), GoldAmount = tostring(bank_gold_amount), DumzAmount = tostring(bank_dumz_amount), NFTGoldAmount = tostring(nft_gold_amount), NFTDumzAmount = tostring(nft_dumz_amount)})

    OneOfOnesSpecialItemsHandler(nft_address, newUserId as number)
    
    -- Debug print
    print("New user created with ID: " .. tostring(newUserId))

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], newUserId)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(newUserId), user_data)
    -- local user_bank: BankAccountData = dbAdmin:exec(string.format([[SELECT * FROM Bank WHERE user_id = %f]], newUserId)) [1] as BankAccountData
    -- helpers.sendBankDataToBackupProcess(tonumber(newUserId), user_bank.id ,user_bank)

    ao.send({
        Target = msg.From,
        Data = json.encode({
            data = insert_user_result[1],
            status = "Success"
        })
    })
end

local function upgradeExistingProfileHandler(msg: Message)
    local user_address = msg.From
    local nft_address = msg.Tags.NFT_Address
    assert(nft_address, "NFT_Address is required")

    local userData = dbAdmin:exec(string.format([[
        SELECT * FROM Users WHERE address = "%s" and nft_address is NULL;
    ]], user_address))
    assert(#userData == 1, "User not found")
    local user_id = userData[1].id

    local nft_already_claimed: boolean = false

    for _, value in ipairs(ClaimedNFTs) do
        if nft_address == value then
            nft_already_claimed = true
            break
        end
    end

    -- update nft_address
    local tempUserData = {
        nft_address = nft_address,
    }
    local baseStats = helpers.CalculateUserBaseStats(tempUserData)
    -- update, total_stamina, total_health, health stamina, nft_address
    dbAdmin:exec(string.format([[
        UPDATE Users SET nft_address = "%s", total_stamina = "%s", total_health = "%s", health = "%s", stamina = "%s" WHERE id = %f;
    ]], nft_address, baseStats.total_stamina, baseStats.total_health, baseStats.health, baseStats.stamina, user_id))

    if not nft_already_claimed then
        table.insert(ClaimedNFTs, nft_address)
        local nft_dumz_amount, nft_gold_amount = helpers.getNFTBankAmountForNFT(nft_address)
        -- -- update bank
        -- dbAdmin:exec(string.format([[
        --     UPDATE Bank SET nft_dumz_amount = %f, nft_gold_amount = %f WHERE user_id = %f;
        -- ]], nft_dumz_amount, nft_gold_amount, user_id))
        ao.send({Target = constants.BACKUP_PROCESS_ID, Action = "Bank.UpdateDataIntoMainBank", UserId = tostring(user_id), NFTGoldAmount = tostring(nft_gold_amount), NFTDumzAmount = tostring(nft_dumz_amount)})

    else
        local nft_dumz_amount, nft_gold_amount = 0,0
        --  dbAdmin:exec(string.format([[
        --     UPDATE Bank SET nft_dumz_amount = %f, nft_gold_amount = %f WHERE user_id = %f;
        -- ]], nft_dumz_amount, nft_gold_amount, user_id))
        ao.send({Target = constants.BANK_PROCESS_ID, Action = "Bank.UpdateDataIntoMainBank", UserId = tostring(user_id), NFTGoldAmount = tostring(nft_gold_amount), NFTDumzAmount = tostring(nft_dumz_amount)})
    end

    OneOfOnesSpecialItemsHandler(nft_address, user_id as number)

    -- Debug print
    print("user upgraded with ID: " .. tostring(user_id))

    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(tonumber(user_id), user_data)
    -- local user_bank: BankAccountData = dbAdmin:exec(string.format([[SELECT * FROM Bank WHERE user_id = %f]], user_id)) [1] as BankAccountData
    -- helpers.sendBankDataToBackupProcess(tonumber(user_id), user_bank.id ,user_bank)

     ao.send({
         Target = msg.From,
         Data = json.encode({
             status = "Success"
         })
     })

end

local function userProfilesHandler(msg: Message)
    local user_address = msg.From

    local profiles = dbAdmin:exec(string.format([[
        SELECT * FROM Users WHERE address = "%s";
    ]], user_address))

    ao.send({
        Target = msg.From,
        Data = json.encode(profiles)
    })
end

local function userInfoHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    assert(user_id, "UserId is required")

    local profile = dbAdmin:exec(string.format([[
        SELECT * from Users where id = %f;
    ]], user_id))
    assert(#profile == 1, "Unique User not found with UserId")

    local inventory = dbAdmin:exec(string.format([[
        SELECT * from Inventory where user_id = %f;
    ]], user_id))
    profile[1].inventory = inventory

    ao.send({
        Target = msg.From,
        Data = json.encode(profile[1])
    })
end

local function reviveUserHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local userData = helpers.CheckUserExists(user_id, msg.From)

    assert(userData.health == 0, "User is not dead")

    dbAdmin:exec(string.format([[
        UPDATE Users SET health = 1 WHERE id = %f;
    ]], user_id))

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function goToTownHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    -- update current_spot to 0
    dbAdmin:exec(string.format([[
            UPDATE Users SET current_spot = 0 WHERE id = %d;
    ]], user_id))

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function goToRestAreaHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local userData = helpers.CheckUserExists(user_id, msg.From)

    local current_spot = userData.current_spot
    -- check which rest area is + or - 1 from current_spot or if user is at a rest area
    local rest_area_level = 0
    for _, level in ipairs(REST_SPOTS) do
        if math.abs(current_spot - level) == 1 then
            rest_area_level = level
            break
        end
        if current_spot == level then
            rest_area_level = level
            break
        end
    end

    assert(rest_area_level ~= 0, "Currently at " .. current_spot .. " and no rest area found nearby")

    -- update current_spot to the nearest rest area
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_spot = %f WHERE id = %f;
    ]], rest_area_level, user_id))

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function regenerateEnergyHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local userData = helpers.CheckUserExists(user_id, msg.From)
    local timestamp = msg.Timestamp
    local last_regenerate_time = userData.last_regenerate_time or 0

    local regenerate_time = helpers.IsInRestSpot(userData) and 120 or 240

    assert(timestamp - last_regenerate_time >= regenerate_time, "Not enough time has passed since last regeneration. Last regenerate time: " .. last_regenerate_time .. " Current time: " .. timestamp .. " User is in rest spot: " .. tostring(helpers.IsInRestSpot(userData)))

    local new_stamina = math.min(userData.stamina + 1, userData.total_stamina)
    dbAdmin:exec(string.format([[
        UPDATE Users SET last_regenerate_time = %f, stamina = %f WHERE id = %f;
    ]], timestamp, new_stamina, user_id))

    ao.send({
        Target = msg.From,
        Status = "Success",
    })
end

local function getAllPlayersAtLocationHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)
    local current_spot = tonumber(msg.Tags.CurrentSpot)
    assert(current_spot, "CurrentSpot is required")

    -- udpate last_updated_at
    dbAdmin:exec(string.format([[
        UPDATE Users SET last_updated_at = %f WHERE id = %f;
    ]], msg.Timestamp, user_id))

    local players = dbAdmin:exec(string.format([[
        SELECT * FROM Users WHERE current_spot = %f;
    ]], current_spot))

    ao.send({
        Target = msg.From,
        Data = json.encode(players)
    })
end

local function userLoginHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    -- local nft_address = msg.Tags.NFT_Address
    local timestamp = msg.Timestamp
    local userData = helpers.CheckUserExists(user_id, msg.From)

    -- print(nft_address)
    -- if userData.nft_address and userData.nft_address ~= nft_address then
    --     userData.total_stamina = 4
    --     userData.stamina = 4 
    --     userData.total_health = 2
    --     userData.health = 2
    --     dbAdmin:exec(string.format([[
    --         UPDATE Users SET nft_address = NULL, total_stamina = "%s", total_health = "%s", health = "%s", stamina = "%s" WHERE id = %f;
    --     ]], userData.total_stamina, userData.total_health, userData.health, userData.stamina, user_id))

    --     local nft_dumz_amount = 0
    --     local nft_gold_amount = 0
    --     dbAdmin:exec(string.format([[
    --         UPDATE Bank SET nft_dumz_amount = %f, nft_gold_amount = %f WHERE user_id = %f;
    --     ]], nft_dumz_amount, nft_gold_amount, user_id))
    -- end

    -- local nft_already_claimed: boolean = false

    -- for _, value in ipairs(ClaimedNFTs) do
    --     if nft_address == value then
    --         nft_already_claimed = true
    --         break
    --     end
    -- end

    -- if not nft_already_claimed and nft_address ~= "NULL" then
    --     table.insert(ClaimedNFTs, nft_address)
    -- end

    -- if nft_already_claimed and nft_address ~= "NULL" then
    --     local nft_dumz_amount = 0
    --     local nft_gold_amount = 0
    --     dbAdmin:exec(string.format([[
    --         UPDATE Bank SET nft_dumz_amount = %f, nft_gold_amount = %f WHERE user_id = %f;
    --     ]], nft_dumz_amount, nft_gold_amount, user_id))
    -- end

    local last_regenerate_time = userData.last_regenerate_time or 0

    local time_since_last_regenerate = timestamp - last_regenerate_time
    -- regenerate 1 energy per 2 minutes
    local energy_to_regenerate = math.floor(time_since_last_regenerate / (120*1000))

    if energy_to_regenerate > 0 and userData.stamina < userData.total_stamina then
        local new_stamina = math.min(userData.stamina + energy_to_regenerate, userData.total_stamina)
        dbAdmin:exec(string.format([[
            UPDATE Users SET stamina = %f, last_regenerate_time = %f WHERE id = %f;
        ]], new_stamina, timestamp, user_id))
    end

    if userData.health == 0 then
        dbAdmin:exec(string.format([[
            UPDATE Users SET health = 1 WHERE id = %f;
        ]], user_id))
    end

    local user_current_spot= dbAdmin:exec(string.format([[
        SELECT current_spot FROM Users WHERE ID = %d;
    ]],user_id))[1]

    local is_Rest_Spot = false

    for _ , value in ipairs(REST_SPOTS) do
           if user_current_spot.current_spot == value then
                -- update last_updated_at
            dbAdmin:exec(string.format([[
                   UPDATE Users SET last_updated_at = %f, last_regenerate_time = %f, current_spot = %f WHERE id = %f;
             ]], msg.Timestamp, msg.Timestamp, user_current_spot.current_spot, user_id))
             
             is_Rest_Spot=true
             break
           end
    end   

   if not is_Rest_Spot then
          dbAdmin:exec(string.format([[
                 UPDATE Users SET last_updated_at = %f, last_regenerate_time = %f, current_spot = 0 WHERE id = %f;
          ]], msg.Timestamp, msg.Timestamp, user_id))
   end

    ao.send({
        Target = msg.From,
        Status = "Success"
    })
end

local function deletingUsersAccountHandler(msg:Message) 
    local user_address = msg.From
    local nft_address = msg.Tags.NFT_Address
    assert(nft_address, "NFT_Address is required")
    -- if nft_address == "NULL" then
    dbAdmin:exec(string.format([[
        DELETE FROM Users WHERE nft_address = "%s" AND address = "%s";
    ]], nft_address, user_address))
--    end
end

local function goldWishesHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local userData: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %f;]], user_id))[1] as UserData
    local roll = math.random(1,4)
    local DAILY_LIMIT = 150
    local current_timestamp = msg.Timestamp
    local log: Daily_Daily_Gold_user_log_entry = {
        message = "Sorry Fren, no more wishes today, try again tomorrow!",
        timestamp = current_timestamp
    }
   
    if not Daily_Gold[user_id] then
        Daily_Gold[user_id] = {
            user_id = user_id,
            timestamp = current_timestamp,
            logs = {},
            gold = 0
        }
    end

    local last_updated = Daily_Gold[user_id].timestamp
    local time_diff = current_timestamp - last_updated

    if time_diff >= 86400000 then
        Daily_Gold[user_id].gold = 0
        Daily_Gold[user_id].logs = {}
        Daily_Gold[user_id].timestamp = current_timestamp
    end

    if Daily_Gold[user_id].gold >= DAILY_LIMIT then
        table.insert(Daily_Gold[user_id].logs,log)
        ao.send({ Target = msg.From, Data = json.encode(Daily_Gold[user_id]) })
        return
    end
    
 -- 3/4 times 10 gold should given to the users and max limit of gold that user get in a day is 150
    if roll ~= 4 then
        if time_diff >= 86400000 then
            Daily_Gold[user_id].gold = 0
            Daily_Gold[user_id].logs = {}
            Daily_Gold[user_id].timestamp = current_timestamp
        end

        if Daily_Gold[user_id].gold >= DAILY_LIMIT then
            table.insert(Daily_Gold[user_id].logs,log)
            ao.send({ Target = msg.From, Data = json.encode(Daily_Gold[user_id]) })
            return
        end
        
        local previous_gold = Daily_Gold[user_id].gold
        Daily_Gold[user_id].gold = Daily_Gold[user_id].gold + 10
        local new_gold = Daily_Gold[user_id].gold - previous_gold 
        Daily_Gold[user_id].timestamp = current_timestamp
        log.message="10g coins magically appeared in your bag!"
        table.insert(Daily_Gold[user_id].logs,log)

        dbAdmin:exec(string.format([[UPDATE Users SET gold_balance = gold_balance + %f, last_updated_at= %f  WHERE id = %f;]], new_gold, current_timestamp, user_id))
        helpers.sendUserDataToBackupProcess(user_id,userData);
        ao.send({Target=msg.From, Data = json.encode(Daily_Gold[user_id])})
        return
    end
    Daily_Gold[user_id].timestamp = current_timestamp
    log.message="hm, looks like no one was listening, maybe try again?"
    table.insert(Daily_Gold[user_id].logs,log)  
    ao.send({ Target = msg.From, Data = json.encode(Daily_Gold[user_id]) })
end

local function resetUsersDamage(msg: Message)
    assert(msg.From==ao.id,"Not access")
    print("Initiate")
    
    dbAdmin:exec([[UPDATE Users SET current_battle_id = NULL]])
    
    print("Successful")
end

-- Add handlers
Handlers.add("Users.SetCurrentIsland", Handlers.utils.hasMatchingTag('Action', 'SetCurrentIsland'), setCurrentIslandHandler)
-- Handlers.add("Users.SetCurrentLocation", Handlers.utils.hasMatchingTag('Action', 'Users.SetCurrentLocation'), setCurrentLocationHandler)
Handlers.add("Users.AddNewUser", Handlers.utils.hasMatchingTag('Action', 'Users.AddNewUser'), addNewUserHandler)
Handlers.add("Users.UpgradeExistingProfile", Handlers.utils.hasMatchingTag('Action', 'Users.UpgradeExistingProfile'), upgradeExistingProfileHandler)
Handlers.add("User.UserProfiles", Handlers.utils.hasMatchingTag('Action', 'User.UserProfiles'), userProfilesHandler)
Handlers.add("User.Info", Handlers.utils.hasMatchingTag('Action', 'User.Info'), userInfoHandler)
Handlers.add("User.GoToTown", Handlers.utils.hasMatchingTag('Action', 'User.GoToTown'), goToTownHandler)
Handlers.add("User.GoToRestArea", Handlers.utils.hasMatchingTag('Action', 'User.GoToRestArea'), goToRestAreaHandler)
Handlers.add("User.RegenerateEnergy", Handlers.utils.hasMatchingTag('Action', 'User.RegenerateEnergy'), regenerateEnergyHandler)
Handlers.add("User.Revive", Handlers.utils.hasMatchingTag('Action', 'User.Revive'), reviveUserHandler)
Handlers.add("User.GetAllPlayersAtLocation", Handlers.utils.hasMatchingTag('Action', 'User.GetAllPlayersAtLocation'), getAllPlayersAtLocationHandler)
Handlers.add("User.Login", Handlers.utils.hasMatchingTag('Action', 'User.Login'), userLoginHandler)
Handlers.add("User.DeletingUsersAccount", Handlers.utils.hasMatchingTag('Action', 'User.DeletingUsersAccount'), deletingUsersAccountHandler)
Handlers.add("User.GoldWishes", Handlers.utils.hasMatchingTag('Action', 'User.GoldWishes'), goldWishesHandler)
Handlers.add("User.resetUsersDamage", Handlers.utils.hasMatchingTag('Action', 'User.resetUsersDamage'), resetUsersDamage)

return {}



-- game:
--   processId: _-h1jIlG-9BotgyC9CoikKrU0JbS5Pf8yBr6Nhm1YDA
--   hash: d4bf08d8652e8279bf443268c1652cb2aa55a81546c949297b1d4574ffbf4a34

-- combat:
--   processId: C5Mew98EcDDAw_PuPR3A2YrTbEdAKIi2tWQjhca85co
--   hash: 12a049dfba875049ced57626bb1477f3e705b01ce7e44a163dd4ae1f5c6ad9e3
-- combat2:
--   processId: crigtRqaGl05C5rEHWpBzMlB83CGz0PpNOsEZYMkIms
--   hash: 12a049dfba875049ced57626bb1477f3e705b01ce7e44a163dd4ae1f5c6ad9e3
-- combat3:
--   processId: c4my8yA8JTpydKTZ6KZ-UQ0z1HvacJO_vnTMI_VGXx8
--   hash: 12a049dfba875049ced57626bb1477f3e705b01ce7e44a163dd4ae1f5c6ad9e3
-- combat4:
--   processId: PdTfjViGZh2jbmN3-72X3Q1S_Q6zu7Pr_uvOiB5b7s0
--   hash: 12a049dfba875049ced57626bb1477f3e705b01ce7e44a163dd4ae1f5c6ad9e3
-- combat5:
--   processId: MoW74fDXI1IwvZ_YndSDY1G7WUs5QrYgtcYuttU6Izg
--   hash: 12a049dfba875049ced57626bb1477f3e705b01ce7e44a163dd4ae1f5c6ad9e3




-----------------------------------

-- combat:
--   processId: mb78FFDuv9COl9kwXsaf3rOyZU6AFdq9dGU1xdNPUhs
--   hash: d7a0bae308c89cbc270a3f5e04303f72847c8382fa2d3bd27b46f92ae4a3a238
-- combat2:
--   processId: htjj556bms7MCh896xPkX7T25QCYwoi9ehiGE7LGyWI
--   hash: d7a0bae308c89cbc270a3f5e04303f72847c8382fa2d3bd27b46f92ae4a3a238
-- combat3:
--   processId: 3q26WFMjTp0XCDSXFh3NUmvzs3cIXmbJQkrtMWypP-Y
--   hash: d7a0bae308c89cbc270a3f5e04303f72847c8382fa2d3bd27b46f92ae4a3a238
-- combat4:
--   processId: 1qv-rdDxC_KHJXElX-yDPVaju9P8NfniWOrUFOZyT_s
--   hash: d7a0bae308c89cbc270a3f5e04303f72847c8382fa2d3bd27b46f92ae4a3a238
-- combat5:
--   processId: z6GPRSiSH5Zezqhpy9DTNdBH0UnSTigibRV1863h0jo
--   hash: d7a0bae308c89cbc270a3f5e04303f72847c8382fa2d3bd27b46f92ae4a3a238
