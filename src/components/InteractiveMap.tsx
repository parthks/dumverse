import { LAMA_IMAGE, REST_SPOTS } from "@/lib/constants";
// import { cn, isValidSpotToMoveTo } from "@/lib/utils";
import { cn, getInteractivePoints, isValidSpotToMoveTo } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import React, { useEffect } from "react";
import { BOSS_SPOTS } from "@/lib/constants";

// import {
//   interactivePointsMap1,
//   interactivePointsMap2,
//   lammaHeight,
//   lammaWidth,
//   SOUNDS,
// } from "@/lib/constants";

// export const interactivePointsMap3 = [
//   { x: 85.2, y: 69.5, level: 53 },
//   { x: 75, y: 69, level: 54 },
//   { x: 65, y: 68, level: 55 },
//   { x: 55, y: 68.5, level: 56 },
//   { x: 45, y: 68.5, level: 57 },
//   { x: 35, y: 68.5, level: 58 },
//   { x: 24.5, y: 68, level: 59 },
//   { x: 15.5, y: 67, level: 60 },
//   { x: 9.5, y: 60, level: 61 }, //  Rest Spot 5
//   { x: 13, y: 49, level: 62 },
//   { x: 22, y: 46.3, level: 63 },
//   { x: 32, y: 44.5, level: 64 },
//   { x: 43, y: 44.5, level: 65 },
//   { x: 52, y: 44, level: 66 },
//   { x: 60, y: 43, level: 67 },
//   { x: 69, y: 42, level: 68 },
//   { x: 75.3, y: 39, level: 69 },
//   { x: 82, y: 35.5, level: 70 },  //  Rest Spot 6
//   { x: 79, y: 28, level: 71 },
//   { x: 72.5, y: 21, level: 72 },
//   { x: 63, y: 21.3, level: 73 },
//   { x: 53, y: 21.5, level: 74 },
//   { x: 43, y: 21.5, level: 75 },
//   { x: 33, y: 21.7, level: 76 },
//   { x: 24, y: 22.4, level: 77 },
//   // { x: 32, y: 21, level: 80 },
//   { x: 15, y: 22.3, level: 78 },
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
  lamaPosition: LamaPosition;
  onLevelSelect: (level: number) => void;
  tempCurrentIslandLevel: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ tempCurrentIslandLevel, lamaPosition, onLevelSelect }) => {
  const { currentIslandLevel, user, refreshUserData } = useGameStore();

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
}, [user?.current_spot]);


  return (
    <div className="w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}

        <img src={currentMapImage()} alt="Game Map" className="w-full h-full object-contain" />
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
            // console.log("Ashu : currentIslandLevel: "+currentIslandLevel);
            // console.log("Ashu : Point.level: "+point.level);
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
                    BOSS_SPOTS.includes(point.level)
                      ? "fill-red-700"
                      // : point.level % 9 == 0
                      : REST_SPOTS.includes(point.level)
                      ? "fill-purple-700"
                      : isValidSpotToMoveTo(currentIslandLevel, point.level)
                      ? "fill-[#3fe406]"
                      : "fill-black"
                  )}
                  data-level={point.level}
                />
              </>
            );
          })}
          {/* image width="5%" height="10%"  */}
          <image href={LAMA_IMAGE[lamaPosition.src]} x={`${lamaPosition.x}%`} y={`${lamaPosition.y}%`} width="4%" height="11%" preserveAspectRatio="xMidYMid meet">
            <title></title>
          </image>

          {/* {tempCurrentIslandLevel <= 27 ? (
            <image href="https://arweave.net/dB07kjfdIJFICANzB7nkt2W8W2FoO4TbFnAVTHeepzw" x="89%" y="92%" width="3%" preserveAspectRatio="xMidYMid meet">
              <title></title>
            </image>
          ) : (
            <></>
          )} */}

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
