require("blackjack.types")

global MAX_PLAYERS_IN_BLACKJACK = 3

global MIN_BET_PLACE_BY_USER = 0

global MAX_BET_PLACE_BY_USER = 100

global ROUND_COUNT: integer
if not ROUND_COUNT then
    ROUND_COUNT = 0
end

global Rounds: {number:Round}
if not Rounds then
    Rounds = {}
end
