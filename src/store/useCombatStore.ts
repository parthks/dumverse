import { MyMessageResult, sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { Battle } from "@/types/combat";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameStatePages, useGameStore } from "./useGameStore";
import { result } from "@permaweb/aoconnect/browser";
import { GAME_PROCESS_ID } from "@/lib/utils";
import { json } from "stream/consumers";

interface CombatState {
  actionLoading: boolean;
  loading: boolean;
  enteringNewBattle: boolean;
  subProcess: string;
  setsubProcess: (state: string) => void;
  setEnteringNewBattle: (enteringNewBattle: boolean) => void;
  currentBattle: Battle | null;
  setCurrentBattle: (battle_id?: number) => Promise<Battle | null>;
  getOpenBattles: () => Promise<Battle | null>;
  enterNewBattle: (level: number) => Promise<MyMessageResult>;
  userAttack: (npc_id: string) => void;
  userRun: () => void;
  userDrinkPotion: () => void;
  goToMapFromBattle: () => void;
  hasBattleReady: boolean;
  sendBattleReadyRequest:() => void;
}

export const useCombatStore = create<CombatState>()(
  devtools(
    (set, get) => ({
      enteringNewBattle: false,
      setEnteringNewBattle: (enteringNewBattle: boolean) => {
        set({ enteringNewBattle }); // used after 30 second timeout if no battle is found
      },
      loading: false,
      actionLoading: false,
      currentBattle: null,
      subProcess: "",
      setsubProcess: (state) => set({ subProcess: state }),
      getOpenBattles: async () => {
        if (get().currentBattle?.id) {
          return null;
        }
        set({ loading: true, enteringNewBattle: true });
        // console.log("Ashu : Subprocess: "+ get().subProcess);
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Battle.GetOpenBattles",
            },
          ],
          process: get().subProcess,
        });
        const battles = resultData.data as Battle[];
        console.log("Ashu : battles: "+JSON.stringify(battles));
        if (battles && battles.length > 0) {
          set({ currentBattle: battles?.[0], enteringNewBattle: false });
          if (useGameStore.getState().GameStatePage !== GameStatePages.COMBAT) {
            useGameStore.getState().setGameStatePage(GameStatePages.COMBAT);
          }
          if (get().currentBattle && !get().currentBattle?.started){
            get().sendBattleReadyRequest();
          }
          if (get().currentBattle && get().currentBattle?.started && Object.keys(get().currentBattle?.players || {}).length > 1){
            // console.log("Ashu : Combat screen stuck problem solved");
            get().sendBattleReadyRequest();
          }
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
          return battles?.[0];
        }
        set({ loading: false });
        return null;
      },
      setCurrentBattle: async (passed_in_battle_id?: number) => {
        const battle_id = passed_in_battle_id || get().currentBattle?.id;
        const user_id = useGameStore.getState().user?.id;
        if (!battle_id || !user_id) return null;
        set({ loading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
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
          process: get().subProcess,
        });
        const battleMessage = resultData.Messages.find((message) => {
          const tags = message.Tags;
          return tags.find((tag: { name: string; value: string }) => tag.name === "Action" && tag.value === "Battle.Data");
        })?.Data;
        const battle = battleMessage ? (JSON.parse(battleMessage) as Battle) : null;
        set({ loading: false });
        if (battle) {
          set({ currentBattle: battle });
          // if (battle && battle.started){
          //   get().sendBattleReadyRequest();
          // }
          return battle;
        }
        return null;
      },
      enterNewBattle: async (level: number) => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) throw new Error("User not found");
        set({ enteringNewBattle: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
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
          ],
        });
        // console.log("Ashu :  dattt: "+JSON.stringify(resultData));
        console.log("subProcess: "+JSON.stringify(resultData.data.subprocess));
        set({ subProcess: resultData.data.subprocess });
        set({ hasBattleReady: false });
        return resultData;
      },
      userAttack: async (npc_id: string) => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id || !npc_id) return;
        set({ loading: true, actionLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
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
          process: get().subProcess,
        });
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false, actionLoading: false });
      },
      userRun: async () => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id) return;
        set({ loading: true, actionLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
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
          process: get().subProcess,
        });
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false, actionLoading: false });
      },
      userDrinkPotion: async () => {
        const user_id = useGameStore.getState().user?.id;
        const battle_id = get().currentBattle?.id;
        if (!user_id || !battle_id) return;
        // set({ loading: true, actionLoading: true });
        set({ loading: true, actionLoading: false });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
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
          process: get().subProcess,
        });
        const battle = findBattleDataMessage(resultData);
        if (battle) {
          set({ currentBattle: battle as Battle });
        }
        set({ loading: false, actionLoading: false });
      },

      goToMapFromBattle: async () => {
        // if you won, move one step forward of current_spot. Need to update the db for this
        set({ loading: true });
        const user_id = useGameStore.getState().user!.id;
        // even when running away, player is removed from players_alive
        // const isAlive = get().currentBattle?.players_alive.find((playerId) => playerId === user_id?.toString());
        const isAlive = get().currentBattle?.players?.[user_id]?.health ?? 0 > 0;
        if (isAlive) {
          await useGameStore.getState().refreshUserData();
          set({ currentBattle: null, loading: false, hasBattleReady:false });
          useGameStore.getState().goToGameMap();
        } else {
          await useGameStore.getState().goToTown(true);
          set({ currentBattle: null, loading: false, hasBattleReady:false });
        }
      },
      hasBattleReady:false,
      sendBattleReadyRequest: async() => {
        const battle_id = get().currentBattle?.id;
        if (!battle_id) return;
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Battle.UserIsReady",
            },
            {
              name: "BattleId",
              value: battle_id.toString(),
            },
          ],
          process: get().subProcess,
        }); 
        // console.log("Ashu : BatteReady=> "+JSON.stringify(resultData));
        set({ hasBattleReady: resultData.data.hasBattleBegun });
      }
    }),
    {
      name: "Combat Store",
      enabled: true,
    }
  )
);

function findBattleDataMessage(messages: MyMessageResult): Battle | null {
  // console.log("Ashu : 22 "+JSON.stringify(messages));

  const battleData = messages.Messages.find((message) => {
    const tags = message.Tags as { name: string; value: string }[];
    return tags.find((tag) => tag.name === "Action" && tag.value === "Battle.Data");
  });
  // console.log("Ashu : "+JSON.stringify(battleData));
  return battleData ? (JSON.parse(battleData.Data as string) as Battle) : null;
}
