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

export default function Den() {
  const { getShop, acceptDenQuest, setGameStatePage } = useGameStore();

  useBuildingMusic({ getBuildingData: () => getShop("ENERGY") });

  const [showBlackjackGame, setShowBlackjackGame] = useState<boolean>(false);
  const [acceptQuestLoading, setAcceptQuestLoading] = useState(false);

  const handleClick = () => {
    setShowBlackjackGame(true);
  };

  if (showBlackjackGame) {
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
  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
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
        {/* <BettingAmount/> */}
        <BlackjackPlaying />
        <div className="absolute inset-0">
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
  {
    image: "https://arweave.net/",
    username: "DumDum",
    bet_amount: "25",
  },
  {
    image: "https://arweave.net/",
    username: "WhoKnows",
    bet_amount: "50",
  },
];

function BlackjackPlaying() {
  const nft_address = null;

  return (
    <>
      {/* players in the game */}

      <div className="text-white grid grid-cols-3 bg-[#37242A] w-[28%] h-[18%] rounded-[35px] p-3 z-10 absolute top-6 left-8">
        {activeUsers.map((user) => (
          <div className="flex flex-col items-center">
            <img
              src={
                nft_address !== null
                  ? `https://arweave.net/${nft_address}`
                  : "https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"
              }
              alt="Content Image"
              className="w-[30%] h-[34%]"
            />
            <h1 className="text-2xl mb-4">{user.username}</h1>
            <h1 className="text-2xl">BET</h1>
            <h1 className="text-2xl">{user.bet_amount}g</h1>
          </div>
        ))}
      </div>

      {/* dealer hands */}
      <div className="z-10 absolute rotate-180 top-1/3 left-[52%] transform -translate-x-1/2">
        <CardsRenderer
          firstCard={CARD_IMAGES.Back}
          secondCard={CARD_IMAGES.Spade.Jack}
        />
        <img
          src={CARD_IMAGES.deck}
          className="rotate-180 w-28 absolute right-72 bottom-10"
        />
      </div>
      {/* players hand */}
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
        <CardsRenderer
          firstCard={CARD_IMAGES.Diamond[2]}
          secondCard={CARD_IMAGES.Club.Jack}
        />
      </div>

      {/* left side player */}
      <div className=" absolute top-[48%] left-[26%] transform -translate-x-1/2">
        <CardsRenderer
          firstCard={CARD_IMAGES.Heart[7]}
          secondCard={CARD_IMAGES.Spade.Queen}
        />
      </div>

      {/* right side player */}
      <div className="absolute top-[48%] right-[10%] transform -translate-x-1/2">
        <CardsRenderer
          firstCard={CARD_IMAGES.Diamond[10]}
          secondCard={CARD_IMAGES.Spade.Ace}
        />
      </div>

      <div className="absolute bottom-40 right-1/3 text-2xl transform -translate-x-16">
        <NewButton onClick={() => {}} alt="Stand" className="px-12 py-2" />

        <NewButton onClick={() => {}} alt="Hit" className="px-16 py-2 mr-52" />

        <NewButton
          onClick={() => {}}
          alt="Double Down"
          className="w-52 relative -left-[21rem] mt-16 py-2"
        />
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
      <img src={secondCard} className={`ml-10`} />
    </div>
  );
}

function BettingAmount() {
  return (
    <>
      <div className="z-10 bg-white bg-center px-[120px] py-[20px] pb-20 absolute bottom-32 left-1/2 transform -translate-x-1/2 rounded-xl">
        <div className="absolute top-4 right-4">
          <ImgButton
            src={
              "https://arweave.net/T2yq7k38DKhERIR4Mg3UBwp8G6IzfAjl0UXidNjrOdA"
            }
            onClick={() => {}}
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
              className="h-[37px] w-[153px] text-center text-4xl bg-no-repeat bg-left border-none focus-visible:ring-0 mb-20"
              style={{
                width: "calc(153px * 2.5)",
                height: "calc(37px * 2)",
                backgroundImage:
                  "url('https://arweave.net/Z73AkQ5HVh-YIxK8whhA04e-f_AAUoaYY2UjIkYm1A8')",
                backgroundSize: "100% 100%",
              }}
            />
            <NewButton
              onClick={() => {}}
              className="bg-center px-20 py-4 text-3xl absolute transform mr-[36%] translate-x-1/2 -translate-y-1/2"
              alt="Confirm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
