import { MyMessageResult, sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
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
  enterNewBattle: (level: number) => Promise<MyMessageResult>;
  userAttack: (npc_id: string) => void;
  userRun: () => void;
  userDrinkPotion: () => void;
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
        if (battle) {
          set({ currentBattle: battle });
        }
        set({ loading: false });
      },
      enterNewBattle: async (level: number) => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) throw new Error("User not found");
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
        return resultData;
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
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false });
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
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false });
      },
      userDrinkPotion: async () => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id) return;
        set({ loading: true });
        const resultData = await sendAndReceiveGameMessage(
          [
            {
              name: "Action",
              value: "Battle.DrinkPotion",
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
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false });
      },

      goToMapFromBattle: async () => {
        // if you won, move one step forward of current_spot. Need to update the db for this
        set({ loading: true });
        const user_id = useGameStore.getState().user!.id;
        const isAlive = get().currentBattle?.players_alive.find((playerId) => playerId === user_id?.toString());
        await useGameStore.getState().refreshUserData();
        set({ currentBattle: null, loading: false });
        if (isAlive) {
          useGameStore.getState().setGameStatePage(GameStatePages.GAME_MAP);
        } else {
          useGameStore.getState().goToTown();
        }
      },
    }),
    {
      name: "Combat Store",
      enabled: true,
    }
  )
);

function findBattleDataMessage(messages: MyMessageResult): Battle | null {
  const battleData = messages.Messages.find((message) => {
    const tags = message.Tags as { name: string; value: string }[];
    return tags.find((tag) => tag.name === "Action" && tag.value === "Battle.Data");
  });
  return battleData ? (JSON.parse(battleData.Data as string) as Battle) : null;
}
