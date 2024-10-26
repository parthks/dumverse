import { ITEM_ICONS, IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { UserWeaponItem } from "./InventoryBag";

export function PlayerFrame() {
  const user = useGameStore((state) => state.user!);
  const regenerateCountdown = useGameStore((state) => state.regenerateCountdown);

  const totalHealth = user.total_health;
  const totalStamina = user.total_stamina;
  const filledHealth = user.health;
  const filledStamina = user.stamina;
  const { weapon, armor } = getEquippedItem(user);

  return (
    <div
      className="w-[750px] bg-no-repeat bg-contain relative"
      style={{
        backgroundImage: "url('https://arweave.net/N8LmY4lR7IsniufNgbFfuhN0Hd8FU1zqUVG0nuiNcLE')",
        aspectRatio: "1881 / 570",
      }}
    >
      <img
        src={user.nft_address ? `https://arweave.net/${user.nft_address}` : IMAGES.DEFAULT_DUMDUM}
        alt="User Avatar"
        className="absolute left-[1.5%] top-[4%] w-[30%] h-[83%] object-contain"
      />
      <div className="absolute left-[32%] top-[5%] flex flex-col justify-between">
        <div className="text-white text-xl font-bold">{user.name}</div>
      </div>
      <div className="absolute w-[480px] top-[25%] h-[100px] left-[31%] flex justify-between">
        {/* Health and stamina */}
        <div className="absolute left-0 top-[0%] flex flex-col gap-1">
          <div className="flex gap-2">
            {Array.from({ length: totalHealth }).map((_, index) => (
              <img className="w-8 h-8" key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" />
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalStamina }).map((_, index) => (
              <img className="h-10" key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
            ))}
          </div>
          {/* convert regenerateCountdown to minutes and seconds */}
          <div className="flex gap-2">
            {user.total_stamina != user.stamina &&
              (regenerateCountdown ? <label className="text-[#66D7F8] text-xl font-bold">{Math.ceil(regenerateCountdown / 60)} min to next regen...</label> : null)}
          </div>
        </div>
        {/* Equipped weapon and armor */}
        <div className="absolute right-0 top-[0%] flex flex-col items-end gap-2">
          <div className="flex gap-2 justify-center items-center">
            <label className="text-white text-xl font-bold">Equipped</label>

            <div className="flex gap-1 items-center mr-2">
              {/* <div className="bg-white p-1 w-12 h-12 rounded-md flex items-center justify-center">
                <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="" />
              </div> */}
              <UserWeaponItem item={weapon} itemType="weapon" />
              <label className="text-white text-xl font-bold">{user.damage}</label>
            </div>
            <div className="flex gap-1 items-center">
              {/* <div className="bg-white p-1 w-12 h-12 rounded-md flex items-center justify-center">
                <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="" />
              </div> */}
              <UserWeaponItem item={armor} itemType="armor" />
              <label className="text-white text-xl font-bold">{user.defense}</label>
            </div>
          </div>
          {/* Token Amounts */}
          <div className="flex flex-col gap-1 items-end">
            <div className="flex gap-2 justify-center items-center ">
              <label className="text-white text-xl font-bold">{user.gold_balance.toLocaleString()}g</label>
              <img src={IMAGES.GOLD_ICON} alt="Gold" className="w-5 h-5" />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <label className="text-white text-xl font-bold">{user.dumz_balance.toLocaleString()} $Dumz</label>
              <img src={IMAGES.DUMZ_ICON} alt="Dumz" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Old shit dammmmmm
// const imageWidth = 1089; // original map width
// const imageHeight = 611; // original map height
// function LoadUserDetails() {
//   const { user } = useGameStore();
//   if (!user) return null;

//   return (
//     <>
//       {/* Frame */}
//       <image
//         href="https://arweave.net/4R0tGBCQTI48nTu1z7n_EZBuXEqvKxvmcoQHHX6Z9hs"
//         x={0}
//         y={"73.8%"}
//         preserveAspectRatio="xMidYMid meet"
//         width={(1881 / imageWidth) * 100 * 0.285 + "%"}
//         height={(570 / imageHeight) * 100 * 0.285 + "%"}
//       />
//       <text x={`18%`} y={`80%`} height={"10%"} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" className="pointer-events-none">
//         {user.name}
//       </text>
//       <image
//         href={`https://arweave.net/${user.nft_address ? user.nft_address : IMAGES.DEFAULT_DUMDUM}`}
//         x={`-1.9%`}
//         y={`77.8%`}
//         width="20.3%"
//         height="20.3%"
//         preserveAspectRatio="xMidYMid meet"
//       />
//       <HealthBar />
//       <StaminaBar />
//       <Inventory />
//     </>
//   );
// }

// function HealthBar() {
//   const { user } = useGameStore();
//   if (!user) return null;

//   const totalHealth = getPlayerTotalHealth(user);
//   const filledHealth = user.health;
//   const emptyHealth = totalHealth - filledHealth;
//   const startX = 15;
//   const startY = 83;
//   const width = 4;
//   const height = 4;

//   const gap = 3;

//   return (
//     <>
//       {Array.from({ length: totalHealth }).map((_, index) => (
//         <image
//           key={index}
//           href={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH}
//           x={`${startX + index * gap}%`}
//           y={`${startY}%`}
//           width={`${width}%`}
//           height={`${height}%`}
//           preserveAspectRatio="xMidYMid meet"
//         >
//           <title>Heart</title>
//         </image>
//       ))}
//     </>
//   );
// }

// function StaminaBar() {
//   const { user } = useGameStore();
//   if (!user) return null;

//   const totalStamina = getPlayerTotalStamina(user);
//   const filledStamina = user.stamina;
//   const emptyStamina = totalStamina - filledStamina;
//   const startX = 14;
//   const startY = 87.5;
//   const width = 6;
//   const height = 6;

//   const gap = 2.5;

//   return (
//     <>
//       {Array.from({ length: totalStamina }).map((_, index) => (
//         <image
//           key={index}
//           href={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA}
//           x={`${startX + index * gap}%`}
//           y={`${startY}%`}
//           width={`${width}%`}
//           height={`${height}%`}
//           preserveAspectRatio="xMidYMid meet"
//         >
//           <title>Stamina</title>
//         </image>
//       ))}
//     </>
//   );
// }

// function Inventory() {
//   const { user } = useGameStore();
//   if (!user) return null;
//   const inventory = user.inventory;
//   const weapon1 = inventory.find((item) => item.item_id === "WEAPON_1");
//   const armor1 = inventory.find((item) => item.item_id === "ARMOR_1");

//   return (
//     <>
//       <text x={`38%`} y={`80%`} height={"10%"} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" className="pointer-events-none">
//         {"Equipped"}
//       </text>
//     </>
//   );
// }
