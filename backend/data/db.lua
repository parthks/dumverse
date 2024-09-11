local sqlite3 = require("lsqlite3")
db = db or sqlite3.open_memory()
dbAdmin = require("@rakis/DbAdmin").new(db)


--[[
     HEALTH_BALANCE is the health with special traits applied (NFTs +1). Without armor.
     No concept of armor health for now. If armor breaks for that battle, health balance starts decreasing when hit.

     NFT_SPECIAL_TRAIT for 1/1s granting "special powers" for various functions. Only 4 NFTs have this trait.
   ]]
--
USERS_TABLE = [[
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
        stamina FLOAT DEFAULT 0,
        damage FLOAT DEFAULT 0,
        defense FLOAT DEFAULT 0
    );
]]

INVENTORY_TABLE = [[
    CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        item_id TEXT NOT NULL,
        item_type TEXT NOT NULL, -- ARMOR, WEAPON, POTION.
        amount INTEGER NOT NULL,
        equipped BOOLEAN DEFAULT FALSE, -- only one item type can be equipped
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
]]

BANK_TABLE = [[
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

-- deposit, withdraw from bank <> game user
-- airdrop - free deposit to game user bank. Given once per cascade per NFT.
-- pull_out - withdraw from game to users address (only for dumz)
-- pull_in - deposit from users address to game (only for dumz)
BANK_TRANSACTIONS_TABLE = [[
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


-- db:exec("DROP TABLE IF EXISTS Users;")
-- db:exec(USERS_TABLE)
-- db:exec("DROP TABLE IF EXISTS Inventory;")
-- db:exec(INVENTORY_TABLE)
-- db:exec("DROP TABLE IF EXISTS Bank;")
-- db:exec(BANK_TABLE)
-- db:exec("DROP TABLE IF EXISTS BankTransactions;")
-- db:exec(BANK_TRANSACTIONS_TABLE)


return dbAdmin
