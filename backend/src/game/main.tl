-- OLD PROCESSES (for aogamejam)
-- testSQL process - cNxJjUzpB8_5iUCbeO-xsCIDxbdIQF85pMorHeYW_bE
-- main - testSQL2.1 process - EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc
-- cron10sec - tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE


-- Island movement happens on the frontend. Users can move to any area and that screen gets rendered. No blockchain interaction needed. Except for combat, that triggers a combat start.


-- local json = require("json")
-- require("utils.utils.dbAdmin")
-- require("game.helpers")
-- require("utils.constants")
require("utils.globals")
require("game.db")
local sqlite3 = require('lsqlite3')
local dbAdminnn = require("utils.utils.dbAdmin")

DB = DB or sqlite3.open_memory()
if not DB then
  print("Failed to open database")
  return
end
dbAdmin = dbAdminnn.new(DB)

-- Load all handlers
require("game.handlers.admin")
require("game.handlers.combat")
require("game.handlers.user")
require("game.handlers.inventory")
require("game.handlers.shop")
require("game.handlers.bank")
