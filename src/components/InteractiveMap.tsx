import React from "react";
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
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ mapWidth, mapHeight, interactivePoints, onLevelSelect }) => {
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
          {interactivePoints.map((point, index) => (
            <circle
              key={index}
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r="14"
              className="interactive-point fill-black hover:fill-green-500 transition-colors duration-200"
              data-level={point.level}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default InteractiveMap;
