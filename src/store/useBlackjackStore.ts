import {
  MyMessageResult,
  sendAndReceiveGameMessage,
  sendDryRunGameMessage,
} from "@/lib/wallet";
import { Round } from "@/types/blackjack";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameStatePages, useGameStore } from "./useGameStore";

interface BlackjackState {
  blackjackStart: boolean;
  setBlackjackStart: (state: boolean) => void;
  currentRound: Round | null;
  enterNewBlackjack: () => Promise<MyMessageResult>;
  getOpenBlackjackRounds: () => Promise<void>;
  placeBet: (betAmount: number) => Promise<MyMessageResult | undefined>;
  blackjackInfo: () => Promise<void>;
  hit: () => Promise<void>;
  doubleDown: () => Promise<void>;
  stand: () => Promise<void>;
  userIsReadyForBlackjack: () => Promise<void>;
}

export const useBlackjackStore = create<BlackjackState>()(
  devtools(
    (set, get) => ({
      blackjackStart: false,
      setBlackjackStart: (state) => set({ blackjackStart: state }),
      currentRound: null,
      enterNewBlackjack: async () => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) throw new Error("User not found");
        set({ currentRound: null });
        const tags = [
          {
            name: "Action",
            value: "BlackjackMatch.EnterNewBlackjackMatch",
          },
          {
            name: "UserId",
            value: user_id.toString(),
          },
        ];
        const resultData = await sendAndReceiveGameMessage({ tags });
        console.log("Ashu :  enterNewBlackjack: " + JSON.stringify(resultData));
        return resultData;
      },
      getOpenBlackjackRounds: async () => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) throw new Error("User not found");
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.GetOpenBlackjackRounds",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
          ],
          process: "blackjack",
        });
        set({
          currentRound: JSON.parse(
            resultData.Messages[resultData.Messages.length - 1].Data
          ) as Round,
        });
        console.log(
          "Ashu :  getOpenBlackjackRounds: " +
            JSON.stringify(resultData)
        );
        if (
          JSON.parse(
            resultData.Messages[resultData.Messages.length - 1].Data
          ) &&
          JSON.parse(resultData.Messages[resultData.Messages.length - 1].Data)
            .players[user_id.toString()].betPlaced
        ) {
          await get().userIsReadyForBlackjack();
        }
      },
      placeBet: async (betAmount) => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.PlaceBet",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
            {
              name: "Bet",
              value: betAmount.toString(),
            },
          ],
          process: "blackjack",
        });
        console.log("Ashu :  placeBet: " + JSON.stringify(resultData));
        useGameStore.getState().refreshUserData();
        return resultData;
      },
      blackjackInfo: async () => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;

        const resultData = await sendDryRunGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.Info",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
          ],
          process: "blackjack",
        });

        console.log("Ashu : blackjackInfo: " + JSON.stringify(resultData));

        // // Check if Messages array has at least 2 elements
        // if (resultData.Messages && resultData.Messages.length > 1) {
        //     // Safely access the second message and set currentRound
        //     set({ currentRound: JSON.parse(resultData.Messages[1].Data) as Round });
        // } else {
        //     console.error("Error: No second message found in resultData");
        // }

        set({
          currentRound: JSON.parse(
            resultData.Messages[resultData.Messages.length - 1].Data
          ) as Round,
        });

        if (resultData.data?.ended) {
          useGameStore.getState().refreshUserData();
        }
      },
      hit: async () => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;

        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.Hit",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
          ],
          process: "blackjack",
        });
        console.log("Ashu :  hit: " + JSON.stringify(resultData));
      },
      doubleDown: async () => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;

        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.DoubleDown",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
          ],
          process: "blackjack",
        });
        console.log("Ashu :  doubleDown: " + JSON.stringify(resultData));
      },
      stand: async () => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;

        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.Stand",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
          ],
          process: "blackjack",
        });
        console.log("Ashu :  stand: " + JSON.stringify(resultData));
      },
      userIsReadyForBlackjack: async () => {
        const user_id = useGameStore.getState().user?.id as number;
        const round_id = get().currentRound?.id as number;
        if (!user_id || !round_id) return;

        const resultData = await sendAndReceiveGameMessage({
          tags: [
            {
              name: "Action",
              value: "Blackjack.UserIsReadyForBlackjack",
            },
            {
              name: "UserId",
              value: user_id.toString(),
            },
            {
              name: "RoundId",
              value: round_id.toString(),
            },
          ],
          process: "blackjack",
        });
        console.log(
          "Ashu :  userIsReadyForBlackjack: " + JSON.stringify(resultData)
        );
        get().blackjackInfo();
      },
    }),
    {
      name: "Blackjack Store",
      enabled: true,
    }
  )
);
