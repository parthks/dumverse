-- require('utils.globals')
-- local constants = require("utils.constants")

local function sendCronCombat()
    ao.send({ Target = "Byl2hF1lJSNHvGM5--Cd8kl_xbTJmupvk8IHgE20v_0", Action = "Cron"})
end    

Handlers.add("ForwardCron", Handlers.utils.hasMatchingTag("Action", "Cron"), sendCronCombat);

return {}
