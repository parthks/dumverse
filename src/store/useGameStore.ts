import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAppStore } from "./useAppStore";
import { result, results, message, spawn, monitor, unmonitor, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import { GAME_PROCESS_ID } from "@/lib/utils";
import { GameUser, Inventory } from "@/types/game";
import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";

export enum GameStatePages {
  HOME = "HOME",
  PROFILE = "PROFILE",
}
interface GameState {
  GameStatePage: GameStatePages | null;
  setGameStatePage: (state: GameStatePages | null) => void;
  registerNewUser: () => void;
  user: GameUser | null;
  setUser: (user: GameUser | null) => void;
  refreshUserData: (userId?: number) => void;
  inventory: Inventory[];
  setInventory: (inventory: Inventory[]) => void;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      GameStatePage: null,
      setGameStatePage: (state) => set({ GameStatePage: state }),
      registerNewUser: async () => {
        const { name, selectedNFT } = useAppStore.getState();
        const tags = [
          { name: "Action", value: "Users.AddNewUser" },
          { name: "Name", value: name },
        ];
        if (selectedNFT) {
          tags.push({ name: "NFT_Address", value: selectedNFT });
        }
        const resultData = await sendAndReceiveGameMessage(tags);
        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
          const data = JSON.parse(resultData.Messages[0].Data);
          if (data.status === "Success") {
            get().setUser(data.data);
          }
        }
      },
      user: null,
      setUser: (user) => {
        if (user) {
          set({ GameStatePage: GameStatePages.HOME });
          get().refreshUserData(user.id);
        }
      },
      refreshUserData: async (userId?: number) => {
        const user_id = userId ? userId : get().user?.id;
        if (!user_id) return;

        const resultData = await sendDryRunGameMessage([
          { name: "Action", value: "User.Info" },
          { name: "UserId", value: user_id.toString() },
        ]);

        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
          const user = JSON.parse(resultData.Messages[0].Data);
          const inventory = user.inventory;
          set({ user: user, inventory: inventory });
        }
      },
      inventory: [],
      setInventory: (inventory) => set({ inventory }),
    }),
    {
      name: "Game Store",
      enabled: true,
    }
  )
);
