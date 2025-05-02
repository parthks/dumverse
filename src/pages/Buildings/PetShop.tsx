import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, IMAGES, PET_LARGE_CARD_IMAGE } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";
import GifComponent from "@/components/Dialogue/Dialogue";
import { sleep } from "@/lib/time";
import { SOUNDS, CARD_IMAGES } from "@/lib/constants";
import audioManager from "@/utils/audioManager";
import NewButton from "@/components/ui/NewButton";
import ImgButton from "@/components/ui/imgButton";
import CombatAreaBag from "@/components/game/CombatAreaBag";

export default function PetShop() {
  const { shop, getShop, buyItem, setGameStatePage,inventoryBagOpen,setInventoryBagOpen, petsOwned, equippedPet, buyItemLoading, buyPet } =
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

  const [openPetShop, setOpenPetShop] = useState(false);
  const [openBag, setOpenBag] = useState(false);

  return (
    <div className="h-screen relative">
      <div className="z-20 absolute bottom-[7%] left-[280px]">
        {/* <ExistToTownButton /> */}
        <NewButton
          className="py-2 px-20 text-2xl"
          // src={
          //   "https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"
          // }
          src={"Exit"}
          onClick={async () => {
            audioManager.playSFX(SOUNDS.BUILDING_ENTER);
            await sleep(750);
            setGameStatePage(GameStatePages.SECOND_TOWN);
          }}
          alt={"Pet Shop Exit"}
        />
      </div>
      {/* <div className="z-10 absolute bottom-4 right-4 ">
        <InventoryBag />
      </div> */}

      <div className="relative w-full h-full ">
        <div className="absolute inset-0">
          <img
            src={
              "https://arweave.net/gZKSbL2uIDQP8Oxaxry3-lgsbzjEJJW82oE1Yigf2sw"
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

{
  !openPetShop && !inventoryBagOpen && <div className="absolute left-[55%] top-[63%]">
  <NewButton
              varient="blue"
              className="px-8 py-3 text-3xl"
         
              src="Shop"
              alt="Pet Shop"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenPetShop(true);
                setInventoryBagOpen(true);
              }}
            />
  </div>
  
} 
 
 {inventoryBagOpen && !openPetShop && (
         <div className="absolute z-30 top-0 left-0 w-full h-full">
           <CombatAreaBag/>
         </div>
       )}

          <div>

       {/* Main content: Pet Shop (left) and Bag (right) */}
  <div className="absolute inset-0 flex items-center justify-center z-10">
    {/* Pet Shop Panel */}
    {openPetShop && shop && ( <>
      <div
        className="relative flex flex-col justify-start items-center"
        style={{
          width: "45vw",
          height: "85vh",
          background: "rgba(30, 30, 40, 0.92)",
          borderRadius: "32px",
          marginRight: "32px",
          boxShadow: "4px 0 32px 0 rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <ImgButton
          className="absolute top-4 right-4 z-40"
          src="https://arweave.net/d-XLB6fqEQsopfIvBAY_eeU5fu9dLhbWh2cipzJqqFM"
          alt="Close Shop"
          onClick={() => {setOpenPetShop(false); setInventoryBagOpen(false)}}
        />
        <h1 className="text-4xl text-white font-bold text-center py-6 underline">Pets</h1>
        <div className="flex-1 w-full overflow-y-auto px-6 pb-8 scrollbar-thin scrollbar-thumb-[#B8860B]/80 scrollbar-track-black">
          {shop.items.map((item) => {
            const isPetOwned = petsOwned?.some(pet => pet.pet_id === item.id);
            const PET_DESCRIPTIONS = {
              DOGE_PUPPY: "+1 Attack\nHelps you attack in battles",
              FAITHFUL_FOX: "Increase chance to run away (1-4 is now successful, instead of 1-3)",
              TINY_TURTLE: "+1 Defense\nHelps block attacks in battles",
              BOLD_BADGER: "+1 Defense\nHelps block attacks in battles",
              DILIGENT_DUCK: "Regenerates stamina faster",
              RASCALLY_RABBIT: "Gives you store discount",
              MIGHTY_MOUSE: "Special mouse hall ability",
              GRUMPY_CAT: "+1 Attack\nGrumpy but strong",
              PET_FOOD: "Make your pet happy!", 
            };
            return (
              <div
                key={item.id}
                className="flex items-center bg-black/40 rounded-xl mb-6 p-4 shadow-lg gap-[5%] pl-[10%]"
              >
                <img
                  src={PET_LARGE_CARD_IMAGE[item.id as keyof typeof PET_LARGE_CARD_IMAGE]}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg mr-6"
                />
                <div>
                  <h2 className="text-2xl text-white font-bold mb-1">{item.name}</h2>
                  <p className="w-48 text-lg text-yellow-200 whitespace-pre-line mb-2">{PET_DESCRIPTIONS[item.id as keyof typeof PET_DESCRIPTIONS]}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center mb-2">
                    <span className="text-xl text-white font-bold">{item.ticket_price || item.gold_price}</span>
                    <img src={item.ticket_price ? IMAGES.TICKET_ICON : IMAGES.GOLD_ICON} alt="Ticket" className="w-7 h-7 ml-2" />
                  </div>
                  <ImgButton
                    disabled={isPetOwned || buyItemLoading}
                    src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
                    alt={`Buy ${item.name}`}
                    data-item-type={item.id}
                    onClick={async () => {
                      if (item.id == "PET_FOOD") {
                         await buyItem(item, "GOLD");
                      }else {
                        await buyPet(item,"TICKET");
                      }
                      audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
                    }}
                    className={`mt-1 ${isPetOwned ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <div>
                  {isPetOwned && (
                    <span className="ml-4 text-green-300 font-semibold">Owned</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    

    {/* Bag Panel */}
    {inventoryBagOpen && (
      <div className="relative flex flex-col justify-start items-center"
        style={{
          width: "45vw",
          height: "95vh",
          overflow: "hidden",
        }}>
        <CombatAreaBag isOpen={inventoryBagOpen} />
      </div>
    )}</>)}
  </div>

<div  className="absolute bottom-2 right-4 z-10">
<div
      className="h-[90px] relative flex item-center justify-center bg-[url('https://arweave.net/0qIHaitffvIgUAqGcFa1Ea9-xJGh2nER-rjgJ23giMo')] bg-no-repeat bg-contain bg-center px-3 py-1"
      style={{ aspectRatio: "224/114", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}
    >

<img 
  src="https://arweave.net/LAWtMvFCxPHtwNLOisKWOxL6IpQ3_74J4Fy27y20KLA" 
  alt="Small Backpack Rest Area" 
  onClick={() => setInventoryBagOpen( !inventoryBagOpen )} 
  className="transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
/>


            </div>
</div>


          </div>
        </div>
      </div>
    </div>
  );
}
