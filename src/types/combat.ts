// local battle = {
//     id = id,
//     player_id_tried_running = nil,  -- last player that tried to run. NPC will attack critical damage
//     players_attacked = {},          -- list of userIds that have attacked (only after all players have attacked, NPC should attack or after 30 seconds cron tick)
//     players_alive = {},             -- list of userIds
//     npcs_alive = {},                -- list of npc ids
//     players = {},                   -- dictionary of users from the user db directly, key is user_id
//     npcs = {},                      -- dictionary of npc enemy data from constants.lua. key is npc_id
//     log = {},                       -- list of battle logs
//     last_npc_attack_timestamp = {}, -- key is npc_id, value is timestamp
//     ended = false,
//     winner = nil,                   -- npc_id, or a user_id
//     created_at = timestamp
// }

// enemy data
// {
//     id = "NPC_1",
//     name = "Cute Doe Eyed Doe",
//     health = 1,
//     damage = 1,
//     difficulty = "EASY",
//     gold_reward = 1,
// }

import { GameUser, Inventory, ItemType } from "./game";

// UserId is a string of the user_id number to match npc_id and avoid tonumber()
export type Battle = {
  id: number;
  level: number;
  last_npc_attack_timestamp: Record<string, number>;
  last_player_attack_timestamp: Record<string, number>;
  players_attacked: string[];
  players_alive: string[];
  npcs_alive: string[];
  players: Record<
    string,
    Omit<GameUser, "inventory" | "id"> & {
      id: string;
      potion_used: boolean;
      potion: { id: string; item_id: ItemType; health: number };
      added_at_timestamp: number;
      inventory_weapon_id?: string;
      inventory_armor_id?: string;
    }
  >;
  npcs: Record<string, NPC>;
  log: BattleLog[];
  started: boolean;
  ended: boolean;
  winner: string | null;
  created_at: number;
};

export type BattleLog = {
  from: string;
  timestamp: number;
  message: string;
};

export type NPC = {
  id: string;
  name: string;
  total_health: number;
  health: number;
  damage: number;
  difficulty: string;
  gold_reward: number;
  dumz_reward: number;
  extra_gold: number;
};
