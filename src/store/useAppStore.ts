import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { BazzarProfile } from "@/types/wallet";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect/browser";
import { GAME_PROCESS_ID } from "@/lib/utils";
import { GameUser } from "@/types/game";
import { GameStatePages, useGameStore } from "./useGameStore";
import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";

interface AppState {
  walletAddressID: string | null;
  profileLoading: boolean;
  profileId: string | null;
  profile: BazzarProfile | null;
  assets: { Quantity: number; Id: string }[];
  setWalletAddressID: (address: string | null) => void;
  setProfileLoading: (loading: boolean) => void;
  setProfileId: (profileId: string | null) => void;
  setProfile: (profile: BazzarProfile | null) => void;
  setAssets: (assets: { Quantity: number; Id: string }[]) => void;
  resetProfileData: () => void;
  gameProfiles: GameUser[];
  getGameProfiles: () => void;
  setGameProfiles: (profiles: GameUser[]) => void;
}
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      walletAddressID: null,
      profileLoading: false,
      profileId: null,
      profile: null,
      assets: [],
      setWalletAddressID: (address) => set({ walletAddressID: address }),
      setProfileLoading: (loading) => set({ profileLoading: loading }),
      setProfileId: (profileId) => set({ profileId }),
      setProfile: (profile) => set({ profile }),
      setAssets: (assets) => set({ assets }),
      resetProfileData: () => {
        set({
          profileId: null,
          profile: null,
          assets: [],
          profileLoading: false,
        });
        useGameStore.getState().setGameStatePage(null);
      },
      gameProfiles: [],
      setGameProfiles: (gameProfiles) => set({ gameProfiles }),
      getGameProfiles: async () => {
        const resultData = await sendAndReceiveGameMessage([{ name: "Action", value: "User.UserProfiles" }]);
        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) set({ gameProfiles: JSON.parse(resultData.Messages[0].Data) });
      },
    }),
    {
      name: "App Store",
      enabled: true,
    }
  )
);
