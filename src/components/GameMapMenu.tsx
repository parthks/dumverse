import ImgButton from "./ui/imgButton";
import NewButton from "./ui/NewButton";
import { useGameStore } from "@/store/useGameStore";
import { LamaPosition } from "@/types/game";
import { getInitialLamaPosition } from "@/lib/utils";
import { interactivePointsMap1, interactivePointsMap2, interactivePointsMap3, lammaHeight, lammaWidth } from "@/lib/constants";

export default function SetSailPopup({
  onClose,
//   setLamaPosition,
//   setTempCurrentIslandLevel,
}: {
  onClose: () => void;
//   setLamaPosition: (position: LamaPosition) => void;
//   setTempCurrentIslandLevel: (level: number) => void;
}) {

    const { goToTown, goToRestArea, goToGameMap, tempCurrentIslandLevel, setTempCurrentIslandLevel, currentIslandLevel, lamaPosition, setLamaPosition, setIsSettingsOpen, user, questBookOpen, isPopupOpen, setIsPopupOpen } =
    useGameStore();  
//   const user = useGameStore((state) => state.user);
  const armors = user?.inventory.filter((item) => item.item_type === "ARMOR");
  const ironArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_2");
  const goldArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_3");
  // check if user has ARMOR_4 or ARMOR_5
  const higherTierArmor = !!armors?.find((armor) => armor.item_id === "ARMOR_4" || armor.item_id === "MAGIC_ROBE");

  return (
    <div className="fixed inset-0 flex items-center justify-center text-white z-50">
      <div className=" w-[30vw] h-[60vh] rounded-lg p-4 relative shadow-lg bg-black bg-opacity-50">
        {/* <button className="absolute top-2 right-2 text-6xl font-bold" onClick={onClose}>
          &times;
        </button> */}

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

         <NewButton 
          onClick={async () => {
              // await travelToLocation(55);
              setTempCurrentIslandLevel(0);
              setLamaPosition(getInitialLamaPosition());
              goToGameMap();
              onClose();
            }}
            
            alt="Happy Green Valley"
            className="bg-blue-400 w-[58%] mr-[12%] h-[75px] text-3xl" />

          {/* <ImgButton
            disabled={!goldArmor && !higherTierArmor}
            src={"https://arweave.net/XqAcm0_8ewqniCRg_8F-hqmD-PjbOwaNh95kTuSsUts"}
            onClick={async () => {
              // await travelToLocation(55);
              setTempCurrentIslandLevel(0);
              setLamaPosition(getInitialLamaPosition());

              onClose();
            }}
            alt={"Happy Green Valley"}
            className="w-[60%]"
          /> */}
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
              goToGameMap();

              onClose();
            }}
            alt={"Dumzz Forest"}
            className="w-[60%] mt-24"
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
             
              goToGameMap();

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

