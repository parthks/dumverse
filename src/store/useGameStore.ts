// import { interactivePoints } from "@/components/InteractiveMap";
import { REST_SPOTS } from "@/lib/constants";
import { getCurrentLamaPosition, getInitialLamaPosition, getInteractivePoints } from "@/lib/utils";
import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { Bank, BankTransaction, GameUser, Inventory, Item, ItemType, LamaPosition, Shop, TokenType, DailyGoldWishes, UserAirdrop, Pet } from "@/types/game";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { interactivePointsMap1, interactivePointsMap2, interactivePointsMap3, lammaHeight, lammaWidth } from "@/lib/constants";

// set({
//   GameStatePage: GameStatePages.GAME_MAP,
//   lamaPosition: {
//     x: interactivePointsMap3[0].x - lammaWidth / 2,
//     y: interactivePointsMap3[0].y - lammaHeight,
//     src: "STAND_LEFT",
//   },
//   tempCurrentIslandLevel:55,
//   currentIslandLevel: 55,
// });

export enum GameStatePages {
  HOME = "HOME",
  PROFILE = "PROFILE",
  GAME_MAP = "GAME_MAP",
  COMBAT = "COMBAT",
  TOWN = "TOWN",
  SECOND_TOWN = "SECOND_TOWN",
  REST_AREA = "REST_AREA",
  BANK = "BANK",
  SHOP = "SHOP",
  ARMORY = "ARMORY",
  WEAPON_SHOP = "WEAPON_SHOP",
  NFT_SHOP = "NFT_SHOP",
  VISITOR_CENTER = "VISITOR_CENTER",
  HALL_OF_FAME = "HALL_OF_FAME",
  INFIRMARY = "INFIRMARY",
  BAKERY = "BAKERY",
  DEN = "DEN",
  PET_SHOP = "PET_SHOP"
}

interface GameState {
  GameStatePage: GameStatePages | null;
  setGameStatePage: (state: GameStatePages | null) => void;
  registerNewUser: (name: string, nft?: string) => Promise<void>;
  upgradeExistingProfile: (nftAddress: string) => Promise<void>;
  deletingUsersAccount: (nftAddress: string) => Promise<void>;
  user: GameUser | null;
  setUserOnLogin: (user: GameUser | null) => void;
  refreshUserData: (userId?: number) => Promise<GameUser | null>;
  getAllPlayersAtLocation: (currentSpot: number) => Promise<GameUser[]>;
  inventory: Inventory[];
  setInventory: (inventory: Inventory[]) => void;
  bank: (Bank & { transactions: BankTransaction[] }) | null;
  getBank: () => Promise<void>;
  bankDataLoading: boolean;
  bankTransactionLoading: boolean;
  deposit: (amount: number, tokenType: TokenType) => Promise<void>;
  withdraw: (amount: number, tokenType: TokenType) => Promise<void>;
  claimAirdrop: (tokenType: TokenType) => Promise<void>;
  // claimTrunk: () => Promise<void>;
  shop: Shop | null;
  getShop: (itemType: ItemType) => Promise<void>;
  buyItem: (item: Item, tokenType: TokenType) => Promise<void>;
  buyItemLoading: boolean;
  consumeItem: (inventoryId: number) => Promise<void>;
  currentIslandLevel: number;
  setCurrentIslandLevel: (level: number) => void;
  // travelToLocation: (level: number) => Promise<void>;
  tempCurrentIslandLevel: number;
  setTempCurrentIslandLevel: (level: number) => void;
  lamaPosition: LamaPosition;
  setLamaPosition: (position: LamaPosition) => void;
  goDirectlyToTownPage: () => void;
  goToTown: (hardRefresh?: boolean) => Promise<void>;
  goToRestArea: () => void; // goes to the nearest rest area (+- 1 from current level)
  goToGameMap: (resetPosition?: boolean) => void;
  regenerateEnergy: () => Promise<void>;
  regenerateCountdown: number | null;
  resetRegenerateCountdown: () => void;
  regenerateCountdownTickDown: () => Promise<void>;
  setRegenerateCountdown: (countdown: number | null) => void;
  reviveUser: () => Promise<boolean>;
  repairItem: (inventoryId: number) => Promise<void>;
  questBookOpen: boolean;
  setQuestBookOpen: (open: boolean) => void;
  acceptBankQuest: () => Promise<boolean>;
  acceptNFTShopQuest: () => Promise<boolean>;
  acceptWeaponQuest: () => Promise<boolean>;
  acceptShopQuest: () => Promise<boolean>;
  acceptDenQuest: () => Promise<boolean>;
  lastDisplayedMessageId: number | null;
  setLastDisplayedMessageId: (state: number | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  getTotalUsers: () => Promise<number>;
  goldWishes: ()=>Promise<DailyGoldWishes | null>;
  isPopupOpen: boolean;
  setIsPopupOpen: (map: boolean) => void;
  setEquipInventoryItem: (userId: number, itemId: number) => Promise<void>;
  inventoryBagOpen: boolean;
  setInventoryBagOpen: (open: boolean) => void;
  userAirdrop: UserAirdrop | null;
  getUserAirdropInfo: () => Promise<void>;
  petsOwned: Pet[] | null;
  equippedPet: Pet | null;
  buyPet: (pet: Item, tokenType: TokenType) => Promise<void>;
}

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      GameStatePage: null,
      setGameStatePage: (state) => set({ GameStatePage: state }),
      registerNewUser: async (name, selectedNFT="71ECP_Ej3eS0SojWhige_IWw5j4NcMb3berqdbfZCzY") => {
        // const { name, selectedNFT } = useAppStore.getState();
        const tags = [
          { name: "Action", value: "Users.AddNewUser" },
          { name: "Name", value: name },
        ];
        if (selectedNFT) {
          tags.push({ name: "NFT_Address", value: selectedNFT });
        }
        const resultData = await sendAndReceiveGameMessage({ tags });
        console.log("Ashu : Add new user: " + JSON.stringify(resultData));
        if (resultData.Messages.length > 0 && resultData.Messages[2].Data) {
          const data = JSON.parse(resultData.Messages[2].Data);
          console.log("Ashu : new user: " + JSON.stringify(data));
          if (data.status === "Success") {
            // get().setUserOnLogin(data.data, selectedNFT? selectedNFT : "NULL");
            get().setUserOnLogin(data.data);
          }
        }
      },
      upgradeExistingProfile: async (nftAddress) => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Users.UpgradeExistingProfile" },
            { name: "NFT_Address", value: nftAddress },
          ],
        });
      },
      deletingUsersAccount: async (nftAddress) => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "User.DeletingUsersAccount" },
            { name: "NFT_Address", value: nftAddress },
          ],
        });
      },
      user: null,
      setUserOnLogin: async (user) => {
        if (user) {
          // if (user.current_battle_id) {
          //   // user is in a battle
          //   useCombatStore.getState().getOpenBattles();
          //   set({ GameStatePage: GameStatePages.COMBAT });
          // }
          // else
          // { name: "NFT_Address", value: nftAddress },

          const resultData = await sendAndReceiveGameMessage({
            tags: [
              { name: "Action", value: "User.Login" },
              { name: "UserId", value: user.id.toString() },
            ],
          });
          // if user is not in a spot, only then go to town. Else need to go to game map
          // if (user.current_spot % 9 === 0 && user.current_spot != 0) {
          if (
            REST_SPOTS.includes(user.current_spot) &&
            user.current_spot != 0
          ) {
            // user is in a spot
            const position = getCurrentLamaPosition(user);
            set({
              currentIslandLevel: position.currentIslandLevel,
              tempCurrentIslandLevel: position.currentIslandLevel,
              lamaPosition: position.lamaPosition,
            });
            // if (position.currentIslandLevel % 9 === 0) {
            if (REST_SPOTS.includes(position.currentIslandLevel)) {
              // user is in a rest area
              set({ GameStatePage: GameStatePages.REST_AREA });
            } else {
              set({ GameStatePage: GameStatePages.GAME_MAP });
            }
          } else {
            // current spot = 0, user is in town
            set({ GameStatePage: GameStatePages.TOWN });
          }
          get().refreshUserData(user.id);
        }
      },
      refreshUserData: async (userId?: number): Promise<GameUser | null> => {
        const user_id = userId ? userId : get().user?.id;
        if (!user_id) return null;

        const resultData = await sendDryRunGameMessage({
          tags: [
            { name: "Action", value: "User.Info" },
            { name: "UserId", value: user_id.toString() },
          ],
        });

        if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
          const user = JSON.parse(resultData.Messages[0].Data);
          const inventory = user.inventory;
          const pet = user.pet ? user.pet : null;

        console.log("Refresh User Data Pet : "+ JSON.stringify(pet));
          set({
            user: user,
            inventory: inventory,
            currentIslandLevel: user.current_spot,
            petsOwned: pet,
            equippedPet: pet ? pet.filter((pet: Pet) => pet.equipped === 1)[0] : null
          });

          return user;
        }
        return null;
      },
      getAllPlayersAtLocation: async (
        currentSpot: number
      ): Promise<GameUser[]> => {
        // this also updates last_updated_at for current user
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "User.GetAllPlayersAtLocation" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "CurrentSpot", value: currentSpot.toString() },
          ],
        });
        return resultData.data as GameUser[];
      },

      inventory: [],
      setInventory: (inventory) => set({ inventory }),
      bank: null,
      bankDataLoading: false,
      getBank: async () => {
        set({ bankTransactionLoading: false, bankDataLoading: true });
        const resultData = await sendDryRunGameMessage({
          tags: [
            // { name: "Action", value: "Bank.Info" },
            { name: "Action", value: "Bank.Info" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
          process: "bank",
        });
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
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            // { name: "Action", value: "Bank.Deposit" },
            { name: "Action", value: "Game.TransferFundsToBank" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "Amount", value: amount.toString() },
            { name: "TokenType", value: tokenType },
          ],
        });
        await get().getBank();
        await get().refreshUserData();
        set({ bankTransactionLoading: false });
      },
      withdraw: async (amount, tokenType) => {
        set({ bankTransactionLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Bank.Withdraw" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "Amount", value: amount.toString() },
            { name: "TokenType", value: tokenType },
          ],
          process: "bank",
        });
        await get().getBank();
        await get().refreshUserData();
        set({ bankTransactionLoading: false });
      },
      claimAirdrop: async (tokenType) => {
        set({ bankTransactionLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            // { name: "Action", value: "Bank.ClaimAirdrop" },
            { name: "Action", value: "Game.BankAirdrop" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "TokenType", value: tokenType },
          ],
        });
        // await Promise.all([get().refreshUserData(), get().getBank()]);
        await get().refreshUserData();
        await get().getBank();
        set({ bankTransactionLoading: false });
      },
      // claimTrunk: async () => {
      //   set({ bankTransactionLoading: true });
      //   const resultData = await sendAndReceiveGameMessage({
      //     tags: [
      //       { name: "Action", value: "Bank.PushOutTrunk" },
      //       { name: "UserId", value: get().user?.id.toString()! },
      //     ],
      //   });
      //   await Promise.all([get().refreshUserData(), get().getBank()]);
      //   set({ bankTransactionLoading: false });
      // },
      shop: null,
      getShop: async (itemType: ItemType) => {
        console.log("Getshop: "+itemType);
        const resultData = await sendDryRunGameMessage({
          tags: [
            { name: "Action", value: "Shop.Info" },
            { name: "ItemType", value: itemType },
          ],
        });
        set({ shop: { items: Object.values(resultData.data.items) } });
      },
      buyItemLoading: false,
      buyItem: async (item, tokenType) => {
        set({ buyItemLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Shop.BuyItem" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "ItemId", value: item.id },
            { name: "TokenType", value: tokenType },
          ],
        });
        await get().refreshUserData();
        set({ buyItemLoading: false });
      },
      consumeItem: async (inventoryId) => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Inventory.UseItem" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "InventoryId", value: inventoryId.toString() },
          ],
        });
        await get().refreshUserData();
      },
      currentIslandLevel: 0,
      setCurrentIslandLevel: (level) => {
        const point =
          getInteractivePoints(level).find((point) => point.level == level) ||
          getInitialLamaPosition();
        set({
          currentIslandLevel: level,
          lamaPosition: {
            ...point,
            src: level == 0 ? "STAND_LEFT" : get().lamaPosition.src,
          },
        });
      },
      // travelToLocation: async (level) => {
      //   const resultData = await sendAndReceiveGameMessage({
      //     tags: [
      //       { name: "Action", value: "Users.SetCurrentLocation" },
      //       { name: "UserId", value: get().user?.id.toString()! },
      //       { name: "Level", value: level.toString() },
      //     ],
      //   });
      //   await get().refreshUserData();
      // },
      tempCurrentIslandLevel: 0,
      setTempCurrentIslandLevel: (level) =>
        set({ tempCurrentIslandLevel: level }),
      lamaPosition: getInitialLamaPosition(),
      setLamaPosition: (position) => set({ lamaPosition: position }),
      goDirectlyToTownPage: () =>
        set({
          GameStatePage: GameStatePages.TOWN,
          shop: null,
          tempCurrentIslandLevel: 0,
        }),
      goToTown: async (playerDead = false) => {
        // hardRefresh is true when going to town from combat (in case on spot one)
        if (get().user?.current_spot !== 0 || playerDead) {
          const resultData = await sendAndReceiveGameMessage({
            tags: [
              { name: "Action", value: "User.GoToTown" },
              { name: "UserId", value: get().user?.id.toString()! },
            ],
          });
          if (resultData.status === "Success") {
            await get().refreshUserData();
            if (playerDead) {
              set({
                GameStatePage: GameStatePages.INFIRMARY,
                tempCurrentIslandLevel: 0,
              });
              // await get().reviveUser();
            } else {
              set({
                GameStatePage: GameStatePages.TOWN,
                tempCurrentIslandLevel: 0,
              });
            }
            get().resetRegenerateCountdown();
          }
        } else {
          // TODO: show error toast and retry?
          set({
            GameStatePage: GameStatePages.TOWN,
            tempCurrentIslandLevel: 0,
          });
        }
      },
      goToRestArea: async () => {
        const currentSpot = get().user?.current_spot;
        if (currentSpot !== undefined && !REST_SPOTS.includes(currentSpot)) {
          const resultData = await sendAndReceiveGameMessage({
            tags: [
              { name: "Action", value: "User.GoToRestArea" },
              { name: "UserId", value: get().user?.id.toString()! },
            ],
          });
          if (resultData.status === "Success") {
            await get().refreshUserData();
            set({ GameStatePage: GameStatePages.REST_AREA });
            get().resetRegenerateCountdown();
          }
        } else {
          set({ GameStatePage: GameStatePages.REST_AREA });
        }
      },
      goToGameMap: async (resetPosition = false) => {
        set({ GameStatePage: GameStatePages.GAME_MAP });
        if (resetPosition) {
          set({
            lamaPosition: getInitialLamaPosition(),
            currentIslandLevel: 0,
          });
        }
      },
      regenerateEnergy: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "User.RegenerateEnergy" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        await get().refreshUserData();
      },
      regenerateCountdown: null,
      resetRegenerateCountdown: () => {
        const currentSpot = get().user?.current_spot;
        const petsOwned = get().petsOwned;
        const inTownOrRestArea = currentSpot !== undefined && REST_SPOTS.includes(currentSpot);
        console.log("inTownOrRestArea", inTownOrRestArea, currentSpot);
        
        // Check if user has equipped DILIGENT_DUCK pet
        const hasEquippedDiligentDuck = petsOwned?.some(pet => 
          pet.pet_id === "DILIGENT_DUCK" && pet.equipped === 1
        );
        
        // Calculate regeneration time with duck bonus if applicable
        let baseTime = inTownOrRestArea ? 120 : 240;
        
        if (hasEquippedDiligentDuck) {
          // Apply 15% faster regeneration (multiply by 0.85)
          baseTime = Math.floor(baseTime * 0.85);
          console.log("DILIGENT_DUCK equipped, applying 15% faster regeneration");
        }
        
        console.log(`setting countdown to ${baseTime} seconds`);
        set({ regenerateCountdown: baseTime });
      },
      regenerateCountdownTickDown: async () => {
        const countdown = get().regenerateCountdown;

        if (countdown !== null) {
          set({ regenerateCountdown: countdown - 1 });

          if (countdown - 1 === 0) {
            await get().regenerateEnergy();
            get().resetRegenerateCountdown();
            get().refreshUserData();
          }
        } else {
          get().resetRegenerateCountdown();
        }
      },
      setRegenerateCountdown: (countdown) => {
        set({ regenerateCountdown: countdown });
      },
      reviveUser: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "User.Revive" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        if (resultData.status && resultData.status == "Success") {
          await get().refreshUserData();
          return true;
        }
        return false;
      },
      repairItem: async (inventoryId) => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Inventory.RepairItem" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "InventoryId", value: inventoryId.toString() },
          ],
        });
        await get().refreshUserData();
      },
      questBookOpen: false,
      setQuestBookOpen: (open) => set({ questBookOpen: open }),
      acceptBankQuest: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Quest.BankQuestAccept" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        await get().refreshUserData();
        return resultData.status == "Success" ? true : false;
      },
      acceptNFTShopQuest: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Quest.NFTShopQuestAccept" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        await get().refreshUserData();
        return resultData.status == "Success" ? true : false;
      },
      acceptWeaponQuest: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Quest.WeaponQuestAccept" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        await get().refreshUserData();
        return resultData.status == "Success" ? true : false;
      },

      acceptShopQuest: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Quest.ShopQuestAccept" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        // console.log("Ashu : " + JSON.stringify(resultData));
        await get().refreshUserData();
        return resultData.status == "Success" ? true : false;
      },
      acceptDenQuest: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Quest.DenQuestAccept" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        await get().refreshUserData();
        return resultData.status == "Success" ? true : false;
      },
      lastDisplayedMessageId: null,
      setLastDisplayedMessageId: (state) =>
        set({ lastDisplayedMessageId: state }),
      isSettingsOpen: false,
      setIsSettingsOpen: (open) => set({ isSettingsOpen: open }),
      getTotalUsers: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "VisitorCenter.TotalUsers" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        if (resultData && resultData.status === "Success") {
          return Number(JSON.parse(resultData.data.TotalUsers));
        } else {
          return 0;
        }
      },
      goldWishes: async () => {
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "User.GoldWishes" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        // Check if resultData and resultData.Messages are defined
        if (resultData && resultData.Messages) {
          // Iterate through the Messages array to find the message with the required Data
          for (const message of resultData.Messages) {
            if (message.Data) {
              try {
                const parsedData = JSON.parse(message.Data);

                // Check if the parsed data has the 'logs' property
                if (parsedData.logs) {
                  console.log("Ashu: DailyGoldWishes Data: ", parsedData);
                  await get().refreshUserData();
                  return parsedData as DailyGoldWishes;
                }
              } catch (error) {
                console.error("Error parsing message data:", error);
              }
            }
          }
        }
        // If no valid data is found, refresh user data and return null
        return null;
      },
      isPopupOpen: true,
      setIsPopupOpen: (map) => set({ isPopupOpen: map }),
      setEquipInventoryItem: async (userId: number, itemId: number) => {
        if (userId != get().user?.id) return;
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Inventory.EquipItem" },
            { name: "UserId", value: userId.toString()! },
            { name: "InventoryId", value: itemId.toString() },
          ],
        });
        await get().refreshUserData();
      },
      inventoryBagOpen: false,
      setInventoryBagOpen: (open) => set({inventoryBagOpen: open }),
      userAirdrop: null,
      getUserAirdropInfo: async ()=>{
        const resultData = await sendDryRunGameMessage({
          tags: [
            { name: "Action", value: "User.AirdropInfo" },
            { name: "UserId", value: get().user?.id.toString()! },
          ],
        });
        console.log("User Airdrop Info: "+ JSON.stringify(resultData));
        if (resultData.data) set({userAirdrop: resultData.data as UserAirdrop});
      },
      petsOwned: [],
      equippedPet: null,
      buyPet: async (pet, tokenType) => {
        set({ buyItemLoading: true });
        const resultData = await sendAndReceiveGameMessage({
          tags: [
            { name: "Action", value: "Shop.BuyPet" },
            { name: "UserId", value: get().user?.id.toString()! },
            { name: "petId", value: pet.id },
            { name: "TokenType", value: tokenType },
          ],
        });
        await get().refreshUserData();
        set({ buyItemLoading: false });
      },
    }),
    {
      name: "Game Store",
      enabled: true,
    }
  )
);
