import { useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { getEquippedItem } from "@/lib/utils";
import { IMAGES, ITEM_ICONS, ITEM_IMAGES, SOUNDS } from "@/lib/constants";
import { useRef, useState } from "react";
import { UserWeaponItem } from "./InventoryBag";

export default function RestAreaBag({ onClose }: { onClose: () => void }) {
  const { user, consumeItem } = useGameStore();
  const [consumeItemLoading, setConsumeItemLoading] = useState(false);
  const drinkPotionAudioRef = useRef<HTMLAudioElement>(null);
  const drinkJooseAudioRef = useRef<HTMLAudioElement>(null);
  const eatCakeAudioRef = useRef<HTMLAudioElement>(null);

  if (!user) return null;

  const inventory = user.inventory;
  const potion1 = inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 = inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 = inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  const { weapon, armor } = getEquippedItem(user);

  const handleItemClick = async (item_type: string) => {
    const inventoryId = inventory?.find((item) => item.item_id === item_type)?.id;
    if (!inventoryId) return;
    setConsumeItemLoading(true);
    await consumeItem(inventoryId);
    if (item_type === "POTION_1") {
      drinkPotionAudioRef.current?.play();
    } else if (item_type === "ENERGY_1") {
      drinkJooseAudioRef.current?.play();
    } else if (item_type === "FOOD_1") {
      eatCakeAudioRef.current?.play();
    }
    setConsumeItemLoading(false);
  };

  return (
    <div
      className="h-[100vh] w-[100vw] relative flex flex-col gap-2 bg-[url('https://arweave.net/DbU1JV6vG2wV9WP1h-UmIpsSPs0knHEGeBkxt0hEVTQ')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <audio preload="auto" ref={drinkPotionAudioRef} src={SOUNDS.DRINK_POTION_AUDIO} />
      <audio preload="auto" ref={drinkJooseAudioRef} src={SOUNDS.DRINK_JOOSE_AUDIO} />
      <audio preload="auto" ref={eatCakeAudioRef} src={SOUNDS.EAT_CAKE_AUDIO} />

      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="flex w-[500px] mt-12 flex-col items-center justify-center">
          {/* <h2 className="text-5xl text-white font-bold">{user.name}</h2> */}

          <div className="flex w-full px-16 gap-4 flex-col items-center justify-between">
            {[
              { type: "FOOD_1", count: food1 },
              { type: "ENERGY_1", count: energy1 },
              { type: "POTION_1", count: potion1 },
            ].map((item, index) => (
              <div key={item.type} className="flex w-full gap-4 flex-row items-center justify-between">
                <div className="w-24 h-24 flex items-center justify-center">
                  <img src={ITEM_IMAGES[item.type as keyof typeof ITEM_IMAGES]} alt={item.type.split("_")[0]} className="max-w-full max-h-full object-contain" />
                </div>
                <label className="text-4xl mr-1 text-white w-16 text-center">{item.count}</label>
                <ImgButton
                  src={`${index == 0 ? "https://arweave.net/LfpZof3_me6FSWiy6Q6KIITa1T5YLofyfcRDiyjxtig" : "https://arweave.net/C2T6giS9wZu9mU4niqEHcPP6AIR-tDIHYs9neT_kRR0"}`}
                  alt={`Use ${item.type.split("_")[0]}`}
                  disabled={consumeItemLoading || item.count == 0}
                  onClick={() => handleItemClick(item.type)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-row gap-16 justify-between mt-4 align-baseline">
            {/* <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-16 h-16 bg-white p-2" />
              <label className="text-2xl mr-1 text-white">{"Weapon"}</label> */}
            <UserWeaponItem repair item={weapon} bigger itemType="weapon" />
            {/* <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="w-16 h-16 bg-white p-2" /> */}
            {/* <label className="text-2xl mr-1 text-white">{"Armor"}</label> */}
            <UserWeaponItem repair item={armor} bigger itemType="armor" />
          </div>

          <div className="flex w-full mt-4 px-8 flex-row justify-between items-baseline">
            <div className="flex flex-col gap-4 items-end justify-between">
              <div className="flex items-center justify-between">
                <div className="flex justify-center items-center">
                  <label className="text-2xl mr-1 text-white">{user?.dumz_balance.toLocaleString()} $Dumz</label>
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
                  <label className="text-2xl mr-1 text-white">{user?.gold_balance.toLocaleString()}g</label>
                  <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-8 " />
                </div>
              </div>
            </div>
          </div>

          <ImgButton className="mt-4" src="https://arweave.net/VzQVXdUSJOvPsXvwHfaXTwoKqDH6siG3A8qCliKmrLQ" onClick={onClose} alt="Close Bag" />
        </div>
      </div>
    </div>
  );
}
