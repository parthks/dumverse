import { Item } from "@/types/game";
import { useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { IMAGES, ITEM_IMAGES } from "@/lib/constants";

export default function ShopItem({
  item,
  size = 330,
  itemSize = 35,
  position,
  handleClick,
}: {
  item: Item;
  size?: number;
  itemSize?: number;
  position: { x: number; y: number };
  handleClick: (event: any) => void;
}) {
  const { buyItemLoading, inventory } = useGameStore();
  const baseX = position.x;
  const baseY = position.y;

  const priceText = item.gold_price ? `${item.gold_price.toLocaleString()} g` : item.dumz_price ? `${item.dumz_price.toLocaleString()} $tDumz` : "--";

  console.log(inventory);
  const alreadyOwned = inventory.some((i) => i.item_id === item.id);

  return (
    <div className="absolute flex flex-col items-center" style={{ width: `${size}px`, top: `${baseY}%`, left: `${baseX}%`, transform: `translate(-50%, -100%)` }}>
      <div className="relative w-full flex flex-col justify-center items-center">
        {/* Item image */}
        <img src={ITEM_IMAGES[item.id as keyof typeof ITEM_IMAGES]} alt={item.name} className={`w-[${itemSize}%] h-auto mb-[-2%]`} />
        <div className="w-full relative">
          {/* Shelf image */}
          <img src="https://arweave.net/nQ03-odZ-vC30jHjueS3UT3XcmKpPeuC8gcWaZS0ZXs" alt="Shelf" className="w-full relative z-10" />
          {/* Text content */}
          <div className="absolute top-[8px] left-0 right-[5px] z-20 text-center">
            {/* Adjust pb-2 for vertical positioning */}
            <p className="text-white text-[118%] leading-[100%]">{item.name}</p>
            <p className="text-white text-[90%] flex items-center justify-center">
              {priceText}
              <img src={item.gold_price ? IMAGES.GOLD_ICON : IMAGES.DUMZ_ICON} alt="Currency" className="ml-2 w-5 h-5" />
            </p>
          </div>
        </div>
      </div>
      {/* Buy button */}
      <ImgButton
        disabled={buyItemLoading || (alreadyOwned && ["WEAPON", "ARMOR"].includes(item.type))}
        src="https://arweave.net/SyQA7SYryT_kycFIuBKCIEBlDSLLkF_4BLmOkI0RCBk"
        alt={`Buy ${item.name}`}
        data-item-type={item.id}
        onClick={handleClick}
      />
    </div>
  );
}
