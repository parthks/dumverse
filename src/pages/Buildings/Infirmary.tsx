import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";

export default function Infirmary() {
  const [revived, setRevived] = useState(false);
  const reviveUser = useGameStore((state) => state.reviveUser);

  useEffect(() => {
    const revive = async () => {
      await reviveUser();
      setRevived(true);
    };
    revive();
  }, [reviveUser]);

  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-4 left-4">{revived && <ExistToTownButton />}</div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/Dpj9_8qSRnJQG77U_YLd0aTYJeI8xYydxRRvLES641A"} alt="Infirmary Background" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
