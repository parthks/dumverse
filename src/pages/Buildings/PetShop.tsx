import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";
import GifComponent from "@/components/Dialogue/Dialogue";
import { sleep } from "@/lib/time";
import { SOUNDS, CARD_IMAGES } from "@/lib/constants";
import audioManager from "@/utils/audioManager";
import NewButton from "@/components/ui/NewButton";
import ImgButton from "@/components/ui/imgButton";

export default function PetShop() {
  const { shop, getShop, setGameStatePage, petsOwned, equippedPet, buyItemLoading, buyPet } =
    useGameStore();

  useBuildingMusic({ getBuildingData: () => getShop("PET") });
  console.log("Petshop Shop: " + JSON.stringify(shop), "::::::: ", JSON.stringify(petsOwned));
  const [showExitButton, setShowExitButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExitButton(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

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
      {/* <div className="z-10 absolute bottom-4 right-4 ">
        <InventoryBag />
      </div> */}

      <div className="relative w-full h-full ">
        <div className="absolute inset-0">
          <img
            src={
              "https://arweave.net/cepoJO-bLC5eShnUkoBwJtxTM8A0McOjEfpLpydBkxs"
            }
            alt="Pet Shop Map"
            className="w-full h-full  "
          />
        </div>
        <div className="absolute inset-0">
          {/* Group the Pet Shop DumDum on the counter and Pet Shop Counter */}
          <div
            className="absolute w-full h-full flex flex-col  items-center justify-end"
            style={{
              ...calculatePositionAndSize(48, 57, 40),
              //   transform: "translate(50%, -100%)",
              height: "auto",
            }}
          >
            <div className="relative w-full h-full flex flex-col">
              {/* Pet Shop DumDum On The Counter */}
              <div
                className="relative"
                style={{
                  maxWidth: "15vw", // Responsive size, adjust as needed
                  width: "100%",
                  top: "2%",
                  aspectRatio: 1, // Keeps the shopkeeper square
                  transform: "translateY(44%) translateX(80%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveAnimation url={BUILDING_IMAGES.PET_SHOP_DUMDUM} />
              </div>

              {/* Pet Shop Counter */}
              <div className="relative">
                <img
                  src="https://arweave.net/W3uLJGIuik73AeX3R1SvvZmzvKJA6zhuTpDNyNEnrlo"
                  alt="Pet Shop Counter"
                  className="relative w-full h-full"
                  style={{ height: "auto" }}
                  // className="absolute "
                  // style={{ ...calculatePositionAndSize(14, 80, 28) }}
                />
              </div>
            </div>
          </div>
          {/* Pet Shop Window */}
          {/* <div
            className="absolute w-full h-full"
            style={{
              ...calculatePositionAndSize(53.5, 42, 26),
              transform: "translate(-50%, -100%)",
            }}
          >
            <img
              src="https://arweave.net/OtCWzeGlhcHr4KuRc7fgRUiz4E4PAbCbd4gkbAdLwXg"
              alt="Pet Shop Window"
            />
          </div> */}

          <div>

          {shop?.items.map((item, index) => {
  // Check if user already owns this pet
  const isPetOwned = petsOwned?.some(pet => pet.pet_id === item.id);
  
  // Define positions for each pet (maintaining the original layout)
  const positions = [
    { bottom: "6%", right: "11%" },      // Doge Puppy
    { bottom: "3%", left: "44%" },       // Faithful Fox
    { bottom: "34.5%", left: "10%" },    // Tiny Turtle
    { bottom: "2%", left: "10%" },       // Bold Badger
    { top: "25%", right: "10.5%" },      // Diligent Duck
    { bottom: "34%", right: "10.5%" },   // Rascally Rabbit
    { top: "20%", left: "46%" },         // Mighty Mouse
    { top: "28.5%", left: "10%" }        // Grumpy Cat
  ];
  
  return (
    <div 
      key={item.id}
      className="absolute flex flex-col items-center justify-center"
      style={positions[index]}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl">{item.name}</h1>
        <h1 className="text-white text-2xl">{item.gold_price}g</h1>
      </div>
      <ImgButton
        disabled={isPetOwned || buyItemLoading}
        src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
        alt={`Buy ${item.name}`}
        data-item-type={item.id}
        onClick={async () => {
          await buyPet(item, item.gold_price ? "GOLD" : "TICKET");
          audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
        }}
        className=""
      />
    </div>
  );
})}

          </div>
        </div>
      </div>
    </div>
  );
}
