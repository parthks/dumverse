import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import ImgButton from "@/components/ui/imgButton";
import { BUILDING_IMAGES } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { useState } from "react";
import GifComponent from "@/components/Dialogue/Dialogue";

export default function Den() {
  const { shop, getShop, buyItem, buyItemLoading, acceptDenQuest} = useGameStore();

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
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
      <div className="z-10 absolute bottom-4 right-4 ">
        <InventoryBag />
      </div>

      <div className="relative w-full h-full ">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/df4TyUlYX8wpMnz-k73yi8sA-0Jk4V-GkkKGPm3Cn-I"} alt="Den Map" className="w-full h-full  " />
        </div>
        <div className="absolute inset-0">
          {/* bg-red-600 */} {/* Group the Den DumDum on the counter, Den Counter and 2 x Two Joose on the Shelf */}
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
              <div className="relative w-full h-full flex flex-col gap-5" style={{ top: "3%" }}>
                {/* Two Joose On The Shelf */}
                <div className=" w-ful flex flex-col items-center relative" style={{ left: "-15%" }}>
                  <div className="flex gap-12  relative" style={{ left: "18px" }}>
                    <img src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y" alt="Joose" style={{ width: "20%" }} />
                    <img src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y" alt="Joose" style={{ width: "20%" }} />
                  </div>
                  <img src="https://arweave.net/nQ03-odZ-vC30jHjueS3UT3XcmKpPeuC8gcWaZS0ZXs" alt="Shelf " style={{ width: "60%", height: "35%" }} />
                </div>
                {/* Two Joose On The Shelf */}
                <div className=" w-ful flex flex-col items-center relative" style={{ left: "-15%" }}>
                  <div className="flex gap-12  relative" style={{ left: "18px" }}>
                    <img src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y" alt="Joose" style={{ width: "20%" }} />
                    <img src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y" alt="Joose" style={{ width: "20%" }} />
                  </div>
                  <img src="https://arweave.net/nQ03-odZ-vC30jHjueS3UT3XcmKpPeuC8gcWaZS0ZXs" alt="Shelf " style={{ width: "60%", height: "35%" }} />
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
                className="absolute h-[20vh] translate-x-[13vw] translate-y-[29vh] z-30"
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
            <img src="https://arweave.net/OtCWzeGlhcHr4KuRc7fgRUiz4E4PAbCbd4gkbAdLwXg" alt="Den Window" />
          </div>
          {/* Den Joose Sign */}
          <div
            className="absolute w-full h-full"
            style={{
              ...calculatePositionAndSize(83, 33, 15),
              transform: "translate(-50%, -100%)",
            }}
          >
            <img src="https://arweave.net/L1pQvT0yUb--UjJZYoYHMSrdcIDrY-kh1QSpYA0pZHg" alt="Den Joose Sign" />
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

                <div style={{ top: "47%", left: "37%", width: "24%", zIndex: 1 }} className=" absolute">
                  <ImgButton src={"https://arweave.net/p6Ct2aj2EgGGzXoMGGVBlnQ75YP-EH_YeKLMl4pyYAE"} onClick={handleClick} alt={"Play Button"} className="" />
                </div>

                {/* Den Table and Chair */}
                <img src="https://arweave.net/6Qk-lI4-2y-Yr23Lw7EbvFWgAanEgbvg0ET42jeBYdM" alt="Den Table and Chair" className="relative w-full" style={{ height: "auto" }} />
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
          <img src={"https://arweave.net/cGEJFKDsbiLbRlT3DR8bnf2UJ1_NjmLt_6GNAcw7i1o"} alt="Den Blackjack Background" className="w-full h-full" />
        </div>
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
