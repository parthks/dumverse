import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveShopKeeper } from "@/components/buildings/RiveShopkeeper";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export default function Den() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  useBuildingMusic({ getBuildingData: () => getShop("ENERGY") });

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
                className="relative w-full h-full flex flex-col gap-5"
                style={{ top: "3%" }}
              >
                {/* Two Joose On The Shelf */}
                <div
                  className=" w-ful flex flex-col items-center relative"
                  style={{ left: "-15%" }}
                >
                  <div
                    className="flex gap-12  relative"
                    style={{ left: "18px" }}
                  >
                    <img
                      src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                      alt="Joose"
                      style={{ width: "20%" }}
                    />
                    <img
                      src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                      alt="Joose"
                      style={{ width: "20%" }}
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
                  className=" w-ful flex flex-col items-center relative"
                  style={{ left: "-15%" }}
                >
                  <div
                    className="flex gap-12  relative"
                    style={{ left: "18px" }}
                  >
                    <img
                      src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                      alt="Joose"
                      style={{ width: "20%" }}
                    />
                    <img
                      src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                      alt="Joose"
                      style={{ width: "20%" }}
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
                  top: "6%",
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveShopKeeper url={BUILDING_IMAGES.DEN_DUMDUM} />
              </div>
              {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              {/* Den Counter */}
              <div className="relative">
                <img
                  src="https://arweave.net/ZTj2H2rj4UbdPSTuzEmbW1N1jiFAxwpB27Ny21-zvA0"
                  alt="Den Counter"
                  className="relative w-full"
                  style={{ height: "auto", top: "0%" }}
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
              ...calculatePositionAndSize(50.5, 49, 26),
              transform: "translate(-50%, -100%)",
            }}
          >
            <img
              src="https://arweave.net/BuSrL39UbK-3tr8U3CTRNy5lOeljoZHreZLGaJ59IFQ"
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
          <div
            className="absolute w-full h-full flex flex-col  items-center justify-end"
            style={{
              ...calculatePositionAndSize(51, 100, 53),
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="relative w-full flex flex-col items-center">
              <div className="relative">
                {/* Joose */}
                <img
                  src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                  alt="Joose"
                  className="absolute"
                  style={{
                    left: "33%",
                    top: "24%",
                    width: "4%",
                    height: "auto",
                    zIndex: 1,
                  }}
                />
                {/* Joose */}
                <img
                  src="https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y"
                  alt="Joose"
                  className="absolute"
                  style={{
                    left: "57%",
                    top: "24%",
                    width: "4%",
                    height: "auto",
                    zIndex: 1,
                  }}
                />
                {/* Den Money On The Table */}
                <img
                  src="https://arweave.net/wLPY5keJuQkEEqJeL-pPV_SvzC4FwoivVblalsjNoYo"
                  alt="Den Money On The Table"
                  className="absolute"
                  style={{
                    left: "36%",
                    top: "22%",
                    width: "25%",
                    height: "auto",
                    zIndex: 1,
                  }}
                />
                {/* Den Table and Chair */}
                <img
                  src="https://arweave.net/uLMdqSRLJFYXnuMcQBx496dg6PX2Ri5tMBQgk31V6Hc"
                  alt="Den Table and Chair"
                  className="relative w-full"
                  style={{ height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
