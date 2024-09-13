import { GameUser } from "@/types/game";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const GAME_PROCESS_ID = "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc";
export const COMBAT_PROCESS_ID = "tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlayerTotalHealth(player: GameUser) {
  return 2;
}

export function getPlayerTotalStamina(player: GameUser) {
  return 4;
}

export function getEquippedItem(player: GameUser) {
  const inventory = player.inventory;
  const weapon = inventory.find((item) => item.item_type === "WEAPON" && item.equipped);
  const armor = inventory.find((item) => item.item_type === "ARMOR" && item.equipped);
  return { weapon, armor };
}
