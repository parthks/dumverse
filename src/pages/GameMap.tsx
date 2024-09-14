import LammaWalkingLeft from "@/assets/lamma_inf_walking_left.gif";
import LammaWalkingRight from "@/assets/lamma_inf_walking_right.gif";
import LammaStandLeft from "@/assets/lamma_stand_left.png";
import LammaStandRight from "@/assets/lamma_stand_right.png";
import { PlayerFrame } from "@/components/game/PlayerFrame";
import InteractiveMap from "@/components/InteractiveMap";
import ImgButton from "@/components/ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, initialLamaPosition, useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import { useEffect, useState } from "react";

// TODO: Need the coordinates (in percentage of the map width and height) for all the black dots
export const interactivePoints = [
  { x: 79, y: 78, level: 1 },
  { x: 74.2, y: 79.6, level: 2 },
  { x: 69.4, y: 79.6, level: 3 },
  { x: 64.6, y: 77.9, level: 4 },
  { x: 60.6, y: 72.8, level: 5 },
];

export const lammaWidth = 6;
export const lammaHeight = 8.5;

const GameMap = () => {
  const { goToTown, currentIslandLevel, lamaPosition, setLamaPosition, user } = useGameStore();

  // useEffect(() => {
  //   console.log("GOT A currentIslandLevel", currentIslandLevel);
  //   if (currentIslandLevel != 0 && lammaPosition.x == initialLamaPosition.x && lammaPosition.y == initialLamaPosition.y) {
  //     handleLevelSelect(currentIslandLevel, true);
  //   }
  // }, [currentIslandLevel]);

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [stepDistance, setStepDistance] = useState("0.5");
  const [stepTime, setStepTime] = useState("50");

  const [tempLamaPosition, setTempLamaPosition] = useState(lamaPosition);
  // currentIslandLevel is the level that the lamma in the db is on
  // tempCurrentIslandLevel  controls the level that the lamma is currently on
  const [tempCurrentIslandLevel, setTempCurrentIslandLevel] = useState(currentIslandLevel);
  const enterNewBattle = useCombatStore((state) => state.enterNewBattle);
  const [enterNewBattleLoading, setEnterNewBattleLoading] = useState(false);
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);

  useEffect(() => {
    if (path.length > 0 && currentPathIndex < path.length) {
      const interval = setInterval(() => {
        setTempLamaPosition((prev) => {
          const targetPoint = path[currentPathIndex];
          const lammaBottomCenterX = prev.x + lammaWidth / 2;
          const lammaBottomCenterY = prev.y + lammaHeight;

          const dx = targetPoint.x - lammaBottomCenterX;
          const dy = targetPoint.y - lammaBottomCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            if (currentPathIndex === path.length - 1) {
              clearInterval(interval);
            } else {
              setCurrentPathIndex(currentPathIndex + 1);
            }
            setLamaPosition({
              x: targetPoint.x - lammaWidth / 2,
              y: targetPoint.y - lammaHeight,
              src: dx >= 0 ? "STAND_RIGHT" : "STAND_LEFT",
            });
            return {
              x: targetPoint.x - lammaWidth / 2,
              y: targetPoint.y - lammaHeight,
              src: dx >= 0 ? "STAND_RIGHT" : "STAND_LEFT",
            };
          }

          const step = parseFloat(stepDistance);
          const ratio = Math.min(step / distance, 1);
          const newX = prev.x + dx * ratio;
          const newY = prev.y + dy * ratio;

          return {
            x: newX,
            y: newY,
            src: dx >= 0 ? "WALKING_RIGHT" : "WALKING_LEFT",
          };
        });
      }, parseInt(stepTime));

      return () => {
        clearInterval(interval);
      };
    }
  }, [path, currentPathIndex]);

  const handleLevelSelect = (level: number, fromStart: boolean = false) => {
    const currentIndex = fromStart || currentIslandLevel == 0 ? 0 : interactivePoints.findIndex((point) => point.level === currentIslandLevel);
    const targetIndex = interactivePoints.findIndex((point) => point.level === level);

    // if (currentIndex !== -1 && targetIndex !== -1) {
    let newPath;
    if (currentIndex < targetIndex) {
      // Moving forward
      newPath = interactivePoints.slice(currentIndex, targetIndex + 1);
    } else {
      // Moving backward
      newPath = interactivePoints.slice(targetIndex, currentIndex + 1).reverse();
    }

    setPath(newPath.map((point) => ({ x: point.x, y: point.y })));
    setCurrentPathIndex(0);
    setTempCurrentIslandLevel(level);
  };

  return (
    <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: "url('https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ')" }}>
      <audio autoPlay loop>
        <source src={SOUNDS.ISLAND_AUDIO} type="audio/mpeg" />
      </audio>
      <div className="z-10 absolute top-4 right-4">
        <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => goToTown()} alt={"Return to Town"} />
      </div>
      <div className="z-10 absolute bottom-4 left-4 flex items-end gap-2">
        <PlayerFrame />
        {tempCurrentIslandLevel != 0 && (
          <ImgButton
            disabled={enterNewBattleLoading || user?.health == 0 || user?.stamina == 0}
            src={"https://arweave.net/bHrruH7w5-XmymuvXL9ZuxITu1aRxw2rtddi2v0FUxE"}
            onClick={async () => {
              setEnterNewBattleLoading(true);
              const resultData = await enterNewBattle(tempCurrentIslandLevel);
              console.log("resultData", resultData);
              if (resultData.status == "Success") {
                setGameStatePage(GameStatePages.COMBAT);
              }
              setEnterNewBattleLoading(false);
            }}
            className="shrink-0 mb-8"
            alt={"Enter Combat"}
          />
        )}
      </div>
      {/* <p className="text-sm text-red-500">Finetune the step distance and time to control the Lamma's movement.</p>
      <label>Step Distance (% of map width between 0-1)</label>
      <Input value={stepDistance} onChange={(e) => setStepDistance(e.target.value)} />
      <label>Step Time (in ms)</label>
      <Input value={stepTime} onChange={(e) => setStepTime(e.target.value)} /> */}
      <InteractiveMap tempCurrentIslandLevel={tempCurrentIslandLevel} lamaPosition={tempLamaPosition} interactivePoints={interactivePoints} onLevelSelect={handleLevelSelect} />
    </div>
  );
};

export default GameMap;
