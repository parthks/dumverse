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

Handlers.add("BlackjackMatch.EnterNewBlackjackMatch", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.EnterNewBlackjackMatch'), enterNewBlackjackMatchHandler)
Handlers.add("BlackjackMatch.EnteredNewBlackjackMatch", Handlers.utils.hasMatchingTag('Action', 'BlackjackMatch.EnteredNewBlackjackMatch'), enteredNewBlackjackMatchHandler)

return {}
