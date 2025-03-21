local helpers = require("game.helpers")
require('utils.globals')
local json = require("json")
local constants = require("utils.constants")

local function shopInfoHandler(msg: Message)
    local itemType = msg.Tags.ItemType as ItemType
    local items = constants.ALL_ITEMS
    if itemType == "SPECIAL_ITEMS" then
        items = constants.SPECIAL_ITEMS
    elseif itemType == "PET" then
        -- Convert PetsData to BaseItem
        items = {}
        for k, pet in pairs(constants.PETS as {string: PetsData}) do
            items[k] = {
                id = pet.id,
                name = pet.name,
                type = pet.ability_type,
                gold_price = pet.gold_price,
                dumz_price = nil
            }
        end
    elseif itemType == "WEAPON" then
        items = constants.WEAPONS
    elseif itemType == "ARMOR" then
        items = constants.ARMORS
    elseif itemType == "POTION" then
        items = constants.POTIONS
    elseif itemType == "FOOD" then
        items = constants.FOOD
    elseif itemType == "ENERGY" then
        -- energy and potion are the same in the shop
        -- Combine POTIONS and ENERGY tables
        items = {}
        for k, v in pairs(constants.POTIONS as {string:BaseItem}) do
            items[k] = v
        end
        for k, v in pairs(constants.ENERGY as {string:BaseItem}) do
            items[k] = v
        end
    end
    ao.send({
        Target = msg.From,
        Status = "Success",
        Data = json.encode({
            items = items
        })
    })
end

local function shopBuyItemHandler(msg: Message)
    local tokenType = msg.Tags.TokenType as TokenType
    assert(tokenType == "GOLD" or tokenType == "DUMZ", "Invalid token type")

    local user_id = tonumber(msg.Tags.UserId)
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)

    local item_id = msg.Tags.ItemId
    assert(item_id, "ItemId is required")

    -- Find the item in the appropriate category
    local item = helpers.GetItemDetails(item_id)
    assert(item, "Item does not exist")

    if (item.id == "WAND" or item.id == "MAGIC_ROBE") then
       assert(userData.nft_address,"To buy this you need to own an NFT")
    end

    -- Check if item has the correct price type
    if tokenType == "GOLD" then
        assert(item.gold_price, "Item does not have a gold price")
    else
        assert(item.dumz_price, "Item does not have a dumz price")
    end

    local results: Pets = dbAdmin:exec(string.format([[SELECT * FROM Pet where user_id = %d and equipped = TRUE]], user_id))[1] as Pets
    local pets: PetsData
    if (results.pet_id == "RASCALLY_RABBIT") then
        pets = helpers.GetPetDetails(results.pet_id)
    end 

    local newBalance: number
    -- Check if user has enough balance
    if tokenType == "GOLD" then
        if pets then
            assert(userData.gold_balance >= (item.gold_price - (item.gold_price * pets.ability)), "You do not have enough GOLD balance")
                newBalance = userData.gold_balance - (item.gold_price - (item.gold_price * pets.ability))
        else
            assert(userData.gold_balance >= item.gold_price, "You do not have enough GOLD balance")
                newBalance = userData.gold_balance - item.gold_price
        end        
    else
        if pets then
            assert(userData.dumz_balance >= (item.dumz_price - (item.dumz_price * pets.ability)), "You do not have enough DUMZ balance")
            newBalance = userData.dumz_balance - (item.dumz_price - (item.dumz_price * pets.ability))
        else
            assert(userData.dumz_balance >= item.dumz_price, "You do not have enough DUMZ balance")
            newBalance = userData.dumz_balance - item.dumz_price
        end  
    end

    -- Update inventory (unequip previous item of the same type if exists)
    -- local inventory = dbAdmin:exec(string.format([[
    --     SELECT * FROM Inventory WHERE user_id = %d AND equipped = TRUE AND item_type = "%s";
    -- ]], user_id, item.type))

    -- if #inventory > 0 then
    --     dbAdmin:exec(string.format([[
    --         UPDATE Inventory SET equipped = FALSE WHERE id = %d;
    --     ]], inventory[1].id))
    -- end
    dbAdmin:exec(string.format([[
        UPDATE Inventory SET equipped = FALSE WHERE user_id = %d AND item_type = "%s";
    ]], user_id, item.type))

    if item_id == "FOOD_2" then
        -- add 10 cake slices
        for _ = 1, 10 do
            dbAdmin:exec(string.format([[
                INSERT INTO Inventory (user_id, item_id, item_type, equipped, created_at) VALUES (%d, "%s", "%s", TRUE, "%s");
            ]], user_id, "FOOD_1", "FOOD", msg.Timestamp))
        end
    else
        -- Add new item to inventory
        dbAdmin:exec(string.format([[
            INSERT INTO Inventory (user_id, item_id, item_type, equipped, created_at) VALUES (%d, "%s", "%s", TRUE, "%s");
        ]], user_id, item_id, item.type, msg.Timestamp))
    end

    -- Update user balance
    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
            UPDATE Users SET gold_balance = %f WHERE id = %d;
        ]], newBalance, user_id))
    else
        dbAdmin:exec(string.format([[
            UPDATE Users SET dumz_balance = %f WHERE id = %d;
        ]], newBalance, user_id))
    end

    -- Update user stats
    local baseStats = helpers.CalculateUserBaseStats(userData)
    if item.type == "WEAPON" then
        local weaponItem = item as WeaponItem
        dbAdmin:exec(string.format([[
            UPDATE Users SET damage = %f WHERE id = %d;
        ]], baseStats.damage + weaponItem.damage, user_id))
    elseif item.type == "ARMOR" then
        local armorItem = item as ArmorItem
        dbAdmin:exec(string.format([[
            UPDATE Users SET defense = %f WHERE id = %d;
        ]], baseStats.defense + armorItem.defense, user_id))
    end
    
    local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id)) [1] as UserData
    helpers.sendUserDataToBackupProcess(user_id, user_data)
    ao.send({ Target = msg.From, Status = "Success" })
end

local function shopBuyPetHandler(msg: Message)

    local tokenType = msg.Tags.TokenType as TokenType
    assert(tokenType == "GOLD", "Invalid token type")
    
    local user_id = tonumber(msg.Tags.UserId)
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)

    local pet_id = msg.Tags.petId
    assert(pet_id, "ItemId is required")
    
    local pet = helpers.GetPetDetails(pet_id)
    assert(pet, "Item does not exist")
        
    if tokenType == "GOLD" then
        assert(pet.gold_price, "Item does not have a gold price")
        assert(userData.gold_balance >= pet.gold_price, "You do not have enough GOLD balance")
    end

    dbAdmin:exec(string.format([[
        UPDATE Pet SET equipped = FALSE WHERE user_id = %d;
    ]], user_id))

    dbAdmin:exec(string.format([[
            INSERT INTO Pet (user_id, pet_id, ability_type, equipped, created_at) VALUES (%d, "%s", "%s", TRUE, "%s");
        ]], user_id, pet_id, pet.ability_type, msg.Timestamp))

    if tokenType == "GOLD" then
        dbAdmin:exec(string.format([[
             UPDATE Users SET gold_balance = %f WHERE id = %d;
        ]], userData.gold_balance - pet.gold_price, user_id))
    end 
    
    ao.send({ Target = msg.From, Status = "Success" })
end

-- Add handlers
Handlers.add("Shop.Info", Handlers.utils.hasMatchingTag('Action', 'Shop.Info'), shopInfoHandler)
Handlers.add("Shop.BuyItem", Handlers.utils.hasMatchingTag('Action', 'Shop.BuyItem'), shopBuyItemHandler)
Handlers.add("Shop.BuyPet", Handlers.utils.hasMatchingTag('Action', 'Shop.BuyPet'), shopBuyPetHandler)

-- TODO: Implement selling items from inventory

return {}