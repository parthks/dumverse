require("blackjack.types")

-- Deck of 52 cards
local deck: {Card} = {
    -- Number cards (2-10)
    { rank = "2",     suit = "Hearts",   value = 2 },
    { rank = "3",     suit = "Hearts",   value = 3 },
    { rank = "4",     suit = "Hearts",   value = 4 },
    { rank = "5",     suit = "Hearts",   value = 5 },
    { rank = "6",     suit = "Hearts",   value = 6 },
    { rank = "7",     suit = "Hearts",   value = 7 },
    { rank = "8",     suit = "Hearts",   value = 8 },
    { rank = "9",     suit = "Hearts",   value = 9 },
    { rank = "10",    suit = "Hearts",   value = 10 },
    { rank = "2",     suit = "Diamonds", value = 2 },
    { rank = "3",     suit = "Diamonds", value = 3 },
    { rank = "4",     suit = "Diamonds", value = 4 },
    { rank = "5",     suit = "Diamonds", value = 5 },
    { rank = "6",     suit = "Diamonds", value = 6 },
    { rank = "7",     suit = "Diamonds", value = 7 },
    { rank = "8",     suit = "Diamonds", value = 8 },
    { rank = "9",     suit = "Diamonds", value = 9 },
    { rank = "10",    suit = "Diamonds", value = 10 },
    { rank = "2",     suit = "Clubs",    value = 2 },
    { rank = "3",     suit = "Clubs",    value = 3 },
    { rank = "4",     suit = "Clubs",    value = 4 },
    { rank = "5",     suit = "Clubs",    value = 5 },
    { rank = "6",     suit = "Clubs",    value = 6 },
    { rank = "7",     suit = "Clubs",    value = 7 },
    { rank = "8",     suit = "Clubs",    value = 8 },
    { rank = "9",     suit = "Clubs",    value = 9 },
    { rank = "10",    suit = "Clubs",    value = 10 },
    { rank = "2",     suit = "Spades",   value = 2 },
    { rank = "3",     suit = "Spades",   value = 3 },
    { rank = "4",     suit = "Spades",   value = 4 },
    { rank = "5",     suit = "Spades",   value = 5 },
    { rank = "6",     suit = "Spades",   value = 6 },
    { rank = "7",     suit = "Spades",   value = 7 },
    { rank = "8",     suit = "Spades",   value = 8 },
    { rank = "9",     suit = "Spades",   value = 9 },
    { rank = "10",    suit = "Spades",   value = 10 },

    -- Face cards (Jack, Queen, King)
    { rank = "Jack",  suit = "Hearts",   value = 10 },
    { rank = "Queen", suit = "Hearts",   value = 10 },
    { rank = "King",  suit = "Hearts",   value = 10 },
    { rank = "Jack",  suit = "Diamonds", value = 10 },
    { rank = "Queen", suit = "Diamonds", value = 10 },
    { rank = "King",  suit = "Diamonds", value = 10 },
    { rank = "Jack",  suit = "Clubs",    value = 10 },
    { rank = "Queen", suit = "Clubs",    value = 10 },
    { rank = "King",  suit = "Clubs",    value = 10 },
    { rank = "Jack",  suit = "Spades",   value = 10 },
    { rank = "Queen", suit = "Spades",   value = 10 },
    { rank = "King",  suit = "Spades",   value = 10 },

    -- Aces
    { rank = "Ace",   suit = "Hearts",   value = { 11, 1 } },
    { rank = "Ace",   suit = "Diamonds", value = { 11, 1 } },
    { rank = "Ace",   suit = "Clubs",    value = { 11, 1 } },
    { rank = "Ace",   suit = "Spades",   value = { 11, 1 } }
}

-- Initialize Dealer with custom Dealer type
local Dealer: DealerType = {
    address = ao.id,
    balance = 1000,
    hiddenCard = {},
    visibleCard = {},
    hasBust = false,
    winnigAmount = nil
    -- gold_balance = 1000,
    
}

return {
    deck = deck,
    Dealer = Dealer
}
