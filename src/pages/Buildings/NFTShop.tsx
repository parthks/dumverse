import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export default function NFTShop() {
  const { shop, getShop } = useGameStore();

  useBuildingMusic({ getBuildingData: () => getShop("SPECIAL_ITEMS") });

  //   if (!shop) return <div>Loading...</div>;

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
          <img src={"https://arweave.net/wfQru_Ld-BGs6sq4qbKtlP6EBUYZXAAZ42mIqJQjaIM"} alt="NFT Shop Background" className="w-full h-full object-cover" />
        </div>

        <img
          src="https://arweave.net/TI0VqS8uw1bGEXB_Ew4Wl37asj-OqvS4-poR5zURri8"
          alt="Curtains"
          className="absolute"
          style={{ ...calculatePositionAndSize(0, 0, 100), transform: "translate(0, 0%)" }}
        />

        {/* <img
          src="https://arweave.net/s0RQ9YQlFx8DF6HL1x3vDXkFdTaie_Car2v5tZE7hNw"
          alt="Poles"
          className="absolute"
          style={{ ...calculatePositionAndSize(50, 10, 100), transform: "translate(-50%, 100%)" }}
        /> */}

        <div className="absolute inset-0">
          {/* Group the shop table, sign, and shopkeeper */}
          <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 50), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/f1jPz7nKfZyBs58BP7AJwu9lKqk1hFCDlf0zlrJ1Iv0" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />
            <img
              src={BUILDING_IMAGES.YELLOW_SHOPKEEPER}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "25%", height: "auto", transform: "translate(-100%, -174%)" }}
            />
            <img
              src="https://arweave.net/cEcCrEw9Wtbtc6EQIXUb6GcosDuvOjtV-9haQhovHXM"
              alt="Cat"
              className="absolute"
              style={{ left: "50%", width: "50%", height: "auto", transform: "translate(25%, -126%)" }}
            />
          </div>
          {/* {shop.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 30,
                y: 25,
              }}
              item={shop.items[0]}
            />
          )} */}
          {/* {shop.items[1] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[1], shop.items[1]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 30,
                y: 55,
              }}
              item={shop.items[1]}
            />
          )} */}
        </div>
      </div>
    </div>
  );
}
