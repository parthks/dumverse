import { InventoryBag } from "@/components/game/InventoryBag";
import ImgButton from "@/components/ui/imgButton";
import { Input } from "@/components/ui/input";
import { SOUNDS, BUILDING_IMAGES, IMAGES } from "@/lib/constants";
import { sleep } from "@/lib/time";
import { GAME_PROCESS_ID, calculatePositionAndSize } from "@/lib/utils";
import { pollForTransferSuccess, sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { useGameStore } from "@/store/useGameStore";
import { useCallback, useEffect, useState, useRef } from "react";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import GifComponent from "@/components/Dialogue/Dialogue";
import audioManager from "@/utils/audioManager";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";

const imageWidth = 3840;
const imageHeight = 2160;

function QuantityInput({ actionType, onClose }: { actionType: BankActionType; onClose: () => void }) {
  const { user, bank, deposit, withdraw, bankTransactionLoading } = useGameStore();
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);

  const handleSubmit = async () => {
    if (!inputValue) {
      return;
    }
    if (inputValue <= 0) {
      setInputValue(undefined);
      return;
    }
    if (inputValue > max) {
      setInputValue(max);
      return;
    }
    if (actionType === "deposit-dumz") {
      console.log("deposit-dumz");
      await deposit(inputValue ?? 0, "DUMZ");
    } else if (actionType === "withdraw-dumz") {
      console.log("withdraw-dumz");
      await withdraw(inputValue ?? 0, "DUMZ");
    } else if (actionType === "deposit-trunk") {
      console.log("deposit-trunk");
      await deposit(inputValue ?? 0, "TRUNK");
    } else if (actionType === "deposit-gold") {
      console.log("deposit-gold");
      await deposit(inputValue ?? 0, "GOLD");
    } else if (actionType === "withdraw-gold") {
      console.log("withdraw-gold");
      await withdraw(inputValue ?? 0, "GOLD");
    }
    audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
    onClose();
  };

  let title;
  let max = 0;
  if (actionType === "deposit-dumz") {
    title = "Depositing how much $Dumz?";
    max = user?.dumz_balance ?? 0;
  } else if (actionType === "withdraw-dumz") {
    title = "Withdrawing how much $Dumz?";
    max = bank?.dumz_amount ?? 0;
  } else if (actionType === "deposit-gold") {
    title = "Depositing how much Gold?";
    max = user?.gold_balance ?? 0;
  } else if (actionType === "withdraw-gold") {
    title = "Withdrawing how much Gold?";
    max = bank?.gold_amount ?? 0;
  } else if (actionType === "deposit-trunk") {
    title = "Depositing how much Trunk?";
    max = user?.trunk_balance ?? 0;
  }
  
  return (
    <div
      className="z-10 bg-cover bg-center bg-no-repeat absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        backgroundImage: "url('https://arweave.net/PGjj1AvsLyry4Dylp3DK8HLTjatjc90t8nCqaarNlmc')",
        width: "500px",
        height: "500px",
      }}
    >
      <div className="absolute top-4 right-4">
        <ImgButton src={"https://arweave.net/T2yq7k38DKhERIR4Mg3UBwp8G6IzfAjl0UXidNjrOdA"} onClick={onClose} alt={"Exit Quantity Input"} />
      </div>
      <div className="flex flex-col items-center w-full gap-4 p-16">
        <h1 className="text-black text-center text-5xl leading-normal font-bold mb-4">{title}</h1>
        <div className="relative">

        <Input
          placeholder={`Max allowed: ${max}`}
          aria-label="Amount"
          type="number"
          value={inputValue}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setInputValue(value);
            } else {
              setInputValue(undefined);
            }
          }}
          className="h-[37px] w-[153px] bg-no-repeat bg-left border-none focus-visible:ring-0"
          style={{
            width: "calc(153px * 1.3)",
            height: "calc(37px * 1.3)",
            backgroundImage: "url('https://arweave.net/kvrXn-DDzS5kypnpyPP_0OcbRv1I1UeZsZfRjWzDAgY')",
            backgroundSize: "100% 100%",
          }}
        />
         <button
        onClick={()=>setInputValue(max)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-2 py-1 rounded-md"
      >
        Max
      </button>
    </div>
        <ImgButton src={"https://arweave.net/y8jNH5_eXoEWAnt-bvaf9ueaNIUVtTCY09C9XjuYDTw"} onClick={handleSubmit} alt={"Confirm Action"} />
      </div>
    </div>
  );
}

function TransferTokens({ onClose, tokenType }: { onClose: () => void; tokenType: "dumz_token" | "trunk_token" }) {
  const { user, bank, getBank, bankDataLoading } = useGameStore();
  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const [tokenBalance, setTokenBalance] = useState<number | undefined>(undefined);
  const [txnLoading, setTxnLoading] = useState(false);
  const [txnCompleted, setTxnCompleted] = useState(false);

  const bankDumz = tokenType === "dumz_token" ? bank?.dumz_amount : tokenType === "trunk_token" ? bank?.trunk_amount : undefined;

  const fetchBalance = useCallback(async () => {
    if (!user?.address) return;
    const balance = await sendDryRunGameMessage({
      tags: [
        { name: "Action", value: "Balance" },
        { name: "Recipient", value: user.address },
      ],
      process: tokenType,
    });
    setTokenBalance(parseInt(balance.data as unknown as string));
  }, [user?.address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleWithdraw = async () => {  
    if (!inputValue) return;
    if (!bankDumz) return;
    if (inputValue <= 0) {
      setInputValue(undefined);
      return;
    }
    if (inputValue > bankDumz) {
      setInputValue(bankDumz);
      return;
    }
    setTxnCompleted(false);
    setTxnLoading(true);
    const tags = [
      { name: "Action", value: "Bank.PushOut" },
      { name: "UserId", value: user!.id!.toString() },
      { name: "Amount", value: inputValue.toString() },
      { name: "TokenType", value: tokenType === "dumz_token" ? "DUMZ" : "TRUNK" },
    ];
    const initialResponse = await sendAndReceiveGameMessage({
      tags: tags,
      process: "bank"
    });
    console.log("initialResponse", initialResponse, initialResponse.status);
    const result = await pollForTransferSuccess(tokenType, (messageTags) => {
      const creditNotice = messageTags.find((tag) => tag.name === "Action" && tag.value === "Credit-Notice");
      const transferToUser = messageTags.find((tag) => tag.name === "X-UserId" && tag.value === user!.id!.toString());
      const amountTransferred = messageTags.find((tag) => tag.name === "Quantity" && tag.value === inputValue.toString());
      return !!creditNotice && !!transferToUser && !!amountTransferred;
    });
    getBank();
    fetchBalance();
    setTxnLoading(false);
    setTxnCompleted(true);
    setInputValue(undefined);
  };

  const handleDeposit = async () => {
    if (!inputValue) return;
    if (!tokenBalance) return;
    if (inputValue <= 0) {
      setInputValue(undefined);
      return;
    }
    if (inputValue > tokenBalance) {
      setInputValue(tokenBalance);
      return;
    }
    setTxnLoading(true);
    const tags = [
      { name: "Action", value: "Transfer" },
      { name: "X-UserId", value: user!.id!.toString() },
      { name: "Recipient", value: GAME_PROCESS_ID },
      { name: "Quantity", value: inputValue.toString() },
    ];
    const resultData = await sendAndReceiveGameMessage({
      tags: tags,
      process: tokenType,
    });
    const debitNotice = resultData.Messages?.find((msg) => msg.Tags.some((tag: { name: string; value: string }) => tag.name === "Action" && tag.value === "Debit-Notice"));
    if (debitNotice) {
      await sleep(2000); // wait for the credit notice to be processed by game process
      setTokenBalance(tokenBalance! - inputValue);
      getBank();
      fetchBalance();
      setInputValue(undefined);
    }
    setTxnLoading(false);
  };

  const title = `Transfer ${tokenType === "dumz_token" ? "$Dumz" : "$Trunk"}` ;
  return (
    <div
      className="z-10 bg-cover bg-center bg-no-repeat absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        backgroundImage: "url('https://arweave.net/PGjj1AvsLyry4Dylp3DK8HLTjatjc90t8nCqaarNlmc')",
        width: "500px",
        height: "500px",
      }}
    >
      <div className="absolute top-4 right-4">
        <ImgButton src={"https://arweave.net/T2yq7k38DKhERIR4Mg3UBwp8G6IzfAjl0UXidNjrOdA"} onClick={onClose} alt={"Exit Quantity Input"} />
      </div>
      <div className="flex flex-col items-center w-full gap-4 p-16">
        <h1 className="text-black text-center text-5xl leading-normal font-bold mb-4">{title}</h1>
        <p>Wallet Balance: {tokenBalance !== undefined ? (tokenBalance/1000).toFixed(3) : "--"}</p>
        <p>Bank Balance: {bankDataLoading ? "--" : bankDumz}</p>
        <Input
          placeholder={`Amount to transfer`}
          aria-label="Amount"
          type="number"
          value={inputValue}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              setInputValue(value);
            } else {
              setInputValue(undefined);
            }
          }}
          className="h-[37px] w-[153px] bg-no-repeat bg-left border-none focus-visible:ring-0"
          style={{
            width: "calc(153px * 1.3)",
            height: "calc(37px * 1.3)",
            backgroundImage: "url('https://arweave.net/kvrXn-DDzS5kypnpyPP_0OcbRv1I1UeZsZfRjWzDAgY')",
            backgroundSize: "100% 100%",
          }}
        />
        <div className="flex gap-4">
          {/* <ImgButton disabled={txnLoading} src={"https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"} onClick={handleDeposit} alt={"Deposit into Bank"} /> */}
          <ImgButton disabled={txnLoading} src={"https://arweave.net/VEFKvwWj0ZNSqSpNS4Na__FOh9fXW8l-ik83TYlLanM"} onClick={handleWithdraw} alt={"Withdraw from Bank"} />
        </div>
        {txnLoading && <p className="font-bold text-2xl text-red-600">Transferring Please Wait...</p>}
        {txnCompleted && <p className="font-bold text-2xl text-green-800">Transaction Complete</p>}
      </div>
    </div>
  );
}

type BankActionType = "deposit-dumz" | "withdraw-dumz" | "deposit-gold" | "withdraw-gold" | "transfer-dumz" | "transfer-trunk" | "deposit-trunk";
function GeneralBankVault({ onExit }: { onExit: () => void }) {
  const { user, bank, bankDataLoading, deposit, withdraw, bankTransactionLoading } = useGameStore();
  const [actionType, setActionType] = useState<BankActionType | null>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        setActionType(itemType as BankActionType);
      }
    }
  };

  // if (!bank) return <div>Loading...</div>;

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      {actionType && actionType !== "transfer-dumz" && actionType !== "transfer-trunk" && (
        <QuantityInput actionType={actionType as BankActionType} onClose={() => setActionType(null)} />
      )}
      {actionType === "transfer-dumz" && <TransferTokens tokenType="dumz_token" onClose={() => setActionType(null)} />}
      {actionType === "transfer-trunk" && <TransferTokens tokenType="trunk_token" onClose={() => setActionType(null)} />}
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/yzWJYKvAcgvbbH9SHJle6rgrPlE6Wsnjxwh20-w7cVQ"} onClick={onExit} alt={"Exit Bank Vault"} />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/MGpWofSa4O90mDCsdowZXM0KF5ZrJmxe_itNxS-iP_I"} alt="General Bank Vault" className="w-full h-full object-contain" />

          <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            <text x="50%" y="35%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading || !bank ? "--" : `${bank.trunk_amount ?? 0} $Trunk`}
            </text>
            {/* trunk */}
            <image
              href="https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"
              x="40%"
              y="40%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || user?.trunk_balance == 0 ? "disabled-image" : ""}`}
              item-type="deposit-trunk"
            />
            <image
              href="https://arweave.net/jsrnPQGUIpOH2NqCKbSYQtzEXvNTHtzbF921GKe3dlY"
              x="50%"
              y="40%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading ? "disabled-image" : ""}`}
              item-type="transfer-trunk"
            />

            {/* dumz */}
            <text x="50%" y="53%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading || !bank ? "--" : `${bank.dumz_amount} $Dumz`}
            </text>
            <image
              href="https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"
              x="36%"
              y="58%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || user?.dumz_balance == 0 ? "disabled-image" : ""}`}
              item-type="deposit-dumz"
            />
            <image
              href="https://arweave.net/VEFKvwWj0ZNSqSpNS4Na__FOh9fXW8l-ik83TYlLanM"
              x="46%"
              y="58%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || !bank || bank.dumz_amount == 0 ? "disabled-image" : ""}`}
              item-type="withdraw-dumz"
            />
            <image
              href="https://arweave.net/jsrnPQGUIpOH2NqCKbSYQtzEXvNTHtzbF921GKe3dlY"
              x="56%"
              y="58%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading ? "disabled-image" : ""}`}
              item-type="transfer-dumz"
            />
            <text x="50%" y="73%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading || !bank ? "--" : `${bank.gold_amount}g`}
            </text>
            {/* gold */}
            <image
              href="https://arweave.net/NVZCN7fRzU2SRFQPP5Ww5HHAoR8d8U4PP2xQG3TrujY"
              x="40%"
              y="77%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || user?.gold_balance == 0 ? "disabled-image" : ""}`}
              item-type="deposit-gold"
            />
            <image
              href="https://arweave.net/VEFKvwWj0ZNSqSpNS4Na__FOh9fXW8l-ik83TYlLanM"
              x="50%"
              y="77%"
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
  const { user, bank, userAirdrop, bankDataLoading, claimAirdrop, bankTransactionLoading, acceptBankQuest } = useGameStore();
  const [acceptQuestLoading, setAcceptQuestLoading] = useState(false);
  const [airdropInfoPopUp, setAirdropInfoPopUp] = useState(false);

  useEffect(() => {
    if (userAirdrop?.claimed_nft_dumz) {
      setAirdropInfoPopUp(true);
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        if (itemType === "claim-dumz") {
          console.log("claim-dumz");
          await claimAirdrop("DUMZ");
          audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
        } else if (itemType === "claim-gold") {
          console.log("claim-gold");
          await claimAirdrop("GOLD");
          audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
        }
        // else if (itemType === "claim-trunk") {
        //   console.log("claim-trunk");
        //   await claimTrunk();
        //   audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
        // }
      }
    }
  };

  // if (!bank || !user) return <div>Loading...</div>;
console.log("Bank User Airdrop: "+JSON.stringify(userAirdrop));
  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      {userAirdrop?.claimed_nft_dumz && airdropInfoPopUp && (
        <div className="fixed inset-0 flex items-center justify-center text-white z-50">
          <div className=" w-[60vw] h-[40vh] rounded-lg p-4 relative shadow-lg bg-black bg-opacity-85">
            <button
              className="absolute top-2 right-2 text-6xl font-bold"
              onClick={() => setAirdropInfoPopUp(false)}
            >
              &times;
            </button>

            <div className="w-full h-full flex items-center text-center py-6">
              <h1 className="text-4xl">
                {" "}
                The $DUMZ {userAirdrop.claimed_nft_gold ? "and gold" : ""} in
                this vault has already been claimed for this cascade. Check back
                in during a future cascade to claim your rewards!
              </h1>
            </div>
          </div>
        </div>
      )}
      {user?.special_item_key === -1 && !userAirdrop?.claimed_nft_dumz && (
        <>
          {" "}
          <div
            className=" absolute z-10"
            style={{
              maxWidth: "18vw",
              width: "100%",
              bottom: "0",
              left: "4",
              aspectRatio: 1,
            }}
          >
            <RiveAnimation url={BUILDING_IMAGES.BANK_GOLD_DUMDUM} />
          </div>
          <GifComponent
            className=" absolute h-[20vh] translate-x-[16vw] translate-y-[63vh] z-10"
            buttonClassName=""
            onClickFunction={async () => {
              setAcceptQuestLoading(true);
              const isQuestAccepted = await acceptBankQuest();
              setAcceptQuestLoading(false);
              return isQuestAccepted;
            }}
            buttonDisable={acceptQuestLoading}
          />{" "}
        </>
      )}
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton
          src={
            "https://arweave.net/yzWJYKvAcgvbbH9SHJle6rgrPlE6Wsnjxwh20-w7cVQ"
          }
          onClick={onExit}
          alt={"Exit Bank Vault"}
        />
      </div>
      <div className="z-10 absolute top-4 right-4">
        <div className="flex items-center gap-2">
          {user && user.special_item_key != -1 && (
            <>
              {/* user.special_item_key number of obtained keys and rest transparent upto a max of 3 keys */}
              {Array.from({ length: user.special_item_key }).map((_, index) => (
                <img
                  src={
                    "https://arweave.net/ZZmiA3RZ8BsaRYD88q_R3muiX5ZeDxwVawo71N-qpfg"
                  }
                  alt="Obtained Key"
                  className="w-16"
                />
              ))}
              {Array.from({ length: 3 - user.special_item_key }).map(
                (_, index) => (
                  <img
                    src={
                      "https://arweave.net/HwqbzSo7P7P4cOB28a1aId8GKR2HIQmZMCmdYbuqPkQ"
                    }
                    alt="Transparent Key"
                    className="w-16"
                  />
                )
              )}
            </>
          )}
        </div>
        {/* {user.special_item_key == -1 && (
          <ImgButton
            disabled={acceptQuestLoading}
            src={IMAGES.ACCEPT_QUEST_BUTTON}
            alt={"Accept Quest"}
            onClick={async () => {
              setAcceptQuestLoading(true);
              await acceptBankQuest();
              setAcceptQuestLoading(false);
            }}
          />
        )} */}
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img
            src={
              "https://arweave.net/ZYGuGEiNCOwDKHDdKRw20g5IpK_nopwVlO0tQcuNHPI"
            }
            alt="NFT Bank Vault"
            className="w-full h-full object-contain"
          />
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${imageWidth} ${imageHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-0"
            onClick={handleClick}
          >
            {/* dumz */}
            <text
              x="45%"
              y="40%"
              fontSize="150"
              textAnchor="middle"
              fill="white"
            >
              {bankDataLoading || !bank
                ? "--"
                : `${bank.nft_dumz_amount} $Dumz`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="43%"
              width={(163 / imageWidth) * 100 * 2.5 + "%"}
              height={(54 / imageHeight) * 100 * 2.5 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${
                bankTransactionLoading ||
                bank?.nft_dumz_amount == 0 ||
                user?.special_item_key != 3
                  ? "disabled-image"
                  : ""
              }`}
              item-type="claim-dumz"
            />
            {/* bank locks */}
            {Array.from({ length: 3 }).map((_, index) => (
              <image
                href={
                  "https://arweave.net/RBunabOFv3oZQQl6J6jccr-k_5XErZa2dVQUl51jV_0"
                }
                x={`${33 + index * 6}%`}
                y="50%"
                width="12%"
                height="12%"
                preserveAspectRatio="xMidYMid meet"
              />
            ))}

            {/* gold */}
            <text
              x="45%"
              y="73%"
              fontSize="150"
              textAnchor="middle"
              fill="white"
            >
              {bankDataLoading || !bank ? "--" : `${bank.nft_gold_amount}g`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="77%"
              width={(163 / imageWidth) * 100 * 2.5 + "%"}
              height={(54 / imageHeight) * 100 * 2.5 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${
                bankTransactionLoading || bank?.nft_gold_amount == 0
                  ? "disabled-image"
                  : ""
              }`}
              item-type="claim-gold"
            />
          </svg>

          {/* <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            <text x="45%" y="35%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.nft_dumz_amount} $Dumz`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="38%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.nft_dumz_amount == 0 || user.special_item_key != 3 ? "disabled-image" : ""}`}
              item-type="claim-dumz"
            />
            <text x="45%" y="50%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.nft_trunk_amount} $Trunk`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="53%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.nft_trunk_amount == 0 ? "disabled-image" : ""}`}
              item-type="claim-trunk"
            />

            {Array.from({ length: 3 }).map((_, index) => (
              <image
                href={"https://arweave.net/RBunabOFv3oZQQl6J6jccr-k_5XErZa2dVQUl51jV_0"}
                x={`${33 + index * 6}%`}
                y="58%"
                width="10%"
                height="10%"
                preserveAspectRatio="xMidYMid meet"
              />
            ))}

            <text x="45%" y="76%" fontSize="100" textAnchor="middle" fill="white">
              {bankDataLoading ? "--" : `${bank.nft_gold_amount}g`}
            </text>
            <image
              href="https://arweave.net/-nNkBcJ5iAWv0tbYBOqZkTDabHvGGLR0jNnAC5OoVX4"
              x="40%"
              y="80%"
              width={(163 / imageWidth) * 100 * 2 + "%"}
              height={(54 / imageHeight) * 100 * 2 + "%"}
              preserveAspectRatio="xMidYMid meet"
              className={`grow-image item cursor-pointer ${bankTransactionLoading || bank?.nft_gold_amount == 0 ? "disabled-image" : ""}`}
              item-type="claim-gold"
            />
          </svg> */}
        </div>
      </div>
    </div>
  );
}

export default function BankPage() {
  const { bank, getBank,getUserAirdropInfo, user, deposit, withdraw, claimAirdrop, bankTransactionLoading, goDirectlyToTownPage, acceptBankQuest } = useGameStore();
  const [amount, setAmount] = useState(0);
  const [acceptQuestLoading, setAcceptQuestLoading] = useState(false);

  const [vaultSelected, setVaultSelected] = useState<"general-vault" | "nft-vault" | null>(null);
  useBackgroundMusic(SOUNDS.TOWN_AUDIO_IN_BUILDING);

  useEffect(() => {
    if (user) {
      getBank();
      getUserAirdropInfo();
    }
  }, [user]);

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    const itemType = event.currentTarget.getAttribute("item-type");
    if (itemType) {
      if ((itemType as "general-vault" | "nft-vault") === "general-vault") setVaultSelected(itemType as "general-vault");
      if ((itemType as "general-vault" | "nft-vault") === "nft-vault" && user?.nft_address) setVaultSelected(itemType as "nft-vault");
      // buyItem(itemType);
    }
  };
  if (!user) return <div>Loading...</div>;

  if (vaultSelected === "general-vault") {
    return <GeneralBankVault onExit={() => setVaultSelected(null)} />;
  } else if (vaultSelected === "nft-vault") {
    return <NftBankVault onExit={() => setVaultSelected(null)} />;
  }

  return (
    <div className="h-screen relative" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton
          src={"https://arweave.net/hwy3FBe-uiAit-OKZmXtV35QqhRX2To-t4lakmRTEjI"}
          onClick={async () => {
            audioManager.playSFX(SOUNDS.BUILDING_ENTER);
            await sleep(1000);
            goDirectlyToTownPage();
          }}
          alt={"Exit Bank"}
        />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/-1jE6wxXzcUcwt_f1Jx3O3aAsdViTEorWXV5BG1fAR8"} alt="Bank Map" className="w-full h-full object-contain" />
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* bg-[#f0ecd3]       */}
          <div
            className="absolute w-full h-full flex flex-col bg-[#f0ecd3] items-center justify-end gap-24"
            style={{
              ...calculatePositionAndSize(50, 100, 47.6),
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="relative w-[50%]">
              <img src="https://arweave.net/zA4CeoP9KBggcsYcGx5LWPSQXCTmnsp6g5BtFTw-WoU" />
            </div>
            <div className="relative w-full  h-full flex flex-col">
              {/* <div className="absolute h-full flex items-center " style={{top:"-8%",left:"17%"}}> */}
              <div
                className=" absolute"
                style={{
                  maxWidth: "15vw",
                  width: "100%",
                  top: "18.5%",
                  left: "17%",
                  aspectRatio: 1,
                }}
              >
                <RiveAnimation url={BUILDING_IMAGES.BANK_GOLD_DUMDUM} />
              </div>
              {user.special_item_key > -1 && (
                <GifComponent
                  className=" absolute h-[20vh] translate-x-[22vw] translate-y-[2vh]"
                  buttonClassName=""
                  onClickFunction={async () => {
                    setAcceptQuestLoading(true);
                    const isQuestAccepted = await acceptBankQuest();
                    setAcceptQuestLoading(false);
                    return isQuestAccepted;
                  }}
                  buttonDisable={acceptQuestLoading}
                />
              )}
              {/* </div> */}

              <div className="relative ">
                <img
                  src="https://arweave.net/308P8DWdOdn9VxdCzn7zplkMJZ9YdClGZuMya5suixM"
                  alt="Bank Table With Glass"
                  className="relative w-full"
                  style={{ height: "auto", top: "0%" }}
                />
              </div>
            </div>
          </div>
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <div
            className="absolute w-full h-full flex flex-row items-center justify-between px-20"
            style={{
              ...calculatePositionAndSize(50, 62, 100),
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Left Vault */}
            <div className="relative flex flex-col w-1/4">
              <img style={{ width: "50%", margin: "auto" }} src="https://arweave.net/fteI4wzrjFS8ruWnIE-QLB7a4ErQvNXgPyN35MsogMg" />
              <img
                src="https://arweave.net/iO1T9cKWz8eRDQt1lKUZAutT7SIWjGnO0begAdUL5FY"
                item-type="general-vault"
                className="relative w-full grow-image item cursor-pointer"
                style={{ height: "auto", top: "0%" }}
                onClick={handleClick}
              />
            </div>

            {/* Right Vault */}
            <div className="relative flex flex-col w-1/4">
              <img style={{ width: "50%", margin: "auto" }} src="https://arweave.net/lCXQvkVSePAyZIMfJmBLOFPvrOeZ6wNeh-csB-PhdoY" />
              <img
                src="https://arweave.net/6yZh_88An3lv0mV9BnDipb3zTbPYU96Ond0tnHmWYFw"
                item-type="nft-vault"
                className="relative w-full grow-image item cursor-pointer"
                style={{ height: "auto", top: "0%" }}
                onClick={handleClick}
              />
            </div>
          </div>
          {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            <image
              href="https://arweave.net/iO1T9cKWz8eRDQt1lKUZAutT7SIWjGnO0begAdUL5FY"
              x="3.5%"
              y="17%"
              width="22%"
              height="42%"
              preserveAspectRatio="xMidYMid meet"
              className="grow-image item cursor-pointer"
              item-type="general-vault"
            /> */}
          {/* TODO: NFT Vault show lock icon if not owned */}
          {/* <image
              href="https://arweave.net/6yZh_88An3lv0mV9BnDipb3zTbPYU96Ond0tnHmWYFw"
              x="74.5%"
              y="17%"
              width="22%"
              height="42%"
              preserveAspectRatio="xMidYMid meet"
              className="grow-image item cursor-pointer"
              item-type="nft-vault"
            />
          </svg> */}
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
