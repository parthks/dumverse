import { interactivePoints, lammaHeight, lammaWidth } from "@/pages/GameMap";
import { initialLamaPosition } from "@/store/useGameStore";
import { GameUser } from "@/types/game";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const GAME_PROCESS_ID = "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc";
export const COMBAT_PROCESS_ID = "tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEquippedItem(player: GameUser) {
  const inventory = player.inventory;
  const weapon = inventory.find((item) => item.item_type === "WEAPON" && item.equipped);
  const armor = inventory.find((item) => item.item_type === "ARMOR" && item.equipped);
  return { weapon, armor };
}

export function getCurrentLamaPosition(player: GameUser) {
  let lamaPosition = initialLamaPosition;
  if (player.current_spot) {
    const point = interactivePoints.find((point) => point.level === player.current_spot);
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

  const nextSpot = currentSpot + 1;
  const previousSpot = currentSpot - 1;
  const nextNextSpot = currentSpot + 2;
  const previousPreviousSpot = currentSpot - 2;

  const isNextSpotRest = [9, 18, 27].includes(nextSpot);
  const isPreviousSpotRest = [9, 18, 27].includes(previousSpot);

  return [nextSpot, previousSpot].includes(targetSpot) || (isNextSpotRest && targetSpot === nextNextSpot) || (isPreviousSpotRest && targetSpot === previousPreviousSpot);
}
