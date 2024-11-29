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

export default function Bakery() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();

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
          <img src={"https://arweave.net/MbOnj-2PBp9wZ2V4GAalLQuNhxoornEzQMR5OJMvlxc"} alt="Bakery Map" className="w-full h-full object-fill" />
        </div>
        {/* Table and Puppy Group */}
        <div className="relative w-full h-full">
          <div className="absolute bottom-[15.4%] left-0 right-0 w-full">
            <img src="https://arweave.net/yiWAC1FxowBACoNa2udcMdqDaQXgKc9B_FKURHidRC8" alt="Bakery Table" className="w-full" style={{ height: "auto", objectFit: "contain" }} />
            <img
              src="https://arweave.net/-6yFMOOf0CKNl8kvXQ1Qr7lgCM_HHEllovD4-TN3YNA"
              alt="Puppy in Basket"
              className="absolute w-auto h-[120px]"
              style={{ bottom: "92%", left: "85%" }}
            />
            <img src="https://arweave.net/WeMKq3YsD4K-iMi_kNut7kxmSIr4xiaezu9FAewwlek" alt="Whisk" className="absolute w-auto h-[60px]" style={{ bottom: "89%", left: "75%" }} />
            <img
              src="https://arweave.net/b9DSRgPZ3emyeVNdCtC1uye_i-dM-VZxB9YUJWtuwCk"
              alt="Rolling Pin"
              className="absolute w-auto h-[80px]"
              style={{ bottom: "88%", left: "10%" }}
            />
          </div>
        </div>

        <div className="absolute inset-0">
          <img
            src="https://arweave.net/SKW3ovBgOtAP4K8WrnP3tARXnpZRVgguzxSvb6FznHI"
            alt="Bakery Sign"
            className="absolute"
            style={{ ...calculatePositionAndSize(50, 24, 20), transform: "translate(-50%, -100%)" }}
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
                  top: "10px",
                  transform: "translate(0, 50%)",
                  left: "-80px",
                  zIndex: 1,
                  aspectRatio: 1, // Keeps the shopkeeper square
                  // transform: "translateY(-50%)", // Moves the shopkeeper up relative to the table
                }}
              >
                <RiveAnimation url={BUILDING_IMAGES.INFIRMARY_CAKESHOP_DUMDUM} />
              </div>
              <GifComponent className="absolute h-[20vh] translate-x-[8.5vw] translate-y-[9vh]" />

              {/* Shop Table */}
              <img src="https://arweave.net/TH9bwqkcXxXUvTUuMPSANB8KgWskr8m255Pb0u3Iz6w" alt="Shop Table" className="relative w-full z-10" style={{ height: "auto" }} />
            </div>
          </div>
          {/* <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 80), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/sgg2-WUXqkerD-EO494aFydCX0InP2tuWXuFMdt6N-8" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />

            <img
              src={BUILDING_IMAGES.INFIRMARY_CAKESHOP_DUMDUM}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "15%", height: "auto", transform: "translate(-75%, -235%)" }}
            />
          </div> */}

          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
              }}
              itemSize={100}
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
                audioManager.playSFX(SOUNDS.SHOP_BUY_ITEM);
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
