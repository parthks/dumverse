import { ITEM_ICONS, IMAGES, ITEM_IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { GameUser, Inventory } from "@/types/game";
import ImgButton from "../ui/imgButton";
import { useState } from "react";

const GREEN_BACKGROUND_IMAGE =
  "https://arweave.net/O-OZtrbU4HPCUpTVK89Qac9Olnhr2zTA1Cdt6-cq1hs";
const YELLOW_BACKGROUND_IMAGE =
  "https://arweave.net/zGg61zm00agq-bzVbsQ6fGwTuIjf9ZXx8C_i42trCx8";
const RED_BACKGROUND_IMAGE =
  "https://arweave.net/wXW7B2jcYEn-f_2KblzzUUdohONNX1HA5UfhZkviMek";

type InventoryBagData = GameUser & {
  weapon: Inventory | undefined;
  armor: Inventory | undefined;
};

type InventoryBagProps = {
  combatInventoryUserData?: GameUser;
  combatInventory?: boolean;
  hideArmor?: boolean;
};
export function InventoryBag({
  combatInventoryUserData,
  combatInventory = false,
  hideArmor = false,
}: InventoryBagProps) {
  const { user } = useGameStore();
  console.log(user);
  if (!user) return null;
  const { weapon, armor } = getEquippedItem(user);
  const userData = combatInventoryUserData ?? user;
  return (
    <InventoryBagRender
      data={{ ...userData, weapon, armor }}
      combatInventory={combatInventory}
    />
  );
}

export function InventoryBagWithoutArmor() {
  const user = useGameStore((state) => state.user);
  const data = user;
  const inventory = data?.inventory;
  const potion1 =
    inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 =
    inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 =
    inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  if (!user) return null;
  return (
    <div
      className="w-[250px] relative flex flex-col gap-2 bg-[url('https://arweave.net/uX_S6BJXzoBFTJ7_HgNocqf-ryhAuIZk12RMII6t8Ac')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "25%",
          right: "28%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-xl mr-2 text-white">
            {data?.gold_balance.toLocaleString()}
          </label>
          <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5" />
        </div>
      </div>

      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "38%",
          right: "28%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-xl mr-2 text-white">
            {data?.dumz_balance.toLocaleString()}
          </label>
          <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5" />
        </div>
      </div>

      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "51%",
          right: "28%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-xl mr-2 text-white">{0}</label>
          <img src={IMAGES.TRUNK_ICON} alt="Trunk" className="w-5" />
        </div>
      </div>

      <div
        className="flex justify-center items-baseline"
        style={{
          position: "absolute",
          width: "50%",
          top: "73%",
          bottom: "0%",
          right: "0%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex flex-col items-center mr-5 gap-1">
          <img
            src={
              "https://arweave.net/9Brag6Pwu1j9dmEtGbnKxfjSa7o_hC4PlOdb5IlGHlM"
            }
            alt="Energy"
            className="w-7"
          />
          <label className="text-xl text-white">{energy1}</label>
        </div>

        <div className="flex flex-col items-center mr-5 gap-1">
          <img
            src={
              "https://arweave.net/qB5Hw-HzW1olR_XtD5nh9vTU9UjFmHg8i1l1bYvj21c"
            }
            alt="Food"
            className="w-10"
          />
          <label className="text-xl text-white mb-2">{food1}</label>
        </div>

        <div className="flex flex-col items-center gap-1">
          <img
            src={
              "https://arweave.net/KdHX03BPfIVtwP7LMGhProTFRB7muBEns_BpsG4zoYQ"
            }
            alt="Potion"
            className="w-7"
          />
          <label className="text-xl text-white">{potion1}</label>
        </div>
      </div>
    </div>
  );
}

function InventoryBagRender({
  data,
  combatInventory,
}: {
  data: InventoryBagData;
  combatInventory: boolean;
}) {
  if (!data) return null;

  const inventory = data?.inventory;
  const potion1 =
    inventory?.filter((item) => item.item_id === "POTION_1").length ?? 0;
  const energy1 =
    inventory?.filter((item) => item.item_id === "ENERGY_1").length ?? 0;
  const food1 =
    inventory?.filter((item) => item.item_id === "FOOD_1").length ?? 0;

  const weapon = data.weapon;
  const armor = data.armor;

  return (
    <div
      className="w-[250px] relative flex flex-col gap-2 bg-[url('https://arweave.net/uX_S6BJXzoBFTJ7_HgNocqf-ryhAuIZk12RMII6t8Ac')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <div
        className="flex justify-center"
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
        }}
      >
        <div className="flex flex-col items-center mr-2">
          <UserWeaponItem item={weapon} itemType="weapon" />
        </div>

        <div className="flex flex-col items-center ml-2">
          <UserWeaponItem item={armor} itemType="armor" />
        </div>
      </div>

      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "46%",
          right: "24%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">
            {data?.gold_balance.toLocaleString()}
          </label>
          <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5" />
        </div>
      </div>

      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "55%",
          right: "24%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">
            {data?.dumz_balance.toLocaleString()}
          </label>
          <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5" />
        </div>
      </div>

      <div
        className="flex items-center justify-end"
        style={{
          position: "absolute",
          top: "64%",
          right: "24%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{0}</label>
          <img src={IMAGES.TRUNK_ICON} alt="Trunk" className="w-5" />
        </div>
      </div>

      <div
        className="flex items-baseline justify-center"
        style={{
          position: "absolute",
          width: "50%",
          top: "79%",
          bottom: "0%",
          right: "0%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {!combatInventory && (
          <>
            <div className="flex flex-col items-center mr-5 gap-1">
              <img
                src={
                  "https://arweave.net/9Brag6Pwu1j9dmEtGbnKxfjSa7o_hC4PlOdb5IlGHlM"
                }
                alt="Energy"
                className="w-5 "
              />
              <label className="text-sm text-white">{energy1}</label>
            </div>

            <div className="flex flex-col items-center mr-5 gap-1">
              <img
                src={
                  "https://arweave.net/qB5Hw-HzW1olR_XtD5nh9vTU9UjFmHg8i1l1bYvj21c"
                }
                alt="Food"
                className="w-8"
              />
              <label className="text-sm text-white mb-2">{food1}</label>
            </div>
          </>
        )}

        <div className="flex flex-col items-center gap-1">
          <img
            src={
              "https://arweave.net/KdHX03BPfIVtwP7LMGhProTFRB7muBEns_BpsG4zoYQ"
            }
            alt="Potion"
            className="w-5"
          />
          <label className="text-sm text-white">{potion1}</label>
        </div>
      </div>
    </div>
  );
}

// for weapon and armor
export function UserWeaponItem({
  item,
  size = "small",
  itemType,
  repair = false,
}: {
  item: Inventory | undefined;
  size?: "bigger" | "medium" | "small";
  itemType: "weapon" | "armor";
  repair?: boolean;
}) {
  const user = useGameStore((state) => state.user!);
  const [loading, setLoading] = useState(false);
  const repairItem = useGameStore((state) => state.repairItem);
  const healthPercentage = item
    ? Math.round((item.item_health / item.total_item_health) * 100)
    : undefined;

  const noItemSize =
    size === "bigger"
      ? "w-12 h-12"
      : size === "medium"
      ? "w-10 h-10"
      : "w-8 h-8";
  const withItemSize =
    size === "bigger" ? "h-14" : size === "medium" ? "h-12" : "h-9";
  const itemSize =
    size === "bigger"
      ? "w-16 h-[70px]"
      : size === "medium"
      ? "w-10 h-12"
      : "w-10 h-12";

  const item_id = item?.item_id;
  const repairCost = item_id?.includes("1")
    ? 5
    : item_id?.includes("2")
    ? 10
    : item_id?.includes("3")
    ? 20
    : item_id?.includes("4")
    ? 30
    : 0;

  return (
    <div className="flex flex-col gap-2 items-center justify-between">
      <div
        className={`relative 
        ${itemSize}`}
      >
        {item ? (
          <>
            <img
              src={healthPercentage && healthPercentage > 50 ? GREEN_BACKGROUND_IMAGE : healthPercentage && healthPercentage > 10 ? YELLOW_BACKGROUND_IMAGE : RED_BACKGROUND_IMAGE}
              alt="weapon background"
              className="absolute w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center">
              <img src={ITEM_IMAGES[item.item_id as keyof typeof ITEM_IMAGES]} alt="weapon in inventory" className={`${withItemSize}`} />
              <p className="text-white text-sm">
                {item.item_health}/{item.total_item_health}
              </p>
            </div>
          </>
        ) : (
          <div
            className={`w-full h-full flex justify-center items-center bg-[#2b3233] ${
              itemType === "weapon" ? "p-2" : "p-0"
            } rounded-sm`}
          >
            <img
              src={
                itemType === "weapon"
                  ? ITEM_ICONS.NO_WEAPON
                  : ITEM_ICONS.NO_ARMOR
              }
              alt="no weapon"
              className={noItemSize}
            />
          </div>
        )}
      </div>
      {item && repair && (
        <>
          <ImgButton
            disabled={
              loading ||
              user.dumz_balance < repairCost ||
              (item && item.item_health === item.total_item_health)
            }
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
            src={
              "https://arweave.net/bqlsq9KfNty-8KdyKJlWFbsxu9E3Zn6budhs3IluRGk"
            }
            alt="Repair weapon"
            className="w-36"
          />
          <div className="flex flex-row items-center justify-center mt-2">
            <p className="text-white text-xl">Cost - {repairCost}</p>
            <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-6 h-6 ml-2" />
          </div>
        </>
      )}
    </div>
  );
}
