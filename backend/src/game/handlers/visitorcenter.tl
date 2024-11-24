local helpers = require("game.helpers")
local json = require("json")
require('utils.globals')


local function getTotalUserCountHandler(msg: Message)
    local user_id = tonumber(msg.Tags.UserId)
    helpers.CheckUserExists(user_id, msg.From)

    local total_users = {TotalUsers = dbAdmin:count("Users") }

    ao.send({
        Target = msg.From,
        Status = "Success",
        Data = json.encode(total_users)
    })
end


Handlers.add("VisitorCenter.TotalUsers", Handlers.utils.hasMatchingTag('Action', 'VisitorCenter.TotalUsers'), getTotalUserCountHandler)

return {}