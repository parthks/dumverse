import LammaStandLeft from "@/assets/lamma_stand_left.png";
import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { Bank, BankTransaction, GameUser, Inventory, Item, LamaPosition, Shop, TokenType } from "@/types/game";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAppStore } from "./useAppStore";
import { interactivePoints } from "@/pages/GameMap";
import { getCurrentLamaPosition } from "@/lib/utils";
import { useCombatStore } from "./useCombatStore";

export enum GameStatePages {
  HOME = "HOME",
  PROFILE = "PROFILE",
  BANK = "BANK",
  SHOP = "SHOP",
  GAME_MAP = "GAME_MAP",
  COMBAT = "COMBAT",
  TOWN = "TOWN",
  REST_AREA = "REST_AREA",
}

export const initialLamaPosition: LamaPosition = {
  x: 81,
  y: 60,
  src: "STAND_LEFT",
};

interface GameState {
  GameStatePage: GameStatePages | null;
  setGameStatePage: (state: GameStatePages | null) => void;
  registerNewUser: (name: string, nft?: string) => Promise<void>;
  user: GameUser | null;
  setUserOnLogin: (user: GameUser | null) => void;
  refreshUserData: (userId?: number) => Promise<GameUser | null>;
  inventory: Inventory[];
  setInventory: (inventory: Inventory[]) => void;
  bank: (Bank & { transactions: BankTransaction[] }) | null;
  getBank: () => Promise<void>;
  bankDataLoading: boolean;
  bankTransactionLoading: boolean;
  deposit: (amount: number, tokenType: TokenType) => Promise<void>;
  withdraw: (amount: number, tokenType: TokenType) => Promise<void>;
  claimAirdrop: (tokenType: TokenType) => Promise<void>;
  shop: Shop | null;
  getShop: () => Promise<void>;
  buyItem: (item: Item, tokenType: TokenType) => Promise<void>;
  buyItemLoading: boolean;
  consumeItem: (inventoryId: number) => Promise<void>;
  currentIslandLevel: number;
  setCurrentIslandLevel: (level: number) => void;
  lamaPosition: LamaPosition;
  setLamaPosition: (position: LamaPosition) => void;
  goToTown: () => void;
  goToRestArea: () => void; // goes to the nearest rest area (+- 1 from current level)
  exitTown: () => void;
  regenerateEnergy: () => Promise<void>;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      GameStatePage: null,
      setGameStatePage: (state) => set({ GameStatePage: state }),
      registerNewUser: async (name, selectedNFT) => {
        // const { name, selectedNFT } = useAppStore.getState();
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
            get().setUserOnLogin(data.data);
          }
        }
      },
      user: null,
      setUserOnLogin: (user) => {
        if (user) {
          if (user.current_battle_id) {
            // user is in a battle
            useCombatStore.getState().getOpenBattles();
            set({ GameStatePage: GameStatePages.COMBAT });
          } else if (user.current_spot) {
            // user is in a spot
            set({ GameStatePage: GameStatePages.GAME_MAP, ...getCurrentLamaPosition(user) });
          } else {
            // user is in town
            set({ GameStatePage: GameStatePages.TOWN });
          }
          get().refreshUserData(user.id);
        }
      },
      refreshUserData: async (userId?: number): Promise<GameUser | null> => {
        const user_id = userId ? userId : get().user?.id;
        if (!user_id) return null;

        const resultData = await sendDryRunGameMessage([
          { name: "Action", value: "User.Info" },
          { name: "UserId", value: user_id.toString() },
        ]);

        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
          const user = JSON.parse(resultData.Messages[0].Data);
          const inventory = user.inventory;
          set({ user: user, inventory: inventory, currentIslandLevel: user.current_spot });
          return user;
        }
        return null;
      },
      inventory: [],
      setInventory: (inventory) => set({ inventory }),
      bank: null,
      bankDataLoading: false,
      getBank: async () => {
        set({ bankTransactionLoading: false, bankDataLoading: true });
        const resultData = await sendDryRunGameMessage([
          { name: "Action", value: "Bank.Info" },
          { name: "UserId", value: get().user?.id.toString()! },
        ]);
        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
          const bankData = JSON.parse(resultData.Messages[0].Data);
          const bank = bankData.bank;
          bank.transactions = bankData.transactions;
          set({ bank: bank });
        }
        set({ bankDataLoading: false });
      },
      bankTransactionLoading: false,
      deposit: async (amount, tokenType) => {
        set({ bankTransactionLoading: true });
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "Bank.Deposit" },
          { name: "UserId", value: get().user?.id.toString()! },
          { name: "Amount", value: amount.toString() },
          { name: "TokenType", value: tokenType },
        ]);
        await get().getBank();
        await get().refreshUserData();
        set({ bankTransactionLoading: false });
      },
      withdraw: async (amount, tokenType) => {
        set({ bankTransactionLoading: true });
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "Bank.Withdraw" },
          { name: "UserId", value: get().user?.id.toString()! },
          { name: "Amount", value: amount.toString() },
          { name: "TokenType", value: tokenType },
        ]);
        await get().getBank();
        await get().refreshUserData();
        set({ bankTransactionLoading: false });
      },
      claimAirdrop: async (tokenType) => {
        set({ bankTransactionLoading: true });
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "Bank.ClaimAirdrop" },
          { name: "UserId", value: get().user?.id.toString()! },
          { name: "TokenType", value: tokenType },
        ]);
        await Promise.all([get().refreshUserData(), get().getBank()]);
        set({ bankTransactionLoading: false });
      },
      shop: null,
      getShop: async () => {
        const resultData = await sendDryRunGameMessage([{ name: "Action", value: "Shop.Info" }]);
        set({ shop: { items: Object.values(resultData.data.items) } });
      },
      buyItemLoading: false,
      buyItem: async (item, tokenType) => {
        set({ buyItemLoading: true });
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "Shop.BuyItem" },
          { name: "UserId", value: get().user?.id.toString()! },
          { name: "ItemId", value: item.id },
          { name: "TokenType", value: tokenType },
        ]);
        await get().refreshUserData();
        set({ buyItemLoading: false });
      },
      consumeItem: async (inventoryId) => {
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "Inventory.UseItem" },
          { name: "UserId", value: get().user?.id.toString()! },
          { name: "InventoryId", value: inventoryId.toString() },
        ]);
        await get().refreshUserData();
      },
      currentIslandLevel: 0,
      setCurrentIslandLevel: (level) => {
        const point = interactivePoints.find((point) => point.level == level) || initialLamaPosition;
        set({ currentIslandLevel: level, lamaPosition: { ...point, src: level == 0 ? "STAND_LEFT" : get().lamaPosition.src } });
      },
      lamaPosition: initialLamaPosition,
      setLamaPosition: (position) => set({ lamaPosition: position }),
      goToTown: async () => {
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "User.GoToTown" },
          { name: "UserId", value: get().user?.id.toString()! },
        ]);
        if (resultData.status === "Success") {
          await get().refreshUserData();
          set({ GameStatePage: GameStatePages.TOWN });
        }
      },
      goToRestArea: async () => {
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "User.GoToRestArea" },
          { name: "UserId", value: get().user?.id.toString()! },
        ]);
        if (resultData.status === "Success") {
          await get().refreshUserData();
          set({ GameStatePage: GameStatePages.REST_AREA });
        }
      },
      exitTown: async () => {
        set({ GameStatePage: GameStatePages.GAME_MAP, lamaPosition: initialLamaPosition, currentIslandLevel: 0 });
      },
      regenerateEnergy: async () => {
        const resultData = await sendAndReceiveGameMessage([
          { name: "Action", value: "User.RegenerateEnergy" },
          { name: "UserId", value: get().user?.id.toString()! },
        ]);
        await get().refreshUserData();
      },
    }),
    {
      name: "Game Store",
      enabled: true,
    }
  )
);
