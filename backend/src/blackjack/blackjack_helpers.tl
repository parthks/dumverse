require("blackjack.types")
require("blackjack.globals")
local utils = require("utils.utils.tl-utils")
require("blackjack.globals")
local constants = require("utils.constants")

local function addLog(blackjack_id: string, timestamp: integer, from: string, message: string)
    Rounds[blackjack_id].logs = Rounds[blackjack_id].logs or {}
    table.insert(Rounds[blackjack_id].logs, {
        from = from,
        message = message,
        timestamp = timestamp
    })
end

local function GetOpenBlackjackRoundsOfUser(user_address: string, timestamp: integer): {Round}
    local rounds: {Round} = {}

    for _, blackjack in pairs(Rounds) do

        if blackjack.ended and (blackjack.created_at + 60000) < timestamp then
            Rounds[tostring(blackjack.id)] = nil
        end

        if not blackjack.ended and (blackjack.created_at + 300000) < timestamp then
            -- print("Blackjack round: " .. blackjack.id .. " - ENDED DUE TO PLAYER INACTIVITY")
            addLog(
                tostring(blackjack.id),
                timestamp,
                "GetOpenBlackjackRoundsOfUser",
                "Blackjack round ended due to player inactivity. Last active timestamp: " .. blackjack.created_at
            )
            blackjack.ended = true
            Rounds[tostring(blackjack.id)] = nil
        end

        if not blackjack.ended then
            local user_addresses = {}

            -- Get all player addresses in open round
            for _, player in pairs(blackjack.players) do
                user_addresses[#user_addresses + 1] = player.address
            end

            if utils.includes(user_address, user_addresses) then
                -- print("Blackjack round: " .. blackjack.id .. " is open for user " .. user_address)
                rounds[#rounds + 1] = blackjack
            end
        end
    end

    return rounds
end

local function calculateTotalWithAceAdjustment(cards: {Card}): integer
    local total: integer = 0
    local aceCount: integer = 0

    -- First, add up all non-Ace cards
    for _, card in ipairs(cards) do
        if type(card.value) == "table" then
            -- This is an Ace
            aceCount = aceCount + 1
            total = total + 11
        else
            total = total + (card.value as integer)
        end
    end

    -- Convert Aces from 11 to 1 as needed to prevent bust
    while total > 21 and aceCount > 0 do
        total = total - 10
        aceCount = aceCount - 1
    end

    return total
end

local function isPlayerBust(players: Player): PlayerCardValues
    local total: number = calculateTotalWithAceAdjustment(players.cards)
    local data: PlayerCardValues = {
        address = players.address,
        id = tostring(players.user_id),
        name = players.name,
        cardsValue = total,
        status = (total > 21) and "Burst" or "Not Burst"
    }

    return data
end

local function getLatestSuitableOpenBattle(): Round | nil
    for _, blackjack in pairs(Rounds) do
        if not blackjack.ended then
            -- print("Checking blackjack round " .. blackjack.id .. " for any online player")
            if #utils.keys(blackjack.players) < MAX_PLAYERS_IN_BLACKJACK then
                return blackjack
            end
        end
    end
    return nil
end

local function createBlackjackRoundCopy(original_round: Round, user_id: string): Round
    -- Create a new round table with proper typing

    local uss = user_id
    uss= ''
    local round: Round = {
        id = original_round.id,
        players = {},
        dealer = {
            address = original_round.dealer.address,
            balance = original_round.dealer.balance,
            hiddenCard = #original_round.winner > 0 and original_round.dealer.hiddenCard or nil,
            visibleCard = original_round.dealer.visibleCard,
            hasBust = original_round.dealer.hasBust,
            winnigAmount = original_round.dealer.winnigAmount,
            status = original_round.dealer.status
        },
        -- deck = #original_round.winner > 0 and original_round.deck or nil,
        deck =  nil,
        logs = original_round.logs,
        started = original_round.started,
        ended = original_round.ended,
        winner = original_round.winner,
        created_at = original_round.created_at
    }

    -- Deep copy players
    for playerId, originalPlayer in pairs(original_round.players) do
        round.players[playerId] = {
            user_id = originalPlayer.user_id,
            address = originalPlayer.address,
            nft_address = originalPlayer.nft_address,
            name = originalPlayer.name,
            betAmount = originalPlayer.betAmount,
            betPlaced = originalPlayer.betPlaced,
            -- cards = (playerId == user_id or originalPlayer.hasStood) and originalPlayer.cards or nil,
            cards = (playerId == user_id or originalPlayer.betPlaced) and originalPlayer.cards or nil,
            -- cards = originalPlayer.cards ,
            value = originalPlayer.value,
            hasDoubleDown = originalPlayer.hasDoubleDown,
            hasBust = originalPlayer.hasBust,
            hasStood = originalPlayer.hasStood,
            status = originalPlayer.status,
            gold_balance = originalPlayer.gold_balance,
            added_at = originalPlayer.added_at
        }
    end

    return round
end


local function sendGoldToPlayerWin(blackjack_id: string)
    local players = Rounds[blackjack_id].players
    for playerId, playerDetails in pairs(players) do
        ao.send({
            Target = constants.GAME_PROCESS_ID,
            Action = "BlackjackMatch.BlackjackWon",
            UserId = tostring(playerId),
            RoundId = blackjack_id,
            Gold = tostring(playerDetails.gold_balance),
        })
    end
end

return {
    addLog = addLog,
    GetOpenBlackjackRoundsOfUser = GetOpenBlackjackRoundsOfUser,
    isPlayerBust = isPlayerBust,
    getLatestSuitableOpenBattle = getLatestSuitableOpenBattle,
    calculateTotalWithAceAdjustment = calculateTotalWithAceAdjustment,
    createBlackjackRoundCopy = createBlackjackRoundCopy,
    sendGoldToPlayerWin = sendGoldToPlayerWin
}
