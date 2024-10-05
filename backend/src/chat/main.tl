local json = require("json")

-- local DB = DB or sqlite3.open_memory()
-- local DBAdmin = DBAdmin or require('DbAdmin').new(DB)

local sqlite3 = require('lsqlite3')
local dbAdminnn = require("utils.utils.dbAdmin")

global DB: db 
global dbAdmin: dbAdminType

DB = DB or sqlite3.open_memory()
if not DB then
  print("Failed to open database")
  return
end
dbAdmin = dbAdminnn.new(DB)

--#region Initialization

local SQLITE_TABLE_CHAT_MESSAGES = [[
DROP TABLE IF EXISTS Messages;
CREATE TABLE IF NOT EXISTS Messages (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    MessageId TEXT UNIQUE NOT NULL,
    Timestamp INTEGER NOT NULL,
    AuthorId TEXT NOT NULL,
    AuthorName TEXT NOT NULL,
    AuthorNFT TEXT DEFAULT NULL,
    ChatRoom TEXT DEFAULT "Town",
    Content TEXT
  );
]]

local function DBInit()
--   DB:exec(SQLITE_TABLE_CHAT_MESSAGES)
  dbAdmin.db:exec(SQLITE_TABLE_CHAT_MESSAGES)
end

global CHAT_INITIALIZED: boolean
CHAT_INITIALIZED = CHAT_INITIALIZED or false
if (not CHAT_INITIALIZED) then
  DBInit()
  CHAT_INITIALIZED = true
end

--#endregion


local function ValidateAuthorName(authorName: string): boolean
    if (authorName == nil) then
      return false
    end
    if (#authorName < 1) then
      return false
    end
    if (#authorName > 100) then
      return false
    end
  
    return true
  end
  
  local function ValidateContent(content: string): boolean
    if (content == nil) then
      return false
    end
    if (#content < 1) then
      return false
    end
    if (#content > 1000) then
      return false
    end
    -- Note: Input sanitization is not performed here, but by the bind function
  
    return true
  end


  Handlers.add(
  "TestChatMessage",
  Handlers.utils.hasMatchingTag("Action", "TestChatMessage"),
  function(msg: Message)
    print("TestChatMessage")
    local messageId = msg.Id
    local timestamp = msg.Timestamp
    local authorId = msg.From
    local authorName = msg.Tags['AuthorName']
    local authorNFT = msg.Tags['AuthorNFT'] or nil
    local content = msg.Data

    print("Received message id" .. messageId .. " by " .. authorName ..  " at " .. timestamp .. " and content " .. content)
    local authorNFTValue = authorNFT ~= nil and string.format("'%s'", authorNFT) or "NULL"

    dbAdmin:exec(string.format([[
        INSERT INTO Messages (MessageId, Timestamp, AuthorId, AuthorName, Content, AuthorNFT)
        VALUES ("%s", %f, "%s", "%s", "%s", %s)
      ]], messageId, timestamp, authorId, authorName, content, authorNFTValue))
  
    ao.send({ Target = msg.From, Status = "Success" })
  end
)

Handlers.add(
  "ChatMessage",
  Handlers.utils.hasMatchingTag("Action", "ChatMessage"),
  function(msg: Message)
    print("ChatMessage")
    local messageId = msg.Id
    local timestamp = msg.Timestamp
    local authorId = msg.From
    local authorName = msg.Tags['AuthorName']
    local authorNFT = msg.Tags['AuthorNFT'] or nil
    local content = msg.Data
    local chatRoom = msg.Tags['ChatRoom'] or "Town"
    assert(chatRoom == "Town" or chatRoom == "RestArea", "Invalid chat room")

    print("Received message id" .. messageId .. " by " .. authorName ..  " at " .. timestamp .. " and content " .. content)


    -- Validate AuthorName
    assert(ValidateAuthorName(authorName), "Invalid Author Name")
    -- Validate Content
    assert(ValidateContent(content), "Invalid Content")

    print("Saving message")
    -- Save message
    local authorNFTValue = authorNFT ~= nil and string.format("'%s'", authorNFT) or "NULL"

    dbAdmin:exec(string.format([[
        INSERT INTO Messages (MessageId, Timestamp, AuthorId, AuthorName, Content, AuthorNFT, ChatRoom)
        VALUES ("%s", %f, "%s", "%s", "%s", %s, "%s")
      ]], messageId, timestamp, authorId, authorName, content, authorNFTValue, chatRoom))
  
    print("Message saved")
    ao.send({ Target = msg.From, Status = "Success" })
  end
)


local function ValidateId(testId: integer): boolean
    if (testId == nil) then
      -- Allow nil ids
      return true
    end
    if (type(testId) ~= "number") then
      return false
    end
    if (testId < 0) then
      return false
    end
  
    return true
  end
  
  local function ValidateTimestamp(testTimestamp: integer): boolean
    if (testTimestamp == nil) then
      -- Allow nil timestamps
      return true
    end
    if (testTimestamp < 0) then
      return false
    end
  
    return true
  end
  
--   local function ValidateLimit(testLimit: integer): boolean
--     if (testLimit == nil) then
--       -- Allow nil limits
--       return true
--     end
--     if (testLimit < 1) then
--       return false
--     end
--     if (testLimit > 100) then
--       return false
--     end
  
--     return true
--   end

Handlers.add(
  'ChatCount',
  Handlers.utils.hasMatchingTag('Action', 'ChatCount'),
  function(msg: Message)
    -- print("ChatCount")
    local chatRoom = msg.Tags['ChatRoom'] or "Town"
    assert(chatRoom == "Town" or chatRoom == "RestArea", "Invalid chat room")
    local count = dbAdmin:exec(string.format([[
        SELECT COUNT(*) FROM Messages WHERE ChatRoom = "%s"
    ]], chatRoom))

    print('count', count)
    

    -- local stmt = DB:prepare("SELECT COUNT(*) FROM Messages")
    -- stmt:step()
    -- local count = stmt:get_value(0)
    -- stmt:finalize()

    ao.send({
      Target = msg.From,
      Action = 'ChatCountResponse',
      Data = tostring(count[1])
    })
  end
)

Handlers.add(
  "ChatHistory",
  Handlers.utils.hasMatchingTag("Action", "ChatHistory"),
  function(msg: Message)
    -- print("ChatHistory")
    local idAfter = tonumber(msg.Tags['Id-After']) as integer
    local idBefore = tonumber(msg.Tags['Id-Before']) as integer
    -- local timestampStart = tonumber(msg.Tags['Timestamp-Start']) as integer
    -- local timestampEnd = tonumber(msg.Tags['Timestamp-End']) as integer
    local limit = tonumber(msg.Tags['Limit']) as integer
    local chatRoom = msg.Tags['ChatRoom'] or "Town"
    assert(chatRoom == "Town" or chatRoom == "RestArea", "Invalid chat room")

    -- Validate individual Ids
    if (not ValidateId(idAfter)) then
       print("Invalid Id Start")
       return
    end
    if (not ValidateId(idBefore)) then
       print("Invalid Id End")
       return
    end
    -- Validate Ids range
    if (idAfter ~= nil
          and idBefore ~= nil
          and idAfter > idBefore) then
       print("Invalid Id Range")
       return
    end

    -- Validate Individual Timestamps
    -- if (not ValidateTimestamp(timestampStart)) then
    --    print("Invalid Timestamp Start")
    --    return
    -- end
    -- if (not ValidateTimestamp(timestampEnd)) then
    --    print("Invalid Timestamp End")
    --    return
    -- end
    -- Validate timestamp range
    -- if (timestampStart ~= nil
    --       and timestampEnd ~= nil
    --       and timestampStart > timestampEnd) then
    --    print("Invalid Timestamp Range")
    --    return
    -- end

    -- Query messages
    -- Any variable maybe be nil
    -- Ids are EXclusive
    -- Timestamps are INclusive
    -- Most recent first
    -- Default limit is 100
    
    -- build query, based on the variables that are not nil
    local query = [[
        SELECT * FROM Messages
    ]]

    local whereClauses = {}
    table.insert(whereClauses, string.format("ChatRoom = '%s'", chatRoom))

    if idAfter ~= nil then
        table.insert(whereClauses, string.format("Id > %f", idAfter))
    end
    if idBefore ~= nil then
        table.insert(whereClauses, string.format("Id < %f", idBefore))
    end
    -- Add WHERE clause if there are any conditions
    if #whereClauses > 0 then
        query = query .. " WHERE " .. table.concat(whereClauses, " AND ") 
    end

    -- Add ORDER BY and LIMIT clauses
    query = query .. " ORDER BY Timestamp DESC LIMIT " .. (limit or 100)


    local messages = dbAdmin:exec(query)
   

    -- local messages = dbAdmin:exec(string.format([[
    --   SELECT * FROM Messages
    --   WHERE (Id > %f OR %f IS NULL)
    --   AND (Id < %f OR %f IS NULL)
    --   AND (Timestamp >= %f OR %f IS NULL)
    --   AND (Timestamp <= %f OR %f IS NULL)
    --   ORDER BY Timestamp DESC
    --   LIMIT %f
    -- ]], idAfter, idAfter, idBefore, idBefore, timestampStart, timestampStart, timestampEnd, timestampEnd, limit or 100))


    -- local stmt = DB:prepare([[
    --   SELECT * FROM Messages
    --   WHERE (Id > ? OR ? IS NULL)
    --   AND (Id < ? OR ? IS NULL)
    --   AND (Timestamp >= ? OR ? IS NULL)
    --   AND (Timestamp <= ? OR ? IS NULL)
    --   ORDER BY Timestamp DESC
    --   LIMIT ?
    -- ]])
    -- stmt:bind_values(
    --   idAfter, idAfter,
    --   idBefore, idBefore,
    --   timestampStart, timestampStart,
    --   timestampEnd, timestampEnd,
    --   limit or 100
    -- )

    -- local messages = {}
    -- for row in stmt:nrows() do
    --   table.insert(messages, {
    --     Id = row.Id,
    --     MessageId = row.MessageId,
    --     Timestamp = row.Timestamp,
    --     AuthorId = row.AuthorId,
    --     AuthorName = row.AuthorName,
    --     Recipient = row.Recipient,
    --     Content = row.Content
    --   })
    -- end

    -- stmt:finalize()

    -- Reply with messages
    ao.send({
      Target = msg.From,
      Action = "ChatHistoryResponse",
      Data = json.encode(messages)
    })
  end
)

print("Loaded Chat Protocol")
