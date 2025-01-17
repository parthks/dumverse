import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";
import GifComponent from "@/components/Dialogue/Dialogue";


export default function Infirmary() {
  const [revived, setRevived] = useState(false);
  const reviveUser = useGameStore((state) => state.reviveUser);

  useEffect(() => {
    let isMounted = true; 
  
    const attemptRevive = async () => {
      if (!revived && isMounted) {
        const isUserRevive = await reviveUser();
        if (isUserRevive) {
          setRevived(true);
        } else {
          if (isMounted) {
            attemptRevive();
          }
        }
      }
    };
  
    attemptRevive();
      return () => {
      isMounted = false;
    };
  }, [revived, reviveUser]);

  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-4 left-4">{revived && <ExistToTownButton />}</div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={"https://arweave.net/stQ9Q3zjvRxj9idFG_iQzRBCFqRw8_xeUTJTcUyw0wU"} alt="Infirmary Background" className="w-full h-full object-cover" />
        </div>

        <div className="absolute w-full h-full flex flex-col items-center justify-end" style={{ ...calculatePositionAndSize(50, 100, 100), transform: "translate(-50%, -100%)" }}>
          {/* Shopkeeper and Table Group */}
          <div className="relative w-full flex flex-col items-center">
            {/* Shopkeeper */}
            <div
              className="relative"
              style={{
                maxWidth: "22vw", // Responsive size, adjust as needed
                width: "100%",
                top: "0px",
                aspectRatio: 1, // Keeps the shopkeeper square
              }}
            >
              <RiveAnimation url={"/purple_loop.riv"} />
              {/* <img src="/shopkeeper_chat.gif" alt="Shopkeeper Chat" className="absolute top-0 right-0 h-auto" style={{ transform: "translate(75%, -40%)" }} /> */}
              <GifComponent className=" absolute h-[20vh] translate-x-[19vw] translate-y-[-44vh]"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
