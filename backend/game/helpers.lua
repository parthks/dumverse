-- send errors



-- check if user exists
function CheckUserExists(userId, address)
  assert(userId, "UserId is required")
  local user = dbAdmin:exec(string.format([[
    SELECT * FROM Users WHERE ID = %f;
]], userId))
  assert(#user > 0, "User does not exist")
  local userData = user[1]
  assert(userData.address == address, "User Address does not match")
  return userData
end

function CalculateUserBaseStats(userData)
  local baseStats = {
    damage = 1,
    defense = 0,
    health = 1,
    total_health = 1,
    stamina = 4,
    total_stamina = 4,
  }
  if userData["nft_address"] then
    baseStats.damage = 2
    baseStats.defense = 0
    baseStats.health = 2
    baseStats.total_health = 2
    baseStats.stamina = 6
    baseStats.total_stamina = 6
  end

  return baseStats
end

--[[
     calcuate dumz reward for killing enemy
     randomize based on difficulty
   ]]
--

return {
  CheckUserExists = CheckUserExists,
  CalculateUserBaseStats = CalculateUserBaseStats
}
