import { InventoryBag } from "@/components/game/InventoryBag";
import ImgButton from "@/components/ui/imgButton";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { ENEMY_CARD_IMAGE, PET_LARGE_CARD_IMAGE, IMAGES, ITEM_ICONS, ITEM_IMAGES, SOUNDS, COMBAT_LOADING_SCREEN } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { Battle, CombatPet, NPC } from "@/types/combat";
import audioManager from "@/utils/audioManager";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useMemo } from "react";

// const currentBattle = {
//   npcs: {
//     PEACOCK: {
//       id: "PEACOCK",
//       name: "Devilish Peacock",
//       total_health: 6,
//       health: 6,
//       damage: 6,
//       difficulty: "SPECIAL",
//     },
//     NPC_5: {
//       health: 0,
//       difficulty: "EASY",
//       total_health: 2,
//       name: "Adorable Red Panda",
//       extra_gold: 0,
//       gold_reward: 5,
//       damage: 2,
//       dumz_reward: 1,
//       id: "NPC_5",
//     },
//   },
//   players_alive: [],
//   players: {
//     "1": {
//       health: 0,
//       last_updated_at: 1731351508810,
//       gold_balance: 0,
//       defense: 0,
//       added_at_timestamp: 1731351756449,
//       special_item_kitten: -1,
//       inventory_weapon_id: "240",
//       special_item_thread: -1,
//       damage: 3,
//       stamina: 2,
//       current_spot: 0,
//       dumz_balance: 0,
//       total_health: 2,
//       total_stamina: 8,
//       special_item_bark: -1,
//       inventory_armor_id: "239",
//       potion_used: false,
//       special_item_heart: -1,
//       potion: {
//         item_id: "POTION_1",
//         health: 1,
//         id: 245,
//       },
//       name: "test1",
//       special_item_key: -1,
//       address: "8ZXWMPj_fq5vfGPqycbuSJQmEt9b4BOWpcyNslAPKUk",
//       last_regenerate_time: 1731351754093,
//       id: "14",
//     },
//   },
//   winner: "LEPERCHAUN",
//   npcs_alive: ["LEPERCHAUN"],
//   level: 1,
//   log: [
//     {
//       from: "NPC_5",
//       timestamp: 1731351766525,
//       message: "hits Made it Leperchaun for 2",
//     },
//     {
//       from: "NPC_5",
//       timestamp: 1731351766525,
//       message: "deals 2 damage to Made it Leperchaun's health",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351766525,
//       message: "hits Adorable Red Panda for 4",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351766525,
//       message: "deals 4 damage to Adorable Red Panda's health",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351766525,
//       message: "has slain Adorable Red Panda",
//     },
//     {
//       from: "1",
//       timestamp: 1731351774503,
//       message: "attack misses",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351774503,
//       message: "hits test1 for 4",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351774503,
//       message: "deals 2 damage to test1's defense",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351774503,
//       message: "deals 2 damage to test1's health",
//     },
//     {
//       from: "1",
//       timestamp: 1731351779152,
//       message: "hits Made it Leperchaun for 3",
//     },
//     {
//       from: "1",
//       timestamp: 1731351779152,
//       message: "deals 3 damage to Made it Leperchaun's health",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351779152,
//       message: "hits test1 for 4",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351779152,
//       message: "deals 4 damage to test1's health",
//     },
//     {
//       from: "1",
//       timestamp: 1731351779152,
//       message: "Player has Perished",
//     },
//     {
//       from: "LEPERCHAUN",
//       timestamp: 1731351779152,
//       message: "has won the battle",
//     },
//   ],
//   created_at: 1731351756449,
//   players_attacked: {},
//   ended: true,
//   last_player_attack_timestamp: {
//     "1": 1731351779152,
//   },
//   last_npc_attack_timestamp: {
//     LEPERCHAUN: 1731351779152,
//     NPC_5: 1731351766525,
//   },
//   id: 110,
// } as any;

/*

enter new battle - get sub process id
loop:
  get open battles - from sub process id -- can take very long.
    (maybe) if get open battles takes very long, can enter a new battle -- get a new sub process id
  if no open battles, wait 5 seconds and try again
  if no open battles, second time then set failedToEnterBattle to true
  if open battles, set current battle

*/

export default function Combat() {
  const {enteringNewBattle, currentBattle, setCurrentBattle, getOpenBattles, setEnteringNewBattle, hasBattleReady, sendBattleReadyRequest, enterNewBattle, subProcess} = useCombatStore();
  // const enteringNewBattle = useCombatStore((state) => state.enteringNewBattle);
  // const currentBattle = useCombatStore((state) => state.currentBattle);
  // const setCurrentBattle = useCombatStore((state) => state.setCurrentBattle);
  // const getOpenBattles = useCombatStore((state) => state.getOpenBattles);
  // const setEnteringNewBattle = useCombatStore((state) => state.setEnteringNewBattle);
  // const combatLoading = useCombatStore((state) => state.loading);
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const tempCurrentIslandLevel = useGameStore((state) => state.tempCurrentIslandLevel);

  const [failedToEnterBattle, setFailedToEnterBattle] = useState(false);
  // console.log("currentBattle", currentBattle);
  const [comabatLoadingScreenImageURL, setComabatLoadingScreenImageURL] = useState<string | null>(null);
  // const hasBattleReady = useCombatStore((state) => state.hasBattleReady);
  // const sendBattleReadyRequest = useCombatStore((state) => state.sendBattleReadyRequest);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const cancelled = useRef(false); // Ref to track if polling has been cancelled
  const pollingStarted = useRef(false); // Ref to track if polling has started
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (comabatLoadingScreenImageURL === null) {
      let savedData: number = parseInt(localStorage.getItem("currentCombatLoadingScreen") || "0");
      savedData = (savedData % Object.keys(COMBAT_LOADING_SCREEN).length) + 1;
      const url = COMBAT_LOADING_SCREEN[`scene${savedData}` as keyof typeof COMBAT_LOADING_SCREEN];
      setComabatLoadingScreenImageURL(url);
      localStorage.setItem("currentCombatLoadingScreen", savedData.toString());
    }

    if (enteringNewBattle && !currentBattle?.id) {
      // Ensure polling starts only once
      if (pollingStarted.current) return;
      pollingStarted.current = true;

      const pollForBattle = async () => {
        let attempt = 0;

        while (!cancelled.current) {
          console.log("polling for open battles...");

          const timeoutId = setTimeout(async () => {
            console.log("getOpenBattles is taking too long. Calling fallback function.");
            console.log("Ashu : tempCurrentIslandLevel: "+tempCurrentIslandLevel);
            const resultData = await enterNewBattle(tempCurrentIslandLevel, true); 
            // if (typeof JSON.parse(resultData.Messages[1].Data).subprocess === "string") {
            //   setGameStatePage(GameStatePages.COMBAT);
            // }
            // cancelled.current = true;
          }, 120000); // 2 minute timeout

          try {
            const battle = await getOpenBattles();
            clearTimeout(timeoutId); // Clear timeout if function completes in time

            console.log("Battle found -> Sending battle ready request.");
            if (battle && (!battle.started || (battle?.started && Object.keys(battle.players || {}).length > 1))) {
               await sendBattleReadyRequest();
              break;
            } else {
              attempt++;
              if (attempt === 2) {
                console.log("No battle found after 2 attempts. Marking failure.");
                setFailedToEnterBattle(true);
              }
              console.log("waiting 5 seconds before retrying... (GetOpenBattles)");
              await sleep(5000);
            }
          } catch (error) {
            clearTimeout(timeoutId); // Clear timeout in case of an error
            console.error("Error fetching battles:", error);
          }
        }
      };

      pollForBattle();

      return () => {
        cancelled.current = true; // Cleanup by setting cancelled to true
      };
    }
  }, [enteringNewBattle, currentBattle?.id, getOpenBattles, sendBattleReadyRequest, tempCurrentIslandLevel, setGameStatePage,subProcess]);

  const { data: newMessages, refetch: refetchBattleUpdates } = useQuery({
    queryKey: [`newMessages-${currentBattle?.id}`],
    queryFn: async () => {
      console.log("refetching battle updates");
      const updatedBattle = await setCurrentBattle(currentBattle!.id);
      return updatedBattle;
    },
    enabled: !!currentBattle?.id && !currentBattle?.ended,
    refetchInterval: 1000, // Poll every 1 second
  });

  // if (enteringNewBattle && !currentBattle?.id) {
  // return <div>Entering a new battle...</div>;
  // }
  if (!hasBattleReady || (enteringNewBattle && !currentBattle?.id)) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <img src={comabatLoadingScreenImageURL || ""} alt="Entering a new battle..." className="w-full h-full" />
      </div>
    );
  }

  if (failedToEnterBattle) {
    return (
      <div>
        <p>Checked for 60 seconds. Failed to find an open battle :(</p>
        <div>
          <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => setGameStatePage(GameStatePages.GAME_MAP)} alt={"Return to Town"} />
        </div>
      </div>
    );
  }

  // if (currentBattle?.id && user?.current_battle_id !== currentBattle?.id) {
  //   return <div>Waiting for battle confirmation...</div>;
  // }

  if (!currentBattle?.id) {
    return (
      <div>
        <p>No battle found</p>
        <div>
          <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => setGameStatePage(GameStatePages.GAME_MAP)} alt={"Return to Town"} />
        </div>
      </div>
    );
  }

  console.log("currentBattle", currentBattle);

  return <MainBattlePage currentBattle={currentBattle} />;

  // return (
  //   <div
  //     className="flex justify-between p-8 min-h-screen bg-cover bg-center bg-no-repeat"
  //     style={{ backgroundImage: "url('https://arweave.net/S6akCN0tHZTeihCQ0PWKBAcMdA3tnteR_28tWviw8TY')" }}
  //   >
  //     <audio src={SOUNDS.BATTLE_AUDIO} autoPlay loop />
  //     <BattleGround currentBattle={currentBattle} />
  //     <CombatInventory currentBattle={currentBattle} />
  //     <BattleLog currentBattle={currentBattle} />
  //   </div>
  // );
}

function MainBattlePage({ currentBattle }: { currentBattle: Battle }) {
  useBackgroundMusic(SOUNDS.BATTLE_AUDIO);

  const { goToTown, goToRestArea, tempCurrentIslandLevel, setTempCurrentIslandLevel, currentIslandLevel, lamaPosition, setLamaPosition, setIsSettingsOpen, user, questBookOpen, isPopupOpen, setIsPopupOpen } =
  useGameStore();

  const currentMapImage = () => {
    if (tempCurrentIslandLevel <= 26) return "https://arweave.net/aSPkGkjMawQdvfa5eJ1qX4PZJv8-6OLDJbvQW5ytsj4";
    if (tempCurrentIslandLevel <= 52) return "https://arweave.net/fhvcZm6NabNEuF-GswrrOOd1GBS-GUxb9WeTiG2FQVQ";
    return "https://arweave.net/904Jv473dMlxApd-GlUGUYggDwu20COKPNimTS6Io9k";
  };



  // const hasBattleReady = useCombatStore((state) => state.hasBattleReady);

  // if(!hasBattleReady){
  //   return(
  //     <div className="flex justify-between p-8 min-h-screen bg-cover bg-center bg-no-repeat"
  //     style={{ backgroundImage: "url('https://arweave.net/S6akCN0tHZTeihCQ0PWKBAcMdA3tnteR_28tWviw8TY')" }}>
  //     <div className="fixed inset-0 flex items-center justify-center text-white z-50">
  //       <div className="w-[30vw] h-[30vh] rounded-lg p-4 relative flex justify-center items-center">
  //         <div className="flex flex-col items-center justify-center w-full h-full">
  //           <h2 className="text-6xl font-semibold ">Loading ...</h2>
  //         </div>
  //       </div>
  //     </div>
  //   </div>

  //   )
  // }

  return (
    <div
      className="flex justify-between p-8 min-h-screen left-0 top-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${currentMapImage()})` }}
    >
      <BattleGround currentBattle={currentBattle} />
      <CombatInventory currentBattle={currentBattle} />
      <BattleLog currentBattle={currentBattle} />
    </div>
  );
}

function CombatInventory({ currentBattle }: { currentBattle: Battle }) {
  const user = useGameStore((state) => state.user);
  const player = currentBattle.players[user!.id.toString()];
  const drinkPotion = useCombatStore((state) => state.userDrinkPotion);
  const actionLoading = useCombatStore((state) => state.actionLoading);
  const potionsInBag = user?.inventory?.filter((item) => item.item_id === "POTION_1") ?? [];
  const potionUsed = !!player.potion_used;
  if (potionUsed) {
    // remove one item from potionsInBag
    potionsInBag.shift();
  }
  (player as any).inventory = potionsInBag;

  return (
    <div className="flex flex-col justify-between">
      <div className="flex-grow"></div>
      <InventoryBag combatInventory combatInventoryUserData={player as any} />
      <div className="flex justify-center">
        <ImgButton
          disabled={actionLoading || potionUsed || !player.potion}
          // className="w-20 shrink-0"
          src={"https://arweave.net/K815sdYLj_pFQQ_95fSY3P-55XinoUZiTskuJEgaK8w"}
          onClick={async () => {
            audioManager.playSFX(SOUNDS.DRINK_POTION_AUDIO);
            await drinkPotion();

            // if (drinkPotionAudioRef.current) {
            //   drinkPotionAudioRef.current.currentTime = 0; // Reset audio to start
            //   drinkPotionAudioRef.current.play();
            // }
          }}
          alt={"Use Potion"}
        />
      </div>
    </div>
  );
}

function BattleGround({ currentBattle }: { currentBattle: Battle }) {
  const userId = useGameStore((state) => state.user!.id);
  const userAttack = useCombatStore((state) => state.userAttack);
  const userRun = useCombatStore((state) => state.userRun);
  const actionLoading = useCombatStore((state) => state.actionLoading);
  console.log("User attack: " , actionLoading,
    currentBattle.ended, // battle has ended
    !!currentBattle.players_attacked.find((player) => player === userId.toString()),
    !currentBattle.players_alive.find((player) => player === userId.toString()));
  const disableAttackButtons =
    actionLoading ||
    currentBattle.ended || // battle has ended
    !!currentBattle.players_attacked.find((player) => player === userId.toString()) || // user has attacked
    !currentBattle.players_alive.find((player) => player === userId.toString()); // user is not alive

  const [newPlayerTimers, setNewPlayerTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    Object.values(currentBattle.players).forEach((player) => {
      // console.log("!!NEW PLAYER!!", player, Date.now() - 8000, (player as any).added_at_timestamp);
      if (player.id !== userId.toString() && (player as any).added_at_timestamp > Date.now() - 8000) {
        const timeToWait = 8000 - (Date.now() - (player as any).added_at_timestamp);
        setNewPlayerTimers((prev) => ({ ...prev, [player.id]: (player as any).added_at_timestamp + timeToWait }));
        timers[player.id] = setTimeout(() => {
          setNewPlayerTimers((prev) => {
            const newTimers = { ...prev };
            delete newTimers[player.id];
            return newTimers;
          });
        }, timeToWait);
      }
    });

    return () => {
      Object.values(timers).forEach((timer) => clearTimeout(timer));
    };
  }, [currentBattle.players, currentBattle.created_at, userId]);

  // const attackAudioRef = useRef<HTMLAudioElement>(null);
  const [attackedEnemyId, setAttackedEnemyId] = useState<string | null>(null);

  const handleAttack = (enemyId: string) => {
    // if (attackAudioRef.current) {
    //   attackAudioRef.current.currentTime = 0; // Reset audio to start
    //   attackAudioRef.current.play();
    // }
    setAttackedEnemyId(enemyId);
    userAttack(enemyId);
    // Reset the attackedEnemyId after the animation duration
    setTimeout(() => setAttackedEnemyId(null), 1000);
  };

  const otherPlayers = Object.values(currentBattle.players).filter((player) => player.id !== userId.toString());
  const enemies = Object.values(currentBattle.npcs);

  const allPlayers = [...enemies, ...otherPlayers];

  // Get all players with pets for the pet display section
  const playersWithPets = Object.values(currentBattle.players).filter(player => player.pet !== null);

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="grid grid-cols-[1fr_1fr] gap-4 items-start w-[700px]">
          {/* <audio preload="auto" ref={attackAudioRef} src={SOUNDS.ATTACK_AUDIO} /> */}

          <div className="relative flex flex-col gap-2 w-[350px] items-center">
            <PlayerCard player={currentBattle.players[userId.toString()]} />
            <UserIsAttackedAnimation currentBattle={currentBattle} />
            <ImgButton
              disabled={disableAttackButtons}
              className={"w-40"}
              src={"https://arweave.net/T2vJXtx4ivM9tySkAq8u2uSCLSDWRaPcIqqBYdAWBfE"}
              onClick={() => userRun()}
              alt={"Run"}
            />
          </div>
          {allPlayers.map((entity, index) => {
            const isNPC = !!(entity as NPC).difficulty;
            const enemyIsAlive = currentBattle.npcs_alive.includes(entity.id) || currentBattle.players_alive.includes(entity.id);
            const newPlayerArrived = !isNPC && !!newPlayerTimers[entity.id]; // pvp 5 second combat cooldown for new players
            const disableAttack = disableAttackButtons || newPlayerArrived;

            return (
              <>
                <div key={entity.id} className="flex flex-col gap-2 w-[350px] items-center">
                  {isNPC && (
                    <div className={`relative ${enemyIsAlive ? "opacity-100" : "opacity-30"}`}>
                      <EnemyCard enemy={entity as NPC} />
                      {attackedEnemyId === entity.id && <AttackAnimation />}
                    </div>
                  )}

                  {!isNPC && (
                    <div className={`${enemyIsAlive ? "opacity-100" : "opacity-30"}`}>
                      <PlayerCard player={entity as Battle["players"][string]} />
                    </div>
                  )}

                  {enemyIsAlive && (
                    <div className="flex gap-2 items-center">
                      <ImgButton
                        disabled={disableAttack}
                        className="w-40 shrink-0"
                        src={"https://arweave.net/DgrvBd4oLXyLXGxNlU3YRxDo1LBpTYKVc_T0irDrmj0"}
                        onClick={() => handleAttack(entity.id)}
                        alt={"Attack" + entity.name}
                      />

                      {isNPC && <NPCAttackCountDown currentBattle={currentBattle} entity={entity as Battle["npcs"][string]} />}
                      {!isNPC && <PlayerAttackCountDown currentBattle={currentBattle} entity={entity as Battle["players"][string]} />}
                    </div>
                  )}
                </div>
              </>
            );
          })}


        </div>

       <div className="flex flex-col gap-5 absolute right-[33%] top-[3%]">
          {/* Display pets for all players who have them */}
          {playersWithPets.map(player => (
            <div key={`pet-${player.id}`} className="flex flex-col gap-2 items-center">
              <PetCard pet={player.pet} />
              <span className="text-sm text-white mb-1">{player.name}'s Pet</span>
            </div>
          ))} 
        </div>

      </div>
    </div>
  );
}

function NPCAttackCountDown({ entity, currentBattle }: { entity: Battle["npcs"][string]; currentBattle: Battle }) {
  const lastAttackTimestamp = currentBattle.last_npc_attack_timestamp[entity.id];
  console.log("Ashu : lastAttackTimestamp: " + lastAttackTimestamp);
  const timeTillAttack = lastAttackTimestamp ? 10 - (Date.now() - lastAttackTimestamp) / 1000 : 10;
  return (
    <p className="text-white text-lg font-bold text-center">
      {Math.ceil(timeTillAttack < 0 ? 0 : timeTillAttack)} seconds till {entity.name} attacks...
    </p>
  );
}

function PlayerAttackCountDown({ entity, currentBattle }: { entity: Battle["players"][string]; currentBattle: Battle }) {
  const userId = useGameStore((state) => state.user!.id).toString();
  // if current user has attacked, show the time till the other player attacks
  if (!currentBattle.players_attacked.includes(userId)) {
    return null;
  }
  const lastAttackTimestamp = currentBattle.last_player_attack_timestamp[entity.id];
  const timeTillAttack = lastAttackTimestamp ? 10 - (Date.now() - lastAttackTimestamp) / 1000 : 10;
  return (
    <p className="text-white text-lg font-bold text-center">
      {entity.name} has {Math.ceil(timeTillAttack < 0 ? 0 : timeTillAttack)} seconds to attack...
    </p>
  );
}

function UserIsAttackedAnimation({ currentBattle }: { currentBattle: Battle }) {
  const userId = useGameStore((state) => state.user!.id).toString();
  const [previousBattle, setPreviousBattle] = useState<Battle | null>(null);
  const [isAttacked, setIsAttacked] = useState(false);
  const attackAudioRef = useRef<HTMLAudioElement>(null);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    if (!previousBattle) {
      setPreviousBattle(currentBattle);
      return;
    }
    const previousDefense = previousBattle.players[userId].defense;
    const currentDefense = currentBattle.players[userId].defense;
    const previousHealth = previousBattle.players[userId].health;
    const currentHealth = currentBattle.players[userId].health;
    if (previousDefense !== currentDefense || previousHealth !== currentHealth) {
      setIsAttacked(true);
      setKey(Math.random()); // Increment the key to restart the GIF
    }
    setPreviousBattle(currentBattle);
  }, [currentBattle, previousBattle]);

  useEffect(() => {
    if (isAttacked) {
      // if (attackAudioRef.current) {
      // attackAudioRef.current.currentTime = 0; // Reset audio to start
      // attackAudioRef.current.play();
      audioManager.playSFX(SOUNDS.IS_ATTACKED_AUDIO);
      // }
      setTimeout(() => {
        setIsAttacked(false);
      }, 5000);
    }
  }, [isAttacked]);

  // useEffect(() => {
  //   setIsAttacked(true);
  //   console.log("isAttaxxckeddd", isAttacked);
  // }, [isAttacked]);

  return (
    <>
      {isAttacked && (
        <>
          {/* <audio preload="auto" ref={attackAudioRef} src={SOUNDS.IS_ATTACKED_AUDIO} /> */}
          <div className="absolute z-10 top-0 left-0 w-full h-[80%] flex items-center justify-center">
            <img key={key} src={`https://arweave.net/685Qo64yiYdiFtwHbi_HoMQZt-7NtWGFYLrtXJfUHcI?key=${key}`} alt="Attacked Animation" className="max-w-full max-h-full" />
            {/* <img src="https://arweave.net/Byhqsjqy34GLYipi7RTBF0qaMevJTtwMdBWbFawGOD0" alt="Attack Animation" className="max-w-full max-h-full" /> */}
          </div>
        </>
      )}
    </>
  );
}

function AttackAnimation() {
  const attackAudioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    audioManager.playSFX(SOUNDS.ATTACK_AUDIO);
    // if (attackAudioRef.current) {
    // attackAudioRef.current.currentTime = 0; // Reset audio to start
    // attackAudioRef.current.play();
    // }
  }, []);
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      {/* <audio preload="auto" ref={attackAudioRef} src={SOUNDS.ATTACK_AUDIO} /> */}
      <img src="https://arweave.net/Byhqsjqy34GLYipi7RTBF0qaMevJTtwMdBWbFawGOD0" alt="Attack Animation" className="max-w-full max-h-full" />
    </div>
  );
}

function PlayerCard({ player }: { player: Battle["players"][string] }) {
  const user = useGameStore((state) => state.user);
  const inventory = useGameStore((state) => state.inventory);
  const totalHealth = player.total_health;
  const totalStamina = player.total_stamina;
  const filledHealth = player.health;
  const filledStamina = player.stamina;
  const drinkPotion = useCombatStore((state) => state.userDrinkPotion);
  const actionLoading = useCombatStore((state) => state.actionLoading);
  // const drinkPotionAudioRef = useRef<HTMLAudioElement>(null);

  const { weapon, armor } = getEquippedItem(inventory!);
  const isUsingWeapon = !!player.inventory_weapon_id;
  const isUsingArmor = !!player.inventory_armor_id;

  return (
    <div
      className="w-[250px] relative flex flex-col bg-[url('https://arweave.net/sX67q1nQcG8fOyyJqTOcIc2CfmAsZCocplOXJIWFN0Y')] bg-no-repeat bg-contain bg-center px-3 py-1"
      style={{ aspectRatio: "302/421", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}
    >
      {/* <audio preload="auto" ref={drinkPotionAudioRef} src={SOUNDS.DRINK_POTION_AUDIO} /> */}
      <h2 className="text-white text-2xl font-bold text-center translate-y-[0.625rem]">{player.name} (P)</h2>
      <img
        src={player.nft_address ? `https://arweave.net/${player.nft_address}` : IMAGES.DEFAULT_DUMDUM}
        alt={player.name}
        className={`w-full ${player.nft_address ? "max-h-[226px]" : "max-h-[212px] mt-4"} object-contain mb-2`}
      />

      {/* <div className="flex gap-2 justify-between items-start">
        <div className="flex flex-col gap-1"> */}
      {/* <div className="flex gap-1">
            {Array.from({ length: totalHealth }).map((_, index) => (
              <img className="w-5" key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" />
            ))}
          </div> */}
      {/* <div className="flex gap-1">
            {Array.from({ length: totalStamina }).map((_, index) => (
              <img className="w-5" key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
            ))}
          </div> */}

      <div className="absolute flex flex-col left-1" style={{ bottom: "22%" }}>
        <div className="relative">
          <img src={"https://arweave.net/TztZ9vkeLpTvkVWjCEkV8HnJncb6i-6lo66kZN2r5Fg"} alt="Health" className="w-20" />
          <p className="absolute inset-0 flex items-center mb-5 justify-center text-white text-xl font-bold">
            {player.health}/{player.total_health}
          </p>
        </div>
      </div>

      {/* {player.potion && (
            <>
              <div className="flex gap-1">
                <img className="h-7" src={ITEM_ICONS[player.potion.item_id as keyof typeof ITEM_ICONS]} alt="Potion" />
                <p className="text-black text-2xl font-bold text-center">{player.potion_used ? 0 : player.potion.health}</p>
              </div>
              <div className="flex gap-1">
                {user?.id.toString() == player.id && (
                  <ImgButton
                    disabled={actionLoading || player.potion_used}
                    className="w-20 shrink-0"
                    src={"https://arweave.net/K815sdYLj_pFQQ_95fSY3P-55XinoUZiTskuJEgaK8w"}
                    onClick={async () => {
                      await drinkPotion();
                      if (drinkPotionAudioRef.current) {
                        drinkPotionAudioRef.current.currentTime = 0; // Reset audio to start
                        drinkPotionAudioRef.current.play();
                      }
                    }}
                    alt={"Use Potion"}
                  />
                )}
              </div>
            </>
          )} */}
      {/* </div> */}
      {/* </div> */}
      <div className="absolute flex flex-col right-8" style={{ bottom: "5%" }}>
        <div className="flex flex-col items-center justify-between" style={{ height: "61px" }}>
          <p className="text-white text-xl font-bold text-center">{player.damage}</p>
          <p className="text-white text-xl font-bold text-center">{player.defense}</p>
        </div>
      </div>
      <div className="flex gap-8 ml-7 mt-1">
        <div className="flex flex-col items-center justify-between">
          <img src={armor && isUsingArmor ? ITEM_IMAGES[armor.item_id as keyof typeof ITEM_IMAGES] : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="h-10" />
          {/* <p className="text-black text-2xl font-bold text-center">{player.damage}</p> */}
        </div>
        <div className="flex flex-col gap-1 items-center justify-between">
          <img src={weapon && isUsingWeapon ? ITEM_IMAGES[weapon.item_id as keyof typeof ITEM_IMAGES] : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="h-10" />
          {/* <p className="text-black text-2xl font-bold text-center">{player.defense}</p> */}
        </div>
      </div>
    </div>
  );
}

function EnemyCard({ enemy }: { enemy: Battle["npcs"][string] }) {
  const special_item_hearts = useGameStore((state) => state.user?.special_item_heart ?? 0);
  var backgroundImage = ENEMY_CARD_IMAGE[enemy.id as keyof typeof ENEMY_CARD_IMAGE];
  console.log("Enemy Background Image: "+ backgroundImage);
  const totalHealth = enemy.total_health;
  const filledHealth = enemy.health;

  const totalGold = (enemy.extra_gold ?? 0) + (enemy.gold_reward ?? 0);
  // Calculate font size based on the number of digits
  // const fontSize = totalGold.toString().length > 3 ? 15 : 20;

  return (
    <div
      className="w-[250px] flex flex-col bg-no-repeat bg-contain bg-center relative"
      style={{
        textShadow: "-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000",
        aspectRatio: "302/421",
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute bottom-[28%] left-[10%]">
        <p className="text-white text-center font-bold" style={{ fontSize: "20px" }}>
          {enemy.health}/{totalHealth}
        </p>
        {/* <div className="flex gap-1 px-4 justify-start">
          {Array.from({ length: totalHealth }).map((_, index) => (
            <img key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" className="w-[9%] " />
          ))}
        </div> */}
      </div>
      {enemy.id == "PEACOCK" && (
        <div className={`absolute w-[215px] left-[20px] bottom-[5%]`}>
          {special_item_hearts <= 0 && <img src="https://arweave.net/h5GrIKLk1Q4Mv0xAF82ZS2Nwh1ESa1kTy5P_9dpirCo" alt="Special Item Heart Top Left" className="w-8 h-8 mx-auto" />}
          {special_item_hearts == 1 && <img src="https://arweave.net/ogpB0YYqkb7isSQ-J-r62GpcyiColpPqEGMhSh1Wn1g" alt="Special Item Heart Top Right" className="w-8 h-8 mx-auto" />}
          {special_item_hearts == 2 && (
            <img src="https://arweave.net/GyghY_YYyptw3Nrx3g-CG248YSaBrwa5l2fJbkYuzjI" alt="Special Item Heart Bottom Right" className="w-8 h-8 mx-auto" />
          )}
          {special_item_hearts >= 3 && (
            <img src="https://arweave.net/dqMWqLwe9ABVOez_1FJqTVebASXNU8lXvYDJ3LJSoak" alt="Special Item Heart Bottom Left" className="w-8 h-8 mx-auto" />
          )}
        </div>
      )}
      {totalGold != 0 && (
        <div className={`absolute w-[65px] ${enemy.id == "LEPERCHAUN" ? "left-[38%] bottom-[7%]" : "left-[2.5%] bottom-[6.5%]"}`}>
          <p
            className="text-white font-bold text-right overflow-hidden whitespace-nowrap"
            style={{
              fontSize: `${enemy.id == "LEPERCHAUN" ? 18 : 15}px`,
              lineHeight: "1",
            }}
          >
            {totalGold.toLocaleString()}g
          </p>
        </div>
      )}
      {enemy.dumz_reward && (
        <div className="absolute bottom-[6.5%] right-[18%]">
          <p
            className="text-white font-bold text-right overflow-hidden whitespace-nowrap"
            style={{
              fontSize: `${15}px`,
              lineHeight: "1",
            }}
          >
            {enemy.dumz_reward} $Dumz
          </p>
        </div>
      )}
      {enemy.trunk_reward && (
        <div className="absolute bottom-[12.2%] right-[18%]">
          <p
            className="text-white font-bold text-right overflow-hidden whitespace-nowrap"
            style={{
              fontSize: `${15}px`,
              lineHeight: "1",
            }}
          >
            {enemy.trunk_reward} $Trunk
          </p>
        </div>
      )}
    </div>
  );
}


function PetCard({pet}:{pet: Battle["players"][string]["pet"]}) {
  const user = useGameStore((state) => state.user);

  // This line needs to be moved after the null check
  if (!pet) return null;
  
  const petAbilityLeftPosition = pet.ability_type !== "RUN_AWAY" ? "28%" : "18%";
  const petImage = PET_LARGE_CARD_IMAGE[pet.id as keyof typeof PET_LARGE_CARD_IMAGE] || '';
  
  return(
    <div
      className="w-[180px] relative flex flex-col bg-[url('https://arweave.net/RDIshQ0tzLOR_J8CEFtA27uC_n9SPEWtre90YDCbgkc')] bg-no-repeat bg-contain bg-center px-3 py-1"
      style={{ aspectRatio: "162/218", textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}
    >
      {petImage && (
        <div className="flex items-center justify-center w-full h-[60%] translate-y-5">
          <img 
            src={petImage} 
            alt={`${pet.name} pet`}
            className="w-[100%] h-[100%] object-contain"
            style={{aspectRatio: "1/1", margin: "auto"}}
          />
        </div>
      )}
      <h2 
        className="absolute bottom-[8%] text-white text-xl font-bold text-center"
        style={{ left: petAbilityLeftPosition }}
      >
        {pet.ability_type === "ATTACK" ? "+ " + pet.ability + " DMG" : 
         pet.ability_type === "DEFENSE" ? "+ " + pet.ability + " DEF" : 
         pet.ability_type === "RUN_AWAY" ? "+ RUN AWAY" : ""}
      </h2>
    </div>
  )
}



function BattleLog({ currentBattle }: { currentBattle: Battle }) {
  const user_id = useGameStore((state) => state.user!.id);
  const combatLoading = useCombatStore((state) => state.loading);
  const goToMapFromBattle = useCombatStore((state) => state.goToMapFromBattle);
  const isAlive = currentBattle?.players?.[user_id]?.health ?? 0 > 0;

  // as the log is updated, scroll to the bottom
  useEffect(() => {
    const logContainer = document.querySelector(".log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [currentBattle.log]);

  return (
    <div
      className="flex shrink-0 flex-col gap-2 bg-[url('https://arweave.net/S-6Ww4DB5i7CZlzpXYXBJI8Q8u5DLOCuK6rL0W2MZrU')] bg-no-repeat bg-contain bg-center p-4 min-w-[460px] max-w-[50vw] h-full"
      style={{ aspectRatio: "649/1040", height: "calc(100vh - 60px)" }}
    >
      <div className="flex items-center justify-between">
        <div className="w-6">{combatLoading && <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>}</div>
        <div className="flex-grow flex flex-col justify-center">
          <h1 className="text-white my-4 text-5xl font-bold text-center underline flex-grow">COMBAT LOG</h1>
          <p className="text-white text-xl text-center">Battle ID: {currentBattle.id}</p>
        </div>
        <div className="w-6"></div>
      </div>
      <div style={{ height: "calc(100vh - 200px)" }} className="log-container flex flex-col gap-8 overflow-y-auto">
        {currentBattle.log.map((log, index) => { 
           const name = currentBattle.players[log.from]?.name || currentBattle.npcs[log.from]?.name || Object.values(currentBattle.players).find((player) => player.pet?.id === log.from)?.pet?.name || "" ;
          return (
            <div key={index} className="flex text-2xl gap-4 justify-between px-4">
              <p className="text-white font-bold text-center">{name ? name + ":" : ""}</p>
              <p className="text-white text-center">
                {log.message.split(" ").map((word, index) =>
                  word === "Perished" ? (
                    <span key={index} className="text-red-800">
                      {word}
                    </span>
                  ) : word === "run" && log.message.split(" ")[index + 1] === "away" ? (
                    <span key={index} className="text-blue-800">
                      {word} {log.message.split(" ")[index + 1]}
                    </span>
                  ) : word === "away" && log.message.split(" ")[index - 1] === "run" ? (
                    <></>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                )}
              </p>
            </div>
          );
        })}
        {currentBattle.ended && (
          <div className="my-4 flex justify-center">
            <ImgButton
              disabled={combatLoading}
              // if alive, return to map, if dead, return to town
              src={`https://arweave.net/${isAlive ? "-ewxfMOLuaFH6ODHxg8KgMWMKkZfAt-yhX1tv2O2t5Y" : "n0rz0kGBK_uPI-XJ3aCPdJ3589IOl5BW2izZNOVFXaI"}`}
              onClick={() => goToMapFromBattle()}
              alt={"Return to Game Map"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
