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
    gold_earned: number | null;
    gold_lost: number | null;
    battle_win: number | null;
    battle_lost: number | null;
    enemy_killed: number | null;
    player_death: number | null;
    death_streak: number | null;
    pvp: number | null;
}

interface LeaderboardState {
  LeaderboardData: LeaderboardDataType[] | null;
  getParticularLeaderboardData: (metric:string) => Promise<void>;
}
export const useLeaderboardStore = create<LeaderboardState>()(
  devtools(
    (set) => ({
        LeaderboardData: null,
    
        getParticularLeaderboardData: async (metric: string) => {
        const resultData = await sendAndReceiveGameMessage({ tags: [{ name: "Action", value: "Record.getLeaderboardData" },{ name: "metrices", value: metric } ],
            process: RECORD_TOKEN_PROCESS_ID });
            console.log("Ashu : leaddddd: ");
        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) set({ LeaderboardData: JSON.parse(resultData.Messages[0].Data) });
        else set({ LeaderboardData: null });
      },
    }),
    {
      name: "Leaderboard Store",
      enabled: true,
    }
  )
);
