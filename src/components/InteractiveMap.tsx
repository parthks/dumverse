import React, { useState } from "react";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useCombatStore } from "@/store/useCombatStore";
import { IMAGES } from "@/lib/constants";
import { getPlayerTotalHealth, getPlayerTotalStamina } from "@/lib/utils";

interface InteractivePoint {
  x: number;
  y: number;
  level: number;
}

const imageWidth = 1089; // original map width
const imageHeight = 611; // original map height

interface InteractiveMapProps {
  interactivePoints: InteractivePoint[];
  lammaPosition: LammaPosition;
  onLevelSelect: (level: number) => void;
}

interface LammaPosition {
  x: number;
  y: number;
  src: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ interactivePoints, lammaPosition, onLevelSelect }) => {
  const { currentIslandLevel, setGameStatePage } = useGameStore();
  const { enterNewBattle } = useCombatStore();

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("interactive-point")) {
      const level = event.target.getAttribute("data-level");
      const buttonType = event.target.getAttribute("button-type");
      if (level) {
        onLevelSelect(parseInt(level));
      } else if (buttonType) {
        if (buttonType === "combat") {
          enterNewBattle(currentIslandLevel);
          setGameStatePage(GameStatePages.COMBAT);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0">
        {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
        <img src={"https://arweave.net/nI5UoE2K_wRFpSsaYy3n286QSxBAdrglZ6va4D66pNA"} alt="Game Map" className="w-full h-full object-contain" />
        <svg width="100%" height="100%" viewBox={`0 0 ${imageWidth} ${imageHeight}`} preserveAspectRatio="xMidYMid meet" className="absolute top-0 left-0" onClick={handleClick}>
          {interactivePoints.map((point, index) => {
            // if current level is the same as the point level, then add the image to the point
            let lammaImage = "" as any;
            if (currentIslandLevel === point.level) {
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
          {currentIslandLevel != 0 && (
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
          )}
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
      <image
        href="https://arweave.net/4R0tGBCQTI48nTu1z7n_EZBuXEqvKxvmcoQHHX6Z9hs"
        x={0}
        y={"73.8%"}
        preserveAspectRatio="xMidYMid meet"
        width={(1881 / imageWidth) * 100 * 0.285 + "%"}
        height={(570 / imageHeight) * 100 * 0.285 + "%"}
      />
      <text x={`18%`} y={`80%`} height={"10%"} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold" className="pointer-events-none">
        {user.name}
      </text>
      <image
        href={`https://arweave.net/${user.nft_address ? user.nft_address : IMAGES.DEFAULT_DUMDUM}`}
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
  if (!user) return null;

  const totalHealth = getPlayerTotalHealth(user);
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
          href={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH}
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
  if (!user) return null;

  const totalStamina = getPlayerTotalStamina(user);
  const filledStamina = user.stamina;
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
          href={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA}
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
