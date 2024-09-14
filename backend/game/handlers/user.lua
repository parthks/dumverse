local json = require("json")
local helpers = require("helpers")

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
        assert(msg.wAR == ISLAND_TRANSFER_FEE, "Incorrect amount of wAR sent")


        dbAdmin:exec(string.format([[
            UPDATE Users SET CURRENT_ISLAND = %f WHERE address = "%s";
        ]], island_id, user_address))

        return ao.send({ Target = msg.From, Status = "Success" })
    end
)

Handlers.add(
    'Users.AddNewUser',
    Handlers.utils.hasMatchingTag('Action', 'Users.AddNewUser'),
    function(msg)
        local user_address = msg.From
        local nft_address = msg.NFT_Address
        local name = msg.Name
        assert(name, "Name is required")

        local getUserQuery
        if nft_address then
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

        local nft_gold_amount = nft_address and 12000 or 10000
        local nft_dumz_amount = nft_address and 80 or 40
        local starting_gold = 10000
        local starting_dumz = 50
        local bank_gold_amount = 10000
        local bank_dumz_amount = 50

        -- local result = dbAdmin:exec(string.format([[
        --     INSERT INTO Users (address, name, nft_address, gold_balance, dumz_balance)
        --     VALUES ('%s', '%s', CASE WHEN '%s' = '' THEN NULL ELSE '%s' END, %f, %f);
        --     INSERT INTO Bank (user_id, gold_amount, dumz_amount, nft_gold_amount, nft_dumz_amount)
        --     VALUES (last_insert_rowid(), %f, %f, %f, %f);
        --     SELECT last_insert_rowid() as id;
        -- ]], user_address, name, nft_address or '', nft_address or '', starting_gold, starting_dumz, starting_gold,
        --     starting_dumz, nft_gold_amount,
        --     nft_dumz_amount))

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

        -- Get the last inserted ID
        local insert_user_result = dbAdmin:exec(getUserQuery)

        assert(insert_user_result and #insert_user_result > 0, "Failed to insert new user")
        local newUserId = insert_user_result[1].id

        -- Insert into Bank
        local insert_bank_result = dbAdmin:exec(string.format([[
        INSERT INTO Bank (user_id, gold_amount, dumz_amount, nft_gold_amount, nft_dumz_amount)
        VALUES (%d, %f, %f, %f, %f);
    ]], newUserId, bank_gold_amount, bank_dumz_amount, nft_gold_amount, nft_dumz_amount))

        assert(insert_bank_result, "Failed to insert into Bank")

        -- Debug print
        print("New user created with ID: " .. tostring(newUserId))

        return ao.send({
            Target = msg.From,
            Data = {
                data = insert_user_result[1],
                status = "Success"
            }
        })
    end
)

Handlers.add("User.UserProfiles",
    Handlers.utils.hasMatchingTag('Action', 'User.UserProfiles'),
    function(msg)
        local user_address = msg.From

        local profiles = dbAdmin:exec(string.format([[
            SELECT * FROM Users WHERE address = "%s";
        ]], user_address))

        return Send({
            Target = msg.From,
            Data = profiles
        })
    end
)
Handlers.add("User.Info",
    Handlers.utils.hasMatchingTag('Action', 'User.Info'),
    function(msg)
        local user_address = msg.From
        local user_id = msg.UserId
        assert(user_id, "UserId is required")

        local profile = dbAdmin:exec(string.format([[
                SELECT * from Users where id = %f;
            ]], user_id))
        assert(#profile == 1, "Unique User not found with UserId")
        -- assert(profile[1].address == user_address, "User does not match address"). TODO: lock it down or not? change from dry to run to send message if locked down

        local inventory = dbAdmin:exec(string.format([[
                SELECT * from Inventory where user_id = %f;
            ]], user_id))
        profile[1].inventory = inventory

        return Send({
            Target = msg.From,
            Data = profile[1]
        })
    end
)

Handlers.add("User.GoToTown",
    Handlers.utils.hasMatchingTag('Action', 'User.GoToTown'),
    function(msg)
        local user_id = msg.UserId
        local userData = helpers.CheckUserExists(user_id, msg.From)

        -- update current_spot to 0
        dbAdmin:exec(string.format([[
            UPDATE Users SET current_spot = 0 WHERE id = %f;
        ]], user_id))

        return ao.send({
            Target = msg.From,
            Status = "Success"
        })
    end
)

Handlers.add("User.RegenerateEnergy",
    Handlers.utils.hasMatchingTag('Action', 'User.RegenerateEnergy'),
    function(msg)
        local user_id = msg.UserId
        local userData = helpers.CheckUserExists(user_id, msg.From)
        local timestamp = msg.Timestamp
        local last_regenerate_time = userData.last_regenerate_time or 0

        assert(timestamp - last_regenerate_time >= 60, "Not enough time has passed since last regeneration")

        local new_stamina = math.min(userData.stamina + 1, userData.total_stamina)
        dbAdmin:exec(string.format([[
            UPDATE Users SET last_regenerate_time = %f, stamina = %f WHERE id = %f;
        ]], timestamp, new_stamina, user_id))

        return ao.send({
            Target = msg.From,
            Status = "Success",
        })
    end
)

-- Admin control function to regenerate user stats (health, stamina)
Handlers.add("Admin.Regenerate",
    Handlers.utils.hasMatchingTag('Action', 'Admin.Regenerate'),
    function(msg)
        assert(msg.From == ao.id, "Only the game server can regenerate users")
        local user_id = msg.UserId
        -- local userData = helpers.CheckUserExists(user_id, msg.From)

        -- update current_spot to 0
        dbAdmin:exec(string.format([[
            UPDATE Users SET health = total_health, gold_balance = 10000, dumz_balance = 10, stamina = total_stamina WHERE id = %f;
        ]], user_id))

        return ao.send({
            Target = msg.From,
            Status = "Success"
        })
    end
)

return {}
