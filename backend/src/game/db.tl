
require("utils.globals")


global USERS_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        current_battle_id INTEGER
    );
]]

global INVENTORY_TABLE: string = [[
    CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id TEXT NOT NULL,
        item_type TEXT NOT NULL,
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
        token_type TEXT NOT NULL CHECK(token_type IN ('GOLD', 'DUMZ')),
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
        dbAdmin.db:exec("DROP TABLE IF EXISTS Inventory;")
        dbAdmin.db:exec(INVENTORY_TABLE)
        dbAdmin.db:exec("DROP TABLE IF EXISTS Bank;")
        dbAdmin.db:exec(BANK_TABLE)
        dbAdmin.db:exec("DROP TABLE IF EXISTS BankTransactions;")
        dbAdmin.db:exec(BANK_TRANSACTIONS_TABLE)
    end
)
-- Send({Target = ao.id, Action = "DANGER.ClearDB" })

return {}