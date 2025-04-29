import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import { PlayerFrame } from "@/components/game/PlayerFrame";
import QuestBook from "@/components/game/QuestBook";
import InteractiveMap from "@/components/InteractiveMap";
import ImgButton from "@/components/ui/imgButton";
import NewButton from "@/components/ui/NewButton";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { interactivePointsMap2, interactivePointsMap3, lammaHeight, lammaWidth, REST_SPOTS, SOUNDS } from "@/lib/constants";
import { getInteractivePoints, getInitialEntityPosition } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { EntityPosition } from "@/types/game";
import { Fit } from "@rive-app/react-canvas";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BOSS_SPOTS } from "@/lib/constants";
import CombatAreaBag from "@/components/game/CombatAreaBag";
import { MyMessageResult } from "@/lib/wallet";


const GameMap = () => {
  const { goToTown, goToRestArea, acceptedTheMouseGame, tempCurrentIslandLevel, setTempCurrentIslandLevel, entityPosition, setEntityPosition, setIsSettingsOpen, user, questBookOpen, isPopupOpen, setIsPopupOpen } =
    useGameStore();

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [stepDistance, setStepDistance] = useState("0.5");
  const [stepTime, setStepTime] = useState("50");
  // const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);

  const [tempEntityPosition, setTempEntityPosition] = useState(entityPosition);
  // currentIslandLevel is the level that the lamma in the db is on
  // tempCurrentIslandLevel controls the level that the lamma is currently on
  // const [tempCurrentIslandLevel, setTempCurrentIslandLevel] = useState(currentIslandLevel);
  const enterNewBattle = useCombatStore((state) => state.enterNewBattle);
  const enterNewMouseBattle = useCombatStore((state) => state.enterNewMouseBattle);
  const setEnteringNewBattle = useCombatStore((state) => state.setEnteringNewBattle);
  const enteringNewBattle = useCombatStore((state) => state.enteringNewBattle);
  const [enterNewAreaLoading, setEnterNewAreaLoading] = useState(false);
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const inventoryBagOpen = useGameStore((state) => state.inventoryBagOpen); 
  const setInventoryBagOpen = useGameStore((state) => state.setInventoryBagOpen); 

  useEffect(() => {
    if (path.length > 0 && currentPathIndex < path.length) {
      const interval = setInterval(() => {
        setTempEntityPosition((prev) => {
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
            setEntityPosition({
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
    let interactivePoints = getInteractivePoints(tempCurrentIslandLevel, acceptedTheMouseGame);
    // Flatten the interactivePoints to handle nested arrays
    const flattenedPoints = interactivePoints.flatMap(point => 
      Array.isArray(point) ? point : [point]
    );
  
    // Filter out points with null level for path calculation
    const pointsWithLevel = flattenedPoints.filter(p => p.level !== null);
  
    const currentIndex = fromStart || tempCurrentIslandLevel == 0 
      ? 0 
      : pointsWithLevel.findIndex((point) => point.level === tempCurrentIslandLevel);
  
    const targetIndex = pointsWithLevel.findIndex((point) => point.level === level);
  
    let newPathPoints;
    if (currentIndex < targetIndex) {
      newPathPoints = pointsWithLevel.slice(currentIndex, targetIndex + 1);
    } else {
      newPathPoints = pointsWithLevel.slice(targetIndex, currentIndex + 1).reverse();
    }
  
    // Now include the null level points between these points for turn taking
    const newPath = [];
    for (let i = 0; i < newPathPoints.length; i++) {
      const point = newPathPoints[i];
      newPath.push({ x: point.x, y: point.y });
  
      // Check if next point exists
      if (i < newPathPoints.length - 1) {
        // Find null level points between current and next point in flattenedPoints
        const startLevel = point.level;
        const endLevel = newPathPoints[i + 1].level;
  
        // Find indices in flattenedPoints
        const startIndex = flattenedPoints.findIndex(p => p.level === startLevel);
        const endIndex = flattenedPoints.findIndex(p => p.level === endLevel);
  
        // Get points between startIndex and endIndex
        const betweenPoints = flattenedPoints.slice(
          Math.min(startIndex, endIndex) + 1, 
          Math.max(startIndex, endIndex)
        );
  
        // Add null level points in between for turns
        betweenPoints.forEach(p => {
          if (p.level === null) {
            newPath.push({ x: p.x, y: p.y });
          }
        });
      }
    }
  
    setPath(newPath);
    setCurrentPathIndex(0);
    setTempCurrentIslandLevel(level);
  };
  

  useBackgroundMusic(SOUNDS.ISLAND_AUDIO);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center overflow-hidden relative"
      // style={{
      //   backgroundImage: "url('https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ')",
      // }}
    >

      {questBookOpen && <QuestBook />}
      {inventoryBagOpen && <CombatAreaBag/>}

      <div className="z-10 absolute top-4 left-[72%] w-[30%]">
        <NewButton className='px-9 py-4 text-3xl z-50'
        //  src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"}
        src={"Return to Town"} 
          onClick={() => goToTown()}
           alt={"Return to Town Button Gamemap"} />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <ImgButton src={"https://arweave.net/y7nAlT1Q93fiOeBqAbXuRv0Ufl96KbF823O4VNNvJR8"} onClick={() => setIsSettingsOpen(true)} alt={"Open Settings"} />
      </div>
      { !acceptedTheMouseGame && (<div className="z-10 absolute bottom-2 left-2 flex items-end gap-2">
        <PlayerFrame />
      </div>)
      }
      
      <div className="z-10 absolute bottom-4 w-[450px] left-[700px]">
        {/* {tempCurrentIslandLevel % 9 == 0 && tempCurrentIslandLevel != 0 && !BOSS_SPOTS.includes(tempCurrentIslandLevel) ? ( */}
        {REST_SPOTS.includes(tempCurrentIslandLevel) && tempCurrentIslandLevel != 0 && !BOSS_SPOTS.includes(tempCurrentIslandLevel) ? (
          <NewButton
            disabled={enterNewAreaLoading}
            varient={"purple"}
            onClick={async () => {
              setEnterNewAreaLoading(true);
              await goToRestArea();
              setEnterNewAreaLoading(false);
            }}
            className="py-4 bottom-1 px-28 text-3xl"
            src="Rest"
            alt="Rest button Gamemap"
            // src={"https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"}
          />
        ) : (
          tempCurrentIslandLevel !== 0 &&
  (
    acceptedTheMouseGame
      ? tempCurrentIslandLevel !== user?.current_mouse_spot
      : tempCurrentIslandLevel !== user?.current_spot
  ) && (
    <NewButton
      disabled={enterNewAreaLoading || user?.health === 0 || user?.stamina === 0}
      src="Enter Combat"
      onClick={async () => {
        setEnterNewAreaLoading(true);
        let resultData: MyMessageResult;
        if (acceptedTheMouseGame) {
          resultData = await enterNewMouseBattle(tempCurrentIslandLevel);
        } else {
          resultData = await enterNewBattle(tempCurrentIslandLevel);
        }
        if (typeof resultData.data.subprocess === "string") {
          setGameStatePage(GameStatePages.COMBAT);
        }
        setEnterNewAreaLoading(false);
      }}
      className="py-4 bottom-1 px-10 text-3xl"
      alt="Enter Combat"
    />
  )
        )}
      </div>
      <div className="z-10 absolute bottom-1 right-24 w-[40%] flex gap-2">
    
      </div>

      {/* <RiveAnimation fit={Fit.Cover} url={"https://arweave.net/aV1siQE3OyrMZGJTjQoqslFAXn-kU6HZ5lAmoK5sewI"} /> */}
      <img src="https://arweave.net/VKCnO9EgY6YGdpBgem8NxAMsdOwqxYizqw-BhymoRg8" alt="Sea" className="object-cover w-full h-full" />
      <InteractiveMap tempCurrentIslandLevel={tempCurrentIslandLevel} entityPosition={tempEntityPosition} onLevelSelect={handleLevelSelect} />
    </div>
  );
};

export default GameMap;
