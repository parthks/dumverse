
require("utils.globals")


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
        total_trunk_token FLOAT DEFAULT 10,
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

-- global LEADERBOARD_TABLE: string = [[
--     CREATE TABLE IF NOT EXISTS Leaderboard (
--         id INTEGER PRIMARY KEY AUTOINCREMENT,
--         name TEXT NOT NULL,
--         address TEXT NOT NULL,
--         nft_address TEXT,
--         gold_earned INTEGER DEFAULT 0,
--         gold_lost INTEGER DEFAULT 0,
--         enemy_killed INTEGER DEFAULT 0,
--         player_death INTEGER DEFAULT 0,
--         death_streak INTEGER DEFAULT 0,
--         pvp INTEGER DEFAULT 0
--     );
-- ]]

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

Handlers.add("Admin.ClearDB",
    Handlers.utils.hasMatchingTag("Action", "DANGER.ClearDB"),
    function(msg: Message)
        assert(msg.From == ao.id, "You are not authorized to perform")
        dbAdmin.db:exec("DROP TABLE IF EXISTS Users;")
        dbAdmin.db:exec(USERS_TABLE)
        -- dbAdmin.db:exec("DROP TABLE IF EXISTS Leaderboard;")
        -- dbAdmin.db:exec(LEADERBOARD_TABLE)
        dbAdmin.db:exec("DROP TABLE IF EXISTS Inventory;")
        dbAdmin.db:exec(INVENTORY_TABLE)
        dbAdmin.db:exec("DROP TABLE IF EXISTS Bank;")
        dbAdmin.db:exec(BANK_TABLE)
        dbAdmin.db:exec("DROP TABLE IF EXISTS BankTransactions;")
        dbAdmin.db:exec(BANK_TRANSACTIONS_TABLE)
    end
)
-- Send({Target = ao.id, Action = "DANGER.ClearDB" })

Handlers.add("Admin.UpdateBankTransactionsTable",
    Handlers.utils.hasMatchingTag("Action", "DANGER.UpdateBankTransactionsTable"),
    function(msg: Message)
        assert(msg.From == ao.id, "You are not authorized to perform this action")
        dbAdmin.db:exec([[
            -- Create a new table with the updated schema
            CREATE TABLE BankTransactions_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                amount FLOAT DEFAULT 0,
                token_type TEXT NOT NULL CHECK(token_type IN ('GOLD', 'DUMZ', 'TRUNK')),
                transaction_type TEXT NOT NULL CHECK(transaction_type IN ('DEPOSIT', 'WITHDRAW', 'CLAIM_AIRDROP', 'AIRDROP', 'PULL_OUT', 'PULL_IN')),
                created_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            );

            -- Copy data from the old table to the new one
            INSERT INTO BankTransactions_new SELECT * FROM BankTransactions;

            -- Drop the old table
            DROP TABLE BankTransactions;

            -- Rename the new table to the original name
            ALTER TABLE BankTransactions_new RENAME TO BankTransactions;
        ]])
    end
)
-- Send({Target = ao.id, Action = "DANGER.UpdateBankTransactionsTable" })

Handlers.add("Admin.UpdateTable",
    Handlers.utils.hasMatchingTag("Action", "DANGER.UpdateTable"),
    function(msg: Message)
        assert(msg.From == ao.id, "You are not authorized to perform this action")
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
        trunk_balance FLOAT DEFAULT 0,
        total_trunk_token FLOAT DEFAULT 10,
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
-- Send({Target = ao.id, Action = "DANGER.UpdateInventoryTable" })

Handlers.add("Admin.addNewColumnInTable", Handlers.utils.hasMatchingTag("Action", "Admin.addNewColumnInTable"),
 function (msg: Message)
    assert(msg.From == ao.id, "You are not authorized to perform this action")
    print("run")
    dbAdmin.db:exec([[ALTER TABLE Users DROP COLUMN has_Claimed_All_Trunk_Tokens]])
    print("run 1")
    dbAdmin.db:exec([[ALTER TABLE Users ADD COLUMN total_trunk_token FLOAT DEFAULT 10;]])
    print("end")
end
)

return {}