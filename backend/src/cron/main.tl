
local function sendCronCombat()

    ao.send({
            Target = "6jy_Ai9mInmMg1t6HPlSWKLcxYBFUe81DEpeuq5fP9k",
            Action = "Battle.CronTick",
            npcTimer="30"
     })

end    

Handlers.add("ForwardCron", Handlers.utils.hasMatchingTag("Action", "Cron"), sendCronCombat);
