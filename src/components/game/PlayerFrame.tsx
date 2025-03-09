import { IMAGES } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { InventoryBagWithoutArmor, UserWeaponItem } from "./InventoryBag";

export function PlayerFrame() {
  const user = useGameStore((state) => state.user);
  const inventory = useGameStore((state) => state.inventory);
  const regenerateCountdown = useGameStore((state) => state.regenerateCountdown);
  const setQuestBookOpen = useGameStore((state) => state.setQuestBookOpen);
  const inventoryBagOpen = useGameStore((state) => state.inventoryBagOpen);
  const setInventoryBagOpen = useGameStore((state) => state.setInventoryBagOpen);

  if (!user) return null;
  const totalStamina = user.total_stamina;
  const filledStamina = user.stamina;
  const { weapon, armor } = getEquippedItem(inventory);

  return (
    <div
      className="w-[650px] bg-no-repeat bg-contain relative"
      style={{
        // transform: "scale(0.9)",
        transformOrigin: "top left",
        textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
        backgroundImage: "url('https://arweave.net/RhDUAUjP3fKp4uQ4m-4pbaLYCwW5kgcH5by_wrlbw3Y')",
        aspectRatio: "883 / 276",
      }}
    >
      <div className={`absolute left-[0%] ${user.nft_address ? "top-[1%] h-[100%]" : "top-[16%] h-[75%]"} w-[30%]  flex items-center justify-center overflow-hidden`}>
        <img src={user.nft_address ? `https://arweave.net/${user.nft_address}` : IMAGES.DEFAULT_DUMDUM} alt="User Avatar" className="object-contain max-w-full max-h-full" />
      </div>

      <div className="absolute left-[33%] top-[2%] flex flex-col justify-between">
        <div className="text-white text-2xl font-bold w-[200px] text-center truncate">{user.name}</div>
      </div>
<div className="absolute left-[25%] -bottom-2">
<div
      className="h-[60px] relative flex items-center justify-center bg-[url('https://arweave.net/_oRB35FU7hBYFv_Bdw00VJRYsZsFHUyApkgg2WiRsaI')] bg-no-repeat bg-contain bg-center "
      style={{ aspectRatio: "74/78"}}
    >
<img src="https://arweave.net/Aq2iLM2oZ8QnEiTmzY0cEUP4X4KHNYDUgL74F-DYKto" alt="Small Pet UI PlayerFrame" className="w-10"/>

      </div>
</div>
     

      <div className="absolute w-[480px] top-[20%] h-[100px] left-[31%] flex flex-col">
        <div className="flex items-center">
          <div className="relative mr-4">
            <img src={"https://arweave.net/TztZ9vkeLpTvkVWjCEkV8HnJncb6i-6lo66kZN2r5Fg"} alt="Health" className="w-20" />
            <p className="absolute top-3 left-0 right-0 text-center text-white text-xl font-bold">
              {user.health}/{user.total_health}
            </p>
          </div>
          <UserWeaponItem repair={false} size="small" item={weapon} itemType="weapon" />
          <p className="mx-2"></p>
          <UserWeaponItem repair={false} size="small" item={armor} itemType="armor" />
          <div className=" ml-4 flex flex-col gap-2 items-center justify-between">
            <label className="text-white text-xl font-bold">
              Dmg <span className="ml-2">{user.damage}</span>
            </label>
            <label className="text-white text-xl font-bold">
              Def <span className="ml-2">{user.defense}</span>
            </label>
          </div>
          
        </div>

        {/* stamina */}
        <div className="flex flex-col gap-1">
  <div className={`${totalStamina > 9 ? "grid grid-cols-8 mb-2 max-w-[220px] ml-[6%]" : "flex gap-1 max-w-[320px]"}`}>
    {Array.from({ length: totalStamina }).map((_, index) => (
      <img 
        className={totalStamina > 9 ? "h-7" : "h-10"} 
        key={index} 
        src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} 
        alt="Stamina" 
      />
    ))}
  </div>
  
  {/* Regeneration countdown */}
  {user.total_stamina != user.stamina && regenerateCountdown && (
    <label className={`text-[#66D7F8] font-bold ${totalStamina > 9 ? "-translate-y-[50%] translate-x-[5%] text-md" : "text-xl   translate-x-[5%]"}`}>
      {Math.ceil(regenerateCountdown / 60)} min to next regen...
    </label>
  )}
</div>


      </div>

      <div className="w-[8%] absolute right-[21%] bottom-[10%] flex gap-2">
 <img 
  src="https://arweave.net/Z0HomJIgsr4nL23MZSdPoSJHzcf5KtQEQkq4vCCEnAM" 
  alt="Quest Book" 
  onClick={() => setQuestBookOpen(true)}
  className="transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
/>

<img 
  src="https://arweave.net/LAWtMvFCxPHtwNLOisKWOxL6IpQ3_74J4Fy27y20KLA" 
  alt="Small Backpack Rest Area" 
  onClick={() => setInventoryBagOpen(!inventoryBagOpen)} 
  className="transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
/>          </div>

      {/* <div className="absolute top-[-25%] left-[82%]">
        <InventoryBagWithoutArmor />
      </div> */}
    </div>
  );
}

// Old shit dammmmmm
// const imageWidth = 1089; // original map width
// const imageHeight = 611; // original map height
// // TODO: If name is bigger than input, then truncate it and add ...
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
