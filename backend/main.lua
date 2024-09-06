-- testSQL process - cNxJjUzpB8_5iUCbeO-xsCIDxbdIQF85pMorHeYW_bE
-- testSQL2.1 process - EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc
-- cron10sec - tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE


-- Island movement happens on the frontend. Users can move to any area and that screen gets rendered. No blockchain interaction needed. Except for combat, that triggers a combat start.


local json = require("json")
dbAdmin = require("data.db")
local helpers = require("helpers")
require("data.constants")


ISLAND_TRANSFER_FEE = 0.01 -- wAR


-- Load all handlers
require("handlers.combat")
require("handlers.user")
require("handlers.inventory")
require("handlers.shop")
require("handlers.bank")
