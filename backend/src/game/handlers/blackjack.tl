require('utils.globals')
local helpers = require("game.helpers")
local json = require("json")
local constants = require("utils.constants")

local function enterNewBlackjackMatchHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local userData: UserData = helpers.CheckUserExists(user_id, msg.From)
    
    assert(userData.gold_balance > 0, "You dont have enough gold to enter into the blackjack")
    
    ao.send({
        Target = constants.BLACKJACK_PROCESS_ID,
        Action = "Blackjack.NewUserJoinBlackjack",
        UserId = tostring(user_id),
        Status = "Success",
        Data = json.encode(userData),
    })
    ao.send({Target= msg.From, Status = "Success" })
end

local function enteredNewBlackjackMatchHandler(msg: Message)
    assert(constants.BLACKJACK_PROCESS_ID == msg.From, "You cant call this handler")
    local user_id = tonumber(msg.Tags.UserId)
    local round_id = tonumber(msg.Tags.RoundId)
    local user_updated_gold = tonumber(msg.Tags.Gold)
    
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_blackjack_id = %d, gold_balance = %f WHERE id = %f;
    ]], round_id, user_updated_gold, user_id))
    
end

local function blackjackPlacedBetHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    local round_id = tonumber(msg.Tags.RoundId)
    local user_bet_amount = tonumber(msg.Tags.Bet)
    local userData = helpers.CheckUserExists(user_id, msg.From)
    assert(userData.current_blackjack_id == round_id, "You are not in this blackjack round")
    assert(userData.gold_balance - user_bet_amount >= 0, "You dont have enough gold to place a bet")
    assert(user_bet_amount >= 5 and user_bet_amount <= 20, "Player " .. tostring(user_id) .. " placed an insufficient bet in Blackjack Round id: " .. tostring(round_id))

    dbAdmin:exec(string.format([[
        UPDATE Users SET gold_balance = %f WHERE id = %f;
    ]], userData.gold_balance - user_bet_amount, user_id))  

    ao.send({
        Target = constants.BLACKJACK_PROCESS_ID,
        Action = "Blackjack.PlaceBet",
        UserId = tostring(user_id),
        RoundId = tostring(round_id),
        Bet = tostring(user_bet_amount),
    })
    
    ao.send({Target= msg.From, Status = "Success" })
end


local function blackjackWonHandler(msg: Message)
    assert(constants.BLACKJACK_PROCESS_ID == msg.From, "You cant call this handler")
    local user_id = tonumber(msg.Tags.UserId)
    -- local round_id = tonumber(msg.Tags.RoundId)
    local user_updated_gold = tonumber(msg.Tags.Gold)
    
    dbAdmin:exec(string.format([[
        UPDATE Users SET current_blackjack_id = NULL, gold_balance = %f WHERE id = %f;
    ]], user_updated_gold, user_id))    
end


Handlers.add("BlackjackMatch.EnterNewBlackjackMatch", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.EnterNewBlackjackMatch'), enterNewBlackjackMatchHandler)
Handlers.add("BlackjackMatch.EnteredNewBlackjackMatch", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.EnteredNewBlackjackMatch'), enteredNewBlackjackMatchHandler)
Handlers.add("BlackjackMatch.PlaceBet", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.PlaceBet'), blackjackPlacedBetHandler)
Handlers.add("BlackjackMatch.BlackjackWon", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.BlackjackWon'), blackjackWonHandler)

return {}
