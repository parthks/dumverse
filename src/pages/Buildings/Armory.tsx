import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import Rive from "@rive-app/react-canvas";

export default function Armory() {
  const { shop, getShop, buyItem } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

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
            style={{ ...calculatePositionAndSize(20, 86, 15), transform: "translate(-50%, -50%)" }}
          />

          {/* Group the shop table, sign, and shopkeeper */}
          <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 48), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/kcuv5Ifubl1oQ66gyRGfFusQfX9cm61RNwf1_Upsnl4" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />
            <div style={{ width: "200px", height: "200px" }} className="absolute left-1/2 h-auto -translate-x-1/2 -translate-y-[221%]">
              <RiveShopKeeper />
            </div>
            {/* <Rive
              className="absolute left-1/2 w-1/5 h-auto -translate-x-1/2 -translate-y-[242%]"
              src="https://public.rive.app/hosted/156163/191181/jwmTWZadb0eu_4gcTDnVow.riv"
            /> */}
            {/* <img
              src={BUILDING_IMAGES.YELLOW_SHOPKEEPER}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "20%", height: "auto", transform: "translate(-50%, -242%)" }}
            /> */}
            <img
              src="https://arweave.net/w2uP86Q1l0ErsqM2KkMh_0s02XOMaknUvuFOtrKy86Q"
              alt="Hammer on Table"
              className="absolute"
              style={{ left: "50%", width: "20%", height: "auto", transform: "translate(20%, -310%)" }}
            />
          </div>
          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
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
                shopBuyItemAudio.play();
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
                shopBuyItemAudio.play();
              }}
              position={{
                x: 75,
                y: 30,
              }}
              item={shop.items[2]}
            />
          )}
          {shop?.items[3] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[3], shop.items[3]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 75,
                y: 60,
              }}
              item={shop.items[3]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export const RiveShopKeeper = () => {
  const { RiveComponent } = useRive({
    // Load a local riv `clean_the_car.riv` or upload your own!
    src: "/character.riv",
    // Be sure to specify the correct state machine (or animation) name
    // This is optional.Provides additional layout control.
    layout: new Layout({
      fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent />;
};
