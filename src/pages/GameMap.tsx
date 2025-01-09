import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import { PlayerFrame } from "@/components/game/PlayerFrame";
import QuestBook from "@/components/game/QuestBook";
import InteractiveMap from "@/components/InteractiveMap";
import ImgButton from "@/components/ui/imgButton";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { interactivePointsMap2, interactivePointsMap3, lammaHeight, lammaWidth, SOUNDS } from "@/lib/constants";
import { getInteractivePoints } from "@/lib/utils";
import { useCombatStore } from "@/store/useCombatStore";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import { Fit } from "@rive-app/react-canvas";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// TODO: Need the coordinates (in percentage of the map width and height) for all the black dots
// export const get = [
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
// export const get = [
//   { x: 82.2, y: 72.8, level: 1 },
//   { x: 78.6, y: 77.5, level: 2 },
//   { x: 72.8, y: 79.6, level: 3 },
//   { x: 66.8, y: 79, level: 4 },
//   { x: 60.6, y: 72.8, level: 5 },
//   { x: 53.3, y: 72.8, level: 6 },
//   { x: 50.5, y: 66, level: 7 },
//   { x: 47.6, y: 53.8, level: 8 },
//   { x: 45.5, y: 46.3, level: 9 },
//   { x: 55.5, y: 33.8, level: 10 },
//   { x: 60, y: 31.6, level: 11 },
//   { x: 71.5, y: 34.1, level: 12 },
//   { x: 78.8, y: 34, level: 13 },
//   { x: 85.3, y: 30.9, level: 14 },
//   { x: 76.8, y: 27.6, level: 15 },
//   { x: 70, y: 27.6, level: 16 },
//   { x: 61.7, y: 27.2, level: 17 },
//   { x: 52.3, y: 30.7, level: 18 },
//   { x: 47, y: 33.4, level: 19 },
//   { x: 42.5, y: 33, level: 20 },
//   { x: 37, y: 32.5, level: 21 },
//   { x: 32, y: 33.4, level: 22 },
//   { x: 27, y: 32, level: 23 },
//   { x: 22, y: 30.8, level: 24 },
//   { x: 17.8, y: 30, level: 25 },
//   { x: 14.8, y: 25.4, level: 26 },
//   { x: 10.5, y: 24.5, level: 27 },
// ];

const GameMap = () => {
  const { goToTown, goToRestArea, tempCurrentIslandLevel, setTempCurrentIslandLevel, currentIslandLevel, lamaPosition, setLamaPosition, setIsSettingsOpen, user, questBookOpen } =
    useGameStore();

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [stepDistance, setStepDistance] = useState("0.5");
  const [stepTime, setStepTime] = useState("50");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const [tempLamaPosition, setTempLamaPosition] = useState(lamaPosition);
  // currentIslandLevel is the level that the lamma in the db is on
  // tempCurrentIslandLevel controls the level that the lamma is currently on
  // const [tempCurrentIslandLevel, setTempCurrentIslandLevel] = useState(currentIslandLevel);
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
    const interactivePoints = getInteractivePoints(currentIslandLevel);

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

  useBackgroundMusic(SOUNDS.ISLAND_AUDIO);

  return (
    <div
      className="h-screen w-screen bg-cover bg-center overflow-hidden relative"
      // style={{
      //   backgroundImage: "url('https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ')",
      // }}
    >
      {/* <audio autoPlay loop>
        <source src={SOUNDS.ISLAND_AUDIO} type="audio/mpeg" />
      </audio> */}

      {questBookOpen && <QuestBook />}

      <div className="z-10 absolute top-4 right-4">
        <ImgButton src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"} onClick={() => goToTown()} alt={"Return to Town"} />
      </div>
      <div className="z-10 absolute bottom-4 right-4">
        <ImgButton src={"https://arweave.net/y7nAlT1Q93fiOeBqAbXuRv0Ufl96KbF823O4VNNvJR8"} onClick={() => setIsSettingsOpen(true)} alt={"Open Settings"} />
      </div>
      <div className="z-10 absolute bottom-2 left-2 flex items-end gap-2">
        <PlayerFrame />
      </div>
      <div className="z-10 absolute bottom-4 left-[800px]">
        {tempCurrentIslandLevel % 9 == 0 && tempCurrentIslandLevel != 0 ? (
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
          tempCurrentIslandLevel != 0 && tempCurrentIslandLevel!=user?.current_spot && (
            <ImgButton
              disabled={enterNewAreaLoading || user?.health == 0 || user?.stamina == 0}
              src={"https://arweave.net/bHrruH7w5-XmymuvXL9ZuxITu1aRxw2rtddi2v0FUxE"}
              onClick={async () => {
                setEnterNewAreaLoading(true);
                const resultData = await enterNewBattle(tempCurrentIslandLevel);
                // resultData.status == "Success"             
                if (typeof(resultData.data.subprocess) === "string") {
                  setGameStatePage(GameStatePages.COMBAT);
                }
                setEnterNewAreaLoading(false);
              }}
              className="shrink-0 mb-8"
              alt={"Enter Combat"}
            />
          )
        )}
      </div>
      <div className="z-10 absolute bottom-2 right-36 flex gap-2">
        {/* <button
          className="bg-white text-black px-2 py-1 rounded-md"
          onClick={async () => {
            // await travelToLocation(0);
            setTempCurrentIslandLevel(0);
            setTempLamaPosition({
              x: interactivePointsMap1[0].x - lammaWidth / 2,
              y: interactivePointsMap1[0].y - lammaHeight,
              src: "STAND_LEFT",
            });
          }}
        >
          Map 1
        </button>
        <button
          className="bg-white text-black px-2 py-1 rounded-md"
          onClick={async () => {
            // await travelToLocation(28);
            setTempCurrentIslandLevel(28);
            setTempLamaPosition({
              x: interactivePointsMap2[0].x - lammaWidth / 2,
              y: interactivePointsMap2[0].y - lammaHeight,
              src: "STAND_LEFT",
            });
          }}
        >
          Map 2
        </button>
        <button
          className="bg-white text-black px-2 py-1 rounded-md"
          onClick={async () => {
            // await travelToLocation(55);
            setTempCurrentIslandLevel(55);
            setTempLamaPosition({
              x: interactivePointsMap3[0].x - lammaWidth / 2,
              y: interactivePointsMap3[0].y - lammaHeight,
              src: "STAND_LEFT",
            });
          }}
        >
          Map 3
        </button> */}
        {tempCurrentIslandLevel <= 27 ? (
          <ImgButton src={"https://arweave.net/hAiYIcs-VWI5KFTHUCnpQ5XQYQbW4LXzLPY0AoKSX8U"} onClick={() => setIsPopupOpen(true)} alt={"Set Sail"} />
        ) : (
          <></>
        )}
        {isPopupOpen && (
          <SetSailPopup
            onClose={() => setIsPopupOpen(false)}
            setTempLamaPosition={setTempLamaPosition}
            setLamaPosition={setLamaPosition}
            setTempCurrentIslandLevel={setTempCurrentIslandLevel}
          />
        )}
      </div>
      {/* {tempCurrentIslandLevel <= 27 ? (
        <div
          className="z-10 absolute"
          style={{
            width: "3%",
            bottom: "5.5%",
            right: "11%",
          }}
        >
          <img
            src="https://arweave.net/dB07kjfdIJFICANzB7nkt2W8W2FoO4TbFnAVTHeepzw"
            alt="Boat and Dock"
            className="w-full"
          />
        </div>
      ) : (
        <></>
      )} */}

      {/* <p className="text-sm text-red-500">Finetune the step distance and time to control the Lamma's movement.</p>
      <label>Step Distance (% of map width between 0-1)</label>
      <Input value={stepDistance} onChange={(e) => setStepDistance(e.target.value)} />
      <label>Step Time (in ms)</label>
      <Input value={stepTime} onChange={(e) => setStepTime(e.target.value)} /> */}

      {/* <RiveAnimation fit={Fit.Cover} url={"https://arweave.net/aV1siQE3OyrMZGJTjQoqslFAXn-kU6HZ5lAmoK5sewI"} /> */}
      <img src="https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ"/>
      <InteractiveMap tempCurrentIslandLevel={tempCurrentIslandLevel} lamaPosition={tempLamaPosition} onLevelSelect={handleLevelSelect} />
    </div>
  );
};

export default GameMap;

function SetSailPopup({
  onClose,
  setTempLamaPosition,
  setLamaPosition,
  setTempCurrentIslandLevel,
}: {
  onClose: () => void;
  setTempLamaPosition: (position: { x: number; y: number; src: "STAND_LEFT" | "STAND_RIGHT" | "WALKING_LEFT" | "WALKING_RIGHT" }) => void;
  setLamaPosition: (position: LamaPosition) => void;
  setTempCurrentIslandLevel: (level: number) => void;
}) {
  const user = useGameStore((state) => state.user);
  const armors = user?.inventory.filter((item) => item.item_type === "ARMOR");
  const ironArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_2");
  const goldArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_3");
  // check if user has ARMOR_4 or ARMOR_5
  const higherTierArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_4" || armor.item_id === "MAGIC_ROBE");

  return (
    <div className="fixed inset-0 flex items-center justify-center text-white z-50">
      <div className=" w-[30vw] h-[60vh] rounded-lg p-4 relative shadow-lg bg-black bg-opacity-50">
        <button className="absolute top-2 right-2 text-6xl font-bold" onClick={onClose}>
          &times;
        </button>

        <div className="w-full text-center">
          <h2 className="text-4xl font-semibold mb-4 underline underline-white underline-offset-2">Departing to ...</h2>
        </div>

        <div className="w-full flex flex-col gap-6 items-center py-6">
          {/* <button
          className="bg-white text-black px-2 py-1 rounded-md"
          onClick={async () => {
            // await travelToLocation(0);
            setTempCurrentIslandLevel(0);
            setTempLamaPosition({
              x: interactivePointsMap1[0].x - lammaWidth / 2,
              y: interactivePointsMap1[0].y - lammaHeight,
              src: "STAND_LEFT",
            });
          }}
        >
           
        Boat Map Dont know the name and Bad with names
        </button> */}

          <ImgButton
            disabled={!goldArmor && !ironArmor && !higherTierArmor}
            src={"https://arweave.net/DpUx9k4qH02hzTLDwisN9UhrNPsvxx5tKMwqrJ5Lgms"}
            onClick={async () => {
              // await travelToLocation(28);
              setTempCurrentIslandLevel(28);
              setLamaPosition({
                x: interactivePointsMap2[0].x - lammaWidth / 2,
                y: interactivePointsMap2[0].y - lammaHeight,
                src: "STAND_LEFT",
              });
              setTempLamaPosition({
                x: interactivePointsMap2[0].x - lammaWidth / 2,
                y: interactivePointsMap2[0].y - lammaHeight,
                src: "STAND_LEFT",
              });

              onClose();
            }}
            alt={"Dumzz Forest"}
            className="w-[60%]"
          />

          <ImgButton
            disabled={!goldArmor && !higherTierArmor}
            src={"https://arweave.net/XqAcm0_8ewqniCRg_8F-hqmD-PjbOwaNh95kTuSsUts"}
            onClick={async () => {
              // await travelToLocation(55);
              setTempCurrentIslandLevel(55);
              setLamaPosition({
                x: interactivePointsMap3[0].x - lammaWidth / 2,
                y: interactivePointsMap3[0].y - lammaHeight,
                src: "STAND_LEFT",
              });
              setTempLamaPosition({
                x: interactivePointsMap3[0].x - lammaWidth / 2,
                y: interactivePointsMap3[0].y - lammaHeight,
                src: "STAND_LEFT",
              });

              onClose();
            }}
            alt={"Tip Top Mountain"}
            className="w-[60%]"
          />
        </div>
      </div>
    </div>
  );
}
