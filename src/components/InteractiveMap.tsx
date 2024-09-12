import React from "react";
import { useGameStore } from "@/store/useGameStore";

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
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
        <img src={"https://arweave.net/od4qHpViFwicbuphNHsCihAU2UjI-PygfZcBLP-hAJo"} alt="Game Map" className="w-full h-full object-contain" />
        <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          {interactivePoints.map((point, index) => {
            // if current level is the same as the point level, then add the image to the point
            let lammaImage = "" as any;
            if (currentLevel === point.level) {
              lammaImage = (
                <image href={lammaPosition.src} x={`${lammaPosition.x}%`} y={`${lammaPosition.y}%`} width="10%" height="10%" preserveAspectRatio="xMidYMid meet">
                  <title>Lamma</title>
                </image>
              );
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
          <image href={lammaPosition.src} x={`${lammaPosition.x}%`} y={`${lammaPosition.y}%`} width="6%" height="10%" preserveAspectRatio="xMidYMid meet">
            <title>Lamma</title>
          </image>
          <LoadUserDetails />
        </svg>
      </div>
    </div>
  );
};

// TODO: If name is bigger than input, then truncate it and add ...
function LoadUserDetails() {
  const { user } = useGameStore();
  if (!user) return null;

  return (
    <>
      <text x={`18%`} y={`80%`} height={"10%"} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" className="pointer-events-none">
        {user.name}
      </text>
      <image
        href={`https://arweave.net/${user.nft_address ? user.nft_address : "dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"}`}
        x={`-1.9%`}
        y={`77.8%`}
        width="20.3%"
        height="20.3%"
        preserveAspectRatio="xMidYMid meet"
      >
        <title>Dumdumz NFT</title>
      </image>
      <HealthBar />
      <StaminaBar />
    </>
  );
}

function HealthBar() {
  const { user } = useGameStore();
  const FilledHealthSource = "https://arweave.net/htFD_LolJawKKO5P9BOO8B2XajxBuuxSvmTpCpNsUvA";
  const EmptyHealthSource = "https://arweave.net/jSCG0qQySh3soDYdLwKiU6WKCUAQaoGEKIk47qDS6Aw";
  if (!user) return null;

  const totalHealth = 2; // TODO: Set dynamically
  const filledHealth = user.health;
  const emptyHealth = totalHealth - filledHealth;
  const startX = 15;
  const startY = 83;
  const width = 4;
  const height = 4;

  const gap = 3;

  return (
    <>
      {Array.from({ length: totalHealth }).map((_, index) => (
        <image
          key={index}
          href={index < filledHealth ? FilledHealthSource : EmptyHealthSource}
          x={`${startX + index * gap}%`}
          y={`${startY}%`}
          width={`${width}%`}
          height={`${height}%`}
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Heart</title>
        </image>
      ))}
    </>
  );
}

function StaminaBar() {
  const { user } = useGameStore();
  const FilledStaminaSource = "https://arweave.net/dhH6e0gRWjNDWd3UK7dXvZbUlnZHBWtFFYUKQ16FAvg";
  const EmptyStaminaSource = "https://arweave.net/jvZ3mUBMgiST4-dt9FmH1o4U2_97oBVHjp9zBim2hWY";
  if (!user) return null;

  const totalStamina = 4; // TODO: Set dynamically
  const filledStamina = user.stamina_balance;
  const emptyStamina = totalStamina - filledStamina;
  const startX = 14;
  const startY = 87.5;
  const width = 6;
  const height = 6;

  const gap = 2.5;

  return (
    <>
      {Array.from({ length: totalStamina }).map((_, index) => (
        <image
          key={index}
          href={index < filledStamina ? FilledStaminaSource : EmptyStaminaSource}
          x={`${startX + index * gap}%`}
          y={`${startY}%`}
          width={`${width}%`}
          height={`${height}%`}
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Stamina</title>
        </image>
      ))}
    </>
  );
}

function Inventory() {
  const { user } = useGameStore();
  if (!user) return null;
  const inventory = user.inventory;
  const weapon = inventory.find((item) => item.item_type === "WEAPON");
  const armor = inventory.find((item) => item.item_type === "ARMOR");
  const potion = inventory.find((item) => item.item_type === "POTION");

  return (
    <>
      <text x={`18%`} y={`80%`} height={"10%"} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" className="pointer-events-none">
        {user.name}
      </text>
    </>
  );
}

export default InteractiveMap;
