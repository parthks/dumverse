import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import ImgButton from "@/components/ui/imgButton";
import { BUILDING_IMAGES } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useState } from "react";
import GifComponent from "@/components/Dialogue/Dialogue";
import { sleep } from "@/lib/time";
import { SOUNDS, CARD_IMAGES } from "@/lib/constants";
import audioManager from "@/utils/audioManager";
import NewButton from "@/components/ui/NewButton";
import { Input } from "@/components/ui/input";
import { useBlackjackStore } from "@/store/useBlackjackStore";
import { useQuery } from "@tanstack/react-query";

export default function Den() {
  const {
    currentRound,
    enterNewBlackjack,
    getOpenBlackjackRounds,
    blackjackStart,
    setBlackjackStart,
    placeBet,
    blackjackInfo,
    hit,
    doubleDown,
    stand,
    userIsReadyForBlackjack,
  } = useBlackjackStore();
  const { getShop, acceptDenQuest, setGameStatePage } = useGameStore();

  useBuildingMusic({ getBuildingData: () => getShop("ENERGY") });

  // const [showBlackjackGame, setShowBlackjackGame] = useState<boolean>(false);
  const [acceptQuestLoading, setAcceptQuestLoading] = useState(false);

  const handleClick = async () => {
    setBlackjackStart(false);
    const result = await enterNewBlackjack();
    setBlackjackStart(true);
    if ((result.status = "Success")) await getOpenBlackjackRounds();
  };

  if (blackjackStart) {
    if (!currentRound) {
      return (
        <div className="flex items-center">
          Loading........
          <NewButton
            className="px-12 bottom-10 py-4 text-2xl"
            src={
              "https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"
            }
            onClick={async () => {
              audioManager.playSFX(SOUNDS.BUILDING_ENTER);
              await sleep(750);
              setGameStatePage(GameStatePages.SECOND_TOWN);
            }}
            alt={"Exit"}
          />
        </div>
      );
    }
    return <BlackjackGame />;
  }

  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-[7%] left-[280px]">
        {/* <ExistToTownButton /> */}
        <NewButton
          className="py-2 px-20 text-2xl"
          src={
            "https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"
          }
          onClick={async () => {
            audioManager.playSFX(SOUNDS.BUILDING_ENTER);
            await sleep(750);
            setGameStatePage(GameStatePages.SECOND_TOWN);
          }}
          alt={"Exit"}
        />
      </div>
      <div className="z-10 absolute bottom-4 right-4 ">
        <InventoryBag />
      </div>

      <div className="relative w-full h-full ">
        <div className="absolute inset-0">
          <img
            src={
              "https://arweave.net/df4TyUlYX8wpMnz-k73yi8sA-0Jk4V-GkkKGPm3Cn-I"
            }
            alt="Den Map"
            className="w-full h-full  "
          />
        </div>
        <div className="absolute inset-0">
          {/* bg-red-600 */}{" "}
          {/* Group the Den DumDum on the counter, Den Counter and 2 x Two Joose on the Shelf */}
          <div
            className="absolute w-full h-full flex flex-col  items-center justify-end"
            style={{
              ...calculatePositionAndSize(11.5, 100, 23),
              transform: "translate(-50%, -100%)",
              height: "95%",
            }}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <div
                className="relative w-full h-full flex flex-col"
                style={{ top: "-3%" }}
              >
                {/* Two Joose On The Shelf */}
                <div
                  className=" w-full flex flex-col items-center relative"
                  style={{ left: "-15%" }}
                >
                  <div
                    className="flex gap-12 relative translate-y-3"
                    style={{ left: "120px" }}
                  >
                    <img
                      src="https://arweave.net/-S67lyxsaXzNbKmrY2Io6X7rjBdKTImryisE88LuRQc"
                      alt="Joose"
                      style={{ width: "15%" }}
                    />
                    <img
                      src="https://arweave.net/-S67lyxsaXzNbKmrY2Io6X7rjBdKTImryisE88LuRQc"
                      alt="Joose"
                      style={{ width: "15%" }}
                    />
                  </div>
                  <img
                    src="https://arweave.net/nQ03-odZ-vC30jHjueS3UT3XcmKpPeuC8gcWaZS0ZXs"
                    alt="Shelf "
                    style={{ width: "60%", height: "35%" }}
                  />
                </div>
                {/* Two Joose On The Shelf */}
                <div
                  className=" w-full flex flex-col items-center relative -translate-y-3"
                  style={{ left: "-15%" }}
                >
                  <div
                    className="flex gap-12  relative translate-y-3"
                    style={{ left: "120px" }}
                  >
                    <img
                      src="https://arweave.net/-S67lyxsaXzNbKmrY2Io6X7rjBdKTImryisE88LuRQc"
                      alt="Joose"
                      style={{ width: "15%" }}
                    />
                    <img
                      src="https://arweave.net/-S67lyxsaXzNbKmrY2Io6X7rjBdKTImryisE88LuRQc"
                      alt="Joose"
                      style={{ width: "15%" }}
                    />
                  </div>
                  <img
                    src="https://arweave.net/nQ03-odZ-vC30jHjueS3UT3XcmKpPeuC8gcWaZS0ZXs"
                    alt="Shelf "
                    style={{ width: "60%", height: "35%" }}
                  />
                </div>
              </div>

              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* Den DumDum On The Counter */}
              <div
                className="relative"
                style={{
                  maxWidth: "15vw", // Responsive size, adjust as needed
                  width: "100%",
                  top: "2%",
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveAnimation url={BUILDING_IMAGES.DEN_DUMDUM} />
              </div>
              <GifComponent
                className="absolute h-[20vh] translate-x-[13vw] translate-y-[29vh]"
                onClickFunction={async () => {
                  setAcceptQuestLoading(true);
                  const isQuestAccepted = await acceptDenQuest();
                  setAcceptQuestLoading(false);
                  return isQuestAccepted;
                }}
                buttonDisable={acceptQuestLoading}
              />
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* Den Counter */}
              <div className="relative">
                <img
                  src="https://arweave.net/ZTj2H2rj4UbdPSTuzEmbW1N1jiFAxwpB27Ny21-zvA0"
                  alt="Den Counter"
                  className="relative w-full"
                  style={{ height: "auto", top: "-13%" }}
                  // className="absolute "
                  // style={{ ...calculatePositionAndSize(14, 80, 28) }}
                />
              </div>
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
            </div>
          </div>
          {/* Den Window */}
          <div
            className="absolute w-full h-full"
            style={{
              ...calculatePositionAndSize(53.5, 42, 26),
              transform: "translate(-50%, -100%)",
            }}
          >
            <img
              src="https://arweave.net/OtCWzeGlhcHr4KuRc7fgRUiz4E4PAbCbd4gkbAdLwXg"
              alt="Den Window"
            />
          </div>
          {/* Den Joose Sign */}
          <div
            className="absolute w-full h-full"
            style={{
              ...calculatePositionAndSize(83, 33, 15),
              transform: "translate(-50%, -100%)",
            }}
          >
            <img
              src="https://arweave.net/L1pQvT0yUb--UjJZYoYHMSrdcIDrY-kh1QSpYA0pZHg"
              alt="Den Joose Sign"
            />
          </div>
          {/* bg-red-400 */}
          {/* Den Table And Chair And Playt Button*/}
          <div
            className="absolute w-full h-full flex flex-col  items-center justify-end z-0"
            style={{
              ...calculatePositionAndSize(51, 91, 53),
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="relative w-full flex flex-col items-center">
              <div className="relative">
                {/* Play Button */}

                <div
                  style={{ top: "47%", left: "37%", width: "24%", zIndex: 1 }}
                  className=" absolute"
                >
                  <ImgButton
                    src={
                      "https://arweave.net/p6Ct2aj2EgGGzXoMGGVBlnQ75YP-EH_YeKLMl4pyYAE"
                    }
                    onClick={handleClick}
                    alt={"Play Button"}
                    disabled={false}
                    className=""
                  />
                </div>

                {/* Den Table and Chair */}
                <img
                  src="https://arweave.net/6Qk-lI4-2y-Yr23Lw7EbvFWgAanEgbvg0ET42jeBYdM"
                  alt="Den Table and Chair"
                  className="relative w-full"
                  style={{ height: "auto" }}
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

function BlackjackGame() {
  const {
    currentRound,
    enterNewBlackjack,
    getOpenBlackjackRounds,
    placeBet,
    blackjackInfo,
    hit,
    doubleDown,
    stand,
    userIsReadyForBlackjack,
    setBlackjackStart,
  } = useBlackjackStore();
  const { user   } = useGameStore();

  const { data: newMessages, refetch: refetchBattleUpdates } = useQuery({
    queryKey: [`newMessages-${currentRound?.id}`],
    queryFn: async () => {
      console.log("refetching blackjack round updates");
      await blackjackInfo();
      return [];
    },
    enabled: !!currentRound?.id && !currentRound?.ended,
    refetchInterval: 1000, // Poll every 1 second
  });

  return (
    <div className="h-screen relative">
      {currentRound?.ended && (
        <div className="z-20 absolute bottom-16 ml-6 w-60 ">
          <NewButton
            className="px-3 py-3 text-2xl"
            onClick={() => {
              setBlackjackStart(false);
            }}
            alt="Return to Den"
          />
        </div>
      )}

      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img
            src={
              "https://arweave.net/cGEJFKDsbiLbRlT3DR8bnf2UJ1_NjmLt_6GNAcw7i1o"
            }
            alt="Den Blackjack Background"
            className="w-full h-full"
          />
        </div>

        {/* {Array.isArray(currentRound?.players)
          ? currentRound.players.length > 0 &&
            currentRound.players[0]?.user_id === user?.id.toString() &&
            !currentRound.players[0]?.betPlaced && <BettingAmount />
          : currentRound?.players &&
            Object.entries(currentRound.players).map(([key, player]) =>
              player.user_id === user?.id.toString() && !player.betPlaced ? (
                <BettingAmount key={key} />
              ) : <></>
            )} */}
        {currentRound &&
          user &&
          !currentRound.players[user.id.toString()].betPlaced && (
            <BettingAmount />
          )}

        <BlackjackPlaying />
        <div className="absolute inset-0 z-0">
          <div
            className="absolute w-full h-full flex flex-col  items-center justify-end"
            style={{
              ...calculatePositionAndSize(50, 38, 23),
              transform: "translate(-50%, -100%)",
              height: "95%",
            }}
          >
            <div
              className="relative"
              style={{
                maxWidth: "150vw", // Responsive size, adjust as needed
                width: "100%",
                top: "2%",
                aspectRatio: 1, // Keeps the shopkeeper square,
              }}
            >
              <RiveAnimation url={BUILDING_IMAGES.DEN_DUMDUM} />
            </div>
          </div>
        </div>
        <div className="z-10 absolute bottom-0 right-4">
          <div className="mb-6">
            <InventoryBag />
          </div>
          {/* <NewButton onClick={() => {}} className="py-3 w-56 text-2xl bottom-0 left-4" alt="Blackjack Chat"></NewButton> */}
        </div>
      </div>
    </div>
  );
}

const activeUsers = [
  {
    image: "https://arweave.net/",
    username: "cryptoCherie",
    bet_amount: "30",
  },
];

function BlackjackPlaying() {
  const {
    currentRound,
    enterNewBlackjack,
    getOpenBlackjackRounds,
    placeBet,
    blackjackInfo,
    hit,
    doubleDown,
    stand,
    userIsReadyForBlackjack,
  } = useBlackjackStore();
  const { user } = useGameStore();

  const remainingTimeOfRound = currentRound?.created_at
    ? 60 - (Date.now() - currentRound?.created_at) / 1000
    : 60;

  return (
    <>
      {/* Players in the game */}
      <div className="text-white grid grid-cols-3 bg-[#37242A] w-[28%] h-[19%] rounded-[35px] z-10 absolute top-6 left-8 place-items-center">
        {currentRound?.players &&
          Object.entries(currentRound.players).map(([key, player]) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center w-full"
            >
              <img
                src={
                  player.nft_address
                    ? `https://arweave.net/${player.nft_address}`
                    : "https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"
                }
                alt="Content Image"
                className="w-[35%] h-[35%] object-contain"
              />
              <h1 className="text-lg mb-1 text-center">{player.name}</h1>
              <h1 className="text-lg text-center">BET</h1>
              <h1 className="text-lg text-center">{player.betAmount}g</h1>
            </div>
          ))}
      </div>

      {/* Dealer hands */}
      <div className="z-0 absolute rotate-180 top-1/3 left-[52%] transform -translate-x-1/2">
        {/* Dealer's Cards */}
        <div className="flex gap-2 w-auto m-10 left-1/2">
          {currentRound?.dealer?.visibleCard?.map((val, key) => {
            const suit = val.suit as keyof typeof CARD_IMAGES;
            const rank =
              val.rank as keyof (typeof CARD_IMAGES)[keyof typeof CARD_IMAGES];

            return (
              <img
                key={key}
                src={CARD_IMAGES[suit][rank]}
                className="w-[95px] h-[135px]" // Fixed size for each card
                alt={`${rank} of ${suit}`}
              />
            );
          })}

          {/* Dealer's Hidden Card */}
          <img
            src={
              currentRound?.dealer?.hiddenCard
                ? CARD_IMAGES[
                    currentRound.dealer.hiddenCard
                      .suit as keyof typeof CARD_IMAGES
                  ][
                    currentRound.dealer.hiddenCard
                      .rank as keyof (typeof CARD_IMAGES)[keyof typeof CARD_IMAGES]
                  ]
                : CARD_IMAGES.Back
            }
            className="w-[95px] h-[135px]" // Fixed size
            alt="Hidden Card"
          />
        </div>
      </div>

      {/* Deck Image */}
      <img
        src={CARD_IMAGES.deck}
        className="w-28 absolute right-[30%] bottom-[48%]"
      />

      {!currentRound?.ended ? (
        <p className="absolute right-[41%] bottom-[40%] text-white text-3xl">
          {" "}
          {Math.ceil(remainingTimeOfRound < 0 ? 0 : remainingTimeOfRound)}{" "}
          seconds remaining{" "}
        </p>
      ) : (
        <p className="absolute right-[41%] bottom-[40%] text-white text-3xl">
          {" "}
          {JSON.stringify(currentRound?.winner)} Win{" "}
        </p>
      )}
      {/* Players' Hands */}
      {currentRound?.players &&
        Object.entries(currentRound.players).map(
          ([playerId, player], index) => {
            const isCurrentUser = player.user_id === user?.id.toString();
            const positionClass = isCurrentUser
              ? "absolute bottom-40 left-1/2 transform -translate-x-1/2"
              : index % 2 === 0
              ? "absolute top-[48%] left-[26%] transform -translate-x-1/2"
              : "absolute top-[48%] right-[10%] transform -translate-x-1/2";

            return (
              <div key={player.user_id} className={positionClass}>
                {player.cards.length > 0 ? (
                  <div className="flex gap-2 w-auto m-10 left-1/2">
                    {player.cards.map((card, key) => {
                      const suit = card.suit as keyof typeof CARD_IMAGES;
                      const rank =
                        card.rank as keyof (typeof CARD_IMAGES)[keyof typeof CARD_IMAGES];

                      return (
                        <img
                          key={key}
                          src={CARD_IMAGES[suit][rank]}
                          className="w-[95px] h-[135px]" // Fixed size for each card
                          alt={`${rank} of ${suit}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <img
                    src={CARD_IMAGES.Back}
                    alt="Back of Card"
                    className="w-[50px] h-[70px]"
                  />
                )}
              </div>
            );
          }
        )}

      {/* Controls */}
      <div className="absolute bottom-52 right-[40%] text-2xl z-10">
        {user?.id && currentRound?.players && currentRound.players[user.id.toString()] && (
          <>
            <NewButton
              varient="blue"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await stand();
              }}
              disabled={
                !currentRound.players[user.id.toString()].betPlaced ||
                currentRound.players[user.id.toString()].hasDoubleDown ||
                currentRound.ended
              }
              alt="Stand"
              className="px-12 py-2"
            />
            <NewButton
              varient="blue"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await hit();
              }}
              disabled={
                !currentRound.players[user.id.toString()].betPlaced ||
                currentRound.players[user.id.toString()].hasDoubleDown ||
                currentRound.players[user.id.toString()].hasBust ||
                currentRound.players[user.id.toString()].hasStood ||
                currentRound.ended
              }
              alt="Hit"
              className="px-16 py-2 mr-52"
            />
            <NewButton
              varient="blue"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await doubleDown();
              }}
              disabled={
                !currentRound.players[user.id.toString()].betPlaced ||
                currentRound.players[user.id.toString()].hasDoubleDown ||
                currentRound.players[user.id.toString()].hasBust ||
                currentRound.players[user.id.toString()].hasStood ||
                currentRound.ended
              }
              alt="Double Down"
              className="w-52 relative -left-[21rem] mt-16 py-2"
            />
          </>
        )}
      </div>
    </>
  );
}

function CardsRenderer({
  firstCard,
  secondCard,
  className,
}: {
  firstCard: string;
  secondCard: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 w-44 m-10 left-1/2 ${className}`}>
      <img src={firstCard} className={``} />
      <img src={secondCard} className={`ml-2`} />
    </div>
  );
}

function BettingAmount() {
  const {
    currentRound,
    enterNewBlackjack,
    getOpenBlackjackRounds,
    placeBet,
    blackjackInfo,
    hit,
    doubleDown,
    stand,
    userIsReadyForBlackjack,
    setBlackjackStart
  } = useBlackjackStore();

  const [inputValue, setInputValue] = useState<number | undefined>(undefined);
  const placingBet = async (betAmount: number) => {
    // const result = await placeBet(betAmount);
    // if (result?.status == "Success") await userIsReadyForBlackjack();
    await placeBet(betAmount);
    await userIsReadyForBlackjack();
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await placingBet(inputValue as number);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="z-40 bg-white bg-center px-[120px] py-[20px] pb-20 absolute bottom-32 left-1/2 transform -translate-x-1/2 rounded-xl">
        <div className="absolute top-4 right-4">
          <ImgButton
            src={
              "https://arweave.net/T2yq7k38DKhERIR4Mg3UBwp8G6IzfAjl0UXidNjrOdA"
            }
            onClick={() => {setBlackjackStart(false)}}
            alt={"Exit Quantity Input"}
          />
        </div>
        <div className="flex flex-col items-center w-min pb-10 pt-5">
          <h1 className="text-center text-6xl leading-tight mb-10">
            How much Gold are you betting?
          </h1>
          <div className="relative">
            <Input
              aria-label="Amount"
              type="number"
              className="h-[37px] w-[153px] text-center text-4xl bg-no-repeat bg-left border-none focus-visible:ring-0 mb-14"
              value={inputValue}
              placeholder="5-20g"
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  value = Math.max(5, Math.min(20, value));
                  setInputValue(value);
                } else {
                  setInputValue(undefined);
                }
              }}
              style={{
                width: "calc(153px * 2.5)",
                height: "calc(37px * 2)",
                backgroundImage:
                  "url('https://arweave.net/Z73AkQ5HVh-YIxK8whhA04e-f_AAUoaYY2UjIkYm1A8')",
                backgroundSize: "100% 100%",
              }}
            />
            <div className="absolute left-[112%]">
            <NewButton
              onClick={handleConfirm}
              disabled={isProcessing || !inputValue}
              className={`bg-center ${isProcessing ? `px-[100px]`: `px-32`} py-4 text-3xl absolute`}
              alt={isProcessing ? 'Processing...' : 'Confirm'}
            />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
