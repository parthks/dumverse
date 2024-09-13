import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";

const imageWidth = 3840;
const imageHeight = 2160;

function GeneralBankVault({ onExit }: { onExit: () => void }) {
  const { user, bank, bankDataLoading, deposit, withdraw, bankTransactionLoading } = useGameStore();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        console.log(itemType);
        if (itemType === "deposit-dumz") {
          console.log("deposit-dumz");
          deposit(user?.dumz_balance ?? 0, "DUMZ");
        } else if (itemType === "withdraw-dumz") {
          console.log("withdraw-dumz");
          withdraw(bank?.dumz_amount ?? 0, "DUMZ");
        } else if (itemType === "deposit-gold") {
          console.log("deposit-gold");
          deposit(user?.gold_balance ?? 0, "GOLD");
        } else if (itemType === "withdraw-gold") {
          console.log("withdraw-gold");
          withdraw(bank?.gold_amount ?? 0, "GOLD");
        }
      }
    }
  };

  if (!bank) return <div>Loading...</div>;

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/yzWJYKvAcgvbbH9SHJle6rgrPlE6Wsnjxwh20-w7cVQ"} onClick={onExit} alt={"Exit Bank Vault"} />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/_bcFdMyWRe8R95lz9gbIcYutT6x_vGoUCH7EoYYJ7To"} alt="General Bank Vault" className="w-full h-full object-contain" />

          <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            {/* dumz */}
            <text x="50%" y="44.5%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.dumz_amount} $Dumz`}
            </text>
            <image
              href="https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"
              x="40%"
              y="50%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || user?.dumz_balance == 0 ? "disabled-image" : ""}`}
              item-type="deposit-dumz"
            />
            <image
              href="https://arweave.net/VEFKvwWj0ZNSqSpNS4Na__FOh9fXW8l-ik83TYlLanM"
              x="50%"
              y="50%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank.dumz_amount == 0 ? "disabled-image" : ""}`}
              item-type="withdraw-dumz"
            />
            <text x="50%" y="67%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.gold_amount}g`}
            </text>
            {/* gold */}
            <image
              href="https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"
              x="40%"
              y="72%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || user?.gold_balance == 0 ? "disabled-image" : ""}`}
              item-type="deposit-gold"
            />
            <image
              href="https://arweave.net/VEFKvwWj0ZNSqSpNS4Na__FOh9fXW8l-ik83TYlLanM"
              x="50%"
              y="72%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.gold_amount == 0 ? "disabled-image" : ""}`}
              item-type="withdraw-gold"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function NftBankVault({ onExit }: { onExit: () => void }) {
  const { user, bank, bankDataLoading, claimAirdrop, bankTransactionLoading } = useGameStore();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        if (itemType === "claim-dumz") {
          console.log("claim-dumz");
          claimAirdrop("DUMZ");
        } else if (itemType === "claim-gold") {
          console.log("claim-gold");
          claimAirdrop("GOLD");
        }
      }
    }
  };

  if (!bank) return <div>Loading...</div>;

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/yzWJYKvAcgvbbH9SHJle6rgrPlE6Wsnjxwh20-w7cVQ"} onClick={onExit} alt={"Exit Bank Vault"} />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/mz1QPdT6fZxtT5PLQEtvP6Q_XSOmTXqs9Q1GhDKVfLg"} alt="NFT Bank Vault" className="w-full h-full object-contain" />

          <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            {/* dumz */}
            <text x="45%" y="50%" fontSize="150" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.nft_dumz_amount} $Dumz`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="53%"
              width={(163 / imageWidth) * 100 * 2.5 + "%"}
              height={(54 / imageHeight) * 100 * 2.5 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.nft_dumz_amount == 0 ? "disabled-image" : ""}`}
              item-type="claim-dumz"
            />
            {/* gold */}
            <text x="45%" y="73%" fontSize="150" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.nft_gold_amount}g`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="77%"
              width={(163 / imageWidth) * 100 * 2.5 + "%"}
              height={(54 / imageHeight) * 100 * 2.5 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.nft_gold_amount == 0 ? "disabled-image" : ""}`}
              item-type="claim-gold"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function BankPage() {
  const { bank, getBank, deposit, withdraw, claimAirdrop, bankTransactionLoading, goToTown } = useGameStore();
  const [amount, setAmount] = useState(0);

  const [vaultSelected, setVaultSelected] = useState<"general-vault" | "nft-vault" | null>(null);

  useEffect(() => {
    getBank();
  }, []);

  // if (!bank) return <div>Bank Loading...</div>;

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        setVaultSelected(itemType as "general-vault" | "nft-vault");
        // buyItem(itemType);
      }
    }
  };

  if (vaultSelected === "general-vault") {
    return <GeneralBankVault onExit={() => setVaultSelected(null)} />;
  } else if (vaultSelected === "nft-vault") {
    return <NftBankVault onExit={() => setVaultSelected(null)} />;
  }
  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/hwy3FBe-uiAit-OKZmXtV35QqhRX2To-t4lakmRTEjI"} onClick={() => goToTown()} alt={"Exit Bank"} />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/HslySMLjJUM5tsd8OHEO21xeDLLbIQ7vS6Xh612fT9A"} alt="Bank Map" className="w-full h-full object-contain" />

          <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            <image
              href="https://arweave.net/iO1T9cKWz8eRDQt1lKUZAutT7SIWjGnO0begAdUL5FY"
              x="3.5%"
              y="17%"
              width="22%"
              height="42%"
              preserveAspectRatio="xMidYMid meet"
              className="grow-image item cursor-pointer"
              item-type="general-vault"
            />
            {/* TODO: NFT Vault show lock icon if not owned */}
            <image
              href="https://arweave.net/6yZh_88An3lv0mV9BnDipb3zTbPYU96Ond0tnHmWYFw"
              x="74.5%"
              y="17%"
              width="22%"
              height="42%"
              preserveAspectRatio="xMidYMid meet"
              className="grow-image item cursor-pointer"
              item-type="nft-vault"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// return (
//   <div>
//     <h1>Bank</h1>
//     <div>
//       <p>
//         Gold in Bank: <NumberTicker value={bank.gold_amount} />
//       </p>
//       <p>
//         Dumz in Bank: <NumberTicker value={bank.dumz_amount} />
//       </p>
//       <p>
//         Gold in NFT Vault: <NumberTicker value={bank.nft_gold_amount} />
//       </p>
//       <p>
//         Dumz in NFT Vault: <NumberTicker value={bank.nft_dumz_amount} />
//       </p>
//     </div>

//     <div>
//       <label>Amount</label>
//       <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
//       {bankTransactionLoading && <p className="text-red-500 my-2">Loading...</p>}

//       <div className="flex flex-col gap-2">
//         <Button onClick={() => deposit(amount, "GOLD")}>Deposit Gold</Button>
//         <Button onClick={() => withdraw(amount, "GOLD")}>Withdraw Gold</Button>
//         <Button onClick={() => withdraw(amount, "DUMZ")}>Withdraw Dumz</Button>
//         <Button onClick={() => deposit(amount, "DUMZ")}>Deposit Dumz</Button>
//         <Button onClick={() => claimAirdrop("GOLD")}>Claim Gold Airdrop</Button>
//         <Button onClick={() => claimAirdrop("DUMZ")}>Claim Dumz Airdrop</Button>
//       </div>
//     </div>
//     <h1>Bank Transactions</h1>
//     <div>
//       {bank.transactions.map((transaction) => (
//         <div key={transaction.id} className="flex flex-col gap-1 mb-3">
//           <p>ID: {transaction.id}</p>
//           <p>Amount: {transaction.amount}</p>
//           <p>Token Type: {transaction.token_type}</p>
//           <p>Transaction Type: {transaction.transaction_type}</p>
//           <p>Transaction Time: {new Date(transaction.created_at).toLocaleString()}</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );
