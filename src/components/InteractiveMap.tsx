import { LAMA_IMAGE, PET_LARGE_CARD_IMAGE, REST_SPOTS } from "@/lib/constants";
// import { cn, isValidSpotToMoveTo } from "@/lib/utils";
import { cn, getInteractivePoints, isValidSpotToMoveTo } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { EntityPosition } from "@/types/game";
import React, { useEffect } from "react";
import { BOSS_SPOTS } from "@/lib/constants";

// import {
//   interactivePointsMap3,
//   interactivePointsMap2,
//   lammaHeight,
//   lammaWidth,
//   SOUNDS,
// } from "@/lib/constants";

// export const interactivePointsMap1 = [
//   { x: 5.5, y: 28, level: 1 },
//   [{ x:6.5, y: 51, level: null },{ x: 19, y: 51, level: 2 }] ,
//   [{ x: 35, y: 57, level: null },{ x: 43, y: 68, level: 3 }],
//   { x: 68, y: 69, level: 4 },
//   { x: 87, y: 83, level: 5 },
// ];


// function getInteractivePoints(currentSpot: number) {
//   // if currentSpot is less than 27, it's map 1
//   if (currentSpot <= 26) return interactivePointsMap1;
//   // if currentSpot is less than 54, it's map 2
//   if (currentSpot <= 52) return interactivePointsMap2;
//   return interactivePointsMap3;
// }

// interface InteractivePoint {
//   x: number;
//   y: number;
//   level: number;
// }

const imageWidth = 1089; // original map width
const imageHeight = 611; // original map height

interface InteractiveMapProps {
  // interactivePoints: InteractivePoint[];
  entityPosition: EntityPosition;
  onLevelSelect: (level: number) => void;
  tempCurrentIslandLevel: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ tempCurrentIslandLevel, entityPosition, onLevelSelect }) => {
  const { currentIslandLevel, user, refreshUserData, acceptedTheMouseGame } = useGameStore();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("interactive-point")) {
      const level = event.target.getAttribute("data-level");
      // const buttonType = event.target.getAttribute("button-type");
      if (level) {
        if (isValidSpotToMoveTo(currentIslandLevel, parseInt(level))) {      
          onLevelSelect(parseInt(level));
        }
      }
    }
  };

  const currentMapImage = () => {
    // if (tempCurrentIslandLevel <= 27) return "https://arweave.net/5pHgEfy8PTzSiByGHkc3kV9Q0k_WGI9vH0tUeRa376I";
    // if (tempCurrentIslandLevel <= 54) return "https://arweave.net/IBWCGccNC1UTFZfHLgfZqATYZvinWiMYDTGg4tzF-NI";
    // return "https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE";\
    if (acceptedTheMouseGame) return "https://arweave.net/sjhPyW1FiHnQ8MYzQENAubilVRY7XZyTXBHKSh3YZpY";
    if (tempCurrentIslandLevel <= 26) return "https://arweave.net/0tihG4RP7k47UXhsac1G1NYYWkrpmR7rzTFDKl3iEt4";
    if (tempCurrentIslandLevel <= 52) return "https://arweave.net/xBYjHPPmUMwNz7ie-g9gzYx3EGpTr4z1ja3w_gW2NQg";
    return "https://arweave.net/7pKdnNo5PS8oY8rwta0g6gMX4kRHoYAYoeFpPmPZvSM";
  };

  useEffect(() => {
    console.log("Ashu : Current Spot Change");

    const fetchData = async () => {
        await refreshUserData();
    };

    fetchData();
}, [user?.current_spot, user?.current_mouse_spot, acceptedTheMouseGame]);

console.log(getInteractivePoints(tempCurrentIslandLevel, acceptedTheMouseGame));

  return (
    <div className="w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}

        <img src={currentMapImage()} alt="Game Map" className={`w-full h-full ${(acceptedTheMouseGame) ? "object-cover" : "object-contain"}`} />
        {/* {tempCurrentIslandLevel <= 27? (
        <div
          className="absolute"
          style={{
            width: "3%",
            bottom: "5.5%",
            right: "11%",
          }}
        >
          <img
            src="https://arweave.net/dB07kjfdIJFICANzB7nkt2W8W2FoO4TbFnAVTHeepzw"
            alt="Boat and Dock"
            className="w-full "
          />
        </div>
      ) : (
        <></>
      )} */}

        {/* <img src={"https://arweave.net/5pHgEfy8PTzSiByGHkc3kV9Q0k_WGI9vH0tUeRa376I"} alt="Game Map 1" className="w-full h-full object-contain" /> */}
        {/* <img src={"https://arweave.net/IBWCGccNC1UTFZfHLgfZqATYZvinWiMYDTGg4tzF-NI"} alt="Game Map 2" className="w-full h-full object-contain" /> */}
        {/* <img src={"https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE"} alt="Game Map 3" className="w-full h-full object-contain" /> */}

        <svg 
  width="100%" 
  height="100%" 
  viewBox={`0 0 ${imageWidth} ${imageHeight}`} 
  preserveAspectRatio="xMidYMid meet" 
  className="absolute top-0 left-0" 
  onClick={handleClick}
>
  {getInteractivePoints(tempCurrentIslandLevel, acceptedTheMouseGame).flatMap((pointOrArray, arrayIndex) => {
    // Handle both single points and arrays of points
    const points = Array.isArray(pointOrArray) ? pointOrArray : [pointOrArray];
    
    return points.map((point, pointIndex) => {
      // Skip rendering points with null level
      if (point.level === null) return null;
      
      // Generate a unique key for each point
      const key = `point-${arrayIndex}-${pointIndex}`;
      
      return (
        // <circle
        //   key={key}
        //   cx={`${point.x}%`}
        //   cy={`${point.y}%`}
        //   r="6"
        //   className={cn(
        //     "interactive-point transition-colors duration-200",
        //     isValidSpotToMoveTo(currentIslandLevel, point.level) ? "hover:fill-[#63af16]" : "fill-black",
        //     BOSS_SPOTS.includes(point.level)
        //       ? "fill-red-700"
        //       : REST_SPOTS.includes(point.level)
        //       ? "fill-purple-700"
        //       : isValidSpotToMoveTo(currentIslandLevel, point.level)
        //       ? "fill-[#3fe406]"
        //       : "fill-black"
        //   )}
        //   data-level={point.level}
        // />
        <circle
  key={key}
  cx={`${point.x}%`}
  cy={`${point.y}%`}
  r="6"
  className={cn(
    "interactive-point transition-colors duration-200",
    isValidSpotToMoveTo(currentIslandLevel, point.level) ? "hover:fill-[#63af16]" : "fill-black",
    acceptedTheMouseGame
      ? point.level === 5
        ? "fill-red-700"
        : REST_SPOTS.includes(point.level)
        ? "fill-purple-700"
        : isValidSpotToMoveTo(currentIslandLevel, point.level)
        ? "fill-[#3fe406]"
        : "fill-black"
      : BOSS_SPOTS.includes(point.level)
        ? "fill-red-700"
        : REST_SPOTS.includes(point.level)
        ? "fill-purple-700"
        : isValidSpotToMoveTo(currentIslandLevel, point.level)
        ? "fill-[#3fe406]"
        : "fill-black"
  )}
  data-level={point.level}
/>

      );
    }).filter(Boolean); // Filter out null elements
  })}
  
  {/* Lama image */}
  <image 
    href={(acceptedTheMouseGame)? PET_LARGE_CARD_IMAGE.MIGHTY_MOUSE : LAMA_IMAGE[entityPosition.src  || "STAND_LEFT"]} 
    x={`${entityPosition.x}%`} 
    y={`${entityPosition.y}%`} 
    width={(acceptedTheMouseGame)? "5%" : "4%"}
    height={(acceptedTheMouseGame)? "15%" : "11%"}
    preserveAspectRatio="xMidYMid meet"
  >
    <title></title>
  </image>
</svg>

      </div>
    </div>
  );
};

export default InteractiveMap;
