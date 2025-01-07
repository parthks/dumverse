require('lsqlite3')

global record dbAdminType
  db: db
  new: function(db: db): dbAdminType
  tables: function(self: dbAdminType): {string}
  count: function(self: dbAdminType, tableName: string): number
  exec: function(self: dbAdminType, sql: string): {table}
  apply: function(self: dbAdminType, sql: string, values: {any})
  select: function(self: dbAdminType, sql: string, values: {any}): {table}
  nrows: function(self: dbAdminType, sql: string): function(): table
end

function dbAdminType.new(newdb: db): dbAdminType
  local self = setmetatable({} as dbAdminType, {__index = dbAdminType})
  self.db = newdb
  return self
end

function dbAdminType:tables(): {string}
  local tables: {string} = {}
  for row in self.db:prepare("SELECT name FROM sqlite_master WHERE type='table';"):nrows() do
    table.insert(tables, row.name as string)
  end
  return tables
end

function dbAdminType:count(tableName: string): number
  local count_query = string.format("SELECT COUNT(*) AS count FROM %s;", tableName)
  for row in self.db:prepare(count_query):nrows() do
    return row.count as number
  end
  return 0
end

function dbAdminType:exec(sql: string): {table}
  local results: {table} = {}
  for row in self.db:prepare(sql):nrows() do
    table.insert(results, row)
  end
  return results
end

function dbAdminType:apply(sql: string, values: {any})
  assert(type(sql) == 'string', 'SQL MUST be a String')
  assert(type(values) == 'table', 'values MUST be an array of values')
  
  local stmt = self.db:prepare(sql)
  stmt:bind_names(values)
  
  local success, err = stmt:step()
  if not success then
    error(sql .. ' statement failed because ' .. err)
  end
  
  stmt:finalize()
end

function dbAdminType:select(sql: string, values: {any}): {table}
  assert(type(sql) == 'string', 'SQL MUST be a String')
  assert(type(values) == 'table', 'values MUST be an array of values')

  local stmt = self.db:prepare(sql)
  stmt:bind_names(values)

  local results: {table} = {}
  while true do
    local success, row = stmt:step()
    if success then
      table.insert(results, row as table)
    else
      break
    end
  end

  stmt:finalize()
  return results
end

function dbAdminType:nrows(sql: string): function(): table
  local stmt = self.db:prepare(sql)
  local function iterator(): table
    local success, row = stmt:step()
    if success then
      return row as table
    else
      stmt:finalize()
      return {} as table
    end
  end
  return iterator
end

return dbAdminType