import NumberTicker from "@/components/magicui/number-ticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";

export default function Bank() {
  const { bank, getBank, deposit, withdraw, claimAirdrop, bankTransactionLoading } = useGameStore();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    getBank();
  }, []);

  if (!bank) return <div>Bank Loading...</div>;

  return (
    <div>
      <h1>Bank</h1>
      <div>
        <p>
          Gold in Bank: <NumberTicker value={bank.gold_amount} />
        </p>
        <p>
          Dumz in Bank: <NumberTicker value={bank.dumz_amount} />
        </p>
        <p>
          Gold in NFT Vault: <NumberTicker value={bank.nft_gold_amount} />
        </p>
        <p>
          Dumz in NFT Vault: <NumberTicker value={bank.nft_dumz_amount} />
        </p>
      </div>

      <div>
        <label>Amount</label>
        <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
        {bankTransactionLoading && <p className="text-red-500 my-2">Loading...</p>}

        <div className="flex flex-col gap-2">
          <Button onClick={() => deposit(amount, "GOLD")}>Deposit Gold</Button>
          <Button onClick={() => withdraw(amount, "GOLD")}>Withdraw Gold</Button>
          <Button onClick={() => withdraw(amount, "DUMZ")}>Withdraw Dumz</Button>
          <Button onClick={() => deposit(amount, "DUMZ")}>Deposit Dumz</Button>
          <Button onClick={() => claimAirdrop("GOLD")}>Claim Gold Airdrop</Button>
          <Button onClick={() => claimAirdrop("DUMZ")}>Claim Dumz Airdrop</Button>
        </div>
      </div>
      <h1>Bank Transactions</h1>
      <div>
        {bank.transactions.map((transaction) => (
          <div key={transaction.id} className="flex flex-col gap-1 mb-3">
            <p>ID: {transaction.id}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Token Type: {transaction.token_type}</p>
            <p>Transaction Type: {transaction.transaction_type}</p>
            <p>Transaction Time: {new Date(transaction.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
