import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export default function Bakery() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  useBuildingMusic({ getBuildingData: () => getShop("FOOD") });

  // if (!shop) return <div>Loading...</div>;

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
          <img src={"https://arweave.net/MbOnj-2PBp9wZ2V4GAalLQuNhxoornEzQMR5OJMvlxc"} alt="Bakery Map" className="w-full h-full object-cover" />
        </div>
        <img
          src="https://arweave.net/9RVWczCj2AjG6XAf5ZNF88x8lWaotD5hN7HpaQbB4B0"
          alt="Bakery Table"
          className="absolute bottom-[20%] left-0 right-0 w-full"
          style={{ height: "auto", objectFit: "contain" }}
        />
        <div className="absolute inset-0">
          <img
            src="https://arweave.net/SKW3ovBgOtAP4K8WrnP3tARXnpZRVgguzxSvb6FznHI"
            alt="Bakery Sign"
            className="absolute"
            style={{ ...calculatePositionAndSize(50, 30, 25), transform: "translate(-50%, -100%)" }}
          />

          {/* Group the shop table, sign, and shopkeeper */}
          <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 80), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/sgg2-WUXqkerD-EO494aFydCX0InP2tuWXuFMdt6N-8" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />

            <img
              src={BUILDING_IMAGES.YELLOW_SHOPKEEPER}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "15%", height: "auto", transform: "translate(-75%, -235%)" }}
            />
          </div>

          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 20,
                y: 30,
              }}
              item={shop.items[0]}
            />
          )}
          {shop?.items[1] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[1], shop.items[1]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 80,
                y: 30,
              }}
              item={shop.items[1]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
