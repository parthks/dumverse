require('utils.globals')
local constants = require("utils.constants")

local type BaseStats = record
  damage: number
  defense: number
  health: number
  total_health: number
  stamina: number
  total_stamina: number
end

local function GetItemDetails(itemId: string): BaseItem

  local itemDetails = constants.WEAPONS[itemId as WeaponIds] or
                      constants.ARMORS[itemId as ArmorIds] or
                      constants.POTIONS[itemId as PotionIds] or
                      constants.ENERGY[itemId as EnergyIds] or
                      constants.FOOD[itemId as FoodIds]
  assert(itemDetails, "Item details not found")
  return itemDetails
end

-- check if user exists
local function CheckUserExists(userId: number, address: string): UserData
  assert(userId, "UserId is required")
  local user = dbAdmin:exec(string.format([[
    SELECT * FROM Users WHERE ID = %d;
]], tonumber(userId)))
  assert(#user > 0, "User does not exist")
  local userData = user[1] as UserData
  assert(userData.address == address, "User Address does not match")
  return userData
end

local function CalculateUserBaseStats(userData: UserData): BaseStats
  local baseStats: BaseStats = {
    damage = 1,
    defense = 0,
    health = 2,
    total_health = 2,
    stamina = 8,
    total_stamina = 8,
  }
  if userData.nft_address then
    baseStats.damage = 2
    baseStats.defense = 0
    baseStats.health = 2
    baseStats.total_health = 2
    baseStats.stamina = 8
    baseStats.total_stamina = 8
  end

  return baseStats
end

--[[
     calculate dumz reward for killing enemy
     randomize based on difficulty
   ]]
-- TODO: Implement this function

return {
  CheckUserExists = CheckUserExists,
  CalculateUserBaseStats = CalculateUserBaseStats,
  GetItemDetails = GetItemDetails
}
