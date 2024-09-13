import ImgButton from "@/components/ui/imgButton";
import { BATTLE_ICONS, ENEMY_CARD_IMAGE, IMAGES, SOUNDS } from "@/lib/constants";
import { getEquippedItem } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { Battle, NPC } from "@/types/combat";
import { useEffect, useRef } from "react";

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

  const otherPlayers = Object.values(currentBattle.players).filter((player) => player.id !== userId.toString());
  const enemies = Object.values(currentBattle.npcs);

  const allPlayers = [...enemies, ...otherPlayers];

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <audio ref={attackAudioRef} src={SOUNDS.ATTACK_AUDIO} />
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

          <div className="flex justify-center items-center">
            <img className="w-[98px] h-[101px]" src={"https://arweave.net/bXDhJ_4eLp_VCErak5teFjgMRkKV7LaCg5Dbs7xOE2I"} alt="Wand" />
          </div>

          {allPlayers.map((entity, index) => {
            const isEnemy = entity.id.startsWith("NPC");
            return (
              <>
                <div key={entity.id} className="flex flex-col gap-2 max-w-[380px] items-center">
                  {isEnemy && <EnemyCard enemy={entity as NPC} />}
                  {!isEnemy && <PlayerCard player={entity as Battle["players"][string]} />}
                  <div className="flex gap-2 items-center">
                    <ImgButton
                      disabled={loading || battleEnded}
                      className="w-40 shrink-0"
                      src={"https://arweave.net/DgrvBd4oLXyLXGxNlU3YRxDo1LBpTYKVc_T0irDrmj0"}
                      onClick={() => handleAttack(entity.id)}
                      alt={"Attack" + entity.name}
                    />

                    {isEnemy && <p className="text-white text-lg font-bold text-center">30 seconds till {entity.name} attacks...</p>}
                    {/* {!isEnemy && <p className="text-white text-lg font-bold text-center">{entity.name} has 30 seconds...</p>} */}
                  </div>
                </div>

                {index % 2 !== 0 && index !== allPlayers.length - 1 && (
                  <div className="flex justify-center items-center">
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

function PlayerCard({ player }: { player: Battle["players"][string] }) {
  const user = useGameStore((state) => state.user);
  const totalHealth = player.total_health;
  const totalStamina = player.total_stamina;
  const filledHealth = player.health;
  const filledStamina = player.stamina;

  const { weapon, armor } = getEquippedItem(user!);

  return (
    <div
      className="w-[302px] flex flex-col bg-[url('https://arweave.net/YHfNqgt4OHoiMxr3Jm9P4FB1QUCg7fND5IBkvuQm96c')] bg-no-repeat bg-contain bg-center px-4 py-1"
      style={{ aspectRatio: "302/421" }}
    >
      <h2 className="text-black text-2xl font-bold text-center">{player.name} (P)</h2>
      <img
        src={`https://arweave.net/${player.nft_address ? player.nft_address : "dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"}`}
        alt={player.name}
        className="w-full object-contain mb-2"
      />
      <div className="flex gap-2 justify-between items-start">
        <div>
          <div className="flex gap-1">
            {Array.from({ length: totalHealth }).map((_, index) => (
              <img key={index} src={index < filledHealth ? IMAGES.FILLED_HEALTH : IMAGES.EMPTY_HEALTH} alt="Health" />
            ))}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalStamina }).map((_, index) => (
              <img className="w-5" key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-between">
            <img src={weapon ? BATTLE_ICONS.WEAPON_1 : BATTLE_ICONS.NO_WEAPON} alt="weapon in inventory" className="w-8 h-8" />
            <p className="text-black text-2xl font-bold text-center">{player.damage}</p>
          </div>
          <div className="flex flex-col gap-1 items-center justify-between">
            <img src={armor ? BATTLE_ICONS.ARMOR_1 : BATTLE_ICONS.NO_ARMOR} alt="armor in inventory" className="w-8 h-8" />
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
  const goToMapFromBattle = useCombatStore((state) => state.goToMapFromBattle);

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
        <h1 className="text-white my-4 text-5xl font-bold text-center underline flex-grow">COMBAT LOG</h1>
        <div className="w-6"></div>
      </div>
      <div className="log-container flex flex-col gap-8 overflow-y-auto">
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
      </div>
      {currentBattle.ended && (
        <div className="my-4 flex justify-center">
          <ImgButton src={"https://arweave.net/-ewxfMOLuaFH6ODHxg8KgMWMKkZfAt-yhX1tv2O2t5Y"} onClick={() => goToMapFromBattle()} alt={"Return to Town"} />
        </div>
      )}
    </div>
  );
}
