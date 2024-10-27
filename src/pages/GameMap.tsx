import { PlayerFrame } from "@/components/game/PlayerFrame";
import QuestBook from "@/components/game/QuestBook";
import InteractiveMap from "@/components/InteractiveMap";
import ImgButton from "@/components/ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";

// TODO: Need the coordinates (in percentage of the map width and height) for all the black dots
// export const interactivePoints = [
//   { x: 82.2, y: 72.8, level: 1 },
//   { x: 78.6, y: 77.5, level: 2 },
//   { x: 72.8, y: 79.6, level: 3 },
//   { x: 66.8, y: 79, level: 4 },
//   { x: 60.6, y: 72.8, level: 5 },
//   { x: 53, y: 72.8, level: 6 },
//   { x: 50.5, y: 66, level: 7 },
//   { x: 48.3, y: 56.7, level: 8 },
//   { x: 45.2, y: 52.3, level: 9 },
//   { x: 55.5, y: 33.8, level: 10 },
//   { x: 60, y: 31.6, level: 11 },
//   { x: 71.5, y: 34.1, level: 12 },
//   { x: 78.8, y: 34, level: 13 },
//   { x: 85.3, y: 30.9, level: 14 },
//   { x: 76.8, y: 27.6, level: 15 },
//   { x: 70, y: 27.6, level: 16 },
//   { x: 61.7, y: 27.2, level: 17 },
//   { x: 52.3, y: 30.7, level: 18 },
//   { x: 43, y: 32.8, level: 19 },
//   { x: 38, y: 32, level: 20 },
//   { x: 33, y: 33.4, level: 21 },
//   { x: 28, y: 33.4, level: 22 },
//   { x: 22.7, y: 32, level: 23 },
//   { x: 18, y: 30, level: 24 },
//   { x: 15.3, y: 26, level: 25 },
//   { x: 13, y: 20.5, level: 26 },
//   { x: 9.3, y: 20, level: 27 },
// ];
export const interactivePoints = [
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

export const lammaWidth = 5;
export const lammaHeight = 8.2;

const GameMap = () => {
  const { goToTown, goToRestArea, currentIslandLevel, lamaPosition, setLamaPosition, user, questBookOpen } = useGameStore();

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [stepDistance, setStepDistance] = useState("0.5");
  const [stepTime, setStepTime] = useState("50");

  const [tempLamaPosition, setTempLamaPosition] = useState(lamaPosition);
  // currentIslandLevel is the level that the lamma in the db is on
  // tempCurrentIslandLevel controls the level that the lamma is currently on
  const [tempCurrentIslandLevel, setTempCurrentIslandLevel] = useState(currentIslandLevel);
  const enterNewBattle = useCombatStore((state) => state.enterNewBattle);
  const [enterNewAreaLoading, setEnterNewAreaLoading] = useState(false);
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

      {questBookOpen && <QuestBook />}

      <div className="z-10 absolute top-4 right-4">
        <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => goToTown()} alt={"Return to Town"} />
      </div>
      <div className="z-10 absolute bottom-2 left-2 flex items-end gap-2">
        <PlayerFrame />
      </div>
      <div className="z-10 absolute bottom-4 left-[800px]">
        {tempCurrentIslandLevel != 0 &&
          (tempCurrentIslandLevel % 9 == 0 ? (
            <ImgButton
              disabled={enterNewAreaLoading}
              onClick={async () => {
                setEnterNewAreaLoading(true);
                await goToRestArea();
                setEnterNewAreaLoading(false);
              }}
              className="shrink-0 mb-8"
              alt="Enter Rest Area"
              src={"https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"}
            />
          ) : (
            <ImgButton
              disabled={enterNewAreaLoading || user?.health == 0 || user?.stamina == 0}
              src={"https://arweave.net/bHrruH7w5-XmymuvXL9ZuxITu1aRxw2rtddi2v0FUxE"}
              onClick={async () => {
                setEnterNewAreaLoading(true);
                const resultData = await enterNewBattle(tempCurrentIslandLevel);
                console.log("resultData", resultData);
                if (resultData.status == "Success") {
                  setGameStatePage(GameStatePages.COMBAT);
                }
                setEnterNewAreaLoading(false);
              }}
              className="shrink-0 mb-8"
              alt={"Enter Combat"}
            />
          ))}
      </div>
      {/* <p className="text-sm text-red-500">Finetune the step distance and time to control the Lamma's movement.</p>
      <label>Step Distance (% of map width between 0-1)</label>
      <Input value={stepDistance} onChange={(e) => setStepDistance(e.target.value)} />
      <label>Step Time (in ms)</label>
      <Input value={stepTime} onChange={(e) => setStepTime(e.target.value)} /> */}
      <InteractiveMap tempCurrentIslandLevel={tempCurrentIslandLevel} lamaPosition={tempLamaPosition} onLevelSelect={handleLevelSelect} />
    </div>
  );
};

export default GameMap;
