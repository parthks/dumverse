import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { BazzarProfile } from "@/types/wallet";

interface AppState {
  walletAddressID: string | null;
  setWalletAddressID: (address: string | null) => void;
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  profile: BazzarProfile | null;
  setProfile: (profile: BazzarProfile | null) => void;
  assets: { Quantity: number; Id: string }[];
  setAssets: (assets: { Quantity: number; Id: string }[]) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        walletAddressID: null,
        setWalletAddressID: (address) => set({ walletAddressID: address }),
        profileId: null,
        setProfileId: (profileId) => set({ profileId }),
        profile: null,
        setProfile: (profile) => set({ profile }),
        assets: [],
        setAssets: (assets) => set({ assets }),
      }),
      {
        name: "dumverse-storage",
      }
    )
  )
);
