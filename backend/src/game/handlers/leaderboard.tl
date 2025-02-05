local json = require("json")
require("utils.globals")

local function goldEarnedLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, gold_earned FROM Leaderboard ORDER BY gold_earned DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function goldLostLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, gold_lost FROM Leaderboard ORDER BY gold_lost DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function dumzLostLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, dumz_lost FROM Leaderboard ORDER BY dumz_lost DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function battleWinLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, battle_win FROM Leaderboard ORDER BY battle_win DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function battleLostLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, battle_lost FROM Leaderboard ORDER BY battle_lost DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function enemiesKilledLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, enemy_killed FROM Leaderboard ORDER BY enemy_killed DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function playerDeathLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, player_death FROM Leaderboard ORDER BY player_death DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function deathStreakLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, death_streak FROM Leaderboard ORDER BY death_streak DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function goldWinInPvPLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, gold_win_in_pvp FROM Leaderboard ORDER BY gold_win_in_pvp DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function dumzWinInPvPLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, dumz_win_in_pvp FROM Leaderboard ORDER BY dumz_win_in_pvp DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

local function pvpWinLeaderboardInfoHandler(msg: Message)
    local result = dbAdmin:exec(string.format([[SELECT id, user_id, name, address, nft_address, pvp_wins FROM Leaderboard ORDER BY pvp_wins DESC;]])) 
    ao.send({Target= msg.From, Data=json.encode(result)})
end

Handlers.add("Leaderboard.GoldEarned", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.GoldEarned'), goldEarnedLeaderboardInfoHandler)
Handlers.add("Leaderboard.GoldLost", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.GoldLost'), goldLostLeaderboardInfoHandler)
Handlers.add("Leaderboard.DumzLost", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.DumzLost'), dumzLostLeaderboardInfoHandler)
Handlers.add("Leaderboard.BattleWin", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.BattleWin'), battleWinLeaderboardInfoHandler)
Handlers.add("Leaderboard.BattleLost", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.BattleLost'), battleLostLeaderboardInfoHandler)
Handlers.add("Leaderboard.EnemiesKilled", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.EnemiesKilled'), enemiesKilledLeaderboardInfoHandler)
Handlers.add("Leaderboard.PlayerDeath", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.PlayerDeath'), playerDeathLeaderboardInfoHandler)
Handlers.add("Leaderboard.DeathStreak", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.DeathStreak'), deathStreakLeaderboardInfoHandler)
Handlers.add("Leaderboard.GoldWinInPvP", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.GoldWinInPvP'), goldWinInPvPLeaderboardInfoHandler)
Handlers.add("Leaderboard.DumzWinInPvP", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.DumzWinInPvP'), dumzWinInPvPLeaderboardInfoHandler)
Handlers.add("Leaderboard.PvPWin", Handlers.utils.hasMatchingTag('Action', 'Leaderboard.PvPWin'), pvpWinLeaderboardInfoHandler)

return {}

