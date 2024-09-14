local bint = require('.bint')(256)
local ao = require('ao')

local json = require('json')




local utils = {
    add = function(a, b)
        return tostring(bint(a) + bint(b))
    end,
    subtract = function(a, b)
        return tostring(bint(a) - bint(b))
    end,
    toBalanceValue = function(a)
        return tostring(bint(a))
    end,
    toNumber = function(a)
        return tonumber(a)
    end
}


--[[
     Initialize State

     ao.id is equal to the Process.Id
   ]]
--
Variant = "0.0.3"

-- token should be idempotent and not change previous state updates
Denomination = Denomination or 12
Balances = Balances or { [ao.id] = utils.toBalanceValue(10000 * 10 ^ Denomination) }
TotalSupply = TotalSupply or utils.toBalanceValue(10000 * 10 ^ Denomination)
Name = Name or 'Dumz Test'
Ticker = Ticker or 'DUMZTEST'
Logo = Logo or 'SBCCXwwecBlDqRLUjb8dYABExTJXLieawf7m2aBJ-KY'


-- reward player for killing enemy
Handlers.add('Game.RewardPlayer', Handlers.utils.hasMatchingTag('Action', 'Game.RewardPlayer'), function(msg)
    -- check message has come from game ID
    assert(msg.From == "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc", 'Message must come from game ID')

    -- call transfer function.
    msg.Recipient = msg.From
    msg.From = ao.id

    TransferFunction(msg)
end)

--[[
     Add handlers for each incoming Action defined by the ao Standard Token Specification
   ]]
--

--[[
     Info
   ]]
--
Handlers.add('info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
    ao.send({
        Target = msg.From,
        Name = Name,
        Ticker = Ticker,
        Logo = Logo,
        Denomination = tostring(Denomination)
    })
end)

--[[
     Balance
   ]]
--
Handlers.add('balance', Handlers.utils.hasMatchingTag('Action', 'Balance'), function(msg)
    local bal = '0'

    -- If not Recipient is provided, then return the Senders balance
    if (msg.Tags.Recipient) then
        if (Balances[msg.Tags.Recipient]) then
            bal = Balances[msg.Tags.Recipient]
        end
    elseif msg.Tags.Target and Balances[msg.Tags.Target] then
        bal = Balances[msg.Tags.Target]
    elseif Balances[msg.From] then
        bal = Balances[msg.From]
    end

    ao.send({
        Target = msg.From,
        Balance = bal,
        Ticker = Ticker,
        Account = msg.Tags.Recipient or msg.From,
        Data = bal
    })
end)

--[[
     Balances
   ]]
--
Handlers.add('balances', Handlers.utils.hasMatchingTag('Action', 'Balances'),
    function(msg) ao.send({ Target = msg.From, Data = json.encode(Balances) }) end)

--[[
     Transfer
   ]]
--
function TransferFunction(msg)
    assert(type(msg.Recipient) == 'string', 'Recipient is required!')
    assert(type(msg.Quantity) == 'string', 'Quantity is required!')
    assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')

    print("Transfering" .. msg.Quantity .. "tokens to" .. msg.Recipient)
    if not Balances[msg.From] then Balances[msg.From] = "0" end
    if not Balances[msg.Recipient] then Balances[msg.Recipient] = "0" end

    if bint(msg.Quantity) <= bint(Balances[msg.From]) then
        Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
        Balances[msg.Recipient] = utils.add(Balances[msg.Recipient], msg.Quantity)

        --[[
         Only send the notifications to the Sender and Recipient
         if the Cast tag is not set on the Transfer message
       ]]
        --
        if not msg.Cast then
            -- Debit-Notice message template, that is sent to the Sender of the transfer
            local debitNotice = {
                Target = msg.From,
                Action = 'Debit-Notice',
                Recipient = msg.Recipient,
                Quantity = msg.Quantity,
                Data = Colors.gray ..
                    "You transferred " ..
                    Colors.blue .. msg.Quantity .. Colors.gray .. " to " .. Colors.green .. msg.Recipient .. Colors
                    .reset
            }
            -- Credit-Notice message template, that is sent to the Recipient of the transfer
            local creditNotice = {
                Target = msg.Recipient,
                Action = 'Credit-Notice',
                Sender = msg.From,
                Quantity = msg.Quantity,
                Data = Colors.gray ..
                    "You received " ..
                    Colors.blue .. msg.Quantity .. Colors.gray .. " from " .. Colors.green .. msg.From .. Colors.reset
            }

            -- Add forwarded tags to the credit and debit notice messages
            for tagName, tagValue in pairs(msg) do
                -- Tags beginning with "X-" are forwarded
                if string.sub(tagName, 1, 2) == "X-" then
                    debitNotice[tagName] = tagValue
                    creditNotice[tagName] = tagValue
                end
            end

            -- Send Debit-Notice and Credit-Notice
            print("Transfer Successful")
            ao.send(debitNotice)
            ao.send(creditNotice)
        end
    else
        ao.send({
            Target = msg.From,
            Action = 'Transfer-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Insufficient Balance!'
        })
    end
end

Handlers.add('transfer', Handlers.utils.hasMatchingTag('Action', 'Transfer'), TransferFunction)

--[[
    Mint
   ]]
--
Handlers.add('mint', Handlers.utils.hasMatchingTag('Action', 'Mint'), function(msg)
    assert(type(msg.Quantity) == 'string', 'Quantity is required!')
    assert(bint(0) < bint(msg.Quantity), 'Quantity must be greater than zero!')

    if not Balances[ao.id] then Balances[ao.id] = "0" end

    if msg.From == ao.id then
        -- Add tokens to the token pool, according to Quantity
        Balances[msg.From] = utils.add(Balances[msg.From], msg.Quantity)
        TotalSupply = utils.add(TotalSupply, msg.Quantity)
        ao.send({
            Target = msg.From,
            Data = Colors.gray .. "Successfully minted " .. Colors.blue .. msg.Quantity .. Colors.reset
        })
    else
        ao.send({
            Target = msg.From,
            Action = 'Mint-Error',
            ['Message-Id'] = msg.Id,
            Error = 'Only the Process Id can mint new ' .. Ticker .. ' tokens!'
        })
    end
end)

--[[
     Total Supply
   ]]
--
Handlers.add('totalSupply', Handlers.utils.hasMatchingTag('Action', 'Total-Supply'), function(msg)
    assert(msg.From ~= ao.id, 'Cannot call Total-Supply from the same process!')

    ao.send({
        Target = msg.From,
        Action = 'Total-Supply',
        Data = TotalSupply,
        Ticker = Ticker
    })
end)

--[[
 Burn
]] --
Handlers.add('burn', Handlers.utils.hasMatchingTag('Action', 'Burn'), function(msg)
    assert(type(msg.Quantity) == 'string', 'Quantity is required!')
    assert(bint(msg.Quantity) <= bint(Balances[msg.From]), 'Quantity must be less than or equal to the current balance!')

    Balances[msg.From] = utils.subtract(Balances[msg.From], msg.Quantity)
    TotalSupply = utils.subtract(TotalSupply, msg.Quantity)

    ao.send({
        Target = msg.From,
        Data = Colors.gray .. "Successfully burned " .. Colors.blue .. msg.Quantity .. Colors.reset
    })
end)
