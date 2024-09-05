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
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        ADDRESS TEXT NOT NULL,
        NFT_ADDRESS TEXT,
        NFT_SPECIAL_TRAIT TEXT,
        CURRENT_ISLAND INTEGER,
        GOLD_BALANCE FLOAT DEFAULT 0,
        DUMZ_BALANCE FLOAT DEFAULT 0,
        HEALTH_BALANCE FLOAT DEFAULT 1
    );
]]
db:exec("DROP TABLE IF EXISTS Users;")
db:exec(USERS_TABLE)

-- db:exec("SELECT * FROM Users;")

INVENTORY_TABLE = [[
    CREATE TABLE IF NOT EXISTS Inventory (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INTEGER NOT NULL,
        ITEM_ID TEXT NOT NULL,
        ITEM_TYPE TEXT NOT NULL, -- ARMOR, WEAPON, POTION, etc.
        AMOUNT INTEGER NOT NULL,
        EQUIPPED BOOLEAN DEFAULT FALSE, -- only one item type can be equipped
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
    );
]]
db:exec("DROP TABLE IF EXISTS Inventory;")
db:exec(INVENTORY_TABLE)

BANK_TABLE = [[
    CREATE TABLE IF NOT EXISTS Bank (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INTEGER NOT NULL,
        GOLD_AMOUNT FLOAT DEFAULT 0,
        DUMZ_AMOUNT FLOAT DEFAULT 0,
        FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
    );
]]
db:exec("DROP TABLE IF EXISTS Bank;")
db:exec(BANK_TABLE)

-- deposit, withdraw from bank <> game user
-- airdrop - free deposit to game user bank. Given once per cascade per NFT.
-- pull_out - withdraw from game to users address (only for dumz)
-- pull_in - deposit from users address to game (only for dumz)
BANK_TRANSACTIONS_TABLE = [[
    CREATE TABLE IF NOT EXISTS BankTransactions (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USER_ID INTEGER NOT NULL,
        AMOUNT FLOAT DEFAULT 0,
        TOKEN_TYPE TEXT NOT NULL CHECK(TOKEN_TYPE IN ('GOLD', 'DUMZ')),
        TRANSACTION_TYPE TEXT NOT NULL CHECK(TRANSACTION_TYPE IN ('DEPOSIT', 'WITHDRAW', 'AIRDROP', 'PULL_OUT', PULL_IN)),
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
    );
]]
db:exec("DROP TABLE IF EXISTS BankTransactions;")
db:exec(BANK_TRANSACTIONS_TABLE)
