import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import type {} from "@redux-devtools/extension";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { RECORD_TOKEN_PROCESS_ID } from "@/lib/utils";
import { useGameStore } from "./useGameStore";


interface LeaderboardDataType {
  id: number;
  user_id: number;
  name: string;
  address: string;
  nft_address: string | null;
  gold_earned: number | null;
  gold_lost: number | null;
  dumz_lost: number | null;
  battle_win: number | null;
  battle_lost: number | null;
  enemy_killed: number | null;
  player_death: number | null;
  death_streak: number | null;
  gold_win_in_pvp: number | null;
  dumz_win_in_pvp: number | null;
  pvp_wins: number | null;
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
  player_death: {
    name: string;
    address: string;
    nft_address: string | null;
    user_id: number;
    id: number;
    player_death: number;
  } | null;
}

interface LeaderboardState {
  LeaderboardData: LeaderboardDataType[] | null;
  PlayerLeaderboardProfileData: LeaderboardDataType[] | null;
  GoldEarnedLeaderboardData: LeaderboardDataType[] | null;
  GoldLostLeaderboardData: LeaderboardDataType[] | null;
  DumzLostLeaderboardData: LeaderboardDataType[] | null;
  BattleWinLeaderboardData: LeaderboardDataType[] | null;
  BattleLostLeaderboardData: LeaderboardDataType[] | null;
  EnemiesKilledLeaderboardData: LeaderboardDataType[] | null;
  PlayerDeathLeaderboardData: LeaderboardDataType[] | null;
  DeathStreakLeaderboardData: LeaderboardDataType[] | null;
  GoldWinInPvPLeaderboardData: LeaderboardDataType[] | null;
  DumzWinInPvPLeaderboardData: LeaderboardDataType[] | null;
  PvpWinLeaderboardData: LeaderboardDataType[] | null;
  HallOfFameLeaderboardData: HallOfFameLeaderboardType;
  // getParticularLeaderboardData: (metric: string) => Promise<void>;
  playerLeaderboardProfileInfo: () => Promise<void>;
  goldEarnedLeaderboardInfo: () => Promise<void>;
  goldLostLeaderboardInfo: () => Promise<void>;
  dumzLostLeaderboardInfo: () => Promise<void>;
  battleWinLeaderboardInfo: () => Promise<void>;
  battleLostLeaderboardInfo: () => Promise<void>;
  enemiesKilledLeaderboardInfo: () => Promise<void>;
  playerDeathLeaderboardInfo: () => Promise<void>;
  deathStreakLeaderboardInfo: () => Promise<void>;
  goldWinInPvPLeaderboardInfo: () => Promise<void>;
  dumzWinInPvPLeaderboardInfo: () => Promise<void>;
  pvpWinLeaderboardInfo: () => Promise<void>;
  topThreePlayerInfo: () => Promise<void>;
}
export const useLeaderboardStore = create<LeaderboardState>()(
  devtools(
    (set,get) => ({
      LeaderboardData: null,
      PlayerLeaderboardProfileData: null,
      GoldEarnedLeaderboardData: null,
      GoldLostLeaderboardData: null,
      DumzLostLeaderboardData: null,
      BattleWinLeaderboardData: null,
      BattleLostLeaderboardData: null,
      EnemiesKilledLeaderboardData: null,
      PlayerDeathLeaderboardData: null,
      DeathStreakLeaderboardData: null,
      GoldWinInPvPLeaderboardData: null,
      DumzWinInPvPLeaderboardData: null,
      PvpWinLeaderboardData: null,
      HallOfFameLeaderboardData: {
        gold_earned: null,
        battle_win: null,
        player_death: null,
      },
      // getParticularLeaderboardData: async (metric: string) => {
      //   const resultData = await sendAndReceiveGameMessage({
      //     tags: [
      //       { name: "Action", value: "Record.getLeaderboardData" },
      //       { name: "metrices", value: metric },
      //     ],
      //     process: RECORD_TOKEN_PROCESS_ID,
      //   });

      //   if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
      //     const leaderboardArray = JSON.parse(resultData.Messages[0].Data);

      //     if (Array.isArray(leaderboardArray) && leaderboardArray.length > 0) {
      //       const firstEntry = leaderboardArray[0];
      //       set((state) => ({
      //         HallOfFameLeaderboardData: {
      //           ...state.HallOfFameLeaderboardData,
      //           [metric]: firstEntry,
      //         },
      //       }));
      //     }
      //     console.log(
      //       "Ashu : leaderboard: " + JSON.stringify(leaderboardArray)
      //     );
      //     set({ LeaderboardData: leaderboardArray });
      //   } else {
      //     set({ LeaderboardData: null });
      //   }
      // },
      playerLeaderboardProfileInfo: async () => {                  // Personal Leaderboard Stats 
        const user = useGameStore.getState().user;
        const resultData = await sendDryRunGameMessage({
          tags: [
            { name: "Action", value: "Leaderboard.PlayerLeaderboardProfile" },
            { name: "UserId", value: user?.id?.toString() || "" },
          ],
        });
        set({ PlayerLeaderboardProfileData: resultData.data as LeaderboardDataType[] });
        console.log("Ashu : leaderboard PlayerLeaderboardProfile: "+JSON.stringify(resultData));
      },
      goldEarnedLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.GoldEarned" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.gold_earned > 0);
        set({ GoldEarnedLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard GoldEarnedLeaderboardInfo: "+JSON.stringify(resultData));
      },
      goldLostLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.GoldLost" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.gold_lost > 0);
        set({ GoldLostLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      dumzLostLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.DumzLost" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.dumz_lost > 0);
        set({ DumzLostLeaderboardData: filteredData});
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      battleWinLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.BattleWin" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.battle_win > 0);
        set({ BattleWinLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      battleLostLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.BattleLost" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.battle_lost > 0);
        set({ BattleLostLeaderboardData: filteredData});
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      enemiesKilledLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.EnemiesKilled" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.enemy_killed > 0);
        set({ EnemiesKilledLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      playerDeathLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.PlayerDeath" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.player_death > 0);
        set({ PlayerDeathLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      deathStreakLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.DeathStreak" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.death_streak > 0);
        set({ DeathStreakLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      goldWinInPvPLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.GoldWinInPvP" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.gold_win_in_pvp > 0);
        set({ GoldWinInPvPLeaderboardData: filteredData });
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      dumzWinInPvPLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.DumzWinInPvP" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.dumz_win_in_pvp > 0);
        set({ DumzWinInPvPLeaderboardData: filteredData});
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      pvpWinLeaderboardInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.PvPWin" }],
        });
        const filteredData = resultData.data.filter((entry: any) => entry.pvp_wins > 0);
        set({ PvpWinLeaderboardData: filteredData});
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData));
      },
      topThreePlayerInfo: async () => {
        const resultData = await sendDryRunGameMessage({
          tags: [{ name: "Action", value: "Leaderboard.TopThreePlayerInfo" }],
        });
        const top_three_player = resultData.data;
        // Object.keys(get().HallOfFameLeaderboardData).map((val,key)=>{
        //   top_three_player.map((val1: any, key1: any)=>{
        //     set({HallOfFameLeaderboardData[val]:val1});
        //   })
        // })
        
        if (top_three_player.length > 0) {
          set({
            HallOfFameLeaderboardData: {
              gold_earned: top_three_player[0],
              battle_win: top_three_player[1],
              player_death: top_three_player[2],
            }
          });
        }
        // console.log("Ashu : leaderboard: "+JSON.stringify(resultData.data));
      },
    }),
    {
      name: "Leaderboard Store",
      enabled: true,
    }
  )
);
