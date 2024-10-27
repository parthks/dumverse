import { LAMA_IMAGE } from "@/lib/constants";
import { cn, isValidSpotToMoveTo } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import React from "react";

// Map 1
export const interactivePoints = [
  { x: 82.2, y: 72.8, level: 1 },
  { x: 78.6, y: 77.5, level: 2 },
  { x: 72.8, y: 79.6, level: 3 },
  { x: 66.8, y: 79, level: 4 },
  { x: 60.6, y: 72.8, level: 5 },
  { x: 53.3, y: 72.8, level: 6 },
  { x: 50.5, y: 66, level: 7 },
  { x: 47.6, y: 53.8, level: 8 },
  { x: 45.5, y: 46.3, level: 9 },
  { x: 55.5, y: 33.8, level: 10 },
  { x: 60, y: 31.6, level: 11 },
  { x: 71.5, y: 34.1, level: 12 },
  { x: 78.8, y: 34, level: 13 },
  { x: 85.3, y: 30.9, level: 14 },
  { x: 76.8, y: 27.6, level: 15 },
  { x: 70, y: 27.6, level: 16 },
  { x: 61.7, y: 27.2, level: 17 },
  { x: 52.3, y: 30.7, level: 18 },
  { x: 47, y: 33.4, level: 19 },
  { x: 42.5, y: 33, level: 20 },
  { x: 37, y: 32.5, level: 21 },
  { x: 32, y: 33.4, level: 22 },
  { x: 27, y: 32, level: 23 },
  { x: 22, y: 30.8, level: 24 },
  { x: 17.8, y: 30, level: 25 },
  { x: 14.8, y: 25.4, level: 26 },
  { x: 10.5, y: 24.5, level: 27 },
];

// Map 2
// const interactivePoints = [
//   { x: 90.2, y: 54.8, level: 1 },
//   { x: 77, y: 66, level: 2 },
//   { x: 54, y: 64.6, level: 3 },
//   { x: 33, y: 65, level: 4 },
//   { x: 17, y: 59, level: 5 },
//   { x: 24.5, y: 52.4, level: 6 },
//   { x: 55, y: 53, level: 7 },
//   { x: 76, y: 50, level: 8 },
//   { x: 87, y: 46, level: 9 },
//   { x: 85, y: 33, level: 10 },
//   { x: 72, y: 35, level: 11 },
//   { x: 62, y: 37, level: 12 },
//   { x: 52, y: 38, level: 13 },
//   { x: 41, y: 38.3, level: 14 },
//   { x: 35, y: 30, level: 15 },
//   { x: 50.5, y: 27, level: 16 },
//   { x: 76, y: 27, level: 17 },
//   { x: 84, y: 26.8, level: 18 },
//   { x: 79, y: 19.2, level: 19 },
//   { x: 69, y: 18.5, level: 20 },
//   { x: 60, y: 17.5, level: 21 },
//   { x: 50, y: 18.5, level: 22 },
//   { x: 40, y: 20, level: 23 },
//   { x: 32, y: 22, level: 24 },
//   { x: 24, y: 24, level: 25 },
//   { x: 17.7, y: 31, level: 26 },
//   { x: 14, y: 39, level: 27 },
// ];

// Map 3
// const interactivePoints = [
//   { x: 90.2, y: 70, level: 1 },
//   { x: 77, y: 69, level: 2 },
//   { x: 67, y: 69, level: 3 },
//   { x: 57, y: 69, level: 4 },
//   { x: 47, y: 69, level: 5 },
//   { x: 37, y: 69, level: 6 },
//   { x: 27, y: 69, level: 7 },
//   { x: 15, y: 68, level: 8 },
//   { x: 8, y: 61, level: 9 },
//   { x: 13, y: 47, level: 10 },
//   { x: 23, y: 44, level: 11 },
//   { x: 33, y: 44, level: 12 },
//   { x: 43, y: 43, level: 13 },
//   { x: 53, y: 43, level: 14 },
//   { x: 63, y: 42, level: 15 },
//   { x: 73, y: 41, level: 16 },
//   { x: 80, y: 37, level: 17 },
//   { x: 87, y: 34, level: 18 },
//   { x: 84, y: 25, level: 19 },
//   { x: 79, y: 19, level: 20 },
//   { x: 72, y: 17.5, level: 21 },
//   { x: 64, y: 18, level: 22 },
//   { x: 56.5, y: 18, level: 23 },
//   { x: 48, y: 18, level: 24 },
//   { x: 40, y: 18, level: 25 },
//   { x: 33, y: 18, level: 26 },
//   { x: 22, y: 20, level: 27 },
// ];
interface InteractivePoint {
  x: number;
  y: number;
  level: number;
}

const imageWidth = 1089; // original map width
const imageHeight = 611; // original map height

interface InteractiveMapProps {
  // interactivePoints: InteractivePoint[];
  lamaPosition: LamaPosition;
  onLevelSelect: (level: number) => void;
  tempCurrentIslandLevel: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ tempCurrentIslandLevel, lamaPosition, onLevelSelect }) => {
  const { currentIslandLevel } = useGameStore();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("interactive-point")) {
      const level = event.target.getAttribute("data-level");
      // const buttonType = event.target.getAttribute("button-type");
      if (level) {
        if (isValidSpotToMoveTo(currentIslandLevel, parseInt(level))) {
          console.log("level", level);
          onLevelSelect(parseInt(level));
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
        <img src={"https://arweave.net/5pHgEfy8PTzSiByGHkc3kV9Q0k_WGI9vH0tUeRa376I"} alt="Game Map 1" className="w-full h-full object-contain" />
        {/* <img src={"https://arweave.net/IBWCGccNC1UTFZfHLgfZqATYZvinWiMYDTGg4tzF-NI"} alt="Game Map 2" className="w-full h-full object-contain" /> */}
        {/* <img src={"https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE"} alt="Game Map 3" className="w-full h-full object-contain" /> */}
        <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          {interactivePoints.map((point, index) => {
            // if current level is the same as the point level, then add the image to the point
            // let lammaImage = "" as any;
            // if (currentIslandLevel === point.level) {
            //   lammaImage = (
            //     <image href={lammaPosition.src} x={`${lammaPosition.x}%`} y={`${lammaPosition.y}%`} width="10%" height="10%" preserveAspectRatio="xMidYMid meet">
            //       <title>Lamma</title>
            //     </image>
            //   );
            // }
            return (
              <>
                <circle
                  key={index}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r="6"
                  className={cn(
                    "interactive-point transition-colors duration-200",
                    isValidSpotToMoveTo(currentIslandLevel, point.level) ? "hover:fill-[#63af16]" : "fill-black",
                    point.level % 9 == 0 ? "fill-purple-700" : isValidSpotToMoveTo(currentIslandLevel, point.level) ? "fill-[#3fe406]" : "fill-black"
                  )}
                  data-level={point.level}
                />
              </>
            );
          })}
          <image href={LAMA_IMAGE[lamaPosition.src]} x={`${lamaPosition.x}%`} y={`${lamaPosition.y}%`} width="5%" height="10%" preserveAspectRatio="xMidYMid meet">
            <title>Lamma</title>
          </image>
          {/* <LoadUserDetails /> */}
          {/* {currentIslandLevel != 0 && (
            <image
              href={"https://arweave.net/bHrruH7w5-XmymuvXL9ZuxITu1aRxw2rtddi2v0FUxE"}
              x={"50%"}
              y={"90%"}
              button-type="combat"
              className={`interactive-point  ${currentIslandLevel != 0 ? "grow-image" : ""}`}
              preserveAspectRatio="xMidYMid meet"
              width={(277 / imageWidth) * 100 * 0.8 + "%"}
              height={(65 / imageHeight) * 100 * 0.8 + "%"}
            />
          )} */}
        </svg>
      </div>
    </div>
  );
};

export default InteractiveMap;
