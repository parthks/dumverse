import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import GifComponent from "@/components/Dialogue/Dialogue";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import audioManager from "@/utils/audioManager";
import Rive from "@rive-app/react-canvas";

export default function Armory() {
  const { shop, getShop, buyItem } = useGameStore();

  useBuildingMusic({ getBuildingData: () => getShop("ARMOR") });

  // if (!shop) return <div>Loading...</div>;

  // console.log("shop", shop.items);
  //   sort shop.items on gold_price
  shop?.items.sort((a, b) => (a.gold_price || 0) - (b.gold_price || 0));

  return (
    <div className="h-screen relative" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/0lrK0cYegAtbwOQ9oFBFAKy_iqdxYhxWpSVx6c-h80M"} alt="Armory Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0">
          <img
            src="https://arweave.net/wmdmI7C7SJnGXHJVJwzmxy05ikTWEJPBPrqOr8WiUWE"
            alt="Fireplace"
            className="absolute"
            style={{ ...calculatePositionAndSize(0, 42, 30), transform: "translate(-30%, -50%)" }}
          />
          <img
            src="https://arweave.net/cOMnBf2OdYiEw4mP6YdW3itRyodIgMNf_IT2f-7SL7E"
            alt="Fireplace"
            className="absolute"
            style={{ ...calculatePositionAndSize(23, 100, 13), transform: "translate(-50%, -100%)" }}
          />

          {/* Group the shop table, sign, and shopkeeper */}
          <div className="absolute w-full h-full flex flex-col items-center justify-end" style={{ ...calculatePositionAndSize(50, 100, 48), transform: "translate(-50%, -100%)" }}>
            {/* Shopkeeper and Table Group */}
            <div className="relative w-full flex flex-col items-center">
              {/* Shopkeeper */}
              <div
                className="relative"
                style={{
                  maxWidth: "15vw", // Responsive size, adjust as needed
                  width: "100%",
                  top: "23px",
                  left: "-9%",
                  zIndex: 1,
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveAnimation url={BUILDING_IMAGES.ARMOR_WEAPON_DUMDUM} />
              </div>
              <GifComponent className="absolute h-[20vh] translate-x-[9vw] translate-y-[-1vh] z-50 scale-50" />

              {/* Shop Table */}
              <img src="https://arweave.net/C6LU2xgJ9oMwH8Ah7C-KdMGxJs6g6w76nXMpovYv7Ms" alt="Shop Table" className="relative w-full" style={{ height: "auto" }} />
            </div>
          </div>
          <div className="absolute w-full h-full -top-1/3 mt-8 flex items-center justify-center gap-4 scale-100 lg:scale-75 md:scale-75 sm:scale-75">
          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
              }}
              position={{
                x: 30,
                y: 30,
              }}
              item={shop.items[0]}
            />
          )}
          {shop?.items[1] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[1], shop.items[1]?.gold_price ? "GOLD" : "DUMZ");
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
              }}
              position={{
                x: 30,
                y: 60,
              }}
              item={shop.items[1]}
            />
          )}
          {shop?.items[2] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[2], shop.items[2]?.gold_price ? "GOLD" : "DUMZ");
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
              }}
              position={{
                x: 78,
                y: 30,
              }}
              item={shop.items[2]}
            />
          )}
          {shop?.items[3] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[3], shop.items[3]?.gold_price ? "GOLD" : "DUMZ");
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
              }}
              position={{
                x: 78,
                y: 60,
              }}
              item={shop.items[3]}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
