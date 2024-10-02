
require("combat.types")
global MAX_PLAYERS_IN_BATTLE = 1
global GAME_PROCESS_ID = ao.env.Process.Tags.GameProcessId

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

global CRON_TICK_COUNT = 0


