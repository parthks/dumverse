local json = require("json")
require("utils.globals")
local sqlite3 = require('lsqlite3')
local dbAdminnn = require("utils.utils.dbAdmin")
local constants = require("utils.constants")

global USERS_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        last_updated_at INTEGER DEFAULT 0,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        nft_address TEXT,
        nft_special_trait TEXT,
        current_island INTEGER,
        gold_balance FLOAT DEFAULT 0,
        dumz_balance FLOAT DEFAULT 0,
        trunk_balance FLOAT DEFAULT 0,
        health FLOAT DEFAULT 0,
        total_health FLOAT DEFAULT 0,
        stamina FLOAT DEFAULT 0,
        total_stamina FLOAT DEFAULT 0,
        last_regenerate_time INTEGER DEFAULT 0,
        damage FLOAT DEFAULT 0,
        defense FLOAT DEFAULT 0,
        current_spot INTEGER DEFAULT 0,
        current_battle_id INTEGER,
        special_item_key INTEGER DEFAULT -1,
        special_item_thread INTEGER DEFAULT -1,
        special_item_bark INTEGER DEFAULT -1,
        special_item_heart INTEGER DEFAULT -1,
        special_item_kitten INTEGER DEFAULT -1
    );
]]

global INVENTORY_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
        item_health FLOAT DEFAULT 40,
        total_item_health FLOAT DEFAULT 40,
        equipped BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
]]

global BANK_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS Bank (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        gold_amount FLOAT DEFAULT 0,
        dumz_amount FLOAT DEFAULT 0,
        trunk_amount FLOAT DEFAULT 0,
        nft_gold_amount FLOAT DEFAULT 0,
        nft_dumz_amount FLOAT DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
]]

global BANK_TRANSACTIONS_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS BankTransactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount FLOAT DEFAULT 0,
        token_type TEXT NOT NULL CHECK(token_type IN ('GOLD', 'DUMZ', 'TRUNK')),
        transaction_type TEXT NOT NULL CHECK(transaction_type IN ('DEPOSIT', 'WITHDRAW', 'CLAIM_AIRDROP', 'AIRDROP', 'PULL_OUT', 'PULL_IN')),
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
]]


global DB: db 
global dbAdmin: dbAdminType

DB = DB or sqlite3.open_memory()
if not DB then
  print("Failed to open database")
  return
end
dbAdmin = dbAdminnn.new(DB)


local function DBInit()
    dbAdmin.db:exec(USERS_TABLE)
    dbAdmin.db:exec(INVENTORY_TABLE)
    dbAdmin.db:exec(BANK_TABLE)
    dbAdmin.db:exec(BANK_TRANSACTIONS_TABLE)
end
    
global BACKUP_PROCESS_INITIALIZED: boolean
    BACKUP_PROCESS_INITIALIZED = BACKUP_PROCESS_INITIALIZED or false
    if (not BACKUP_PROCESS_INITIALIZED) then
      DBInit()
      BACKUP_PROCESS_INITIALIZED = true
end


local function addAndUpdateUsersHandler(msg: Message)
    assert(msg.From == constants.GAME_PROCESS_ID, "You cannot call this handler")
    local user_id = tonumber(msg.Tags.UserId)
    local data: UserData = json.decode(msg.Data) as UserData

    local user_data = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id=%f]], user_id))
    if #user_data == 0 then
        dbAdmin:exec(string.format([[
            INSERT INTO Users (
                id, name, address, nft_address, nft_special_trait, current_island,
                gold_balance, dumz_balance, trunk_balance, health, total_health,
                stamina, total_stamina, last_regenerate_time, damage, defense,
                current_spot, current_battle_id, special_item_key, special_item_thread,
                special_item_bark, special_item_heart, special_item_kitten
            )
            VALUES (
                %f, '%s', '%s', %s, %s, %s, %f, %f, %f, %f, %f, %f, %f, %d, %f, %f, %d, %s, %s, %s, %s, %s, %s
            );
        ]],
        data.id,
        data.name,
        data.address,
        data.nft_address and string.format("'%s'", data.nft_address) or "NULL",
        data.nft_special_trait and string.format("'%s'", data.nft_special_trait) or "NULL",
        data.current_island and string.format("%d", data.current_island) or "NULL",
        data.gold_balance,
        data.dumz_balance,
        data.trunk_balance,
        data.health,
        data.total_health,
        data.stamina,
        data.total_stamina,
        data.last_regenerate_time,
        data.damage,
        data.defense,
        data.current_spot,
        data.current_battle_id and string.format("%d", data.current_battle_id) or "NULL",
        data.special_item_key and string.format("%d", data.special_item_key) or "NULL",
        data.special_item_thread and string.format("%d", data.special_item_thread) or "NULL",
        data.special_item_bark and string.format("%d", data.special_item_bark) or "NULL",
        data.special_item_heart and string.format("%d", data.special_item_heart) or "NULL",
        data.special_item_kitten and string.format("%d", data.special_item_kitten) or "NULL"
        ))
        print("User Insert: " .. user_id)
    else
        dbAdmin:exec(string.format([[
    UPDATE Users
    SET 
        name = '%s',
        address = '%s',
        nft_address = %s,
        nft_special_trait = %s,
        current_island = %s,
        gold_balance = %f,
        dumz_balance = %f,
        trunk_balance = %f,
        health = %f,
        total_health = %f,
        stamina = %f,
        total_stamina = %f,
        last_regenerate_time = %d,
        damage = %f,
        defense = %f,
        current_spot = %d,
        current_battle_id = %s,
        special_item_key = %s,
        special_item_thread = %s,
        special_item_bark = %s,
        special_item_heart = %s,
        special_item_kitten = %s
    WHERE id = %f
]],
    data.name,
    data.address,
    data.nft_address and string.format("'%s'", data.nft_address) or "NULL",
    data.nft_special_trait and string.format("'%s'", data.nft_special_trait) or "NULL",
    data.current_island and string.format("%d", data.current_island) or "NULL",
    data.gold_balance,
    data.dumz_balance,
    data.trunk_balance,
    data.health,
    data.total_health,
    data.stamina,
    data.total_stamina,
    data.last_regenerate_time,
    data.damage,
    data.defense,
    data.current_spot,
    data.current_battle_id and string.format("%d", data.current_battle_id) or "NULL",
    data.special_item_key and string.format("%d", data.special_item_key) or "NULL",
    data.special_item_thread and string.format("%d", data.special_item_thread) or "NULL",
    data.special_item_bark and string.format("%d", data.special_item_bark) or "NULL",
    data.special_item_heart and string.format("%d", data.special_item_heart) or "NULL",
    data.special_item_kitten and string.format("%d", data.special_item_kitten) or "NULL",
    data.id
))
print("User Update: " .. user_id)
    end
end

local function addAndUpdateInventoryHandler(msg: Message)
    assert(msg.From == constants.GAME_PROCESS_ID, "You cannot call this handler")

    local user_id = tonumber(msg.Tags.UserId)
    local id = tonumber(msg.Tags.Id)
    local data: InventoryItem = json.decode(msg.Data) as InventoryItem

    local inventory_data = dbAdmin:exec(string.format(
        [[SELECT * FROM Inventory WHERE user_id = %d AND id = %d]],
        user_id, id
    ))

    if #inventory_data == 0 then
        dbAdmin:exec(string.format([[
            INSERT INTO Inventory (
                id, user_id, item_id, item_type, item_health, total_item_health, equipped, created_at
            ) VALUES (
                %d, %d, '%s', '%s', %f, %f, %s, CURRENT_TIMESTAMP
            )
        ]],
            id,
            data.user_id,
            data.item_id,
            data.item_type,
            data.item_health,
            data.total_item_health,
            data.equipped and "TRUE" or "FALSE"
        ))
        print("Inventory Insert: " .. user_id)
    else
        dbAdmin:exec(string.format([[
            UPDATE Inventory
            SET 
                item_health = %f,
                total_item_health = %f,
                equipped = %s,
                item_id = '%s'
            WHERE user_id = %d AND id = %d
        ]],
            data.item_health,
            data.total_item_health,
            data.equipped and "TRUE" or "FALSE",
            data.item_id,
            data.user_id,
            id
        ))
        print("Inventory Update: " .. user_id)
    end
end

local function addAndUpdateBankHandler(msg: Message)
    assert(msg.From == constants.GAME_PROCESS_ID, "You cannot call this handler")
    
    local user_id = tonumber(msg.Tags.UserId)
    local id = tonumber(msg.Tags.Id)
    local data: BankAccountData = json.decode(msg.Data) as BankAccountData
   
    local Bank_data = dbAdmin:exec(string.format(
        [[SELECT * FROM Bank WHERE user_id = %d AND id = %d]],
        user_id, id
    ))

    if #Bank_data == 0 then
        dbAdmin:exec(string.format([[
            INSERT INTO Bank (
                id, user_id, gold_amount, dumz_amount, trunk_amount, nft_gold_amount, nft_dumz_amount
            ) VALUES (
                %d, %d, %f, %f, %f, %f, %f
            )
        ]],
            id,
            data.user_id,
            data.gold_amount,
            data.dumz_amount,
            data.trunk_amount,
            data.nft_gold_amount,
            data.nft_dumz_amount
        ))
        print("Bank Insert: " .. user_id)
    else
        dbAdmin:exec(string.format([[
            UPDATE Bank
            SET 
                gold_amount = %f,
                dumz_amount = %f,
                trunk_amount = %f,
                nft_gold_amount = %f,
                nft_dumz_amount = %f
            WHERE user_id = %d AND id = %d
        ]],
            data.gold_amount,
            data.dumz_amount,
            data.trunk_amount,
            data.nft_gold_amount,
            data.nft_dumz_amount,
            data.user_id,
            id
        ))
        print("Bank Update: " .. user_id)
    end
end

local function addAndUpdateBankTransactionsHandler(msg: Message)
    assert(msg.From == constants.GAME_PROCESS_ID, "You cannot call this handler")
    
    local user_id = tonumber(msg.Tags.UserId)
    local id = tonumber(msg.Tags.Id)
    local data: BankTransaction = json.decode(msg.Data) as BankTransaction
   
    local BankTransactions_data = dbAdmin:exec(string.format(
        [[SELECT * FROM BankTransactions WHERE user_id = %d AND id = %d]],
        user_id, id
    ))
    
    if #BankTransactions_data == 0 then
        dbAdmin:exec(string.format([[
            INSERT INTO BankTransactions (
                id, user_id, amount, token_type, transaction_type, created_at
            ) VALUES (
                %d, %d, %f, '%s', '%s', %d
            )
        ]],
            id,
            data.user_id,
            data.amount,
            data.token_type,
            data.transaction_type,
            data.created_at
        ))
        print("BankTransactions Insert: " .. user_id)
    else
        dbAdmin:exec(string.format([[
            UPDATE BankTransactions
            SET 
                amount = %f,
                token_type = '%s',
                transaction_type = '%s',
                created_at = %d
            WHERE user_id = %d AND id = %d
        ]],
            data.amount,
            data.token_type,
            data.transaction_type,
            data.created_at,
            data.user_id,
            id
        ))
        print("BankTransactions Update: " .. user_id)
    end
end

-- local function withdrawTrunksHandler(msg: Message)
--     local user_id: number = tonumber(msg.Tags.UserId)
--     local quantity = tonumber(msg.Tags.Quantity)

--     assert(quantity and quantity > 0, "Invalid quantity: must be greater than zero")

--     quantity = (tonumber(string.format("%.3f", quantity))) * 1000
--     print("Quantity: " .. quantity)

--     local user_data: UserData = dbAdmin:exec(string.format([[SELECT * FROM Users WHERE id = %d]], user_id))[1] as UserData
--     assert(user_data, "User data not found")

--     local user_bank: BankAccountData = dbAdmin:exec(string.format([[SELECT * FROM Bank WHERE user_id = %d]], user_id))[1] as BankAccountData
--     assert(user_bank, "Bank account data not found")

--     user_data.trunk_balance = (tonumber(string.format("%.3f", user_data.trunk_balance))) * 1000
--     user_bank.trunk_amount = (tonumber(string.format("%.3f", user_bank.trunk_amount))) * 1000
--     print("user_data.trunk_balance: " .. user_data.trunk_balance)
--     print("user_bank.trunk_amount: " .. user_bank.trunk_amount)

--     local total_balance = tonumber(string.format("%.3f", user_data.trunk_balance + user_bank.trunk_amount))
--     assert(total_balance >= quantity, "Insufficient funds: not enough trunk available")

--     user_data.trunk_balance = user_data.trunk_balance - quantity

--     if user_data.trunk_balance <= 0 then
--         user_bank.trunk_amount = user_bank.trunk_amount + user_data.trunk_balance 
--         user_data.trunk_balance = 0 

--         -- user_bank.trunk_amount = tonumber(string.format("%.3f", user_bank.trunk_amount))
--         user_bank.trunk_amount = user_bank.trunk_amount / 1000

--         print("user_data.trunk_balance 2: " .. user_data.trunk_balance)
--         print("user_bank.trunk_amount 2: " .. user_bank.trunk_amount)
--         dbAdmin:exec(string.format([[UPDATE Bank SET trunk_amount = %f WHERE user_id = %d]],user_bank.trunk_amount, user_id))
--     end

--     -- user_data.trunk_balance = tonumber(string.format("%.3f", user_data.trunk_balance))
--     user_data.trunk_balance =  user_data.trunk_balance / 1000
--     print("user_data.trunk_balance 3: " .. user_data.trunk_balance)
--     print("user_bank.trunk_amount 3: " .. user_bank.trunk_amount)
--     dbAdmin:exec(string.format([[UPDATE Users SET trunk_balance = %f WHERE id = %d]],user_data.trunk_balance, user_id))
--     print("Quantity 2: " .. quantity)
--     ao.send({Target = "wOrb8b_V8QixWyXZub48Ki5B6OIDyf_p1ngoonsaRpQ", Action = "Transfer", Recipient = user_data.address, Quantity = tostring(quantity)})
--     print("Done")
-- end


Handlers.add("Backup.addAndUpdateUsers", Handlers.utils.hasMatchingTag("Action", "Backup.addAndUpdateUsers"), addAndUpdateUsersHandler)
Handlers.add("Backup.addAndUpdateInventory", Handlers.utils.hasMatchingTag("Action", "Backup.addAndUpdateInventory"), addAndUpdateInventoryHandler)
Handlers.add("Backup.addAndUpdateBank", Handlers.utils.hasMatchingTag("Action", "Backup.addAndUpdateBank"), addAndUpdateBankHandler)
Handlers.add("Backup.addAndUpdateBankTransactions", Handlers.utils.hasMatchingTag("Action", "Backup.addAndUpdateBankTransactions"), addAndUpdateBankTransactionsHandler)
-- Handlers.add("Backup.WithdrawTrunks", Handlers.utils.hasMatchingTag("Action", "Backup.WithdrawTrunks"), withdrawTrunksHandler)

Handlers.add("Backup.UpdateTable",
    Handlers.utils.hasMatchingTag("Action", "Backup.DANGER.UpdateTable"),
    function(msg: Message)
        assert(msg.From == ao.id, "You are not authorized to perform this action")
        DBInit()
        dbAdmin.db:exec([[
            -- Create a new table with the updated schema
            CREATE TABLE Users_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
        last_updated_at INTEGER DEFAULT 0,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        nft_address TEXT,
        nft_special_trait TEXT,
        current_island INTEGER,
        gold_balance FLOAT DEFAULT 0,
        dumz_balance FLOAT DEFAULT 0,
        health FLOAT DEFAULT 0,
        total_health FLOAT DEFAULT 0,
        stamina FLOAT DEFAULT 0,
        total_stamina FLOAT DEFAULT 0,
        last_regenerate_time INTEGER DEFAULT 0,
        damage FLOAT DEFAULT 0,
        defense FLOAT DEFAULT 0,
        current_spot INTEGER DEFAULT 0,
        current_battle_id INTEGER,
        special_item_kitten INTEGER DEFAULT -1,
        special_item_key INTEGER DEFAULT -1,
        special_item_thread INTEGER DEFAULT -1,
        special_item_bark INTEGER DEFAULT -1,
        special_item_heart INTEGER DEFAULT -1,
            );

            -- Copy data from the old table to the new one
            INSERT INTO Users_new SELECT * FROM Users;

            -- Drop the old table
            DROP TABLE Users;

            -- Rename the new table to the original name
            ALTER TABLE Users_new RENAME TO Users;
        ]])
    end
)
