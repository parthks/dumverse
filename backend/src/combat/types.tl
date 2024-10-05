require("utils.combat")

global record BattleLogEntry
    from: string
    message: string
    timestamp: integer
end

global record Battle
    id: integer
    level: integer
    players_attacked: {string}
    players_alive: {string}
    npcs_alive: {string}
    players: {string: CombatUserData}
    npcs: {string: CombatEnemyData}
    log: {BattleLogEntry}
    last_npc_attack_timestamp: {string: integer}
    ended: boolean
    winner: string | nil
    created_at: integer
end

global record BattleHelpersType
    getLatestSuitableOpenBattle: function(player: CombatUserData): Battle | nil
    killNPC: function(battle_id: integer, npc_id: string, attacker_id: string, timestamp: integer)
    killPlayer: function(battle_id: integer, player_id: string, attacker_id: string, timestamp: integer)
    playerRanAway: function(battle_id: integer, player_id: string, timestamp: integer)
    addPlayer: function(battle_id: integer, player: CombatUserData)
    log: function(battle_id: integer, timestamp: integer, from: string, message: string)
    addLogs: function(battle_id: integer, logs: {BattleLogEntry})
    new: function(timestamp: integer): Battle
    get: function(id: integer): Battle
    update: function(id: integer, battle: Battle)
    checkIfBattleShouldEnd: function(battle_id: integer): boolean
    endBattle: function(battle_id: integer, winner_id: string | nil, timestamp: integer)
end

global type CombatEnemyData = record
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

