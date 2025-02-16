local json = require("json")
require("utils.globals")
require("blackjack.types")
require("blackjack.globals")
local constants = require("utils.constants")

local blackjack_constant_variable = require("blackjack.constant")
local deck = blackjack_constant_variable.deck
local Dealer = blackjack_constant_variable.Dealer

local blackjack_helpers = require("blackjack.blackjack_helpers")
local addLog = blackjack_helpers.addLog
local GetOpenBlackjackRoundsOfUser = blackjack_helpers.GetOpenBlackjackRoundsOfUser
local isPlayerBust = blackjack_helpers.isPlayerBust
local getLatestSuitableOpenBattle = blackjack_helpers.GetOpenBlackjackRoundsOfUser
local calculateTotalWithAceAdjustment = blackjack_helpers.calculateTotalWithAceAdjustment


local function newUserJoinBlackjackHandler(msg: Message)
    
    assert(constants.GAME_PROCESS_ID == msg.From, "Only Game process can send this message")

    local user_id = tonumber(msg.Tags.UserId) as integer
    local user_data = json.decode(msg.Data) as UserData
    local timestamp = msg.Timestamp

    local rounds = GetOpenBlackjackRoundsOfUser(user_data.address, timestamp)

    if #rounds > 0 then
        print("user is already in a blackjack game")
        ao.send({
            Target = constants.GAME_PROCESS_ID,
            UserId = tostring(user_id),
            RoundId = tostring(rounds[1].id),
            Gold = tostring(rounds[1].players[user_id].gold_balance),
            Action = "BlackjackMatch.EnteredNewBlackjackMatch",
        })
        return
    end

    local round = getLatestSuitableOpenBattle() as Round

    if not round then
        ROUND_COUNT = ROUND_COUNT + 1
        local new_round: Round = {
            id = ROUND_COUNT,
            players = {},
            dealer = Dealer,
            deck = deck,
            logs = {},
            -- internal_logs = {},
            started = false,
            ended = false,
            winner = {},
            created_at = timestamp
        }

        Rounds[ROUND_COUNT] = new_round

        for i = #Rounds[ROUND_COUNT].deck, 2, -1 do
            local j = math.random(i)
            Rounds[ROUND_COUNT].deck[i], Rounds[ROUND_COUNT].deck[j] = Rounds[ROUND_COUNT].deck[j], Rounds[ROUND_COUNT].deck[i]
        end

        if #Rounds[ROUND_COUNT].dealer.visibleCard == 0 then
            Rounds[ROUND_COUNT].dealer.hiddenCard = Rounds[ROUND_COUNT].deck[1]
            table.remove(Rounds[ROUND_COUNT].deck, 1)
            table.insert(Rounds[ROUND_COUNT].dealer.visibleCard, Rounds[ROUND_COUNT].deck[1])
            table.remove(Rounds[ROUND_COUNT].deck, 1)
        end
    end

    -- Player Information
    local player: Player = {
        user_id = user_id,
        nft_address = user_data.nft_address or nil,
        address = user_data.address,
        betAmount = 0,
        betPlaced = false,
        cards = {},
        hasDoubleDown = false,
        hasBust = false,
        hasStood = false,
        gold_balance = user_data.gold_balance,
        added_at = timestamp
    }

    Rounds[ROUND_COUNT].players[user_id] = player

    for _, playerDetails in pairs(Rounds[ROUND_COUNT].players) do
        table.insert(playerDetails.cards, Rounds[ROUND_COUNT].deck[1])
        table.remove(Rounds[ROUND_COUNT].deck, 1)
        table.insert(playerDetails.cards, Rounds[ROUND_COUNT].deck[1])
        table.remove(Rounds[ROUND_COUNT].deck, 1)
    end

    addLog(Rounds[ROUND_COUNT].id, timestamp, "newUserJoinBlackjackHandler", "Player " .. user_id .. " added to Blackjack")

    ao.send({
        Target = constants.GAME_PROCESS_ID,
        UserId = tostring(user_id),
        RoundId = tostring(Rounds[ROUND_COUNT].id),
        Gold = tostring(Rounds[ROUND_COUNT].players[user_id].gold_balance),
        Action = "BlackjackMatch.EnteredNewBlackjackMatch",
    })
end


local function getOpenBlackjackRoundsHandler(msg: Message)
    local round = GetOpenBlackjackRoundsOfUser(msg.From, msg.Timestamp)
    ao.send({ Target = msg.From, Data = json.encode(round) })
end

-- Handler for placing a bet
local function placeBetHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId) as integer
    local round_id = tonumber(msg.Tags.RoundId) as integer
    local user_bet_amount = tonumber(msg.Tags.Bet)

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id))
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended")
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has already placed bet in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has double down in Blackjack Round id: " .. tostring(round_id))
    assert(user_bet_amount > MIN_BET_PLACE_BY_USER and user_bet_amount <= MAX_BET_PLACE_BY_USER, "Player " .. tostring(user_id) .. " placed an insufficient bet in Blackjack Round id: " .. tostring(round_id))

    local player = Rounds[round_id].players[user_id]

    player.betAmount = user_bet_amount
    player.betPlaced = true
    player.gold_balance = player.gold_balance - player.betAmount

    Rounds[round_id].players[user_id] = player

    print("Player " .. tostring(user_id) .. " has placed bet " .. user_bet_amount .. " in Blackjack Round id: " .. tostring(round_id))

    ao.send({ Target = msg.From, Status = "Success" })
end



-- Handler for showing cards at the end of a round
local function blackjackInfoHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId) as integer
    local round_id = tonumber(msg.Tags.RoundId) as integer

    local round = Rounds[round_id]
    if not round.winner then
        round.dealer.hiddenCard = nil
        round.deck = nil
        for playerId, playerDetails in pairs(round.players) do
            if playerId ~= user_id and not playerDetails.hasStood then
                playerDetails.cards = nil
            end
        end
    end

    local data = json.encode(round)
    ao.send({ Target = msg.From, Data = data })
end



-- Handler for player hitting in Blackjack
local function hitHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId) as integer
    local round_id = tonumber(msg.Tags.RoundId) as integer

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id))
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended")
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id))
    assert(Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has not placed bet in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has already doubled down in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasBust, "Player " .. tostring(user_id) .. " is already bust in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasStood, "Player " .. tostring(user_id) .. " has already stood in Blackjack Round id: " .. tostring(round_id))

    local Deck = Rounds[round_id].deck
    local player = Rounds[round_id].players[user_id]

    -- Deal a new card from the deck
    table.insert(player.cards, Deck[1])
    table.remove(Deck, 1)
    print("card added")

    local checkPlayersBurst = isPlayerBust(player)
    if checkPlayersBurst.status == "Burst" then
        player.hasBust = true
        player.hasStood = true
    end
    player.value = checkPlayersBurst.cardsValue

    Rounds[round_id].players[user_id] = player
    Rounds[round_id].deck = Deck

    print("checking burst and send message")
    ao.send({ Target = msg.From, Status = "Success" })
end


-- Handler for doubling down on a bet
local function doubleDownHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId) as integer
    local round_id = tonumber(msg.Tags.RoundId) as integer

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id))
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended")
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id))
    assert(Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has not placed bet in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has already doubled down in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasBust, "Player " .. tostring(user_id) .. " is already bust in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasStood, "Player " .. tostring(user_id) .. " has already stood in Blackjack Round id: " .. tostring(round_id))

    local Deck = Rounds[round_id].deck
    local player = Rounds[round_id].players[user_id]

    player.hasDoubleDown = true
    player.gold_balance = player.gold_balance - player.betAmount
    player.betAmount = player.betAmount * 2
    table.insert(player.cards, Deck[1])
    table.remove(Deck, 1)

    local checkPlayersBurst = isPlayerBust(player)
    if checkPlayersBurst.status == "Burst" then
        player.hasBust = true
        player.hasStood = true
    end

    player.hasStood = true
    player.value = checkPlayersBurst.cardsValue

    Rounds[round_id].players[user_id] = player
    Rounds[round_id].deck = Deck

    ao.send({ Target = msg.From, Status = "Success" })
end


-- Handler for determining the winner of the game
local function matchWinner(msg: Message)
    for _, round in pairs(Rounds) do
        local playerCount, stoodCount = 0, 0
        local players = round.players

        -- Count players and those who have stood
        for _, player in pairs(players) do
            playerCount = playerCount + 1
            if player.hasStood then 
                stoodCount = stoodCount + 1 
            end
        end

        -- Check if all players have stood and round duration exceeded
        if playerCount == stoodCount and round.created_at + 60000 < msg.Timestamp then
            local Deck = round.deck
            local playerAndDealerCardValues: {string: PlayerCardValues} = {}

            -- Process player results
            for _, player in pairs(players) do
                local playerData = isPlayerBust(player)
                player.value = playerData.cardsValue
                playerAndDealerCardValues[playerData.id] = playerData

                if playerData.cardsValue == 21 then
                    player.gold_balance = player.gold_balance + (player.betAmount * 2.5)
                    playerData.status = "Blackjack"
                    round.winner[#round.winner + 1] = tostring(player.user_id)
                end

                player.status = playerData.status
            end

            -- Dealer logic
            local dealer = round.dealer
            local dealerCards = { dealer.visibleCard[1], dealer.hiddenCard }
            local dealerTotal = calculateTotalWithAceAdjustment(dealerCards)

            -- Dealer must hit until at least 17
            while dealerTotal <= 16 do
                table.insert(dealer.visibleCard, Deck[1])
                table.remove(Deck, 1)
                dealerCards = { dealer.visibleCard[1], dealer.visibleCard[2], dealer.hiddenCard }
                dealerTotal = calculateTotalWithAceAdjustment(dealerCards)
            end

            dealer.status = (dealerTotal == 21 and "Blackjack") or (dealerTotal > 21 and "Bust") or "Not Bust"
            dealer.hasBust = dealerTotal > 21
            playerAndDealerCardValues["Dealer"] = { 
                address = dealer.address, 
                cardsValue = dealerTotal, 
                status = dealer.status, 
                id = "Dealer" 
            }

            -- If dealer has blackjack, check for tie scenario
            if dealer.status == "Blackjack" then
                dealer.winnigAmount = dealerTotal
                round.winner[#round.winner + 1] = "Dealer" 

                for _, player in pairs(players) do
                    if player.status == "Blackjack" then
                        player.gold_balance = player.gold_balance - (player.betAmount * 2.5) + player.betAmount
                    else
                        player.gold_balance = player.gold_balance - player.betAmount
                    end
                end

                round.ended = true
                break
            end

            -- If dealer busts, all remaining players win
            if dealer.hasBust then
                for _, player in pairs(players) do
                    if player.status ~= "Blackjack" then
                        player.gold_balance = player.gold_balance + player.betAmount
                    end
                    round.winner[#round.winner + 1] = tostring(player.user_id)
                end

                round.ended = true
                break
            end

            -- Determine the highest valid hand (not busted or blackjack)
            local winner: PlayerCardValues
            for _, entry in pairs(playerAndDealerCardValues) do
                if entry.status == "Not Bust" and entry.status ~= "Blackjack" then
                    if not winner or entry.cardsValue > winner.cardsValue then
                        winner = entry
                    end
                end
            end

            -- Handle winnings based on winner determination
            if winner then
                if winner.id == "Dealer" then
                    dealer.winnigAmount = winner.cardsValue
                    for _, player in pairs(players) do
                        if player.status ~= "Blackjack" then
                            if player.value == winner.cardsValue then
                                player.gold_balance = player.gold_balance + player.betAmount
                                round.winner[#round.winner + 1] = tostring(player.user_id)
                            else
                                player.gold_balance = player.gold_balance - player.betAmount
                            end
                        end
                    end
                else
                    for _, player in pairs(players) do
                        if player.address == winner.address and player.user_id == tonumber(winner.id) then
                            player.gold_balance = player.gold_balance + (player.betAmount * 2)
                        elseif player.status ~= "Blackjack" then
                            player.gold_balance = player.gold_balance - player.betAmount
                        end
                    end
                end

                round.winner[#round.winner + 1] = winner.id
            end
        end
    end
end



-- Handler for player standing
local function standHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId) as integer
    local round_id = tonumber(msg.Tags.RoundId) as integer

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id) )
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended" )
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id) )
    assert(Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has not placed bet in Blackjack Round id: " .. tostring(round_id) )
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has already doubled down in Blackjack Round id: " .. tostring(round_id) )
    
    Rounds[round_id].players[user_id].hasStood = true

    ao.send({Target= msg.From, Status = "Success" })
end


Handlers.add("Blackjack.NewUserJoinBlackjack", Handlers.utils.hasMatchingTag("Action", "Blackjack.NewUserJoinBlackjack"), newUserJoinBlackjackHandler)
Handlers.add("Blackjack.GetOpenBlackjackRounds", Handlers.utils.hasMatchingTag("Action", "Blackjack.GetOpenBlackjackRounds"), getOpenBlackjackRoundsHandler)
Handlers.add("Blackjack.PlaceBet", Handlers.utils.hasMatchingTag("Action", "Blackjack.PlaceBet"), placeBetHandler)
Handlers.add("Blackjack.Info", Handlers.utils.hasMatchingTag("Action", "Blackjack.Info"), blackjackInfoHandler)
Handlers.add("Blackjack.Hit", Handlers.utils.hasMatchingTag("Action", "Blackjack.Hit"), hitHandler)
Handlers.add("Blackjack.DoubleDown", Handlers.utils.hasMatchingTag("Action", "Blackjack.DoubleDown"), doubleDownHandler)
-- Handlers.add("Blackjack.Win", Handlers.utils.hasMatchingTag("Action", "Blackjack.Win"), matchWinner)
Handlers.add("Blackjack.Stand", Handlers.utils.hasMatchingTag("Action", "Blackjack.Stand"), standHandler)



Handlers.add("matchWinner", Handlers.utils.hasMatchingTag("Action", "Cron"), function(msg: Message)
    matchWinner(msg)
end)

Handlers.prepend("CheckPlayerStatus",function(): string
        return "continue"
    end,
    function(msg: Message)
        matchWinner(msg)
    end
)

return {}