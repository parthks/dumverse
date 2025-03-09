import { useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { getEquippedItem } from "@/lib/utils";
import { IMAGES, ITEM_ICONS, ITEM_IMAGES, SOUNDS } from "@/lib/constants";
import { useRef, useState } from "react";
import { UserWeaponItem } from "./InventoryBag";
import audioManager from "@/utils/audioManager";
import {  Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
export default function CombatAreaBag() {
    const { user, consumeItem, inventory, inventoryBagOpen, setInventoryBagOpen } = useGameStore();
    const [consumeItemLoading, setConsumeItemLoading] = useState(false);
    const drinkPotionAudioRef = useRef<HTMLAudioElement>(null);
    const drinkJooseAudioRef = useRef<HTMLAudioElement>(null);
    const eatCakeAudioRef = useRef<HTMLAudioElement>(null);
  
    if (!user) return null;
  
    // const inventory = user.inventory;
    const potion1 = inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
    const energy1 = inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
    const food1 = inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;
  
    const { weapon, armor } = getEquippedItem(inventory);
  
    const handleItemClick = async (item_type: string) => {
      const inventoryId = inventory?.find((item) => item.item_id === item_type)?.id;
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
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Semi-transparent overlay to let the sea background show through */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div
          className="w-full h-full relative z-50 flex flex-col gap-2 bg-[url('https://arweave.net/4VTvQTWHM0cKHiNCazxhX8ehtdDQLA9hE77V5U1KIuo')] bg-no-repeat bg-contain bg-center p-4"
          style={{ aspectRatio: "1081/1066", maxWidth: "90vw", maxHeight: "90vh" }}
        >
          <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="flex w-[500px] mt-12 flex-col items-center justify-center">
              <div className="w-full flex justify-around items-center inset-x-0 pr-4">
                <div className="flex w-[50%] gap-4 flex-col items-center justify-between">
                  {[
                    { type: "FOOD_1", count: food1 },
                    { type: "ENERGY_1", count: energy1 },
                    { type: "POTION_1", count: potion1 },
                  ].map((item, index) => (
                    <div
                      key={item.type}
                      className="flex w-full gap-10 flex-row items-center justify-center"
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
                    </div>
                  ))}
                </div>
                <div
                  className="h-[250px] relative flex flex-col bg-[url('https://arweave.net/Jd2TZnGt7Ai_Tfc6885pujthtJxPyJ_nt-Iq0cLBXHU')] bg-no-repeat bg-contain bg-center px-3 pt-2 justify-around"
                  style={{
                    aspectRatio: "162/218",
                    textShadow:
                      "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                  }}
                >
                  <img
                    src={`https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY`}
                    alt="Pet - Open Bagpack"
                    className="w-full max-h-[226px] object-contain"
                  />{" "}
                  <h2 className="text-white text-2xl font-bold text-center">
                    +1 Def
                  </h2>
                </div>
              </div>
  
              <div className="flex flex-row gap-16 justify-between mt-4 align-baseline my-16">
                <UserWeaponItem
                  repair
                  item={weapon}
                  size="bigger"
                  itemType="weapon"
                />
                <UserWeaponItem
                  repair
                  item={armor}
                  size="bigger"
                  itemType="armor"
                />
              </div>
  
              <div className="flex w-full px-8 flex-row justify-between items-baseline">
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
                      <label className="text-2xl mr-1 text-white">{0} Trunk</label>
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
  
              <ImgButton
                className="mt-4"
                src="https://arweave.net/VzQVXdUSJOvPsXvwHfaXTwoKqDH6siG3A8qCliKmrLQ"
                onClick={()=>setInventoryBagOpen(!inventoryBagOpen)}
                alt="Close Bag"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  