local json = require("json")
-- local constants = require("utils.constants")
require("combat.types")
global MAX_PLAYERS_IN_BATTLE = 2
-- global GAME_PROCESS_ID = ao.env.Process.Tags.GameProcessId
global GAME_PROCESS_ID = "Q-m1C__tJObZCydD_fTcds6np6gHRDDP05PfkCSSLGI"

global BATTLE_COUNT: integer
if not BATTLE_COUNT then
    BATTLE_COUNT = 0
end

-- table of battles with id as key and battle as value
global Battles: {number:Battle}
if not Battles then
    Battles = {}
end


 -- table of npcs with id as key and extra gold as value, taken from perished players
global NPCS_EXTRA_GOLD: {string:integer}
if not NPCS_EXTRA_GOLD then
    NPCS_EXTRA_GOLD = {}
end

global ONE_OF_ONE_ASSET_IDS: {string} = {
    "A8ucm402DGkcJWydu1iibXGvpsDSnI5rj3Z-zP7JjB4",
    "XYkNDhHBAPF85xy7E56mmZR4VJTS8os0JbxNh_fdRZE",
    "2UMirpNKMZ9MDpApI3gI0Dy0975fC-vOK3UoIeMM2yg",
    "5U-KMM4rJ2x19xEEgSIHVdDopxuTXgCjaQgTUrNFiKE",
}

global CRON_TICK_COUNT = 0

global function sendBatteDataToHistoryProcess(battle_Id:integer,battle_data: Battle, battle_error_status: string)
    ao.send({
        Target = "6sCdkpNtbFwGMk73ys5XImL3akp_ttkKjHU4B-eO-e8",
        Action = "Record.SavedToHistory",
        Data = json.encode(battle_data),
        SubProcess = tostring(ao.id),
        ErrorStatus = battle_error_status,
        BattleId = tostring(battle_Id)
    })
end    


-- global DailyTrunkTokenStatus: {number: DailyTrunkToken}
-- if not DailyTrunkTokenStatus then
--     DailyTrunkTokenStatus = {}
-- end
