import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import { InventoryBag } from "@/components/game/InventoryBag";
import { IMAGES, ITEM_IMAGES, SOUNDS } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import { Item } from "@/types/game";
import { useEffect } from "react";

const imageWidth = 3840;
const imageHeight = 2160;

const ITEM_POSITIONS = {
  0: {
    x: 28,
    y: 5,
  },
  1: {
    x: 67,
    y: 5,
  },
  2: {
    x: 67,
    y: 34,
  },
  3: {
    x: 28,
    y: 34,
  },
};
function ShopItem({ item, position }: { item: Item; position: number }) {
  const { buyItemLoading } = useGameStore();
  const baseX = ITEM_POSITIONS[position as keyof typeof ITEM_POSITIONS].x;
  const baseY = ITEM_POSITIONS[position as keyof typeof ITEM_POSITIONS].y;

  const itemWidth = 323;
  const itemHeight = 196; // Increased height to accommodate all elements
  const textWidth = 400; // Fixed width for text centering

  const priceText = item.gold_price ? `${item.gold_price} g` : `${item.dumz_price} $Dumz`;
  const fontSize = 50;
  const iconSize = 50;
  const iconGap = 10;

  // Estimate text width (adjust multiplier as needed for your font)
  const estimatedTextWidth = priceText.length * fontSize * 0.58;
  const totalWidth = estimatedTextWidth + iconSize + iconGap;
  const offset = totalWidth / 2;

  return (
    <g transform={`translate(${(baseX * imageWidth) / 100}, ${(baseY * imageHeight) / 100})`}>
      <image
        href={ITEM_IMAGES[item.id as keyof typeof ITEM_IMAGES]}
        x={0}
        y={0}
        width={(itemWidth / imageWidth) * 100 * 1 + "%"}
        height={(itemHeight / imageHeight) * 100 * 1 + "%"}
        preserveAspectRatio="xMidYMid meet"
      />
      <image
        href={"https://arweave.net/FZClIS-LUQyR43CFMQNPSBgR51gRcDlrirohThSDTF0"}
        x={-itemWidth}
        y={95}
        width={(958 / imageWidth) * 100 * 1 + "%"}
        height={(343 / imageHeight) * 100 * 1 + "%"}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Shelf</title>
      </image>
      <text x={`${itemWidth / 2}`} y={itemHeight + 40} fontSize="50" fill="white" textAnchor="middle">
        {item.name}
      </text>
      {/* Centered price text and image as a unit */}
      <g transform={`translate(${itemWidth / 2}, ${itemHeight + 85})`}>
        <g transform={`translate(-${offset}, 0)`}>
          <text fontSize={`${fontSize}`} fill="white" textAnchor="start" dominantBaseline="central">
            {priceText}
          </text>
          {/* dumz or gold icon image */}
          <image
            href={`${item.gold_price ? IMAGES.GOLD_ICON : IMAGES.DUMZ_ICON}`}
            x={estimatedTextWidth + iconGap}
            y={-iconSize / 2}
            width={(iconSize / imageWidth) * 100 + "%"}
            height={(iconSize / imageHeight) * 100 + "%"}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
      <image
        href={"https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"}
        x={`${(itemWidth - 166 * 2.5) / 2}`}
        y={itemHeight + 150}
        width={(166 / imageWidth) * 100 * 2.5 + "%"}
        height={(39 / imageHeight) * 100 * 2.5 + "%"}
        preserveAspectRatio="xMidYMid meet"
        className={`grow-image item ${buyItemLoading ? "disabled-image" : ""}`}
        item-type={item.id}
      >
        <title>Buy {item.name}</title>
      </image>
    </g>
  );
}

function ShopTableItem({ item }: { item: Item }) {
  const { buyItemLoading } = useGameStore();
  if (!item) return null;
  const itemWidth = 323;
  const itemHeight = 196;
  const plaqueWidth = 146 * 2.5;
  const plaqueHeight = 39 * 2.5;

  const priceText = item.gold_price ? `${item.gold_price} g` : `${item.dumz_price} $Dumz`;
  const fontSize = 40;
  const iconSize = 40;
  const iconGap = 10;

  const estimatedTextWidth = priceText.length * fontSize * 0.58;
  const totalWidth = estimatedTextWidth + iconSize + iconGap;
  const offset = totalWidth / 2;
  return (
    <g transform={`translate(${imageWidth / 1.65}, ${imageHeight / 1.277})`}>
      {/* item image */}
      <image
        href={ITEM_IMAGES[item.id as keyof typeof ITEM_IMAGES]}
        x={0}
        y={-50}
        width={(itemWidth / imageWidth) * 100 + "%"}
        height={(itemHeight / imageHeight) * 100 + "%"}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* plaque image with name and price */}
      <g transform={`translate(0, ${itemHeight})`}>
        <image
          href={"https://arweave.net/ekiDREAGABYDwSgOIvqkSBW2qqyOvilDqSkBrcZvdfg"}
          x={0}
          y={0}
          width={(plaqueWidth / imageWidth) * 100 + "%"}
          height={(plaqueHeight / imageHeight) * 100 + "%"}
          preserveAspectRatio="xMidYMid meet"
        />
        <text x={plaqueWidth / 2} y={plaqueHeight / 3} fontSize={fontSize} fill="white" textAnchor="middle">
          {item.name}
        </text>
        {/* Centered price text and image as a unit */}
        <g transform={`translate(${plaqueWidth / 2}, ${(plaqueHeight * 2) / 3})`}>
          <g transform={`translate(-${offset}, 0)`}>
            <text fontSize={fontSize} fill="white" textAnchor="start" dominantBaseline="central">
              {priceText}
            </text>
            {/* dumz or gold icon image */}
            <image
              href={`${item.gold_price ? IMAGES.GOLD_ICON : IMAGES.DUMZ_ICON}`}
              x={estimatedTextWidth + iconGap}
              y={-iconSize / 2}
              width={(iconSize / imageWidth) * 100 + "%"}
              height={(iconSize / imageHeight) * 100 + "%"}
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </g>

      {/* Buy button */}
      <image
        href={"https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"}
        x={(itemWidth - plaqueWidth) / 2}
        y={itemHeight + plaqueHeight + 40}
        width={(166 / imageWidth) * 100 * 2.5 + "%"}
        height={(39 / imageHeight) * 100 * 2.5 + "%"}
        preserveAspectRatio="xMidYMid meet"
        className={`grow-image item ${buyItemLoading ? "disabled-image" : ""}`}
        item-type={item.id}
      >
        <title>Buy {item.name}</title>
      </image>
    </g>
  );
}

export default function Shop() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();
  const shopBuyItemAudio = new Audio(SOUNDS.SHOP_BUY_ITEM);

  // useBuildingMusic({ getBuildingData: getShop });

  if (!shop) return <div>Loading...</div>;

  const handleClick = async (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemId = event.target.getAttribute("item-type");
      if (itemId) {
        const item = shop.items.find((item) => item.id === itemId);
        if (!item) return;
        await buyItem(item, item.gold_price ? "GOLD" : "DUMZ");
        shopBuyItemAudio.play();
        // buyItem(itemType);
      }
    }
  };

  console.log("shop", shop.items);

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
          <img src={"https://arweave.net/XGifLWazz33oRvlKt6EZHpZc0tDF_KqdAvmBR3O5Flk"} alt="Town Map" className="w-full h-full object-contain" />
          <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
            <g transform="translate(-50%, -50%)">
              <image
                href={"https://arweave.net/RfmkbozkG-yWu5nTEZB1vZNFMY8nReAJE5T1esrLcZw"}
                x={`83%`}
                y={`20%`}
                width={(709 / imageWidth) * 100 * 0.85 + "%"}
                height={(858 / imageHeight) * 100 * 0.85 + "%"}
                preserveAspectRatio="xMidYMid meet"
                transform="translate(-50%, -50%)"
              >
                <title>Shop Window Frame</title>
              </image>
            </g>

            <g transform="translate(-50%, -50%)">
              <image
                href={"https://arweave.net/EGns8f3XSoIYfDuzPomOSI1CYnSTuHFf5UkHs7yoWn4"}
                x={`${50 - (2099 / imageWidth) * 50}%`}
                y={`78%`}
                width={(2099 / imageWidth) * 100 + "%"}
                height={(488 / imageHeight) * 100 + "%"}
                preserveAspectRatio="xMidYMid meet"
              >
                <title>Shop Table</title>
              </image>
            </g>

            <g transform="translate(-50%, -50%)">
              <image
                href={"https://arweave.net/EtD1v-e4LaLsRP_hwSqFl2-uxDKj3cz6mhGwU4BESlY"}
                x={`29%`}
                y={`65%`}
                width={(597 / imageWidth) * 100 + "%"}
                height={(479 / imageHeight) * 100 + "%"}
                preserveAspectRatio="xMidYMid meet"
              >
                <title>Shop Sign</title>
              </image>
            </g>
            <image
              href={"https://arweave.net/ERNUnhjW23_jDy4kFNk-Wmu_WFoTRgXeaCDgIYFyVws"}
              x={`${44}%`}
              y={`${50}%`}
              width={(536 / imageWidth) * 100 * 1 + "%"}
              height={(652 / imageHeight) * 100 * 1 + "%"}
              preserveAspectRatio="xMidYMid meet"
            >
              <title>Shop Keeper</title>
            </image>

            <ShopItem position={0} item={shop.items[0]} />
            <ShopItem position={1} item={shop.items[1]} />
            <ShopItem position={2} item={shop.items[2]} />
            <ShopItem position={3} item={shop.items[3]} />
            <ShopTableItem item={shop.items[4]} />
          </svg>
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
