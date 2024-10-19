import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveShopKeeper } from "@/components/buildings/RiveShopkeeper";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export default function Weapon() {
  const { shop, getShop, buyItem } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  useBuildingMusic({ getBuildingData: () => getShop("WEAPON") });

  //   if (!shop) return <div>Loading...</div>;

  //   console.log("shop", shop.items);
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
          <img src={"https://arweave.net/8LmZ0u-eK5Ir3bUrF-iSne58cmgPelPcQHWTlMd7f58"} alt="Weapon Shop Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0">
          <div className="absolute" style={{ ...calculatePositionAndSize(0, 58, 85), transform: "translate(0, 0)" }}>
            <img
              src="https://arweave.net/EDiX5PbGtPOVHgMxlACk2js538D13biYdlt-cAgzpK0"
              alt="Table"
              className="absolute"
              style={{ ...calculatePositionAndSize(0, 42, 50), transform: "translate(0, 0)" }}
            />
            <img
              src={"https://arweave.net/yu4aXRJJyfe0VuwVn6nz2y3mQZE2X0XzVYHr9ujuXlo"}
              alt="Tool"
              className="absolute"
              style={{ ...calculatePositionAndSize(10, 92, 8), transform: "translate(0, 50%)" }}
            />
            <img
              src={"https://arweave.net/fzYzWusAIwQxrtTLVYV_jtGUlNu9LXACcn7wNseUIuw"}
              alt="Saw"
              className="absolute"
              style={{ ...calculatePositionAndSize(32, 92, 11), transform: "translate(0, 65%)" }}
            />
          </div>
          {/* Group the shop table and shopkeeper */}
          <div className="absolute w-full h-full flex flex-col items-center justify-end" style={{ ...calculatePositionAndSize(50, 100, 48), transform: "translate(-50%, -100%)" }}>
            {/* Shopkeeper and Table Group */}
            <div className="relative w-full flex flex-col items-center">
              {/* Shopkeeper */}
              <div
                className="relative"
                style={{
                  maxWidth: "12vw", // Responsive size, adjust as needed
                  width: "100%",
                  top: "0",
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveShopKeeper url={BUILDING_IMAGES.ARMOR_WEAPON_DUMDUM} />
              </div>

              {/* Shop Table */}
              <img src="https://arweave.net/wlkWadmmnZ5YLvSauURaPMTzmK4fTjbxoc4CH9Q8IH8" alt="Shop Table" className="relative w-full" style={{ height: "auto" }} />
            </div>
          </div>
          {/* <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 57), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/3GlvzzIUvPyYQHQj0UHDNLCBEAL5ZlMoEb-G2aeLqCQ" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />

            <img
              src={BUILDING_IMAGES.WEAPON_DEALER}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "55%", height: "auto", transform: "translate(-50%, -141%)" }}
            />
          </div> */}
          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 12,
                y: 35,
              }}
              item={shop.items[0]}
              itemSize={100}
            />
          )}
          {shop?.items[1] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[1], shop.items[1]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 37,
                y: 35,
              }}
              item={shop.items[1]}
              itemSize={100}
            />
          )}
          {shop?.items[2] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[2], shop.items[2]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 62,
                y: 35,
              }}
              item={shop.items[2]}
              itemSize={100}
            />
          )}
          {shop?.items[3] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[3], shop.items[3]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 87,
                y: 35,
              }}
              item={shop.items[3]}
              itemSize={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
