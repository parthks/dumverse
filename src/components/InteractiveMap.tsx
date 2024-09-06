import React, { useEffect, useState } from "react";
import MapImage from "@/assets/map.png";

interface InteractivePoint {
  x: number;
  y: number;
  level: string;
}

interface InteractiveMapProps {
  mapWidth: number;
  mapHeight: number;
  interactivePoints: InteractivePoint[];
  onLevelSelect: (level: string) => void;
  lammaPosition: LammaPosition;
  currentLevel: string;
}

interface LammaPosition {
  x: number;
  y: number;
  src: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ currentLevel, mapWidth, mapHeight, interactivePoints, onLevelSelect, lammaPosition }) => {
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("interactive-point")) {
      const level = event.target.getAttribute("data-level");
      if (level) {
        onLevelSelect(level);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" />
        <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          {interactivePoints.map((point, index) => {
            // if current level is the same as the point level, then add the image to the point
            let lammaImage = "" as any;
            if (currentLevel === point.level) {
              lammaImage = <image href={lammaPosition.src} x={`${lammaPosition.x}%`} y={`${lammaPosition.y}%`} width="10%" height="10%" preserveAspectRatio="xMidYMid meet" />;
            }
            return (
              <>
                <circle
                  key={index}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r="10.5"
                  className="interactive-point fill-red-500 hover:fill-green-500 transition-colors duration-200"
                  data-level={point.level}
                />
              </>
            );
          })}
          <image href={lammaPosition.src} x={`${lammaPosition.x}%`} y={`${lammaPosition.y}%`} width="6%" height="10%" preserveAspectRatio="xMidYMid meet" />;
        </svg>
        {/* <GifPlayer autoplay={true} gif={LammaWalking} still={LammaStill} /> */}
      </div>
    </div>
  );
};

export default InteractiveMap;
