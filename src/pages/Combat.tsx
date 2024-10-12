import ImgButton from "@/components/ui/imgButton";
import { ENEMY_CARD_IMAGE, IMAGES, ITEM_ICONS, SOUNDS } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { Battle, NPC } from "@/types/combat";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

// const currentBattle = {
//   log: [
//     {
//       timestamp: 1726346958193,
//       message: "hits Doe Eyed Deer for 2",
//       from: "3",
//     },
//     {
//       timestamp: 1726346958193,
//       message: "has slain Doe Eyed Deer",
//       from: "3",
//     },
//     {
//       timestamp: 1726346958193,
//       message: "hits CryptoCherie for 1",
//       from: "NPC_2",
//     },
//     {
//       timestamp: 1726346961590,
//       message: "hits Sad Hedgehog for 2",
//       from: "3",
//     },
//     {
//       timestamp: 1726346961590,
//       message: "has slain Sad Hedgehog",
//       from: "3",
//     },
//     {
//       timestamp: 1726346961590,
//       message: "has won the battle",
//       from: "3",
//     },
//   ],
//   winner: "2",
//   npcs: {
//     NPC_1: {
//       health: 0,
//       dumz_reward: 1,
//       damage: 1,
//       difficulty: "EASY",
//       total_health: 1,
//       gold_reward: 10,
//       extra_gold: 10000,
//       id: "NPC_1",
//       defense: 0,
//       name: "Doe Eyed Deer",
//     },
//     NPC_2: {
//       health: 0,
//       dumz_reward: 1,
//       damage: 1,
//       difficulty: "EASY",
//       total_health: 1,
//       gold_reward: 10,
//       extra_gold: 0,
//       id: "NPC_2",
//       defense: 0,
//       name: "Sad Hedgehog",
//     },
//   },
//   npcs_alive: ["NPC_1", "NPC_2"],
//   last_npc_attack_timestamp: {
//     NPC_1: 1726346952043,
//     NPC_2: 1726346958193,
//   },
//   level: 1,
//   id: 39,
//   players_attacked: ["7"],
//   ended: false,
//   created_at: 1726346952043,
//   players: {
//     "7": {
//       potion: {
//         health: 1,
//         id: 12,
//         item_id: "POTION_1",
//       },
//       name: "CryptoCherie",
//       damage: 2,
//       health: 2,
//       potion_used: true,
//       total_health: 2,
//       stamina: 1,
//       defense: 0,
//       nft_address: "B9-lCfmpAqDLhcyLL054pEYzNZlV6ZyseBsuxx2C-IY",
//       id: "2",
//       total_stamina: 6,
//       gold_balance: 24070,
//       current_spot: 0,
//       address: "9T6eBRHUSaoS4Dxi0iVdyaSroL6EaxGGKlgxBvMr6go",
//       dumz_balance: 60,
//     },
//   },
//   players_alive: ["7"],
// } as any;
export default function Combat() {
  const enteringNewBattle = useCombatStore((state) => state.enteringNewBattle);

  const currentBattle = useCombatStore((state) => state.currentBattle);
  const setCurrentBattle = useCombatStore((state) => state.setCurrentBattle);

  const getOpenBattles = useCombatStore((state) => state.getOpenBattles);
  const setEnteringNewBattle = useCombatStore((state) => state.setEnteringNewBattle);
  // const combatLoading = useCombatStore((state) => state.loading);

  const setGameStatePage = useGameStore((state) => state.setGameStatePage);

  const [failedToEnterBattle, setFailedToEnterBattle] = useState(false);
  // console.log("currentBattle", currentBattle);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let stopTimeout: NodeJS.Timeout | null = null;

    const checkOpenBattles = async () => {
      if (enteringNewBattle && !currentBattle?.id) {
        console.log("Checking for open battles", "enteringNewBattle", enteringNewBattle, currentBattle?.id);
        const battle = await getOpenBattles();
        if (!battle) {
          // Schedule the next check in 1 second
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(checkOpenBattles, 5000);
        }
      }
    };

    if (enteringNewBattle && !currentBattle?.id) {
      console.log("SET UP TIMEOUT FOR CHECKING OPEN BATTLES", "enteringNewBattle", enteringNewBattle, currentBattle?.id);
      checkOpenBattles();

      // Stop checking after 60 seconds
      if (stopTimeout) clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        if (timeout) {
          console.log("Stopped checking for open battles after 60 seconds");
          clearTimeout(timeout);
        }
        setFailedToEnterBattle(true);
        // Reset the enteringNewBattle state
        setEnteringNewBattle(false);
      }, 60000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (stopTimeout) {
        clearTimeout(stopTimeout);
      }
    };
  }, [enteringNewBattle, currentBattle?.id, getOpenBattles, setFailedToEnterBattle, setEnteringNewBattle]);

  // check for battle updates
  // useEffect(() => {
  //   let timeout: NodeJS.Timeout | null = null;

  //   const checkBattleUpdates = async () => {
  //     if (currentBattle?.id) {
  //       console.log("Checking for battle updates");
  //       const updatedBattle = await setCurrentBattle(currentBattle.id);

  //       // Use the most up-to-date battle state
  //       if (updatedBattle && !updatedBattle.ended) {
  //         if (timeout) clearTimeout(timeout);
  //         timeout = setTimeout(checkBattleUpdates, 5000);
  //       } else {
  //         // Battle has ended, clean up
  //         if (timeout) {
  //           clearTimeout(timeout);
  //         }
  //       }
  //     }
  //   };

  //   if (currentBattle?.id && !currentBattle.ended) {
  //     checkBattleUpdates(); // Start the initial call only if battle is ongoing
  //   }

  //   return () => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   };
  // }, [currentBattle?.id, currentBattle?.ended, setCurrentBattle]);

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

  if (enteringNewBattle && !currentBattle?.id) {
    return <div>Entering a new battle...</div>;
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

  return (
    <div className="flex gap-4 justify-between p-8 min-h-screen bg-gray-900">
      <audio src={SOUNDS.BATTLE_AUDIO} autoPlay loop />
      <BattleGround currentBattle={currentBattle} />
      <BattleLog currentBattle={currentBattle} />
    </div>
  );
}

function BattleGround({ currentBattle }: { currentBattle: Battle }) {
  const userId = useGameStore((state) => state.user!.id);
  const userAttack = useCombatStore((state) => state.userAttack);
  const userRun = useCombatStore((state) => state.userRun);
  const actionLoading = useCombatStore((state) => state.actionLoading);
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

  const attackAudioRef = useRef<HTMLAudioElement>(null);
  const [attackedEnemyId, setAttackedEnemyId] = useState<string | null>(null);

  const handleAttack = (enemyId: string) => {
    if (attackAudioRef.current) {
      attackAudioRef.current.currentTime = 0; // Reset audio to start
      attackAudioRef.current.play();
    }
    setAttackedEnemyId(enemyId);
    userAttack(enemyId);
    // Reset the attackedEnemyId after the animation duration
    setTimeout(() => setAttackedEnemyId(null), 1000);
  };

  const otherPlayers = Object.values(currentBattle.players).filter((player) => player.id !== userId.toString());
  const enemies = Object.values(currentBattle.npcs);

  const allPlayers = [...enemies, ...otherPlayers];

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <audio preload="auto" ref={attackAudioRef} src={SOUNDS.ATTACK_AUDIO} />
          <div className="flex flex-col gap-2 w-[380px] items-center">
            <PlayerCard player={currentBattle.players[userId.toString()]} />
            <ImgButton
              disabled={disableAttackButtons}
              className={"w-40"}
              src={"https://arweave.net/T2vJXtx4ivM9tySkAq8u2uSCLSDWRaPcIqqBYdAWBfE"}
              onClick={() => userRun()}
              alt={"Run"}
            />
          </div>

          <div className="flex justify-center self-center">
            <img className="w-[98px] h-[101px]" src={"https://arweave.net/bXDhJ_4eLp_VCErak5teFjgMRkKV7LaCg5Dbs7xOE2I"} alt="Wand" />
          </div>

          {allPlayers.map((entity, index) => {
            const isNPC = entity.id.startsWith("NPC");
            const enemyIsAlive = currentBattle.npcs_alive.includes(entity.id) || currentBattle.players_alive.includes(entity.id);
            const newPlayerArrived = !isNPC && !!newPlayerTimers[entity.id]; // pvp 5 second combat cooldown for new players
            const disableAttack = disableAttackButtons || newPlayerArrived;

            return (
              <>
                <div key={entity.id} className="flex flex-col gap-2 w-[380px] items-center">
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

                      {isNPC && <p className="text-white text-lg font-bold text-center">20 seconds till {entity.name} attacks...</p>}
                      {/* {!isEnemy && <p className="text-white text-lg font-bold text-center">{entity.name} has 20 seconds...</p>} */}
                    </div>
                  )}
                </div>

                {index % 2 !== 0 && index !== allPlayers.length - 1 && (
                  <div className="flex justify-center self-center">
                    <img className="w-[98px] h-[101px]" src={"https://arweave.net/bXDhJ_4eLp_VCErak5teFjgMRkKV7LaCg5Dbs7xOE2I"} alt="Wand" />
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AttackAnimation() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
      <img src="https://arweave.net/Byhqsjqy34GLYipi7RTBF0qaMevJTtwMdBWbFawGOD0" alt="Attack Animation" className="max-w-full max-h-full" />
    </div>
  );
}

function PlayerCard({ player }: { player: Battle["players"][string] }) {
  const user = useGameStore((state) => state.user);
  const totalHealth = player.total_health;
  const totalStamina = player.total_stamina;
  const filledHealth = player.health;
  const filledStamina = player.stamina;
  const drinkPotion = useCombatStore((state) => state.userDrinkPotion);
  const actionLoading = useCombatStore((state) => state.actionLoading);
  const drinkPotionAudioRef = useRef<HTMLAudioElement>(null);

  const { weapon, armor } = getEquippedItem(user!);

  return (
    <div
      className="w-[250px] flex flex-col bg-[url('https://arweave.net/YHfNqgt4OHoiMxr3Jm9P4FB1QUCg7fND5IBkvuQm96c')] bg-no-repeat bg-contain bg-center px-4 py-1"
      style={{ aspectRatio: "302/421" }}
    >
      <audio preload="auto" ref={drinkPotionAudioRef} src={SOUNDS.DRINK_POTION_AUDIO} />
      <h2 className="text-black text-2xl font-bold text-center">{player.name} (P)</h2>
      <img src={player.nft_address ? `https://arweave.net/${player.nft_address}` : IMAGES.DEFAULT_DUMDUM} alt={player.name} className="w-full  max-h-[200px] object-contain mb-2" />
      <div className="flex gap-2 justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {Array.from({ length: totalHealth }).map((_, index) => (
              <img className="w-5" key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" />
            ))}
          </div>
          {/* <div className="flex gap-1">
            {Array.from({ length: totalStamina }).map((_, index) => (
              <img className="w-5" key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
            ))}
          </div> */}
          {player.potion && (
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
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-between">
            <img src={weapon ? ITEM_ICONS.WEAPON_1 : ITEM_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-8 h-8" />
            <p className="text-black text-2xl font-bold text-center">{player.damage}</p>
          </div>
          <div className="flex flex-col gap-1 items-center justify-between">
            <img src={armor ? ITEM_ICONS.ARMOR_1 : ITEM_ICONS.NO_ARMOR} alt="armor in inventory" className="w-8 h-8" />
            <p className="text-black text-2xl font-bold text-center">{player.defense}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnemyCard({ enemy }: { enemy: Battle["npcs"][string] }) {
  const backgroundImage = ENEMY_CARD_IMAGE[enemy.id as keyof typeof ENEMY_CARD_IMAGE];
  const totalHealth = enemy.total_health;
  const filledHealth = enemy.health;
  return (
    <div
      className="w-[250px] flex flex-col bg-no-repeat bg-contain bg-center relative"
      style={{
        aspectRatio: "302/421",
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute bottom-[19%] left-0 right-0 w-full">
        <div className="flex gap-1 px-4 justify-start">
          {Array.from({ length: totalHealth }).map((_, index) => (
            <img key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" className="w-[9%] " />
          ))}
        </div>
      </div>
      <div className="absolute bottom-[3%] left-[2%] w-[26%]">
        <p className="text-black text-xl font-bold text-right">{(enemy.extra_gold ?? 0) + enemy.gold_reward}g</p>
      </div>
    </div>
  );
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
      className="flex shrink-0 flex-col gap-2 bg-[url('https://arweave.net/V4B3MJpEEAStbIOJbygQ6-lcVBR8w_8baD5TKK7u6p8')] bg-no-repeat bg-contain bg-center p-4 min-w-[460px] max-w-[50vw] h-full"
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
          const name = currentBattle.players[log.from]?.name || currentBattle.npcs[log.from]?.name || "";
          return (
            <div key={index} className="flex text-2xl gap-4 justify-between px-4">
              <p className="text-white font-bold text-center">{name}:</p>
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
