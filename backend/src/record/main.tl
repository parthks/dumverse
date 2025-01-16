require("utils.combat")
local json = require("json")
require("utils.globals")
local sqlite3 = require('lsqlite3')
local dbAdminnn = require("utils.utils.dbAdmin")
local constants = require("utils.constants")

global record Battle
    id: integer
    subprocess_address: string
    level: integer
    players_attacked: {string}
    players_alive: {string}
    npcs_alive: {string}
    players: {string: CombatUserData}
    npcs: {string: CombatEnemyData}
    log: {BattleLogEntry}
    internal_logs: {BattleLogEntry}
    last_player_attack_timestamp: {string: integer}
    last_npc_attack_timestamp: {string: integer}
    started: boolean
    ended: boolean
    winner: string | nil
    created_at: integer
    error: string
end

global record CombatEnemyData
    id: string
    name: string
    total_health: number
    health: number
    damage: number | {number}
    difficulty: string
    gold_reward: integer
    dumz_reward: integer
    extra_gold: integer | nil
    trunk_reward: integer | nil
end

global record BattleLogEntry
    from: string
    message: string
    timestamp: integer
end

global LEADERBOARD_TABLE: string = [[
DROP TABLE IF EXISTS Leaderboard;
    CREATE TABLE IF NOT EXISTS Leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        nft_address TEXT,
        address TEXT NOT NULL,
        gold_earned INTEGER DEFAULT 0,
        gold_lost INTEGER DEFAULT 0,
        battle_win INTEGER DEFAULT 0,
        battle_lost INTEGER DEFAULT 0,
        enemy_killed INTEGER DEFAULT 0,
        player_death INTEGER DEFAULT 0,
        death_streak INTEGER DEFAULT 0,
        pvp INTEGER DEFAULT 0
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
      dbAdmin.db:exec(LEADERBOARD_TABLE)
end
    
global LEADERBOARD_INITIALIZED: boolean
    LEADERBOARD_INITIALIZED = LEADERBOARD_INITIALIZED or false
    if (not LEADERBOARD_INITIALIZED) then
      DBInit()
      LEADERBOARD_INITIALIZED = true
end


global PlayerBattleData: {number:{Battle}}
if not PlayerBattleData then
    PlayerBattleData = {}
end

global SubProcesses: {string}
if not SubProcesses then
    SubProcesses = {
        "jqV5F0Hf69S4_uQbtLJhJMuYZwOVszzO2DUcAbkl57E",
        "es7fbu4enhUoICeZnANuT8DWu6fvs-8xKLOvI-Slobo",
        "gZfmxG0HeT5uxmpf5MpdF1AcsrpyibwVWvlCs48A8Fo",
        "_sbrjYFbp4DuWGotLtv8xHqwUXjzTQsaRpBGivAZVAY",
        "OUXGFm3m4jWFLifXmyLuCeIXCnJ4rypN1hU3dsHJW-o",
    }
end


global function gettingBattleDataOfPlayer(BattleId: integer, UserAddress: string): {Battle} | nil

    local battle_id = BattleId
    if not PlayerBattleData[battle_id] then
        return nil
    end

    local battle_data = PlayerBattleData[battle_id]
    local user_address = UserAddress
    local matched_battles = {}

    for _, battle in ipairs(battle_data) do
        for _, userdata in pairs(battle.players) do
            if userdata.address == user_address then
                table.insert(matched_battles, battle)
                break 
            end
        end
    end

    if #matched_battles == 0 then
        return nil
    end

    return matched_battles
end

-- local function getLeaderboardByMetric(metric: string):{{any:any}}
--     local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, %s FROM Leaderboard ORDER BY %s DESC;]], metric, metric))
--     return result
-- end

local function savedToHistoryHandler(msg: Message)
    local found = false
    for _, subProcess in ipairs(SubProcesses) do
        if subProcess == msg.From then
            found = true
            break 
        end

    end
    if not found then
        assert(found == true, "Only Combat process can send this message")
    end

    local battle_id = tonumber(msg.Tags.BattleId) as integer
    local battle_data = json.decode(msg.Data) as { string: any }
    battle_data.subprocess_address = msg.Tags.SubProcess
    battle_data.error = msg.Tags.ErrorStatus
    local _battle_data = battle_data as Battle
    

    if not PlayerBattleData[battle_id] then
        PlayerBattleData[battle_id] = { _battle_data }
        print("New Battle Data Entry: " .. battle_id)
    else
        table.insert(PlayerBattleData[battle_id], _battle_data)
        print("Battle data entered in registered Battle Id: " .. battle_id)
    end
end    
-- ffvkmPM1jW71hFlBpVbaIapBa_Wl6UIwfdTkDNqsKNw

local function insertOrUpdateDataInLeaderBoradHandler(msg: Message)
    -- print("Data assert")

    assert(msg.From == constants.GAME_PROCESS_ID,"You cant call this handler")
     local user_id = tonumber(msg.Tags.UserId)
     local leaderboarda_data = json.decode(msg.Data) as Leaderboard
    -- print("Data coming")
     local user_exist= dbAdmin:exec(string.format([[
             SELECT * from Leaderboard WHERE user_id = %d;
           ]], user_id))
        --    print("Data user_exist")

      if leaderboarda_data.nft_address == nil then
        leaderboarda_data.nft_address = "NULL"   
      end

      if #user_exist == 0 then
        dbAdmin:exec(string.format([[
        INSERT INTO Leaderboard (user_id, name, address, nft_address, gold_earned, gold_lost, battle_win, battle_lost, enemy_killed, player_death, death_streak, pvp)
        VALUES (%d, '%s', '%s', '%s', 0, 0, 0, 0, 0, 0, 0, 0);
    ]], user_id, leaderboarda_data.name, leaderboarda_data.address, leaderboarda_data.nft_address))
    -- print("Data INSERT")
      end

        if leaderboarda_data.death_streak_ended then
            dbAdmin:exec(string.format([[
        UPDATE Leaderboard SET gold_lost = gold_lost + %d, battle_lost = battle_lost + 1, player_death = player_death + 1, death_streak = 0 WHERE user_id = %d ;
    ]],  leaderboarda_data.gold_lost, user_id))
    -- print("Data UPDATE loss")

        else
            dbAdmin:exec(string.format([[
                UPDATE Leaderboard SET gold_earned = gold_earned + %d, battle_win = battle_win + 1, enemy_killed = enemy_killed + %d, death_streak = death_streak + 1 WHERE user_id = %d ;
            ]], leaderboarda_data.gold_earned, leaderboarda_data.enemy_killed ,user_id))
            -- print("Data UPDATE win")
        end
        print("New Leaderboard Entry: " .. user_id)

end  

local function getLeaderboardDataHandler(msg: Message) 
    local metrices = msg.Tags.metrices
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, %s FROM Leaderboard ORDER BY %s DESC;]], metrices, metrices)) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function resetRecordSubprocessesHandler(msg:Message)
    assert(msg.From==ao.id,"You can not call this handler")
    print("Initiate")
    -- dbAdmin:exec(string.format([[TRUNCATE TABLE Leaderboard]]))
    DBInit()
    print("Done successfully")
end

Handlers.add("Record.SavedToHistory", Handlers.utils.hasMatchingTag("Action", "Record.SavedToHistory"), savedToHistoryHandler)
Handlers.add("Record.insertOrUpdateDataInLeaderBorad", Handlers.utils.hasMatchingTag("Action", "Record.insertOrUpdateDataInLeaderBorad"), insertOrUpdateDataInLeaderBoradHandler)
Handlers.add("Record.getLeaderboardData", Handlers.utils.hasMatchingTag("Action", "Record.getLeaderboardData"), getLeaderboardDataHandler)
Handlers.add("Record.ResetRecordSubprocesses", Handlers.utils.hasMatchingTag('Action', 'Record.ResetRecordSubprocesses'), resetRecordSubprocessesHandler)

-- return {}

-- utils.globals utils.constants utils.utils.dbAdmin
-- "gold_earned"
-- "gold_lost"
-- "battle_win"
-- "battle_lost"
-- "enemy_killed"
-- "player_death"
-- "death_streak"
-- "pvp"


-- history:
--   processId: QRxo_20Grok3jWppfpeSV3WgwFyViIg33W_OHpYRj7U
--   hash: 7d8229df19eb09565ad7e7b63ce7d0727666b7a6d99309746b4473e6c3c8fc32