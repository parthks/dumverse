require("utils.combat")
local json = require("json")

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
    damage: number
    difficulty: string
    gold_reward: integer
    dumz_reward: integer
    extra_gold: integer | nil
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
        "C5Mew98EcDDAw_PuPR3A2YrTbEdAKIi2tWQjhca85co",
        "crigtRqaGl05C5rEHWpBzMlB83CGz0PpNOsEZYMkIms",
        "c4my8yA8JTpydKTZ6KZ-UQ0z1HvacJO_vnTMI_VGXx8",
        "PdTfjViGZh2jbmN3-72X3Q1S_Q6zu7Pr_uvOiB5b7s0",
        "MoW74fDXI1IwvZ_YndSDY1G7WUs5QrYgtcYuttU6Izg",
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
    else
        table.insert(PlayerBattleData[battle_id], _battle_data)
    end
end    
-- ffvkmPM1jW71hFlBpVbaIapBa_Wl6UIwfdTkDNqsKNw

Handlers.add("History.SavedToHistory", Handlers.utils.hasMatchingTag("Action", "History.SavedToHistory"), savedToHistoryHandler)

return {}

-- utils.globals utils.constants utils.utils.dbAdmin
-- utils.globals utils.constants utils.utils.dbAdmin
-- utils.globals utils.constants utils.utils.dbAdmin
-- utils.globals utils.constants utils.utils.dbAdmin
-- utils.globals utils.constants utils.utils.dbAdmin