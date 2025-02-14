-- Define the Card type
global record Card
    rank: string
    suit: string
    value: integer | {integer} -- Value can be a number or a table (for Aces)
end

-- Define the Player type
global record Player
    user_id: integer
    address: string
    nft_address: string | nil
    betAmount: number
    betPlaced: boolean
    cards: {Card} -- Player's hand of cards
    value: integer
    hasDoubleDown: boolean
    hasBust: boolean
    hasStood: boolean
    status: string | nil
    gold_balance: number
    added_at: integer
end

-- Define the RevealedHand type (used in ShowCards handler)
global record RevealedHand
    address: string
    hiddenCard: {Card} -- Can be empty if hidden card is not shown
    visibleCard: {Card}
    hand: {Card} | nil -- Optional, only for players
end

-- Define the Dealer type

-- global record DealersHiddenCard
--     show: boolean
--     card: Card
-- end

global record DealerType
    address: string
    balance: number
    hiddenCard: Card
    visibleCard: {Card}
    hasBust: boolean
    winnigAmount: number | nil
    status: string | nil
    -- gold_balance: number
    
end

-- Define the PlayerCardValues type (used in Win handler)
global record PlayerCardValues
    address: string
    id: string
    cardsValue: integer
    status: string
end

global record BlackjackGameLogEntry
    from: string
    message: string
    timestamp: integer
end

global record Round 
    id: integer
    players: {integer: Player}
    dealer: DealerType
    deck: {Card}
    logs: {BlackjackGameLogEntry}
    -- internal_logs: {BlackjackGameLogEntry}
    started: boolean
    ended: boolean
    winner: {string} 
    created_at: integer
end