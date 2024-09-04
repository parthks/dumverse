-- send errors



-- check if user exists
function CheckUserExists(userId, address)
  local user = dbAdmin:exec(string.format([[
    SELECT * FROM Users WHERE ID = %f;
]], userId))
  assert(#user > 0, "User does not exist")
  local userData = user[1]
  assert(userData.ADDRESS == address, "User Address does not match")
  return userData
end

--[[
     calcuate dumz reward for killing enemy
     randomize based on difficulty
   ]]
--
