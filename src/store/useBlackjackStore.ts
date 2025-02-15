import {
  MyMessageResult,
  sendAndReceiveGameMessage,
  sendDryRunGameMessage,
} from "@/lib/wallet";
import { Round } from "@/types/blackjack";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GameStatePages, useGameStore } from "./useGameStore";
import { result } from "@permaweb/aoconnect/browser";
import { GAME_PROCESS_ID } from "@/lib/utils";
import { json } from "stream/consumers";

interface BlackjackState {
  currentRound: Round | null;
  enterNewBlackjack: () => Promise<void>;
  getOpenBlackjackRounds: () => Promise<void>;
  placeBet: (betAmount: number) => Promise<void>;
  blackjackInfo: () => Promise<void>;
  hit: () => Promise<void>;
  doubleDown: () => Promise<void>;
  stand: () => Promise<void>;
  userIsReadyForBlackjack: () => Promise<void>;
}

export const useBlackjackStore = create<BlackjackState>()(
  devtools(
    (set, get) => ({
      currentRound: null,
      enterNewBlackjack: async () => {
        const user_id = useGameStore.getState().user?.id;
        if (!user_id) throw new Error("User not found");
        console.log(user_id);
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
        set({currentRound: resultData.data as Round})
        console.log(
          "Ashu :  getOpenBlackjackRounds: " + JSON.stringify(resultData.data)
        );
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
        console.log("Ashu :  blackjackInfo: " + JSON.stringify(resultData));
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
      },
    }),
    {
      name: "Blackjack Store",
      enabled: true,
    }
  )
);
