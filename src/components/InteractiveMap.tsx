import { LAMA_IMAGE } from "@/lib/constants";
import { cn,getInteractivePoints, isValidSpotToMoveTo } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import React from "react";
import {
  interactivePointsMap1,
  interactivePointsMap3,
  lammaHeight,
  lammaWidth,
  SOUNDS,
} from "@/lib/constants";

// const interactivePointsMap2 = [
//   { x: 90.2, y: 55.8, level: 28 },
//   { x: 77, y: 65.2, level: 29 },
//   { x: 54, y: 65.6, level: 30 },
//   { x: 33, y: 66, level: 31 },
//   { x: 19.5, y: 59, level: 32 },
//   { x: 26.5, y: 54.3, level: 33 },
//   { x: 55, y: 54, level: 34 },
//   { x: 76, y: 52, level: 35 },
//   { x: 86, y: 46, level: 36 },
//   { x: 84, y: 36, level: 37 },
//   { x: 72, y: 37.5, level: 38 },
//   { x: 62, y: 39, level: 39 },
//   { x: 52, y: 40, level: 40 },
//   { x: 42, y: 41, level: 41 },
//   { x: 36, y: 35, level: 42 },
//   { x: 50.5, y: 30, level: 43 },
//   { x: 76, y: 31, level: 44 },
//   { x: 82, y: 27.8, level: 45 },
//   { x: 79, y: 23.5, level: 46 },
//   { x: 68, y: 22, level: 47 },
//   { x: 60, y: 21.5, level: 48 },
//   { x: 50, y: 22.5, level: 49 },
//   { x: 40, y: 24, level: 50 },
//   { x: 34, y: 25.5, level: 51 },
//   { x: 24, y: 29, level: 52 },
//   { x: 19, y: 37, level: 53 },
//   { x: 14, y: 42.5, level: 54 },
// ];

// function getInteractivePoints(currentSpot: number) {
//   // if currentSpot is less than 27, it's map 1
//   if (currentSpot <= 27) return interactivePointsMap1;
//   // if currentSpot is less than 54, it's map 2
//   if (currentSpot <= 54) return interactivePointsMap2;
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
          onLevelSelect(parseInt(level));
        }
      }
    }
  };

  const currentMapImage = () => {
    // if (tempCurrentIslandLevel <= 27) return "https://arweave.net/5pHgEfy8PTzSiByGHkc3kV9Q0k_WGI9vH0tUeRa376I";
    // if (tempCurrentIslandLevel <= 54) return "https://arweave.net/IBWCGccNC1UTFZfHLgfZqATYZvinWiMYDTGg4tzF-NI";
    // return "https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE";\
    if (tempCurrentIslandLevel <= 27) return "https://arweave.net/fXXyF_eEP2ZF0IWKiBflF6HhM1FZcS-rQ9UM9tHZO20";
    if (tempCurrentIslandLevel <= 54) return "https://arweave.net/ojFFGryPHdTlowmEUjOCYUHKi8P8TRss6tmgD7RrO88";
    return "https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE";
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
        
        <img src={currentMapImage()} alt="Game Map" className="w-full h-full object-contain" />
        {tempCurrentIslandLevel == 0? (
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
      )}
     
       

        {/* <img src={"https://arweave.net/5pHgEfy8PTzSiByGHkc3kV9Q0k_WGI9vH0tUeRa376I"} alt="Game Map 1" className="w-full h-full object-contain" /> */}
        {/* <img src={"https://arweave.net/IBWCGccNC1UTFZfHLgfZqATYZvinWiMYDTGg4tzF-NI"} alt="Game Map 2" className="w-full h-full object-contain" /> */}
        {/* <img src={"https://arweave.net/tX8Sx-OUMOnWIA6IbuxFkXvRt3CqD6fnpEqDDPqlOtE"} alt="Game Map 3" className="w-full h-full object-contain" /> */}

        <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          {getInteractivePoints(tempCurrentIslandLevel).map((point, index) => {
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
