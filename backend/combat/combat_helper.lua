-- create a helper simulates combat that is based on dice rolls (1-4 is a successful hit, 5-6 is a miss).
local function _verifyAttackSuccessful()
    local attacker_roll = math.random(1, 6)
    local success = attacker_roll <= 4
    return success, attacker_roll
end


-- Helper function to get entity stats
local function _getEntityStats(entity, entityType)
    -- in case players have need to be special logic for stats, add it here.

    if entityType == "player" then
        return {
            health = entity.health,
            damage = entity.damage,
            defense = entity.defense,
            name = entity.name,
            id = entity.id
        }
    elseif entityType == "npc" then
        return {
            health = entity.health,
            damage = entity.damage,
            defense = entity.defense or 0,
            name = entity.name,
            id = entity.id
        }
    end
end



-- attackingEntityType = "player" or "npc"
-- defendingEntityType = "player" or "npc"
function SimulateCombat(attackingEntity, attackingEntityType, defendingEntity, defendingEntityType, timestamp,
                        critical_hit)
    print("attackingEntity " .. attackingEntity.name .. " defendingEntity " .. defendingEntity.name)

    local attacker = _getEntityStats(attackingEntity, attackingEntityType)
    local defender = _getEntityStats(defendingEntity, defendingEntityType)
    local log = {}

    print("SimulateCombat - attacker " .. attacker.name .. " defender " .. defender.name)

    local success, attacker_roll = _verifyAttackSuccessful()

    -- table.insert(log, {
    --     message = string.format("%s attacks %s with a roll of %d", attacker.name, defender.name, attacker_roll),
    --     timestamp = timestamp
    -- })


    if success or critical_hit then
        local damage = attacker.damage
        if critical_hit then
            damage = damage * 2
            table.insert(log,
                {
                    from = defender.id,
                    message = string.format("Run away failed. %s hits you for a critical hit of %d", attacker.name,
                        damage),
                    timestamp = timestamp
                })
        else
            table.insert(log,
                {
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
            table.insert(log,
                {
                    from = attacker.id,
                    message = string.format("deals %d damage to %s's defense", defense_damage,
                        defender.name),
                    timestamp = timestamp
                })
        end

        -- If there's remaining damage, it depletes health
        if damage > 0 then
            health_damage = damage
            defender.health = math.max(defender.health - health_damage, 0)
            table.insert(log,
                {
                    from = attacker.id,
                    message = string.format("deals %d damage to %s's health", health_damage,
                        defender.name),
                    timestamp = timestamp
                })
        end

        -- Update entity stats
        defendingEntity.defense = remaining_defense
        defendingEntity.health = defender.health
    else
        table.insert(log,
            {
                from = attacker.id,
                message = string.format("attack misses"),
                timestamp = timestamp
            })
    end

    return log, defender.health
end

return {
    SimulateCombat = SimulateCombat,
}
