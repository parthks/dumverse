#!/bin/bash

if [[ "$(uname)" == "Linux" ]]; then
    BIN_PATH="$HOME/.luarocks/bin"
else
    BIN_PATH="/opt/homebrew/bin"
fi
# Recreate build directories
rm -rf ./build
rm -rf ./build-lua

# GENERATE LUA in /build-lua
mkdir -p ./build
mkdir -p ./build-lua

# build teal
cyan build -u

cd build-lua

amalg.lua -s game/main.lua -o ../build/game.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.globals utils.combat \
    dummy.dummy \
    utils.constants \
    game.helpers \
    game.db \
    game.handlers.admin \
    game.handlers.combat \
    game.handlers.user \
    game.handlers.inventory \
    game.handlers.shop \
    game.handlers.bank \
    game.handlers.quest \
    game.handlers.visitorcenter \
    game.handlers.leaderboard

amalg.lua -s tokens/dumz.lua -o ../build/dumz.lua \
    utils.utils.bint utils.utils.tl-utils \
    tokens.dumz
    
amalg.lua -s combat/main.lua -o ../build/combat.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.combat \
    combat.battle_helpers combat.combat_helper combat.globals combat.types \
     

amalg.lua -s combat/main.lua -o ../build/combat2.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.combat \
    combat.battle_helpers combat.combat_helper combat.globals combat.types \
     

 amalg.lua -s combat/main.lua -o ../build/combat3.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.combat \
    combat.battle_helpers combat.combat_helper combat.globals combat.types \
     

amalg.lua -s combat/main.lua -o ../build/combat4.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.combat \
    combat.battle_helpers combat.combat_helper combat.globals combat.types \
     

amalg.lua -s combat/main.lua -o ../build/combat5.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils utils.combat \
    combat.battle_helpers combat.combat_helper combat.globals combat.types \
                

amalg.lua -s cron/main.lua -o ../build/cron.lua

amalg.lua -s record/main.lua -o ../build/record.lua \
    utils.combat utils.globals utils.constants utils.utils.dbAdmin

amalg.lua -s chat/main.lua -o ../build/chat.lua \
    utils.utils.tl-utils utils.utils.dbAdmin utils.utils.db-utils \

amalg.lua -s backup/main.lua -o ../build/backup.lua \
    utils.combat utils.globals utils.constants utils.utils.dbAdmin    

amalg.lua -s bank/main.lua -o ../build/bank.lua \
    utils.combat utils.globals utils.constants utils.utils.dbAdmin  

# FINAL RESULT is build/main.lua