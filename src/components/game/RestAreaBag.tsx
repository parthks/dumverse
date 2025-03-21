import { useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { getEquippedItem } from "@/lib/utils";
import { IMAGES, ITEM_ICONS, ITEM_IMAGES, SOUNDS, PET_LARGE_CARD_IMAGE } from "@/lib/constants";
import { useRef, useState } from "react";
import { UserWeaponItem } from "./InventoryBag";
import audioManager from "@/utils/audioManager";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Pet } from "@/types/game";

export default function RestAreaBag({ onClose }: { onClose: () => void }) {
  const { user, consumeItem, inventory, petsOwned } = useGameStore();
  const [consumeItemLoading, setConsumeItemLoading] = useState(false);
  const drinkPotionAudioRef = useRef<HTMLAudioElement>(null);
  const drinkJooseAudioRef = useRef<HTMLAudioElement>(null);
  const eatCakeAudioRef = useRef<HTMLAudioElement>(null);

  if (!user) return null;

  // const inventory = user.inventory;
  const potion1 =
    inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 =
    inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 =
    inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  const { weapon, armor } = getEquippedItem(inventory);

  const handleItemClick = async (item_type: string) => {
    const inventoryId = inventory?.find(
      (item) => item.item_id === item_type
    )?.id;
    if (!inventoryId) return;
    setConsumeItemLoading(true);
    await consumeItem(inventoryId);
    if (item_type === "POTION_1") {
      audioManager.playSFX(SOUNDS.DRINK_POTION_AUDIO);
    } else if (item_type === "ENERGY_1") {
      audioManager.playSFX(SOUNDS.DRINK_JOOSE_AUDIO);
    } else if (item_type === "FOOD_1") {
      audioManager.playSFX(SOUNDS.EAT_CAKE_AUDIO);
    }
    setConsumeItemLoading(false);
  };

  const equippedPet: Pet | null = petsOwned ? petsOwned.filter((pet: Pet) => pet.equipped === 1)[0] : null;

  return (
    <div
      className="h-[100vh] w-[100vw] relative flex flex-col gap-2 bg-[url('https://arweave.net/4VTvQTWHM0cKHiNCazxhX8ehtdDQLA9hE77V5U1KIuo')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "1081/1066" }}
    >
      {/* <audio preload="auto" ref={drinkPotionAudioRef} src={SOUNDS.DRINK_POTION_AUDIO} /> */}
      {/* <audio preload="auto" ref={drinkJooseAudioRef} src={SOUNDS.DRINK_JOOSE_AUDIO} /> */}
      {/* <audio preload="auto" ref={eatCakeAudioRef} src={SOUNDS.EAT_CAKE_AUDIO} /> */}

      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="flex w-[500px] mt-12 flex-col items-center justify-center">
          {/* <h2 className="text-5xl text-white font-bold">{user.name}</h2> */}

          <div className="w-full flex justify-around items-center inset-x-0">
            <div className="flex w-[50%] flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold text-white underline">
                Consumables
              </h1>
              <div className="w-full flex flex-col items-center justify-between">
                {[
                  { type: "FOOD_1", count: food1 },
                  { type: "ENERGY_1", count: energy1 },
                  { type: "POTION_1", count: potion1 },
                ].map((item, index) => (
                  <div
                    key={item.type}
                    className="flex w-full gap-4 flex-row items-center justify-between"
                  >
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img
                        src={ITEM_IMAGES[item.type as keyof typeof ITEM_IMAGES]}
                        alt={item.type.split("_")[0]}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <label className="text-4xl mr-1 text-white w-16 text-center">
                      {item.count}
                    </label>
                    <ImgButton
                      src={`${
                        index == 0
                          ? "https://arweave.net/LfpZof3_me6FSWiy6Q6KIITa1T5YLofyfcRDiyjxtig"
                          : "https://arweave.net/C2T6giS9wZu9mU4niqEHcPP6AIR-tDIHYs9neT_kRR0"
                      }`}
                      alt={`Use ${item.type.split("_")[0]}`}
                      disabled={consumeItemLoading || item.count == 0}
                      onClick={() => handleItemClick(item.type)}
                      className="w-64"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold text-white underline -translate-y-2">
                Pet
              </h1>
              <div
                className="h-[250px] relative flex flex-col bg-[url('https://arweave.net/Jd2TZnGt7Ai_Tfc6885pujthtJxPyJ_nt-Iq0cLBXHU')] bg-no-repeat bg-contain bg-center px-3 pt-2 justify-around"
                style={{
                  aspectRatio: "162/218",
                  textShadow:
                    "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                }}
              >
                
                <img
  src={equippedPet && equippedPet.pet_id in PET_LARGE_CARD_IMAGE 
    ? PET_LARGE_CARD_IMAGE[equippedPet.pet_id as keyof typeof PET_LARGE_CARD_IMAGE] 
    : "https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"}
  alt="Pet - Open Bagpack"
  className="w-full max-h-[70%] object-contain"
/>



                <h2 className="text-white text-2xl font-bold text-center">
                {equippedPet ? 
  (equippedPet.ability_type === "ATTACK" ? "+ 1 DMG" : 
   equippedPet.ability_type === "DEFENSE" ? "+ 1 DEF" : 
   equippedPet.ability_type === "RUN_AWAY" ? "+ RUN AWAY" : "")
  : ""
}

                </h2>
              </div>
            </div>
          </div>

          <div className="flex gap-16 items-start my-5">
            {/* <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-16 h-16 bg-white p-2" />
              <label className="text-2xl mr-1 text-white">{"Weapon"}</label> */}

            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold text-white underline -translate-y-1">
                Weapon
              </h1>{" "}
              <UserWeaponItem
                repair
                item={weapon}
                size="bigger"
                itemType="weapon"
              />
            </div>

            {/* <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="w-16 h-16 bg-white p-2" /> */}
            {/* <label className="text-2xl mr-1 text-white">{"Armor"}</label> */}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold text-white underline -translate-y-1">
                Armor
              </h1>{" "}
              <UserWeaponItem
                repair
                item={armor}
                size="bigger"
                itemType="armor"
              />{" "}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold text-white underline">
              Currencies
            </h1>
            <div className="flex w-full mt-4 px-8 flex-row justify-between items-baseline">
              <div className="flex flex-col gap-4 items-end justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex justify-center items-center">
                    <label className="text-2xl mr-1 text-white">
                      {user?.dumz_balance.toLocaleString()} $Dumz
                    </label>
                    <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-8" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex justify-center items-center">
                    <label className="text-2xl mr-1 text-white">
                      {0} Trunk
                    </label>
                    <img src={IMAGES.TRUNK_ICON} alt="Trunk" className="w-8 " />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 items-end justify-center">
                <div className="flex items-center justify-center">
                  <div className="flex justify-center items-center">
                    <label className="text-2xl mr-1 text-white">
                      {user?.gold_balance.toLocaleString()}g
                    </label>
                    <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-8 " />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ImgButton
            className="mt-4"
            src="https://arweave.net/VzQVXdUSJOvPsXvwHfaXTwoKqDH6siG3A8qCliKmrLQ"
            onClick={onClose}
            alt="Close Bag"
          />
        </div>
      </div>
    </div>
  );
}
