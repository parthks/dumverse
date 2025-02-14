require("blackjack.types")
require("blackjack.globals")
local utils = require("utils.utils.tl-utils")
require("blackjack.globals")


local function addLog(blackjack_id: integer, timestamp: integer, from: string, message: string)
    Rounds[blackjack_id].logs = Rounds[blackjack_id].logs or {}
    table.insert(Rounds[blackjack_id].logs, {
        from = from,
        message = message,
        timestamp = timestamp
    })
end

local function GetOpenBlackjackRoundsOfUser(user_address: string, timestamp: integer): {Round}
    local rounds = {}

    for _, blackjack in pairs(Rounds) do
        if not blackjack.ended and (blackjack.created_at + 300000) < timestamp then
            print("Blackjack round: " .. blackjack.id .. " - ENDED DUE TO PLAYER INACTIVITY")
            addLog(
                blackjack.id,
                timestamp,
                "GetOpenBlackjackRoundsOfUser",
                "Blackjack round ended due to player inactivity. Last active timestamp: " .. blackjack.created_at
            )
            blackjack.ended = true
        end

        if not blackjack.ended then
            local user_addresses = {}

            -- Get all player addresses in open battle
            for _, player in pairs(blackjack.players) do
                user_addresses[#user_addresses + 1] = player.address
            end

            if utils.includes(user_address, user_addresses) then
                print("Blackjack round: " .. blackjack.id .. " is open for user " .. user_address)
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
        cardsValue = total,
        status = (total > 21) and "Burst" or "Not Burst"
    }

    return data
end

local function getLatestSuitableOpenBattle(): Round | nil
    for _, blackjack in pairs(Rounds) do
        if not blackjack.ended then
            print("Checking blackjack round " .. blackjack.id .. " for any online player")
            if #utils.keys(blackjack.players) < MAX_PLAYERS_IN_BLACKJACK then
                return blackjack
            end
        end
    end
    return nil
end

return {
    addLog = addLog,
    GetOpenBlackjackRoundsOfUser = GetOpenBlackjackRoundsOfUser,
    isPlayerBust = isPlayerBust,
    getLatestSuitableOpenBattle = getLatestSuitableOpenBattle,
    calculateTotalWithAceAdjustment = calculateTotalWithAceAdjustment
}
