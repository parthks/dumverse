
require("combat.types")
require("utils.combat")


local record CombatEntityStats
    health: number
    damage: number
    defense: number
    name: string
    id: string
end



-- create a helper simulates combat that is based on dice rolls (1-4 is a successful hit, 5-6 is a miss).
local function _verifyPlayerAttackAttackSuccessful(): (boolean, number)
    local attacker_roll = math.random(1, 6)
    local success = attacker_roll <= 5
    return success
end
local function _verifyNPCAttackAttackSuccessful(): (boolean, number)
    local attacker_roll = math.random(1, 6)
    local success = attacker_roll <= 4
    return success
end

-- Helper function to get entity stats
-- local function _getEntityStats(entity: any, entityType: string): CombatEntityStats
--     if entityType == "player" then
--         return {
--             health = entity.health,
--             damage = entity.damage,
--             defense = entity.defense,
--             name = entity.name,
--             id = entity.id
--         }
--     elseif entityType == "npc" then
--         return {
--             health = entity.health,
--             damage = entity.damage,
--             defense = entity.defense or 0,
--             name = entity.name,
--             id = entity.id
--         }
--     end
--     error("Invalid entity type")
-- end

local function _getEntityStatsForPlayer(entity: CombatUserData): CombatEntityStats
    return {
        health = entity.health,
        damage = entity.damage,
        defense = entity.defense,
        name = entity.name,
        id = tostring(entity.id)
    }
end

local function _getEntityStatsForNPC(entity: CombatEnemyData): CombatEntityStats
    return {
        health = entity.health,
        damage = entity.damage,
        defense = 0,
        name = entity.name,
        id = entity.id
    }
end

-- attackingEntityType = "player" or "npc"
-- defendingEntityType = "player" or "npc"
local function SimulateCombat(attacker: CombatEntityStats, defender: CombatEntityStats, timestamp: integer, critical_hit: boolean, attacker_type: string): ({BattleLogEntry}, number, number)

    local log: {BattleLogEntry} = {}

    print("SimulateCombat - attacker " .. attacker.name .. " defender " .. defender.name)

    local success = false
    if attacker_type == "player" then
        success = _verifyPlayerAttackAttackSuccessful()
    else
        success = _verifyNPCAttackAttackSuccessful()
    end

    if success or critical_hit then
        local damage = attacker.damage
        if critical_hit then
            damage = damage * 2
            table.insert(log, {
                from = defender.id,
                message = string.format("Run away failed. %s hits you for a critical hit of %d", attacker.name, damage),
                timestamp = timestamp
            })
        else
            table.insert(log, {
                from = attacker.id,
                message = string.format("hits %s for %d", defender.name, damage),
                timestamp = timestamp
            })
        end

        local remaining_defense = defender.defense
        local health_damage = 0

        -- First, damage targets the defense
        if remaining_defense > 0 then
            local defense_damage = math.min(damage, remaining_defense)
            remaining_defense = remaining_defense - defense_damage
            damage = damage - defense_damage
            print("defense reduced from " .. defender.defense .. " to " .. remaining_defense)
            table.insert(log, {
                from = attacker.id,
                message = string.format("deals %d damage to %s's defense", defense_damage, defender.name),
                timestamp = timestamp
            })
        end

        -- If there's remaining damage, it depletes health
        if damage > 0 then
            health_damage = math.floor(damage)
            defender.health = math.max(defender.health - health_damage, 0)
            table.insert(log, {
                from = attacker.id,
                message = string.format("deals %d damage to %s's health", health_damage, defender.name),
                timestamp = timestamp
            })
        end

        -- Update entity stats
        defender.defense = remaining_defense
        defender.health = defender.health
    else
        table.insert(log, {
            from = attacker.id,
            message = "attack misses",
            timestamp = timestamp
        })
    end

    return log, defender.health, defender.defense
end

local function PlayerAttacksNPC(attackingEntity: CombatUserData, defendingEntity: CombatEnemyData, timestamp: integer): ({BattleLogEntry}, number, number)
    local attacker = _getEntityStatsForPlayer(attackingEntity)
    local defender = _getEntityStatsForNPC(defendingEntity)
    return SimulateCombat(attacker, defender, timestamp, false, "player")
end

local function NPCAttacksPlayer(attackingEntity: CombatEnemyData, defendingEntity: CombatUserData, timestamp: integer, critical_hit: boolean): ({BattleLogEntry}, number, number)
    local attacker = _getEntityStatsForNPC(attackingEntity)
    local defender = _getEntityStatsForPlayer(defendingEntity)
    return SimulateCombat(attacker, defender, timestamp, critical_hit, "npc")
end

local function NPCAttacksNPC(attackingEntity: CombatEnemyData, defendingEntity: CombatEnemyData, timestamp: integer): ({BattleLogEntry}, number, number)
    local attacker = _getEntityStatsForNPC(attackingEntity)
    local defender = _getEntityStatsForNPC(defendingEntity)
    return SimulateCombat(attacker, defender, timestamp, false, "npc")
end

local function PlayerAttacksPlayer(attackingEntity: CombatUserData, defendingEntity: CombatUserData, timestamp: integer): ({BattleLogEntry}, number, number)
    local attacker = _getEntityStatsForPlayer(attackingEntity)
    local defender = _getEntityStatsForPlayer(defendingEntity)
    return SimulateCombat(attacker, defender, timestamp, false, "player")
end


return {
    PlayerAttacksNPC = PlayerAttacksNPC,
    NPCAttacksPlayer = NPCAttacksPlayer,
    PlayerAttacksPlayer = PlayerAttacksPlayer,
    NPCAttacksNPC = NPCAttacksNPC,
}