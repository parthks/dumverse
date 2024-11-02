import { LamaPosition } from "@/types/game";

export const REST_SPOTS = [0, 9, 18, 27];

export const BUILDING_IMAGES = {
  ARMOR_WEAPON_DUMDUM: "https://arweave.net/lpK2ZqY1jFk2TagQOD8wlzSmWAPXjrdRG926H5MOl8E",
  BANK_GOLD_DUMDUM: "https://arweave.net/2jMrkffcBsDRHSG6tceVFVREamWSEdV_QFWPhP4Bz0M",
  DEN_DUMDUM: "https://arweave.net/2NLJJZmZApk-tw3uqB5MmjscZZHwvS0TaLSszjhubEc",
  GENERAL_STORE_DUMDUM: "https://arweave.net/mOYG1wZlqbATMceZDDDsZmrpVqw8RVL4o56Osb70v3Y",
  INFIRMARY_CAKESHOP_DUMDUM: "https://arweave.net/qd6baOG5KsRPjElSvygboYNtyKVcc13kaC4vxzBTb4E",
  NFT_SHOP_DUMDUM: "https://arweave.net/AiIJFDMfrHp2J6GdazlLx6dQOVKhoVtQzWDLIQ7oH6w",
  VISITOR_CENTER_HALL_FAME_DUMDUM: "https://arweave.net/5iR8uYcUHqNUHcnApeX55_5tSrg5j9tl7RS3O0PQLFk",
};

export const IMAGES = {
  DEFAULT_DUMDUM: "https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY",
  FILLED_HEALTH: "https://arweave.net/htFD_LolJawKKO5P9BOO8B2XajxBuuxSvmTpCpNsUvA",
  EMPTY_HEALTH: "https://arweave.net/jSCG0qQySh3soDYdLwKiU6WKCUAQaoGEKIk47qDS6Aw",
  FILLED_STAMINA: "https://arweave.net/dhH6e0gRWjNDWd3UK7dXvZbUlnZHBWtFFYUKQ16FAvg",
  EMPTY_STAMINA: "https://arweave.net/jvZ3mUBMgiST4-dt9FmH1o4U2_97oBVHjp9zBim2hWY",
  GOLD_ICON: "https://arweave.net/8_z7MIgJ2v8fbdYMAKSgpwDc7exFxUJVQnd-egomLXA",
  DUMZ_ICON: "https://arweave.net/_53RnMurt-qradH-caMUJMgvvpoUVmzpM5Yjk8KQVtI",
  TRUNK_ICON: "https://arweave.net/OVmZl1tJUKOWTut1_yYzswGHLAK_-3yvSNfnDbX87C0",
};

export const ITEM_ICONS = {
  NO_WEAPON: "https://arweave.net/K7EXDycnrwtN3g2v_kpcwYZnpPmDFua9GdYl-xoH9k4",
  NO_ARMOR: "https://arweave.net/K9j8WvEJ-7st4ng8z2N3vvyFJH8d2wzlTmB-v4PyeaA",
  WEAPON_1: "https://arweave.net/HeVvlqtkbqR_7uYrAwLG7MiSEwQw5pC4C5ZK8nJ502c",
  ARMOR_1: "https://arweave.net/rrqGSfzfbcG_k0gLqr0VbBc2nO2-KG_gCTKvCI3leFY",
  POTION_1: "https://arweave.net/xyThnEuAAAz5wriPEVwEQ_bAfwHCaOSZAdfp3P0Nmqk",
  ENERGY_1: "https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y",
  FOOD_1: "https://arweave.net/-tUyiDZQCbIytBSEKfsSdLh13utGP4SKUD72eS-QrH4",
};

export const ITEM_IMAGES = {
  WEAPON_1: "https://arweave.net/7a23JeEQssnf01L47H1FccCU7W402DrKv5nDah9fLkU",
  WEAPON_2: "https://arweave.net/Ew8tx7YB3t-ZC3MDYdp5jOzlF4nNHLy157EUhhrAbXs",
  WEAPON_3: "https://arweave.net/Ndm0F4mPJhR5JmhZZvJgGDwH7YQetZVCW8S5BR-72Rk",
  WEAPON_4: "https://arweave.net/64fmvf_r9DACOvNBeTovCX9xrNZCTcEZYeT659-BMoM",
  ARMOR_1: "https://arweave.net/aRZkLSJj01b-dhuA_fVFuYXbaF34k08f6m5vmAjWJWY",
  ARMOR_2: "https://arweave.net/xZSQX8FshEg8owZOfA_6x0-377A2taLiOxIcFDkMlE4",
  ARMOR_3: "https://arweave.net/OaEB7uVq4xT7FhAdwF8dMux1lHX_3wCSRizkrpYrieU",
  ARMOR_4: "https://arweave.net/pWQ1UST8bnw5DAoVvtb-9vQaDLcFuHLijycsjL2jiW0",
  POTION_1: "https://arweave.net/xyThnEuAAAz5wriPEVwEQ_bAfwHCaOSZAdfp3P0Nmqk",
  ENERGY_1: "https://arweave.net/OxaOKKjL44SScyyyalWntsj3PwS0-maX-lfSQgbxH7Y",
  FOOD_1: "https://arweave.net/QWs_k5A7_cLpuIjNZSthBbzaeAP6cTTTxL_n3zn3MxI",
  FOOD_2: "https://arweave.net/DVQPPsCUA9P0ZPoqAZsft1XRHJSAWjnQjosBw5UElp0",
  WAND: "https://arweave.net/W_Q7IE-AQTvkew2g3SXz8eSmyX3CjSrz2AMSHYOedVI",
  MAGIC_ROBE: "https://arweave.net/UCfZ2kVk-aIz18EeC8_X3RrqidKzYUBFxlGUJslB8fU",
};

export const ENEMY_CARD_IMAGE = {
  NPC_1: "https://arweave.net/-ViThoEIwlBp5mkewLk2OjnnEKNee5SEbmeMwdsfFD0",
  NPC_2: "https://arweave.net/sf72XoFEIwZy1SpLJ5bqEGs2WLevkHM-ljZy95lGyuY",
  NPC_3: "https://arweave.net/S9D0Tf9Eu4lnQ3nw2MzuV0gKCgo5vlXUmME1KP3gCBI",
  NPC_4: "https://arweave.net/5kv0IVgvrCN-Ww1GZFbNevNX3L9aKg0fBwzjK9nabrc",
  NPC_5: "https://arweave.net/6zXMMGRVxBltXuV6LkVgJbfGhmeNUlBV-T7dJVebM2E",
  NPC_6: "https://arweave.net/9rXqcbd-c3CPFrMD39uV27B-pfhKUCQdV4l5WmZLvqo",
  NPC_7: "https://arweave.net/qVe1dy3dQh3xuGyQAQ2pRe-DRdMwhHLIYzkA5h3vTBo",
  NPC_8: "https://arweave.net/hQb7hRMU4Rynz18euMo3IHEgouij2cmb7TAPocOegQA",
  NPC_9: "https://arweave.net/ViFdKd-cUkxaJ6WAsw4xjRFKi7QeTzJop7wqmmQOQ9A",
  NPC_10: "https://arweave.net/9VoHqEbKolMa4Gebk2dUKq-P2ZTyXGh2CCGwxtHfYjg",
  NPC_11: "https://arweave.net/KAXnRZxDWLG_vl0GEN-OK4uOfoLddEyp2UMNezV7FqE",
  NPC_12: "https://arweave.net/VwTxz8r7_6U3Jin7QORp_jsEa9OSMH69n1En_cbmff0",
  NPC_13: "https://arweave.net/owTkaG8UTkdeI9lTtbAHoPjRx0MlOl1qOLxberuuWE0",
};

export const SOUNDS = {
  ISLAND_AUDIO: "https://arweave.net/yW2M75jkljOj3I-Wv2Cs0A3Dqkn4MVdyCRfqkQL8pMs",
  TOWN_AUDIO: "https://arweave.net/8cpm7ZN-eegh6um6mqua1ODU0ZOxA6GVyfSt3rqwjeQ",
  TOWN_AUDIO_IN_BUILDING: "https://arweave.net/Nnz_IEzTOlV7sfLaK2kYDOLhGDk_RtSEOEW-R-5YnlQ",
  BATTLE_AUDIO: "https://arweave.net/gibXjVdGHmPOP7e4AtStM8U7fRiMZZ6A2u_gKRKPhcE",
  ATTACK_AUDIO: "https://arweave.net/cONoIFz54QfP3jVuJh5dmCfJC7DrFiypMVb_KIX9oVY",
  IS_ATTACKED_AUDIO: "https://arweave.net/fNz7e9LYrChtmlajfBKEf_bdyybUZfZSpUK9ioxkqYo",
  BUILDING_ENTER: "https://arweave.net/1y0gZbjA-jmTiC2Ocm-TQj4_bUUSfrUOuGjbb-3zBWI",
  SHOP_BUY_ITEM: "https://arweave.net/9EtNgLrsqHuXNZWPhH3NcMcxkTQhGpxRo6wvQJmcU1Q",
  REST_AREA_AUDIO: "https://arweave.net/_d4bjMzhu7UayVt5KURYwYBGrREEB6-tYA8MLI0R2r4",
  TOWN_REST_AREA_AUDIO: "https://arweave.net/RutoWcguMTChg_gPkgRZU6llN8_mbU-s5r_UfLmyMKs",
  DRINK_POTION_AUDIO: "https://arweave.net/wBwQoEtG5_cz6CFtw3y6qCFPmZUpjhmgwB1s-AXriLg",
  DRINK_JOOSE_AUDIO: "https://arweave.net/0okk9yn9v-DQ0OHdYyiuMzDvpJOGiasho1eJxhtXn_s",
  EAT_CAKE_AUDIO: "https://arweave.net/iZ4lOyJPKy6E1YYQRokL9uzbZhtQs4bj8ItJUFfRP4A",
};

export const LOGIN_VIDEO = "https://arweave.net/1jm4BEW5n1OLg6xtE97_hrjD_wS70jmmG_jh2mSFxzQ";

export const LAMA_IMAGE = {
  STAND_RIGHT: "https://arweave.net/WnUicCMnZ11xpI8pgNg0UJWy37tfdZ-cAPZR97aWBDo",
  STAND_LEFT: "https://arweave.net/1veX02WtE9hauvuYLStfab_iDm3iwNHs_ohzq2mqgI0",
  WALKING_RIGHT: "https://arweave.net/MnL26j3J-OgeAlb3T-6AHw0LhemJS2xbqbHjAROJLdQ",
  WALKING_LEFT: "https://arweave.net/V-Fia6R8Ee6dmvp9UeLrBtw8qqZqSzyenc1lZUV8BzI",
};

export const lammaWidth = 5;
export const lammaHeight = 8.2;

// Map 1
export const interactivePointsMap1 = [
  { x: 82.2, y: 72.8, level: 1 },
  { x: 78.6, y: 77.5, level: 2 },
  { x: 72.8, y: 79.6, level: 3 },
  { x: 66.8, y: 79, level: 4 },
  { x: 60.6, y: 72.8, level: 5 },
  { x: 53.3, y: 72.8, level: 6 },
  { x: 50.5, y: 66, level: 7 },
  { x: 47.6, y: 53.8, level: 8 },
  { x: 45.5, y: 46.3, level: 9 },
  { x: 55.5, y: 33.8, level: 10 },
  { x: 60, y: 31.6, level: 11 },
  { x: 71.5, y: 34.1, level: 12 },
  { x: 78.8, y: 34, level: 13 },
  { x: 85.3, y: 30.9, level: 14 },
  { x: 76.8, y: 27.6, level: 15 },
  { x: 70, y: 27.6, level: 16 },
  { x: 61.7, y: 27.2, level: 17 },
  { x: 52.3, y: 30.7, level: 18 },
  { x: 47, y: 33.4, level: 19 },
  { x: 42.5, y: 33, level: 20 },
  { x: 37, y: 32.5, level: 21 },
  { x: 32, y: 33.4, level: 22 },
  { x: 27, y: 32, level: 23 },
  { x: 22, y: 30.8, level: 24 },
  { x: 17.8, y: 30, level: 25 },
  { x: 14.8, y: 25.4, level: 26 },
  { x: 10.5, y: 24.5, level: 27 },
];

// Map 2
// export const interactivePointsMap2 = [
//   { x: 90.2, y: 54.8, level: 28 },
//   { x: 77, y: 66, level: 29 },
//   { x: 54, y: 64.6, level: 30 },
//   { x: 33, y: 65, level: 31 },
//   { x: 17, y: 59, level: 32 },
//   { x: 24.5, y: 52.4, level: 33 },
//   { x: 55, y: 53, level: 34 },
//   { x: 76, y: 50, level: 35 },
//   { x: 87, y: 46, level: 36 },
//   { x: 85, y: 33, level: 37 },
//   { x: 72, y: 35, level: 38 },
//   { x: 62, y: 37, level: 39 },
//   { x: 52, y: 38, level: 40 },
//   { x: 41, y: 38.3, level: 41 },
//   { x: 35, y: 30, level: 42 },
//   { x: 50.5, y: 27, level: 43 },
//   { x: 76, y: 27, level: 44 },
//   { x: 84, y: 26.8, level: 45 },
//   { x: 79, y: 19.2, level: 46 },
//   { x: 69, y: 18.5, level: 47 },
//   { x: 60, y: 17.5, level: 48 },
//   { x: 50, y: 18.5, level: 49 },
//   { x: 40, y: 20, level: 50 },
//   { x: 32, y: 22, level: 51 },
//   { x: 24, y: 24, level: 52 },
//   { x: 17.7, y: 31, level: 53 },
//   { x: 14, y: 39, level: 54 },
// ];

export const interactivePointsMap2 = [
  { x: 90.2, y: 55.8, level: 28 },
  { x: 77, y: 65.2, level: 29 },
  { x: 54, y: 65.6, level: 30 },
  { x: 33, y: 66, level: 31 },
  { x: 19.5, y: 59, level: 32 },
  { x: 26.5, y: 54.3, level: 33 },
  { x: 55, y: 54, level: 34 },
  { x: 76, y: 52, level: 35 },
  { x: 86, y: 46, level: 36 },
  { x: 84, y: 36, level: 37 },
  { x: 72, y: 37.5, level: 38 },
  { x: 62, y: 39, level: 39 },
  { x: 52, y: 40, level: 40 },
  { x: 42, y: 41, level: 41 },
  { x: 36, y: 35, level: 42 },
  { x: 50.5, y: 30, level: 43 },
  { x: 76, y: 31, level: 44 },
  { x: 82, y: 27.8, level: 45 },
  { x: 79, y: 23.5, level: 46 },
  { x: 68, y: 22, level: 47 },
  { x: 60, y: 21.5, level: 48 },
  { x: 50, y: 22.5, level: 49 },
  { x: 40, y: 24, level: 50 },
  { x: 34, y: 25.5, level: 51 },
  { x: 24, y: 29, level: 52 },
  { x: 19, y: 37, level: 53 },
  { x: 14, y: 42.5, level: 54 },
];


// Map 3
export const interactivePointsMap3 = [
  { x: 90.2, y: 70, level: 55 },
  { x: 77, y: 69, level: 56 },
  { x: 67, y: 69, level: 57 },
  { x: 57, y: 69, level: 58 },
  { x: 47, y: 69, level: 59 },
  { x: 37, y: 69, level: 60 },
  { x: 27, y: 69, level: 61 },
  { x: 15, y: 68, level: 62 },
  { x: 8, y: 61, level: 63 },
  { x: 13, y: 47, level: 64 },
  { x: 23, y: 44, level: 65 },
  { x: 33, y: 44, level: 66 },
  { x: 43, y: 43, level: 67 },
  { x: 53, y: 43, level: 68 },
  { x: 63, y: 42, level: 69 },
  { x: 73, y: 41, level: 70 },
  { x: 80, y: 37, level: 71 },
  { x: 87, y: 34, level: 72 },
  { x: 84, y: 25, level: 73 },
  { x: 79, y: 19, level: 74 },
  { x: 72, y: 17.5, level: 75 },
  { x: 64, y: 18, level: 76 },
  { x: 56.5, y: 18, level: 77 },
  { x: 48, y: 18, level: 78 },
  { x: 40, y: 18, level: 79 },
  { x: 33, y: 18, level: 80 },
  { x: 22, y: 20, level: 81 },
];
