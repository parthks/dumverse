// import { interactivePoints } from "@/components/InteractiveMap";
import { GameUser, LamaPosition } from "@/types/game";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { interactivePointsMap1, interactivePointsMap2, interactivePointsMap3, lammaHeight, lammaWidth } from "./constants";

export const GAME_PROCESS_ID = "_-h1jIlG-9BotgyC9CoikKrU0JbS5Pf8yBr6Nhm1YDA"; //"EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc";
export const COMBAT_PROCESS_ID = "BzQAmLBXwHvzCGPFHw1TlTbS8ramHzCniFT8bgE2ERU"; //TputK13wn_0L0AJlOYpOrwzyAonF55k1VuEAvnkaitQ "tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE";
export const CHAT_PROCESS_ID = "uln9Hp5_AE_rbDwDJYmv2s4A8Z0NLu-669x_I0aUmGI"; //"BzQAmLBXwHvzCGPFHw1TlTbS8ramHzCniFT8bgE2ERU"; //"tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE";
export const DUMZ_TOKEN_PROCESS_ID = "mdZ4A4RJpd47KEmirFTyjRuTFxc52g2UYahrsmAe-dk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEquippedItem(player: GameUser) {
  const inventory = player.inventory;
  const weapon = inventory.find((item) => item.item_type === "WEAPON" && item.equipped);
  const armor = inventory.find((item) => item.item_type === "ARMOR" && item.equipped);
  return { weapon, armor };
}

export function getInteractivePoints(currentSpot: number) {
  // if currentSpot is less than 27, it's map 1
  if (currentSpot <= 27) return interactivePointsMap1;
  // if currentSpot is less than 54, it's map 2
  if (currentSpot <= 54) return interactivePointsMap2;
  return interactivePointsMap3;
}

export function getInitialLamaPosition(): LamaPosition {
  return {
    x: 81,
    y: 60,
    src: "STAND_LEFT",
  };
  // if (currentSpot <= 54)
  //   return {
  //     x: 90.2,
  //     y: 54.8,
  //     src: "STAND_LEFT",
  //   };
  // return {
  //   x: 90.2,
  //   y: 70,
  //   src: "STAND_LEFT",
  // };
}

export function getCurrentLamaPosition(player: GameUser) {
  let lamaPosition = getInitialLamaPosition();
  if (player.current_spot) {
    const point = getInteractivePoints(player.current_spot).find((point) => point.level === player.current_spot);
    if (point) {
      lamaPosition = {
        x: point.x - lammaWidth / 2,
        y: point.y - lammaHeight,
        src: "STAND_LEFT",
      };
    }
  }
  return {
    currentIslandLevel: player.current_spot,
    lamaPosition,
  };
}

// equivalent function is also in backend/game/handlers/combat.lua
export function isValidSpotToMoveTo(currentSpot: number, targetSpot: number) {
  if (currentSpot === targetSpot) return true;
  if (currentSpot == 0 && targetSpot == 28) return true;
  if (currentSpot == 0 && targetSpot == 55) return true;

  const nextSpot = currentSpot + 1;
  const previousSpot = currentSpot - 1;
  const nextNextSpot = currentSpot + 2;
  const previousPreviousSpot = currentSpot - 2;

  const isNextSpotRest = nextSpot % 9 == 0;
  const isPreviousSpotRest = previousSpot % 9 == 0;

  return [nextSpot, previousSpot].includes(targetSpot) || (isNextSpotRest && targetSpot === nextNextSpot) || (isPreviousSpotRest && targetSpot === previousPreviousSpot);
}

// Helper functions
const calculatePosition = (x: number, y: number) => ({
  left: `${x}%`,
  top: `${y}%`,
});

const calculateSize = (width: number) => {
  const base = {
    width: `${width}%`,
    height: `auto`,
  };

  return base;
};

const calculateTransform = (x: number, y: number) => ({
  transform: `translate(-${x}%, -${y}%)`,
});

export const calculatePositionAndSize = (x: number, y: number, width: number) => {
  return {
    ...calculatePosition(x, y),
    ...calculateSize(width),
    ...calculateTransform(50, 50),
  };
};
