#!/bin/bash
# Check if wallet.json exists
if [ ! -f "wallet.json" ]; then
    echo "Error: wallet.json file not found. Please ensure the wallet file is present in the current directory."
    exit 1
fi

# export WALLET_JSON="$(cat ~/.aos.json)"
export WALLET_JSON="$(cat wallet.json)"
npx aoform apply -f processes.yaml
