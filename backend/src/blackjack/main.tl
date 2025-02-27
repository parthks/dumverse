local json = require("json")
require("utils.globals")
require("blackjack.types")
require("blackjack.globals")
local constants = require("utils.constants")

-- local blackjack_constant_variable = require("blackjack.constant")
-- local deck = blackjack_constant_variable.deck
-- local Dealer = blackjack_constant_variable.Dealer

local blackjack_helpers = require("blackjack.blackjack_helpers")
local addLog = blackjack_helpers.addLog
local GetOpenBlackjackRoundsOfUser = blackjack_helpers.GetOpenBlackjackRoundsOfUser
local isPlayerBust = blackjack_helpers.isPlayerBust
local getLatestSuitableOpenBattle = blackjack_helpers.getLatestSuitableOpenBattle
local calculateTotalWithAceAdjustment = blackjack_helpers.calculateTotalWithAceAdjustment
local createBlackjackRoundCopy = blackjack_helpers.createBlackjackRoundCopy
local sendGoldToPlayerWin = blackjack_helpers.sendGoldToPlayerWin

local function newUserJoinBlackjackHandler(msg: Message)
    
    assert(constants.GAME_PROCESS_ID == msg.From, "Only Game process can send this message")
    print("started newUserJoinBlackjackHandler")
    local user_id = msg.Tags.UserId
    local user_data = json.decode(msg.Data) as UserData
    local timestamp = msg.Timestamp

    local rounds = GetOpenBlackjackRoundsOfUser(user_data.address, timestamp)

    if #rounds > 0 then
        -- print("user is already in a blackjack game")
        ao.send({
            Target = constants.GAME_PROCESS_ID,
            UserId = tostring(user_id),
            RoundId = tostring(rounds[1].id),
            Gold = tostring(rounds[1].players[user_id].gold_balance),
            Action = "BlackjackMatch.EnteredNewBlackjackMatch"
        })
        return
    end

    local round = getLatestSuitableOpenBattle() 
    
    local round_id: string
    if not round then
        ROUND_COUNT = ROUND_COUNT + 1
        round_id = tostring(ROUND_COUNT)
        local new_round: Round = {
            id = ROUND_COUNT,
            players = {},
            dealer = {
                address = ao.id,
                balance = 1000,
                hiddenCard = {},
                visibleCard = {},
                hasBust = false,
                winnigAmount = nil
                -- gold_balance = 1000,
                
            },
            deck = {
                -- Number cards (2-10)
                { rank = "2",     suit = "Hearts",   value = 2 },
                { rank = "3",     suit = "Hearts",   value = 3 },
                { rank = "4",     suit = "Hearts",   value = 4 },
                { rank = "5",     suit = "Hearts",   value = 5 },
                { rank = "6",     suit = "Hearts",   value = 6 },
                { rank = "7",     suit = "Hearts",   value = 7 },
                { rank = "8",     suit = "Hearts",   value = 8 },
                { rank = "9",     suit = "Hearts",   value = 9 },
                { rank = "10",    suit = "Hearts",   value = 10 },
                { rank = "2",     suit = "Diamonds", value = 2 },
                { rank = "3",     suit = "Diamonds", value = 3 },
                { rank = "4",     suit = "Diamonds", value = 4 },
                { rank = "5",     suit = "Diamonds", value = 5 },
                { rank = "6",     suit = "Diamonds", value = 6 },
                { rank = "7",     suit = "Diamonds", value = 7 },
                { rank = "8",     suit = "Diamonds", value = 8 },
                { rank = "9",     suit = "Diamonds", value = 9 },
                { rank = "10",    suit = "Diamonds", value = 10 },
                { rank = "2",     suit = "Clubs",    value = 2 },
                { rank = "3",     suit = "Clubs",    value = 3 },
                { rank = "4",     suit = "Clubs",    value = 4 },
                { rank = "5",     suit = "Clubs",    value = 5 },
                { rank = "6",     suit = "Clubs",    value = 6 },
                { rank = "7",     suit = "Clubs",    value = 7 },
                { rank = "8",     suit = "Clubs",    value = 8 },
                { rank = "9",     suit = "Clubs",    value = 9 },
                { rank = "10",    suit = "Clubs",    value = 10 },
                { rank = "2",     suit = "Spades",   value = 2 },
                { rank = "3",     suit = "Spades",   value = 3 },
                { rank = "4",     suit = "Spades",   value = 4 },
                { rank = "5",     suit = "Spades",   value = 5 },
                { rank = "6",     suit = "Spades",   value = 6 },
                { rank = "7",     suit = "Spades",   value = 7 },
                { rank = "8",     suit = "Spades",   value = 8 },
                { rank = "9",     suit = "Spades",   value = 9 },
                { rank = "10",    suit = "Spades",   value = 10 },
            
                -- Face cards (Jack, Queen, King)
                { rank = "Jack",  suit = "Hearts",   value = 10 },
                { rank = "Queen", suit = "Hearts",   value = 10 },
                { rank = "King",  suit = "Hearts",   value = 10 },
                { rank = "Jack",  suit = "Diamonds", value = 10 },
                { rank = "Queen", suit = "Diamonds", value = 10 },
                { rank = "King",  suit = "Diamonds", value = 10 },
                { rank = "Jack",  suit = "Clubs",    value = 10 },
                { rank = "Queen", suit = "Clubs",    value = 10 },
                { rank = "King",  suit = "Clubs",    value = 10 },
                { rank = "Jack",  suit = "Spades",   value = 10 },
                { rank = "Queen", suit = "Spades",   value = 10 },
                { rank = "King",  suit = "Spades",   value = 10 },
            
                -- Aces
                { rank = "Ace",   suit = "Hearts",   value = { 11, 1 } },
                { rank = "Ace",   suit = "Diamonds", value = { 11, 1 } },
                { rank = "Ace",   suit = "Clubs",    value = { 11, 1 } },
                { rank = "Ace",   suit = "Spades",   value = { 11, 1 } }
            },
            logs = {},
            -- internal_logs = {},
            started = false,
            ended = false,
            winner = {},
            created_at = timestamp
        }
        print("User is enter in new blackjack: " .. timestamp)

        Rounds[round_id] = new_round

        for i = #Rounds[round_id].deck, 2, -1 do
            local j = math.random(i)
            Rounds[round_id].deck[i], Rounds[round_id].deck[j] = Rounds[round_id].deck[j], Rounds[round_id].deck[i]
        end

        if #Rounds[round_id].dealer.visibleCard == 0 then
            Rounds[round_id].dealer.hiddenCard = Rounds[round_id].deck[1]
            table.remove(Rounds[round_id].deck, 1)
            table.insert(Rounds[round_id].dealer.visibleCard, Rounds[round_id].deck[1])
            table.remove(Rounds[round_id].deck, 1)
        end
    end
    
    round_id = tostring(ROUND_COUNT)

    -- Player Information
    local player: Player = {
        user_id = user_id,
        nft_address = user_data.nft_address or nil,
        address = user_data.address,
        name = user_data.name,
        betAmount = 0,
        betPlaced = false,
        cards = {},
        hasDoubleDown = false,
        hasBust = false,
        hasStood = false,
        gold_balance = user_data.gold_balance,
        added_at = timestamp
    }

    Rounds[round_id].players[user_id] = player

    -- for _, playerDetails in pairs(Rounds[round_id].players) do
    --     if #playerDetails.cards <= 2 then
            -- table.insert(playerDetails.cards, Rounds[round_id].deck[1])
            -- table.remove(Rounds[round_id].deck, 1)
            -- table.insert(playerDetails.cards, Rounds[round_id].deck[1])
            -- table.remove(Rounds[round_id].deck, 1)
            table.insert(Rounds[round_id].players[user_id].cards, Rounds[round_id].deck[1])
            table.remove(Rounds[round_id].deck, 1)
            table.insert(Rounds[round_id].players[user_id].cards, Rounds[round_id].deck[1])
            table.remove(Rounds[round_id].deck, 1)
    --     end
    -- end

    addLog(tostring(Rounds[round_id].id), timestamp, "newUserJoinBlackjackHandler", "Player " .. user_id .. " added to Blackjack")

    ao.send({
        Target = constants.GAME_PROCESS_ID,
        UserId = tostring(user_id),
        RoundId = tostring(Rounds[round_id].id),
        Gold = tostring(Rounds[round_id].players[user_id].gold_balance),
        Action = "BlackjackMatch.EnteredNewBlackjackMatch",
    })
end


local function getOpenBlackjackRoundsHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local get_open_round = GetOpenBlackjackRoundsOfUser(msg.From, msg.Timestamp)[1]
    local round = createBlackjackRoundCopy(get_open_round, user_id)
    ao.send({ Target = msg.From, Data = json.encode(round) })
end

-- Handler for placing a bet
local function placeBetHandler(msg: Message)

    assert(constants.GAME_PROCESS_ID == msg.From, "You cant call this handler")

    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId
    local user_bet_amount = tonumber(msg.Tags.Bet)

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id))
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended")
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has already placed bet in Blackjack Round id: " .. tostring(round_id))
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has double down in Blackjack Round id: " .. tostring(round_id))
    assert(user_bet_amount >= MIN_BET_PLACE_BY_USER and user_bet_amount <= MAX_BET_PLACE_BY_USER, "Player " .. tostring(user_id) .. " placed an insufficient bet in Blackjack Round id: " .. tostring(round_id))

    local player = Rounds[round_id].players[user_id]

    player.betAmount = user_bet_amount
    player.betPlaced = true
    player.gold_balance = player.gold_balance - player.betAmount

    Rounds[round_id].players[user_id] = player

    -- print("Player " .. tostring(user_id) .. " has placed bet " .. user_bet_amount .. " in Blackjack Round id: " .. tostring(round_id))

    ao.send({ Target = msg.From, Status = "Success" })
end


local function blackjackInfoHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId

    local original_round = Rounds[round_id]
    local round = createBlackjackRoundCopy(original_round, user_id)
    ao.send({ Target = msg.From, Data = json.encode(round) })
    if round.ended then
        Rounds[round_id] = nil
    end
end



-- Handler for player hitting in Blackjack
local function hitHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId

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
    -- print("card added")

    local checkPlayersBurst = isPlayerBust(player)
    if checkPlayersBurst.status == "Burst" then
        player.hasBust = true
        player.hasStood = true
    end
    player.value = checkPlayersBurst.cardsValue

    Rounds[round_id].players[user_id] = player
    Rounds[round_id].deck = Deck

    -- print("checking burst and send message")
    ao.send({ Target = msg.From, Status = "Success" })
end


-- Handler for doubling down on a bet
local function doubleDownHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId

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


-- Main function to determine winners and handle payouts in a blackjack game
-- Processes all active rounds and determines winners based on:
-- 1. If all players have stood (hasStood = true)
-- 2. If round duration has exceeded 60 seconds
-- 3. Various winning conditions (blackjack, bust, highest hand)
local function matchWinner(msg: Message)
    for _, round in pairs(Rounds) do
        -- Count total players and players who have stood (finished their turns)
        local playerCount, stoodCount = 0, 0
        for _, player in pairs(round.players) do
            playerCount = playerCount + 1
            if player.hasStood then 
                stoodCount = stoodCount + 1 
            end
        end

        -- Force all players to stand if round time exceeds 60 seconds
        -- if (round.created_at + 60000 < msg.Timestamp) then
        --     stoodCount = playerCount
        -- end

        -- Process round if all players have stood or time has expired
        if playerCount == stoodCount or (round.started and (round.created_at + 60000 < msg.Timestamp) and not round.ended) then
            local playerAndDealerCardValues: {string: PlayerCardValues} = {}
            round.winner = {}

            -- Process each player's hand and handle blackjacks
            for _, player in pairs(round.players) do
                if player.betPlaced then
                    local playerData = isPlayerBust(player)
                    player.value = playerData.cardsValue
                    playerAndDealerCardValues[playerData.id] = playerData

                    -- Handle immediate blackjack wins (21)
                    if playerData.cardsValue == 21 then
                        player.gold_balance = player.gold_balance + (player.betAmount * 2.5)
                        playerData.status = "Blackjack"
                        round.winner[#round.winner + 1] = tostring(player.name)
                        if playerCount == 1 then
                            player.status = playerData.status
                            sendGoldToPlayerWin(tostring(round.id))
                            print("round ended at: " .. msg.Timestamp)
                            round.ended = true
                            break
                        end
                    end

                    player.status = playerData.status
                end
            end

            -- Process dealer's hand and hit until reaching at least 17
            local dealerCards = { round.dealer.visibleCard[1], round.dealer.hiddenCard }
            local dealerTotal = calculateTotalWithAceAdjustment(dealerCards)

            while dealerTotal <= 16 and #dealerCards <= 3 do
                table.insert(round.dealer.visibleCard, round.deck[1])
                table.remove(round.deck, 1)
                dealerCards = { round.dealer.visibleCard[1], round.dealer.visibleCard[2], round.dealer.hiddenCard }
                dealerTotal = calculateTotalWithAceAdjustment(dealerCards)
            end

            -- Set dealer's final status and record values
            round.dealer.status = (dealerTotal == 21 and "Blackjack") or (dealerTotal > 21 and "Bust") or "Not Bust"
            round.dealer.hasBust = dealerTotal > 21
            playerAndDealerCardValues["Dealer"] = { 
                address = round.dealer.address, 
                cardsValue = dealerTotal, 
                status = round.dealer.status, 
                id = "Dealer",
                name = "Dealer"
            }

            -- Handle dealer blackjack scenario
            if round.dealer.status == "Blackjack" then
                round.dealer.winnigAmount = dealerTotal
                round.winner[#round.winner + 1] = "Dealer" 

                -- Process payouts for dealer blackjack
                for _, player in pairs(round.players) do
                    if player.betPlaced then
                        if player.status == "Blackjack" then
                            -- Push (tie) - return original bet for player blackjack
                            player.gold_balance = player.gold_balance - (player.betAmount * 2.5) + player.betAmount
                        else
                            -- Player loses to dealer blackjack
                            player.gold_balance = player.gold_balance - player.betAmount
                        end
                    end
                end

                sendGoldToPlayerWin(tostring(round.id))
                print("round ended at: " .. msg.Timestamp)
                round.ended = true
                break
            end

            -- Handle dealer bust scenario - all non-bust players win
            if round.dealer.hasBust then
                for _, player in pairs(round.players) do
                    if player.betPlaced then
                        if player.status ~= "Blackjack" then
                            player.gold_balance = player.gold_balance + player.betAmount
                        end
                        round.winner[#round.winner + 1] = tostring(player.name)
                    end    
                end

                sendGoldToPlayerWin(tostring(round.id))
                print("round ended at: " .. msg.Timestamp)
                round.ended = true
                break
            end

            -- Determine winner for normal gameplay (no dealer blackjack/bust)
            local winner: PlayerCardValues
            local highestValue = 0

            -- Check for any player blackjacks first
            local blackjackWinner: PlayerCardValues | nil = nil
            for _, entry in pairs(playerAndDealerCardValues) do
                if entry.cardsValue == 21 then
                    blackjackWinner = entry
                    break
                end
            end

            -- Set winner to blackjack holder or find highest non-bust hand
            if blackjackWinner then
                winner = blackjackWinner
            else
                for _, entry in pairs(playerAndDealerCardValues) do
                    if entry.status == "Not Bust" then
                        if not winner or entry.cardsValue > winner.cardsValue then
                            winner = entry
                            highestValue = entry.cardsValue
                        end
                    end
                end
            end

            -- Process payouts based on winner
            if winner then
                if winner.id == "Dealer" then
                    -- Handle dealer win scenario
                    round.dealer.winnigAmount = winner.cardsValue
                    for _, player in pairs(round.players) do
                        if player.status ~= "Blackjack" and player.betPlaced then
                            if player.value == winner.cardsValue then
                                -- Push (tie) - return original bet
                                player.gold_balance = player.gold_balance + player.betAmount
                                round.winner[#round.winner + 1] = tostring(player.name)
                            else
                                -- Player loses to dealer
                                player.gold_balance = player.gold_balance - player.betAmount
                            end
                        end
                    end
                else
                    -- Handle player win scenario
                    for _, player in pairs(round.players) do
                        if player.betPlaced then
                            if player.address == winner.address and player.user_id == tonumber(winner.id) then
                                -- Winner gets 2:1 payout
                                player.gold_balance = player.gold_balance + (player.betAmount * 2)
                            elseif player.status ~= "Blackjack" then
                                -- Other players lose their bets
                                player.gold_balance = player.gold_balance - player.betAmount
                            end
                        end
                    end
                end
                round.winner[#round.winner + 1] = winner.name
            end
            
            -- Finalize round and process payouts
            sendGoldToPlayerWin(tostring(round.id))
            print("round ended at: " .. msg.Timestamp)
            round.ended = true
        end
    end
end


-- Handler for player standing
local function standHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id) )
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended" )
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id) )
    assert(Rounds[round_id].players[user_id].betPlaced, "Player " .. tostring(user_id) .. " has not placed bet in Blackjack Round id: " .. tostring(round_id) )
    assert(not Rounds[round_id].players[user_id].hasDoubleDown, "Player " .. tostring(user_id) .. " has already doubled down in Blackjack Round id: " .. tostring(round_id) )
    
    Rounds[round_id].players[user_id].hasStood = true

    ao.send({Target= msg.From, Status = "Success" })
end

local function userIsReadyForBlackjackHandler(msg: Message)
    local user_id = msg.Tags.UserId
    local round_id = msg.Tags.RoundId

    assert(Rounds[round_id], "Blackjack Round not found with id: " .. tostring(round_id) )
    assert(not Rounds[round_id].ended, "This blackjack round with id: " .. tostring(round_id) .. " is already ended" )
    assert(Rounds[round_id].players[user_id], "Player " .. tostring(user_id) .. " is not found in Blackjack Round id: " .. tostring(round_id) )

    local round = Rounds[round_id]

    if round.started then
        ao.send({Target=msg.From, Status = "Success" })
        return
    end

    round.started=true
    Rounds[round_id].created_at = msg.Timestamp
    print("User is ready for blackjack: " .. msg.Timestamp)
    ao.send({Target=msg.From, Status = "Success" })

    -- round.created_at = msg.Timestamp
end  

Handlers.add("Blackjack.NewUserJoinBlackjack", Handlers.utils.hasMatchingTag("Action", "Blackjack.NewUserJoinBlackjack"), newUserJoinBlackjackHandler)
Handlers.add("Blackjack.GetOpenBlackjackRounds", Handlers.utils.hasMatchingTag("Action", "Blackjack.GetOpenBlackjackRounds"), getOpenBlackjackRoundsHandler)
Handlers.add("Blackjack.PlaceBet", Handlers.utils.hasMatchingTag("Action", "Blackjack.PlaceBet"), placeBetHandler)
Handlers.add("Blackjack.Info", Handlers.utils.hasMatchingTag("Action", "Blackjack.Info"), blackjackInfoHandler)
Handlers.add("Blackjack.Hit", Handlers.utils.hasMatchingTag("Action", "Blackjack.Hit"), hitHandler)
Handlers.add("Blackjack.DoubleDown", Handlers.utils.hasMatchingTag("Action", "Blackjack.DoubleDown"), doubleDownHandler)
-- Handlers.add("Blackjack.Win", Handlers.utils.hasMatchingTag("Action", "Blackjack.Win"), matchWinner)
Handlers.add("Blackjack.Stand", Handlers.utils.hasMatchingTag("Action", "Blackjack.Stand"), standHandler)
Handlers.add("Blackjack.UserIsReadyForBlackjack", Handlers.utils.hasMatchingTag("Action", "Blackjack.UserIsReadyForBlackjack"), userIsReadyForBlackjackHandler)


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