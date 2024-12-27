import { sendAndReceiveGameMessage } from "@/lib/wallet";
import type {} from "@redux-devtools/extension";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RECORD_TOKEN_PROCESS_ID } from "@/lib/utils";

interface LeaderboardDataType {
    id: number;
    user_id: number;
    name: string;
    address: string;
    nft_address: string | null;
    gold_earned: number | null;
    gold_lost: number | null;
    battle_win: number | null;
    battle_lost: number | null;
    enemy_killed: number | null;
    player_death: number | null;
    death_streak: number | null;
    pvp: number | null;
}

interface HallOfFameLeaderboardType {
    gold_earned: {
      name: string;
      address: string;
      nft_address: string | null;
      user_id: number;
      id: number;
      gold_earned: number;
    } | null;
    battle_win: {
      name: string;
      address: string;
      nft_address: string | null;
      user_id: number;
      id: number;
      battle_win: number;
    } | null;
    enemy_killed: {
      name: string;
      address: string;
      nft_address: string | null;
      user_id: number;
      id: number;
      enemy_killed: number;
    } | null;
  }

interface LeaderboardState {
  LeaderboardData: LeaderboardDataType[] | null;
  HallOfFameLeaderboardData: HallOfFameLeaderboardType;
  getParticularLeaderboardData: (metric:string) => Promise<void>;
}
export const useLeaderboardStore = create<LeaderboardState>()(
  devtools(
    (set) => ({
        LeaderboardData: null,
        HallOfFameLeaderboardData: {
            gold_earned: null,
            battle_win: null,
            enemy_killed: null,
          },
          getParticularLeaderboardData: async (metric: string) => {
            const resultData = await sendAndReceiveGameMessage({
              tags: [
                { name: "Action", value: "Record.getLeaderboardData" },
                { name: "metrices", value: metric },
              ],
              process: RECORD_TOKEN_PROCESS_ID,
            });
          
            if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
              const leaderboardArray = JSON.parse(resultData.Messages[0].Data);
          
              if (Array.isArray(leaderboardArray) && leaderboardArray.length > 0) {
                const firstEntry = leaderboardArray[0];
                set((state) => ({
                  HallOfFameLeaderboardData: {
                    ...state.HallOfFameLeaderboardData,
                    [metric]: firstEntry,
                  },
                }));
              }
          
              set({ LeaderboardData: leaderboardArray });
            } else {
              set({ LeaderboardData: null });
            }
          },
          
    }),
    {
      name: "Leaderboard Store",
      enabled: true,
    }
  )
);
