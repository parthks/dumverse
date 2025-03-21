require("utils.combat")
local json = require("json")
require("utils.globals")

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



global PlayerBattleData: {number:{Battle}}
if not PlayerBattleData then
    PlayerBattleData = {}
end

global SubProcesses: {string}
if not SubProcesses then
    SubProcesses = {
        "5EwarJ937Hxx5961oTypYS2R-P4YXlhbNPBtN8MDgcQ",
        "ePgW-n_4-xW-TVzNuX0LKnO2fAdmf2ArFu87_RzSgVQ",
        "iDw3CxdrETywWxA_Zed5aEmrFbgitSHZOxOwdfhD4sA",
        "VFhgKE3lhDnlBRR_3danRaVbVnECpJcK6zIsHnP8-TU",
        "adOKunFqCj9NuRxWj8KUBp1oCUYf53F2jfEGR8MI_ZM",
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

global function gettingBattleDataOfPlayerFromLastBattle(UserAddress: string): {Battle} | nil
    local battles = {}
    local battleIds = {} -- To track already added battles

    for _, battle_data in pairs(PlayerBattleData) do
        for _, battlesAtIds in ipairs(battle_data) do
            -- Check if we've already added this battle
            if not battleIds[battlesAtIds.id] then
                for _, userdata in pairs(battlesAtIds.players) do
                    if userdata.address == UserAddress then
                        table.insert(battles, battlesAtIds)
                        battleIds[battlesAtIds.id] = true
                        break -- Break after finding the user in this battle
                    end
                end
            end
        end
    end

    -- Sort battles by creation time (newest first)
    table.sort(battles, function(a: Battle, b: Battle): boolean
        return (a.created_at or 0) > (b.created_at or 0)
    end)
    
    print(UserAddress .. " : " .. tostring(#battles))
    
    -- Limit to last 10 battles
    local result = {}
    local count = 0
    for _, battle in ipairs(battles) do
        count = count + 1
        table.insert(result, battle)
        if count >= 2 then -- Changed from 1 to 10
            break
        end
    end

    if #result > 0 then
        return result
    end
    return nil
end



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


local function resetRecordSubprocessesHandler(msg:Message)
    assert(msg.From=="Q-m1C__tJObZCydD_fTcds6np6gHRDDP05PfkCSSLGI","You can not call this handler")
    print("Initiate")
    SubProcesses = {
        "5EwarJ937Hxx5961oTypYS2R-P4YXlhbNPBtN8MDgcQ",
        "ePgW-n_4-xW-TVzNuX0LKnO2fAdmf2ArFu87_RzSgVQ",
        "iDw3CxdrETywWxA_Zed5aEmrFbgitSHZOxOwdfhD4sA",
        "VFhgKE3lhDnlBRR_3danRaVbVnECpJcK6zIsHnP8-TU",
        "adOKunFqCj9NuRxWj8KUBp1oCUYf53F2jfEGR8MI_ZM",
    }
    print("Done successfully")
end

Handlers.add("Record.SavedToHistory", Handlers.utils.hasMatchingTag("Action", "Record.SavedToHistory"), savedToHistoryHandler)
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