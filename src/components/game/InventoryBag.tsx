import { ITEM_ICONS, IMAGES, ITEM_IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { GameUser, Inventory } from "@/types/game";
import ImgButton from "../ui/imgButton";
import { useState } from "react";

const GREEN_BACKGROUND_IMAGE = "https://arweave.net/O-OZtrbU4HPCUpTVK89Qac9Olnhr2zTA1Cdt6-cq1hs";
const YELLOW_BACKGROUND_IMAGE = "https://arweave.net/zGg61zm00agq-bzVbsQ6fGwTuIjf9ZXx8C_i42trCx8";
const RED_BACKGROUND_IMAGE = "https://arweave.net/wXW7B2jcYEn-f_2KblzzUUdohONNX1HA5UfhZkviMek";

type InventoryBagData = GameUser & {
  weapon: Inventory | undefined;
  armor: Inventory | undefined;
};

type InventoryBagProps = {
  combatInventoryUserData?: GameUser;
  combatInventory?: boolean;
};
export function InventoryBag({ combatInventoryUserData, combatInventory = false }: InventoryBagProps) {
  const { user } = useGameStore();
  console.log(user);
  if (!user) return null;
  const { weapon, armor } = getEquippedItem(user);
  const userData = combatInventoryUserData ?? user;
  return <InventoryBagRender data={{ ...userData, weapon, armor }} combatInventory={combatInventory} />;
}

function InventoryBagRender({ data, combatInventory }: { data: InventoryBagData; combatInventory: boolean }) {
  if (!data) return null;

  const inventory = data?.inventory;
  const potion1 = inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 = inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 = inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  const weapon = data.weapon;
  const armor = data.armor;
  const weaponHealthPercentage = weapon ? Math.round((weapon.item_health / weapon.total_item_health) * 100) : undefined;
  const armorHealthPercentage = armor ? Math.round((armor.item_health / armor.total_item_health) * 100) : undefined;

  return (
    <div
      className="w-[250px] relative flex flex-col gap-2 bg-[url('https://arweave.net/uX_S6BJXzoBFTJ7_HgNocqf-ryhAuIZk12RMII6t8Ac')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <div className="flex justify-center" style={{ position: "absolute", top: "21%", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
        <div className="flex flex-col items-center mr-2">
          <UserWeaponItem item={weapon} itemType="weapon" />
        </div>

        <div className="flex flex-col items-center ml-2">
          <UserWeaponItem item={armor} itemType="armor" />
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "48%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{data?.gold_balance.toLocaleString()}g</label>
          <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "57%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{data?.dumz_balance.toLocaleString()} $Dumz</label>
          <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "66%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{0} $Trunk</label>
          <img src={IMAGES.TRUNK_ICON} alt="Trunk" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-center" style={{ position: "absolute", width: "50%", bottom: "0%", right: "0%", transform: "translate(-50%, -50%)" }}>
        {!combatInventory && (
          <>
            <div className="flex flex-col items-center mr-5">
              <label className="text-sm text-white">{energy1}</label>
              <img src={"https://arweave.net/9Brag6Pwu1j9dmEtGbnKxfjSa7o_hC4PlOdb5IlGHlM"} alt="Energy" className="w-5" />
            </div>

            <div className="flex flex-col items-center mr-5">
              <label className="text-sm text-white">{food1}</label>
              <img src={"https://arweave.net/qB5Hw-HzW1olR_XtD5nh9vTU9UjFmHg8i1l1bYvj21c"} alt="Food" className="w-8" />
            </div>
          </>
        )}

        <div className="flex flex-col items-center">
          <label className="text-sm text-white">{potion1}</label>
          <img src={"https://arweave.net/KdHX03BPfIVtwP7LMGhProTFRB7muBEns_BpsG4zoYQ"} alt="Potion" className="w-5" />
        </div>
      </div>
    </div>
  );
}

// for weapon and armor
export function UserWeaponItem({ item, bigger = false, itemType }: { item: Inventory | undefined; bigger?: boolean; itemType: "weapon" | "armor" }) {
  const user = useGameStore((state) => state.user!);
  const [loading, setLoading] = useState(false);
  const repairItem = useGameStore((state) => state.repairItem);
  const healthPercentage = item ? Math.round((item.item_health / item.total_item_health) * 100) : undefined;

  return (
    <div className="flex flex-col gap-2 items-center justify-between">
      <div className={`relative w-${bigger ? "16" : "10"} h-${bigger ? "20" : "12"}`}>
        {item ? (
          <>
            <img
              src={healthPercentage && healthPercentage > 50 ? GREEN_BACKGROUND_IMAGE : healthPercentage && healthPercentage > 10 ? YELLOW_BACKGROUND_IMAGE : RED_BACKGROUND_IMAGE}
              alt="weapon background"
              className="absolute w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center">
              <img src={ITEM_IMAGES[item.item_id as keyof typeof ITEM_IMAGES]} alt="weapon in inventory" className={`h-${bigger ? "14" : "9"} p-1`} />
              <p className="text-white text-sm">
                {item.item_health}/{item.total_item_health}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-white rounded-sm">
            <img src={itemType === "weapon" ? ITEM_ICONS.NO_WEAPON : ITEM_ICONS.NO_ARMOR} alt="no weapon" className={`w-${bigger ? "12" : "8"} h-${bigger ? "12" : "8"}`} />
          </div>
        )}
      </div>
      {item && bigger && (
        <>
          <ImgButton
            disabled={loading || user.dumz_balance < 5 || (item && item.item_health === item.total_item_health)}
            onClick={async () => {
              setLoading(true);
              try {
                await repairItem(item.id);
              } catch (error) {
                console.error(error);
              } finally {
                setLoading(false);
              }
            }}
            src={"https://arweave.net/bqlsq9KfNty-8KdyKJlWFbsxu9E3Zn6budhs3IluRGk"}
            alt="Repair weapon"
            className="w-36"
          />
          <div className="flex flex-row items-center justify-center mt-2">
            <p className="text-white text-xl">Cost - 5</p>
            <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-6 h-6 ml-2" />
          </div>
        </>
      )}
    </div>
  );
}
