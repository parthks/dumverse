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
          <div className="absolute w-full h-full flex flex-col items-center justify-end" style={{ ...calculatePositionAndSize(50, 100, 48), transform: "translate(-50%, -100%)" }}>
            {/* Shopkeeper and Table Group */}
            <div className="relative w-full flex flex-col items-center">
              {/* Shopkeeper */}
              <div
                className="relative"
                style={{
                  maxWidth: "12vw", // Responsive size, adjust as needed
                  width: "100%",
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveShopKeeper />
              </div>

              {/* Shop Table */}
              <img src="https://arweave.net/5OR4ryz5M-JLTF7rRUWPXD6s8_LM1o4KF_CgZ10_D9Q" alt="Shop Table" className="relative w-full" style={{ height: "auto" }} />

              {/* Hammer on Table */}
              {/* <img
                src="https://arweave.net/w2uP86Q1l0ErsqM2KkMh_0s02XOMaknUvuFOtrKy86Q"
                alt="Hammer on Table"
                className="absolute"
                style={{
                  left: "50%",
                  width: "10%", // Adjust as needed for responsiveness
                  height: "auto",
                  transform: "translate(-50%, -100%)", // Keep it centered and positioned above the table
                }}
              /> */}
            </div>
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
    src: "/unhappy.riv",
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
