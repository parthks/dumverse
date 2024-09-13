import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { Battle } from "@/types/combat";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameStatePages, useGameStore } from "./useGameStore";
import { result } from "@permaweb/aoconnect/browser";
import { GAME_PROCESS_ID } from "@/lib/utils";

interface CombatState {
  loading: boolean;
  enteringNewBattle: boolean;
  currentBattle: Battle | null;
  setCurrentBattle: (battle_id?: number) => void;
  getOpenBattles: () => void;
  enterNewBattle: (level: number) => void;
  userAttack: (npc_id: string) => void;
  userRun: () => void;
  goToMapFromBattle: () => void;
}

export const useCombatStore = create<CombatState>()(
  devtools(
    (set, get) => ({
      enteringNewBattle: false,
      loading: false,
      currentBattle: null,
      getOpenBattles: async () => {
        set({ loading: true });
        const resultData = await sendAndReceiveGameMessage(
          [
            {
              name: "Action",
              value: "Battle.GetOpenBattles",
            },
          ],
          "combat"
        );
        const battles = resultData.data as Battle[];
        if (battles && battles.length > 0) {
          set({ currentBattle: battles?.[0], enteringNewBattle: false });
          if (useGameStore.getState().GameStatePage !== GameStatePages.COMBAT) {
            useGameStore.getState().setGameStatePage(GameStatePages.COMBAT);
          }
        }
        set({ loading: false });
        return;
      },
      setCurrentBattle: async (passed_in_battle_id?: number) => {
        const battle_id = passed_in_battle_id || get().currentBattle?.id;
        const user_id = useGameStore.getState().user?.id;
        if (!battle_id || !user_id) return;
        set({ loading: true });
        const resultData = await sendDryRunGameMessage(
          [
            {
              name: "Action",
              value: "Battle.Info",
            },
            {
              name: "BattleId",
              value: battle_id.toString(),
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
          ],
          "combat"
        );
        const battle = resultData.data?.id ? (resultData.data as Battle) : null;
        set({ currentBattle: battle, loading: false });
      },
      enterNewBattle: async (level: number) => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) return;
        set({ enteringNewBattle: true });
        const resultData = await sendAndReceiveGameMessage([
          {
            name: "Action",
            value: "Combat.EnterNewCombat",
          },
          {
            name: "Level",
            value: level.toString(),
          },
          {
            name: "UserId",
            value: user_id.toString(),
          },
        ]);
        // const battle = resultData.data as Battle;
        // set({ currentBattle: battle });
        // set({ enteringNewBattle: false });
      },
      userAttack: async (npc_id: string) => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id || !npc_id) return;
        set({ loading: true });
        const resultData = await sendAndReceiveGameMessage(
          [
            {
              name: "Action",
              value: "Battle.UserAttack",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "BattleId",
              value: battle_id.toString(),
            },
            {
              name: "AttackEntityId",
              value: npc_id,
            },
          ],
          "combat"
        );
        const battle = resultData.data as Battle;
        set({ currentBattle: battle, loading: false });
      },
      userRun: async () => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id) return;
        set({ loading: true });
        const resultData = await sendAndReceiveGameMessage(
          [
            {
              name: "Action",
              value: "Battle.UserRun",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "BattleId",
              value: battle_id.toString(),
            },
          ],
          "combat"
        );
        const battle = resultData.data as Battle;
        set({ currentBattle: battle, loading: false });
      },
      goToMapFromBattle: async () => {
        set({ currentBattle: null, loading: false });
        useGameStore.getState().setGameStatePage(GameStatePages.GAME_MAP);
      },
    }),
    {
      name: "Combat Store",
      enabled: true,
    }
  )
);
