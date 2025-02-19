require("blackjack.types")

global MAX_PLAYERS_IN_BLACKJACK = 3

global MIN_BET_PLACE_BY_USER = 5

global MAX_BET_PLACE_BY_USER = 20

global ROUND_COUNT: integer
if not ROUND_COUNT then
    ROUND_COUNT = 0
end

global Rounds: {string:Round}
if not Rounds then
    Rounds = {}
end
