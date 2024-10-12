import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import ShopItem from "@/components/buildings/ShopItem";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { BUILDING_IMAGES, SOUNDS } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

// function ShopItem({ item, position }: { item: Item; position: number }) {
//   const { buyItemLoading } = useGameStore();
//   const baseX = ITEM_POSITIONS[position as keyof typeof ITEM_POSITIONS].x;
//   const baseY = ITEM_POSITIONS[position as keyof typeof ITEM_POSITIONS].y;

//   const itemWidth = 323;
//   const itemHeight = 196; // Increased height to accommodate all elements
//   const textWidth = 400; // Fixed width for text centering

//   const priceText = item.gold_price ? `${item.gold_price} g` : `${item.dumz_price} $tDumz`;
//   const fontSize = 50;
//   const iconSize = 50;
//   const iconGap = 10;

//   // Estimate text width (adjust multiplier as needed for your font)
//   const estimatedTextWidth = priceText.length * fontSize * 0.58;
//   const totalWidth = estimatedTextWidth + iconSize + iconGap;
//   const offset = totalWidth / 2;

//   return (
//     <g transform={`translate(${(baseX * imageWidth) / 100}, ${(baseY * imageHeight) / 100})`}>
//       <image
//         href={ITEM_IMAGES[item.id as keyof typeof ITEM_IMAGES]}
//         x={0}
//         y={0}
//         width={(itemWidth / imageWidth) * 100 * 1 + "%"}
//         height={(itemHeight / imageHeight) * 100 * 1 + "%"}
//         preserveAspectRatio="xMidYMid meet"
//       />
//       <image
//         href={"https://arweave.net/FZClIS-LUQyR43CFMQNPSBgR51gRcDlrirohThSDTF0"}
//         x={-itemWidth}
//         y={95}
//         width={(958 / imageWidth) * 100 * 1 + "%"}
//         height={(343 / imageHeight) * 100 * 1 + "%"}
//         preserveAspectRatio="xMidYMid meet"
//       >
//         <title>Shelf</title>
//       </image>
//       <text x={`${itemWidth / 2}`} y={itemHeight + 40} fontSize="50" fill="white" textAnchor="middle">
//         {item.name}
//       </text>
//       {/* Centered price text and image as a unit */}
//       <g transform={`translate(${itemWidth / 2}, ${itemHeight + 85})`}>
//         <g transform={`translate(-${offset}, 0)`}>
//           <text fontSize={`${fontSize}`} fill="white" textAnchor="start" dominantBaseline="central">
//             {priceText}
//           </text>
//           {/* dumz or gold icon image */}
//           <image
//             href={`${item.gold_price ? IMAGES.GOLD_ICON : IMAGES.DUMZ_ICON}`}
//             x={estimatedTextWidth + iconGap}
//             y={-iconSize / 2}
//             width={(iconSize / imageWidth) * 100 + "%"}
//             height={(iconSize / imageHeight) * 100 + "%"}
//             preserveAspectRatio="xMidYMid meet"
//           />
//         </g>
//       </g>
//       <image
//         href={"https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"}
//         x={`${(itemWidth - 166 * 2.5) / 2}`}
//         y={itemHeight + 150}
//         width={(166 / imageWidth) * 100 * 2.5 + "%"}
//         height={(39 / imageHeight) * 100 * 2.5 + "%"}
//         preserveAspectRatio="xMidYMid meet"
//         className={`grow-image item ${buyItemLoading ? "disabled-image" : ""}`}
//         item-type={item.id}
//       >
//         <title>Buy {item.name}</title>
//       </image>
//     </g>
//   );
// }

// function ShopTableItem({ item }: { item: Item }) {
//   const { buyItemLoading } = useGameStore();
//   if (!item) return null;
//   const itemWidth = 323;
//   const itemHeight = 196;
//   const plaqueWidth = 146 * 2.5;
//   const plaqueHeight = 39 * 2.5;

//   const priceText = item.gold_price ? `${item.gold_price} g` : `${item.dumz_price} $tDumz`;
//   const fontSize = 40;
//   const iconSize = 40;
//   const iconGap = 10;

//   const estimatedTextWidth = priceText.length * fontSize * 0.58;
//   const totalWidth = estimatedTextWidth + iconSize + iconGap;
//   const offset = totalWidth / 2;
//   return (
//     <g transform={`translate(${imageWidth / 1.65}, ${imageHeight / 1.277})`}>
//       {/* item image */}
//       <image
//         href={ITEM_IMAGES[item.id as keyof typeof ITEM_IMAGES]}
//         x={0}
//         y={-50}
//         width={(itemWidth / imageWidth) * 100 + "%"}
//         height={(itemHeight / imageHeight) * 100 + "%"}
//         preserveAspectRatio="xMidYMid meet"
//       />

//       {/* plaque image with name and price */}
//       <g transform={`translate(0, ${itemHeight})`}>
//         <image
//           href={"https://arweave.net/ekiDREAGABYDwSgOIvqkSBW2qqyOvilDqSkBrcZvdfg"}
//           x={0}
//           y={0}
//           width={(plaqueWidth / imageWidth) * 100 + "%"}
//           height={(plaqueHeight / imageHeight) * 100 + "%"}
//           preserveAspectRatio="xMidYMid meet"
//         />
//         <text x={plaqueWidth / 2} y={plaqueHeight / 3} fontSize={fontSize} fill="white" textAnchor="middle">
//           {item.name}
//         </text>
//         {/* Centered price text and image as a unit */}
//         <g transform={`translate(${plaqueWidth / 2}, ${(plaqueHeight * 2) / 3})`}>
//           <g transform={`translate(-${offset}, 0)`}>
//             <text fontSize={fontSize} fill="white" textAnchor="start" dominantBaseline="central">
//               {priceText}
//             </text>
//             {/* dumz or gold icon image */}
//             <image
//               href={`${item.gold_price ? IMAGES.GOLD_ICON : IMAGES.DUMZ_ICON}`}
//               x={estimatedTextWidth + iconGap}
//               y={-iconSize / 2}
//               width={(iconSize / imageWidth) * 100 + "%"}
//               height={(iconSize / imageHeight) * 100 + "%"}
//               preserveAspectRatio="xMidYMid meet"
//             />
//           </g>
//         </g>
//       </g>

//       {/* Buy button */}
//       <image
//         href={"https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"}
//         x={(itemWidth - plaqueWidth) / 2}
//         y={itemHeight + plaqueHeight + 40}
//         width={(166 / imageWidth) * 100 * 2.5 + "%"}
//         height={(39 / imageHeight) * 100 * 2.5 + "%"}
//         preserveAspectRatio="xMidYMid meet"
//         className={`grow-image item ${buyItemLoading ? "disabled-image" : ""}`}
//         item-type={item.id}
//       >
//         <title>Buy {item.name}</title>
//       </image>
//     </g>
//   );
// }

export default function Shop() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  useBuildingMusic({ getBuildingData: () => getShop("ENERGY") });

  // if (!shop) return <div>Loading...</div>;

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
          <img src={"https://arweave.net/8kiel2lmr7r9HppfIDFbHaio2o-IGASvIKe8igZGDxM"} alt="Shop Map" className="w-full h-full object-contain" />
        </div>
        <div className="absolute inset-0">
          <img
            src="https://arweave.net/RfmkbozkG-yWu5nTEZB1vZNFMY8nReAJE5T1esrLcZw"
            alt="Shop Window Frame"
            className="absolute"
            style={{ ...calculatePositionAndSize(90, 35, 15) }}
          />

          {/* Group the shop table, sign, and shopkeeper */}
          <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 55), transform: "translate(-50%, -100%)" }}>
            <img src="https://arweave.net/EGns8f3XSoIYfDuzPomOSI1CYnSTuHFf5UkHs7yoWn4" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />
            <img
              src="https://arweave.net/EtD1v-e4LaLsRP_hwSqFl2-uxDKj3cz6mhGwU4BESlY"
              alt="Shop Sign"
              className="absolute"
              style={{ left: "17.7%", width: "25%", height: "auto", transform: "translate(-20%, -175%)" }}
            />
            <img
              src={BUILDING_IMAGES.YELLOW_SHOPKEEPER}
              alt="Shop Keeper"
              className="absolute"
              style={{ left: "50%", width: "23.1%", height: "auto", transform: "translate(-50%, -175%)" }}
            />
          </div>
          {/* <img
            src="https://arweave.net/EGns8f3XSoIYfDuzPomOSI1CYnSTuHFf5UkHs7yoWn4"
            alt="Shop Table"
            className="absolute"
            style={{ ...calculatePositionAndSize(50, 100, 65), transform: "translate(-50%, -100%)" }}
          />
          <img src="https://arweave.net/EtD1v-e4LaLsRP_hwSqFl2-uxDKj3cz6mhGwU4BESlY" alt="Shop Sign" className="absolute" style={{ ...calculatePositionAndSize(32, 73, 15) }} />
          <img src={BUILDING_IMAGES.YELLOW_SHOPKEEPER} alt="Shop Keeper" className="absolute" style={{ ...calculatePositionAndSize(50, 59.5, 15) }} /> */}

          {shop?.items[0] && (
            <ShopItem
              handleClick={async () => {
                await buyItem(shop.items[0], shop.items[0]?.gold_price ? "GOLD" : "DUMZ");
                shopBuyItemAudio.play();
              }}
              position={{
                x: 30,
                y: 40,
              }}
              itemSize={20}
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
                x: 60,
                y: 40,
              }}
              itemSize={18}
              item={shop.items[1]}
            />
          )}

          {/* <ShopItem position={2} item={shop.items[2]} /> */}
          {/* <ShopItem position={3} item={shop.items[3]} /> */}
          {/* <ShopTableItem item={shop.items[4]} /> */}
        </div>
      </div>
    </div>
  );
}

// return (
//   <div>
//     <h1>Shop</h1>
//     <h2 className="text-2xl font-bold">Weapons</h2>
//     <div className="flex flex-wrap gap-4">
//       {weapons.map((item) => (
//         <div key={item.id}>
//           <p>ID: {item.id}</p>
//           <h2>Name: {item.name}</h2>
//           <p>Type: {item.type}</p>
//           <p>Gold Price: {item.gold_price}</p>
//           <p>Dumz Price: {item.dumz_price}</p>
//           <p>Damage: {item.damage}</p>
//           <div className="flex gap-2">
//             <Button onClick={() => buyItem(item, "GOLD")} disabled={buyItemLoading}>
//               {buyItemLoading ? "Loading..." : "Buy with Gold"}
//             </Button>
//             <Button onClick={() => buyItem(item, "DUMZ")} disabled={buyItemLoading}>
//               {buyItemLoading ? "Loading..." : "Buy with Dumz"}
//             </Button>
//           </div>
//         </div>
//       ))}
//     </div>
//     <br />
//     <h2 className="text-2xl font-bold">Armor</h2>
//     <div className="flex flex-wrap gap-4">
//       {armor.map((item) => (
//         <div key={item.id}>
//           <h2>Name: {item.name}</h2>
//           <p>Type: {item.type}</p>
//           <p>Gold Price: {item.gold_price}</p>
//           <p>Dumz Price: {item.dumz_price}</p>
//           <p>Defense: {item.defense}</p>
//           <div className="flex gap-2">
//             <Button onClick={() => buyItem(item, "GOLD")} disabled={buyItemLoading}>
//               {buyItemLoading ? "Loading..." : "Buy with Gold"}
//             </Button>
//             <Button onClick={() => buyItem(item, "DUMZ")} disabled={buyItemLoading}>
//               {buyItemLoading ? "Loading..." : "Buy with Dumz"}
//             </Button>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );
