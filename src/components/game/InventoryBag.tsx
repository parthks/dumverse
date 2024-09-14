import { ITEM_ICONS, IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export function InventoryBag() {
  const { user } = useGameStore();
  console.log(user);
  if (!user) return null;

  const inventory = user?.inventory;
  const potion1 = inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 = inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 = inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  const { weapon, armor } = getEquippedItem(user);

  return (
    <div
      className="w-[250px] relative flex flex-col gap-2 bg-[url('https://arweave.net/4XqXLlFNmQaIJQwLPoyz0XkMk8QNqpq8PduFvgh4CRM')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <div className="flex items-center justify-between" style={{ position: "absolute", top: "32.5%", left: "38%", transform: "translate(-50%, -50%)" }}>
        <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-6 h-6" />
      </div>
      <div className="flex items-center justify-between" style={{ position: "absolute", top: "32.5%", left: "62%", transform: "translate(-50%, -50%)" }}>
        <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="w-6 h-6" />
      </div>
      <div className="flex items-center justify-between" style={{ position: "absolute", top: "55%", right: "10%", transform: "translate(-50%, -50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-lg mr-1 text-white">{user?.gold_balance.toLocaleString()}g</label>
          <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ position: "absolute", top: "65%", right: "0%", transform: "translate(-50%, -50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-lg mr-1 text-white">{user?.dumz_balance.toLocaleString()} $tDumz</label>
          <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ position: "absolute", width: "50%", bottom: "0%", right: "0%", transform: "translate(-50%, -50%)" }}>
        <label className="text-lg ml-1 mr-1 text-white">{energy1}</label>
        <label className="text-lg mr-1 text-white">{food1}</label>
        <label className="text-lg mr-1 text-white">{potion1}</label>
      </div>
    </div>
  );
}
