import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useState } from "react";
import { SOUNDS } from "@/lib/constants";

export default function Town() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const [chatOpen, setChatOpen] = useState(false);

  const handleBuildingSelect = (building: GameStatePages) => {
    setGameStatePage(building);
  };
  return (
    <div className="h-screen">
      <audio src={SOUNDS.TOWN_AUDIO} autoPlay loop />
      <InteractiveTownMap onBuildingSelect={handleBuildingSelect} />
      <div className="z-10 absolute bottom-4 right-4">
        <ImgButton src={"https://arweave.net/fCgsiCsv1ZNCSljaXAtqIVX71EDOFbU5blXGjjkLj_k"} onClick={() => setChatOpen(!chatOpen)} alt={"Toggle Chat"} />
      </div>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/Nuj6OhWo55MGJCPIa8RHFFQZ6wTdvzJg5rBipEjvuPA"} onClick={() => setGameStatePage(GameStatePages.GAME_MAP)} alt={"Return to Town"} />
      </div>
    </div>
  );
}

interface InteractiveTownMapProps {
  onBuildingSelect: (level: GameStatePages) => void;
}
const InteractiveTownMap: React.FC<InteractiveTownMapProps> = ({ onBuildingSelect }) => {
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    console.log(event.target);
    if (event.target instanceof SVGElement && event.target.classList.contains("building")) {
      const buildingType = event.target.getAttribute("building-type");
      if (buildingType) {
        onBuildingSelect(buildingType as GameStatePages);
      }
    }
  };

  const imageWidth = 3840;
  const imageHeight = 2160;

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
        <img src={"https://arweave.net/a1-ZDvfawd_Nt43arJ8gpFnWStMjg3AHU_9SRAqwf6M"} alt="Town Map" className="w-full h-full object-contain" />
        <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          <image
            href={"https://arweave.net/ApxR5t3vqSIq0jS6T0zGGYC3-QPdAqFQDhgRl1aDMSY"}
            x={`${48.5}%`}
            y={`${-1.8}%`}
            width={(294 / imageWidth) * 100 * 3 + "%"}
            height={(273 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 02 center building
          />
          {/* right side */}
          <image
            href={"https://arweave.net/nA2Cf5yFMcW8CKPce6bBNGyvjFV1I2jKbpy3oqiW-XU"}
            x={`${61.5}%`}
            y={`${5}%`}
            width={(309 / imageWidth) * 100 * 3 + "%"}
            height={(348 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 03 NFT holder building
          />
          <image
            href={"https://arweave.net/p8vrXsnFt0pv8A3LhpDYoRMHB8sxzlNGTPi4aXJLhSM"}
            x={`${62}%`}
            y={`${2}%`}
            width={(414 / imageWidth) * 100 * 3 + "%"}
            height={(474 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            className="building cursor-pointer"
            building-type="BANK"
            // 08 Bank building
          />
          <image
            href={"https://arweave.net/DusVpqx7T7l5nFo3Igl3aN4NPUO39WG1MnEe5M2WTMs"}
            x={`${71}%`}
            y={`${22}%`}
            width={(414 / imageWidth) * 100 * 2.75 + "%"}
            height={(474 / imageHeight) * 100 * 2.75 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 09 Shady building
          />
          {/* <image
            href={"https://arweave.net/xlNew92daEX6n4uGiQVz5eaUfC9Sun2zVmTSB3uPntM"}
            x={`${65}%`}
            y={`${0}%`}
            width={(455 / imageWidth) * 100 * 3 + "%"}
            height={(692 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 10 }}
            // 10 Tree branch
          /> */}
          {/* left side */}
          <image
            href={"https://arweave.net/ndMhZxrD0z34IntzRnCJ97XwpbxTaZyqipO6DQvBojc"}
            x={`${41}%`}
            y={`${11}%`}
            width={(177 / imageWidth) * 100 * 3 + "%"}
            height={(216 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 04 yellow house
          />
          <image
            href={"https://arweave.net/85YNOU7Lyfn6brw6fgkzVgraICHLBGaimvIrnhkRrik"}
            x={`${22}%`}
            y={`${5}%`}
            width={(375 / imageWidth) * 100 * 3 + "%"}
            height={(309 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 05 green house
          />
          <image
            href={"https://arweave.net/WBkjn63k5ooy6A0Jiy9HK0gKs55MI42_wVJ_scz1lmU"}
            x={`${16}%`}
            y={`${3}%`}
            width={(297 / imageWidth) * 100 * 3 + "%"}
            height={(402 / imageHeight) * 100 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            // 06 weaponsmith
          />
          <image
            href={"https://arweave.net/ssf-g0RwkQd_sBmgygl0koe03wokEPW-H3AOmU77CIo"}
            x={`${0}%`}
            y={`${0}%`}
            width={9.817708333 * 3 + "%"}
            height={22.222222222 * 3 + "%"}
            preserveAspectRatio="xMidYMid meet"
            className="building cursor-pointer"
            building-type="SHOP"
            // 07 general store
          />
          ;
        </svg>
      </div>
    </div>
  );
};
