import { sendAndReceiveGameMessage } from "@/lib/wallet";
import { GameUser } from "@/types/game";
import { BazzarProfile } from "@/types/wallet";
import type {} from "@redux-devtools/extension";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useGameStore } from "./useGameStore";

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
  gameProfiles: null | GameUser[];
  getGameProfiles: () => void;
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
      gameProfiles: null,
      getGameProfiles: async () => {
        const resultData = await sendAndReceiveGameMessage({ tags: [{ name: "Action", value: "User.UserProfiles" }] });
        console.log("Ashu : getGameProfiles: "+ JSON.stringify(resultData));
        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) set({ gameProfiles: JSON.parse(resultData.Messages[0].Data) });
        else set({ gameProfiles: [] });
      },
    }),
    {
      name: "App Store",
      enabled: true,
    }
  )
);
