import { ITEM_ICONS, IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const GREEN_BACKGROUND_IMAGE = "https://arweave.net/O-OZtrbU4HPCUpTVK89Qac9Olnhr2zTA1Cdt6-cq1hs";

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
      className="w-[250px] relative flex flex-col gap-2 bg-[url('https://arweave.net/uX_S6BJXzoBFTJ7_HgNocqf-ryhAuIZk12RMII6t8Ac')] bg-no-repeat bg-contain bg-center p-4"
      style={{ aspectRatio: "392/425" }}
    >
      <div className="flex justify-center" style={{ position: "absolute", top: "21%", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
        <div className="flex flex-col items-center mr-2">
          <div className="relative">
            <div className={`w-10 h-10 flex justify-center items-center ${weapon ? "bg-transparent" : "bg-white"}`}>
              <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-10 h-10 z-10 p-1" />
              {weapon && <img src={GREEN_BACKGROUND_IMAGE} alt="weapon background" className="absolute w-10 h-10" />}
            </div>
            {weapon && <p className="text-white text-sm text-center">40/40</p>}
          </div>
        </div>

        <div className="flex flex-col items-center ml-2">
          <div className="relative">
            <div className={`w-10 h-10 flex justify-center items-center ${armor ? "bg-transparent" : "bg-white"}`}>
              <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="w-10 h-10 z-10 p-1" />
              {armor && <img src={GREEN_BACKGROUND_IMAGE} alt="armor background" className="absolute w-10 h-10 inset-0" />}
            </div>
            {armor && <p className="text-white text-sm text-center">40/40</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "48%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{user?.gold_balance.toLocaleString()}g</label>
          <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "57%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{user?.dumz_balance.toLocaleString()} $tDumz</label>
          <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-end" style={{ position: "absolute", top: "66%", right: "24%", transform: "translateY(-50%)" }}>
        <div className="flex justify-center items-center">
          <label className="text-sm mr-1 text-white">{0} $Trunk</label>
          <img src={IMAGES.TRUNK_ICON} alt="Trunk" className="w-5" />
        </div>
      </div>

      <div className="flex items-center justify-between" style={{ position: "absolute", width: "50%", bottom: "0%", right: "0%", transform: "translate(-50%, -50%)" }}>
        <div className="flex flex-col items-center">
          <label className="text-sm text-white">{energy1}</label>
          <img src={"https://arweave.net/9Brag6Pwu1j9dmEtGbnKxfjSa7o_hC4PlOdb5IlGHlM"} alt="Energy" className="w-5" />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-white">{food1}</label>
          <img src={"https://arweave.net/qB5Hw-HzW1olR_XtD5nh9vTU9UjFmHg8i1l1bYvj21c"} alt="Food" className="w-8" />
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm text-white">{potion1}</label>
          <img src={"https://arweave.net/KdHX03BPfIVtwP7LMGhProTFRB7muBEns_BpsG4zoYQ"} alt="Potion" className="w-5" />
        </div>
      </div>
    </div>
  );
}
