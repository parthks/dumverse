import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const GAME_PROCESS_ID = "EGlMBTK5d9kj56rKRMvc4KwYPxZ43Bbs6VqQxnDilSc";
export const COMBAT_PROCESS_ID = "tCNnN9HmJaHHEEYkAub6dNcsB5lVSect6fdP0DE_-XE";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
