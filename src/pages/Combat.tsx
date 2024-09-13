import ImgButton from "@/components/ui/imgButton";
import { ENEMY_CARD_IMAGE, IMAGES, SOUNDS } from "@/lib/constants";
import { getPlayerTotalHealth, getPlayerTotalStamina } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { Battle } from "@/types/combat";
import { useEffect, useRef } from "react";

const currentBattleNow: Battle = {
  log: [
    {
      timestamp: 1726234643854,
      message: "Cute Doe Eyed Doe attacks 1human with a roll of 1",
    },
    {
      timestamp: 1726234643854,
      message: "Cute Doe Eyed Doe deals 1 damage to 1human's health",
    },
    {
      timestamp: 1726234683854,
      message: "Cute Doe Eyed Doe attacks 1human with a roll of 5",
    },
    {
      timestamp: 1726234683854,
      message: "Cute Doe Eyed Doe's attack misses",
    },
    {
      timestamp: 1726234723854,
      message: "Cute Doe Eyed Doe attacks 1human with a roll of 5",
    },
    {
      timestamp: 1726234723854,
      message: "Cute Doe Eyed Doe's attack misses",
    },
    {
      timestamp: 1726234763854,
      message: "Cute Doe Eyed Doe attacks 1human with a roll of 5",
    },
    {
      timestamp: 1726234763854,
      message: "Cute Doe Eyed Doe's attack misses",
    },
    {
      timestamp: 1726234803854,
      message: "Cute Doe Eyed Doe attacks 1human with a roll of 3",
    },
    {
      timestamp: 1726234803854,
      message: "Cute Doe Eyed Doe deals 1 damage to 1human's health",
    },
    {
      message: "NPC Cute Doe Eyed Doe won the battle",
      timestamp: 1726234803854,
    },
  ],
  winner: "NPC_1",
  npcs: {
    NPC_1: {
      gold_reward: 1,
      name: "Cute Doe Eyed Doe",
      damage: 1,
      difficulty: "EASY",
      id: "NPC_1",
      total_health: 1,
      health: 1,
    },
  },
  npcs_alive: ["NPC_1"],
  last_npc_attack_timestamp: {
    NPC_1: 1726234803854,
  },
  id: 31,
  players_attacked: [],
  ended: true,
  created_at: 1726234606495,
  players: {
    "5": {
      address: "6fpt98wMlpt1Q1C6-xdNI0qqOGbbjhLt5zl0NFNsSHE",
      gold_balance: 100,
      dumz_balance: 40,
      stamina: 6,
      defense: 0,
      id: "5",
      health: 0,
      name: "1human",
      damage: 2,
      nft_address: "UwLiygqiBMaMyzto_A2Xq6fz6S8Zcr0QSKOZJ6dFU-A",
    },
  },
  players_alive: [],
};

export default function Combat() {
  const { loading, enteringNewBattle, currentBattle, getOpenBattles, setCurrentBattle, enterNewBattle, userAttack, userRun } = useCombatStore();
  const { setGameStatePage } = useGameStore();

  console.log("currentBattle", currentBattle);

  //   Check for open battles
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    if (enteringNewBattle && !currentBattle?.id) {
      interval = setInterval(() => {
        console.log("checking for open battles");
        getOpenBattles();
      }, 1000);

      // Stop checking after 30 seconds
      timeout = setTimeout(() => {
        if (interval) {
          console.log("Stopped checking for open battles after 30 seconds");
          clearInterval(interval);
        }
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [enteringNewBattle, currentBattle, getOpenBattles]);

  //  Check for battle updates
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (currentBattle?.id && !currentBattle.ended) {
      if (interval) {
        clearInterval(interval);
      }
      interval = setInterval(() => {
        console.log("Checking for battle updates");
        setCurrentBattle(currentBattle.id);
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentBattle?.id, currentBattle?.ended, setCurrentBattle]);

  if (enteringNewBattle && !currentBattle?.id) {
    return <div>Entering a new battle...</div>;
  }

  if (!currentBattle) {
    return (
      <div>
        <p>No battle found</p>
        <div>
          <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => setGameStatePage(GameStatePages.GAME_MAP)} alt={"Return to Town"} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 justify-between p-8 h-screen bg-gray-900">
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
  const loading = useCombatStore((state) => state.loading);
  const battleEnded = currentBattle.ended;

  const attackAudioRef = useRef<HTMLAudioElement>(null);

  const handleAttack = (enemyId: string) => {
    if (attackAudioRef.current) {
      attackAudioRef.current.currentTime = 0; // Reset audio to start
      attackAudioRef.current.play();
    }
    userAttack(enemyId);
  };

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="flex flex-col gap-2 max-w-[380px] items-center">
          <PlayerCard player={currentBattle.players[userId.toString()]} />
          <ImgButton
            disabled={loading || battleEnded}
            className={"w-40"}
            src={"https://arweave.net/T2vJXtx4ivM9tySkAq8u2uSCLSDWRaPcIqqBYdAWBfE"}
            onClick={() => userRun()}
            alt={"Run"}
          />
        </div>
        <img className="w-[98px] h-[101px]" src={"https://arweave.net/bXDhJ_4eLp_VCErak5teFjgMRkKV7LaCg5Dbs7xOE2I"} alt="Wand" />
        <div className="flex flex-col gap-2 max-w-[380px] items-center">
          <EnemyCard enemy={Object.values(currentBattle.npcs)[0]} />
          <div className="flex gap-2 items-center">
            <ImgButton
              disabled={loading || battleEnded}
              className="w-40 shrink-0"
              src={"https://arweave.net/DgrvBd4oLXyLXGxNlU3YRxDo1LBpTYKVc_T0irDrmj0"}
              onClick={() => handleAttack(Object.values(currentBattle.npcs)[0].id)}
              alt={"Attack" + Object.values(currentBattle.npcs)[0].name}
            />
            <audio ref={attackAudioRef} src={SOUNDS.ATTACK_AUDIO} />
            <p className="text-white text-lg font-bold text-center">30 seconds till {Object.values(currentBattle.npcs)[0].name} attacks...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player }: { player: Battle["players"][string] }) {
  const totalHealth = getPlayerTotalHealth(player as any);
  const totalStamina = getPlayerTotalStamina(player as any);
  const filledHealth = player.health;
  const filledStamina = player.stamina;
  return (
    <div
      className="w-[302px] flex flex-col bg-[url('https://arweave.net/YHfNqgt4OHoiMxr3Jm9P4FB1QUCg7fND5IBkvuQm96c')] bg-no-repeat bg-contain bg-center px-4 py-1"
      style={{ aspectRatio: "302/421" }}
    >
      <h2 className="text-black text-2xl font-bold text-center">{player.name}</h2>
      <img
        src={`https://arweave.net/${player.nft_address ? player.nft_address : "dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"}`}
        alt={player.name}
        className="w-full object-contain mb-2"
      />
      <div className="flex gap-1">
        {Array.from({ length: totalHealth }).map((_, index) => (
          <img key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" />
        ))}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalStamina }).map((_, index) => (
          <img key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
        ))}
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
      className="w-[302px] flex flex-col bg-no-repeat bg-contain bg-center relative"
      style={{
        aspectRatio: "302/421",
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <div className="absolute bottom-[19%] left-0 right-0 w-full">
        <div className="flex gap-1 px-4 justify-start">
          {Array.from({ length: totalHealth }).map((_, index) => (
            <img key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" className="w-[12%] " />
          ))}
        </div>
      </div>
      <div className="absolute bottom-[3%] left-[2%] w-[26%]">
        <p className="text-black text-xl font-bold text-right">{enemy.gold_reward}g</p>
      </div>
    </div>
  );
}

function BattleLog({ currentBattle }: { currentBattle: Battle }) {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const combatLoading = useCombatStore((state) => state.loading);

  // as the log is updated, scroll to the bottom
  useEffect(() => {
    const logContainer = document.querySelector(".log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [currentBattle.log]);

  return (
    <div
      className="flex flex-col gap-2 bg-[url('https://arweave.net/V4B3MJpEEAStbIOJbygQ6-lcVBR8w_8baD5TKK7u6p8')] bg-no-repeat bg-contain bg-center p-4 max-w-[50vw] h-full max-h-[calc(100vw*1040/649/2)]"
      style={{ aspectRatio: "649/1040" }}
    >
      <div className="flex items-center justify-between">
        <div className="w-6">{combatLoading && <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>}</div>
        <h1 className="text-white text-3xl font-bold text-center underline flex-grow">COMBAT LOG</h1>
        <div className="w-6"></div>
      </div>
      <div className="log-container flex flex-col gap-2 overflow-y-auto">
        {currentBattle.log.map((log, index) => (
          <div key={index} className="text-white p-2 rounded">
            {log.message}
          </div>
        ))}
        {currentBattle.ended && (
          <div className="flex justify-center">
            <ImgButton
              className="w-32"
              src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"}
              onClick={() => setGameStatePage(GameStatePages.GAME_MAP)}
              alt={"Return to Town"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
