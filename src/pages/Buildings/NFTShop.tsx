import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveShopKeeper } from "@/components/buildings/RiveShopkeeper";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import ImgButton from "@/components/ui/imgButton";

export default function NFTShop() {
  const { shop, getShop, buyItem, buyItemLoading, inventory } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  useBuildingMusic({ getBuildingData: () => getShop("SPECIAL_ITEMS") });

  //   if (!shop) return <div>Loading...</div>;

  //   sort shop.items on gold_price
  shop?.items.sort((a, b) => (a.gold_price || 0) - (b.gold_price || 0));

  // const alreadyOwned = inventory.some((i) => i.item_id === item.id);

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
          <img
            src={
              "https://arweave.net/wfQru_Ld-BGs6sq4qbKtlP6EBUYZXAAZ42mIqJQjaIM"
            }
            alt="NFT Shop Background"
            className="w-full h-full object-cover"
          />
        </div>

        <img
          src="https://arweave.net/TI0VqS8uw1bGEXB_Ew4Wl37asj-OqvS4-poR5zURri8"
          alt="Curtains"
          className="absolute"
          style={{
            ...calculatePositionAndSize(0, 0, 100),
            transform: "translate(0, 0%)",
          }}
        />

        {/* <img
          src="https://arweave.net/s0RQ9YQlFx8DF6HL1x3vDXkFdTaie_Car2v5tZE7hNw"
          alt="Poles"
          className="absolute"
          style={{ ...calculatePositionAndSize(50, 10, 100), transform: "translate(-50%, 100%)" }}
        /> */}

        <div className="absolute inset-0">
          {/* Group the shop table, sign, and shopkeeper */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-end"
            style={{
              ...calculatePositionAndSize(50, 100, 48),
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Shopkeeper and Table Group */}
            <div className="relative w-full h-full flex flex-col items-center">
              {/* Shopkeeper */}
              <div
                className="absolute "
                style={{
                  maxWidth: "15vw", // Responsive size, adjust as needed
                  width: "100%",
                  top: "-69%",
                  aspectRatio: 1,
                  zIndex: 1,
                  // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveShopKeeper url={BUILDING_IMAGES.NFT_SHOP_DUMDUM} />
              </div>

              {/* Shop Table */}
              <img
                src="https://arweave.net/qfTKWVpHru4GihzJNGDL2datew4zgrQ-WTMPalkeEvo"
                alt="Shop Table"
                className="relative w-full"
                style={{ height: "auto" }}
              />
            </div>
          </div>

          {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <div
            className="absolute w-full h-full flex flex-col items-center justify-end"
            style={{
              ...calculatePositionAndSize(50, 72, 35),
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="relative w-full h-full flex flex-col items-center ">
              <div
                className="relative flex flex-col items-center gap-3"
                style={{ width: "50%" }}
              >
                <img
                  src="https://arweave.net/3Qwkk4zSxtN91Qs4ZccLlLhVXch-FwL1jIDRX-Vi1k0"
                  alt="NFT Shop - Shelf with wand"
                  className="relative w-full"
                  style={{ height: "auto", top: "0%" }}
                />
                <ImgButton
                  disabled={
                    buyItemLoading ||
                    (inventory.some((i) => i.item_id === shop?.items[2].id) &&
                      (shop?.items[2].type
                        ? ["WEAPON", "ARMOR"].includes(shop.items[2].type)
                        : false))
                  }
                  src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
                  alt={`Buy ${shop?.items[2].name}`}
                  data-item-type={shop?.items[2].id}
                  onClick={async () => {
                    if (shop?.items[2]) {
                      await buyItem(
                        shop?.items[2],
                        shop?.items[2]?.gold_price ? "GOLD" : "DUMZ"
                      );
                      shopBuyItemAudio.play();
                    }
                  }}
                />
              </div>
              <div className="relative w-full  h-full flex flex-row">
                <div className="relative flex flex-col items-center gap-3">
                  <img
                    src="https://arweave.net/rKIIgoJfpt_bgEVBVoMyOA9zLUPBuXdUucYVB9_ywdE"
                    alt="NFT Shop - Shelf with Robe"
                    className="relative w-full"
                    style={{ height: "auto", top: "-37%", left: "-65%" }}
                  />
                  <div
                    className="relative"
                    style={{ height: "auto", top: "-37%", left: "-65%" }}
                  >
                    <ImgButton
                      disabled={
                        buyItemLoading ||
                        (inventory.some(
                          (i) => i.item_id === shop?.items[1].id
                        ) &&
                          (shop?.items[1].type
                            ? ["WEAPON", "ARMOR"].includes(shop.items[1].type)
                            : false))
                      }
                      src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
                      alt={`Buy ${shop?.items[1].name}`}
                      data-item-type={shop?.items[1].id}
                      onClick={async () => {
                        if (shop?.items[1]) {
                          await buyItem(
                            shop?.items[1],
                            shop?.items[1]?.gold_price ? "GOLD" : "DUMZ"
                          );
                          shopBuyItemAudio.play();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="relative flex flex-col items-center gap-3">
                  <img
                    src="https://arweave.net/KeziMnbKyzhrQC8qUw5TabZ-sitRT0MI9WqcUgZCXlA"
                    alt="NFT Shop - Shelf with Cat"
                    className="relative w-full"
                    style={{ height: "auto", top: "19%", right: "-65%" }}
                  />
                  <div
                    className="relative"
                    style={{ height: "auto", top: "19%", right: "-65%" }}
                  >
                    <ImgButton
                      disabled={
                        buyItemLoading ||
                        (inventory.some(
                          (i) => i.item_id === shop?.items[0].id
                        ) &&
                          (shop?.items[0].type
                            ? ["WEAPON", "ARMOR"].includes(shop.items[0].type)
                            : false))
                      }
                      src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
                      alt={`Buy ${shop?.items[0].name}`}
                      data-item-type={shop?.items[0].id}
                      onClick={async () => {
                        if (shop?.items[0]) {
                          await buyItem(
                            shop?.items[0],
                            shop?.items[0]?.gold_price ? "GOLD" : "DUMZ"
                          );
                          shopBuyItemAudio.play();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 35,
                y: 40,
              }}
              itemSize={65}
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
                x: 65,
                y: 40,
              }}
              itemSize={60}
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
                x: 80,
                y: 60,
              }}
              itemSize={60}
              item={shop.items[2]}
            />
          )}  
           */}
          {/* <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 50), transform: "translate(-50%, -100%)" }}>
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
          </div> */}

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
