import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect, useRef, useState } from "react";
import Combat from "./Combat";
import GameMap from "./GameMap";
import RestArea from "./RestArea";
import Town from "./Town";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bank from "./Buildings/Bank";
import Shop from "./Buildings/Shop";
import Bakery from "./Buildings/Bakery";
import Armory from "./Buildings/Armory";
import Weapon from "./Buildings/Weapon";
import NFTShop from "./Buildings/NFTShop";
import Infirmary from "./Buildings/Infirmary";
import VisitorCenter from "./Buildings/VisitorCenter";
import HallOfFame from "./Buildings/HallOfFame";
import Den from "./Buildings/Den";
import Second_Town from "./Second_Town";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import { Fit } from "@rive-app/canvas";
import Settings from "@/components/game/Settings";
import { REST_SPOTS } from "@/lib/constants";
import PetShop from "./Buildings/PetShop";

const queryClient = new QueryClient();

export default function Game() {
  const { GameStatePage, setGameStatePage, isSettingsOpen, setIsSettingsOpen, user, regenerateEnergy,regenerateCountdown,resetRegenerateCountdown, setRegenerateCountdown, regenerateCountdownTickDown, petsOwned } = useGameStore();

  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("@/lib/worker", import.meta.url), { type: 'module' });
    }

    const worker = workerRef.current;

    // Handle messages from the worker
    worker.onmessage = (event) => {
      const { countdown: newCountdown, complete } = event.data;

      if (newCountdown !== undefined || newCountdown == null) {
        // console.log("Ashu : newCountdown: "+newCountdown);
        // console.log("Ashu : regenerateCountdown: "+regenerateCountdown);

        // Instead of directly updating, call regenerateCountdownTickDown
        regenerateCountdownTickDown();
      }

      // if (complete) {
      //   console.log("Countdown complete. Regenerating energy...");
      //   regenerateEnergy();
      //   resetRegenerateCountdown(); // Reset the countdown
      // }
    };

    // Start the worker if conditions are met
    if (user?.id && user?.stamina < user?.total_stamina) {
      // console.log("Ashu : Dammmm WORKERSSSS");
      const hasEquippedDiligentDuck = petsOwned?.some(pet => 
        pet.pet_id === "DILIGENT_DUCK" && pet.equipped === 1
      );
      
      const baseCountdown = (user?.current_spot !== undefined && REST_SPOTS.includes(user?.current_spot)) ? 120 : 240;
      const initialCountdown = regenerateCountdown != null ? 
        regenerateCountdown : 
        (hasEquippedDiligentDuck ? Math.floor(baseCountdown * 0.85) : baseCountdown);
            worker.postMessage({
        type: "start",
        data: {
          interval: 1000, // 1 second interval
          initialCountdown,
        },
      });
    }

    return () => {
      worker.postMessage({ type: "stop" });
      worker.terminate();
      workerRef.current = null;
    };
  }, [user?.current_spot, user?.stamina, user?.total_stamina, GameStatePage, regenerateCountdown]);

  let page = <div>Game</div>;
  if (GameStatePage === GameStatePages.BANK) page = <Bank />;
  if (GameStatePage === GameStatePages.SHOP) page = <Shop />;
  if (GameStatePage === GameStatePages.GAME_MAP) page = <GameMap />;
  if (GameStatePage === GameStatePages.COMBAT) page = <Combat />;
  if (GameStatePage === GameStatePages.TOWN) page = <Town />;
  if (GameStatePage === GameStatePages.REST_AREA) page = <RestArea />;
  if (GameStatePage === GameStatePages.BAKERY) page = <Bakery />;
  if (GameStatePage === GameStatePages.ARMORY) page = <Armory />;
  if (GameStatePage === GameStatePages.WEAPON_SHOP) page = <Weapon />;
  if (GameStatePage === GameStatePages.NFT_SHOP) page = <NFTShop />;
  if (GameStatePage === GameStatePages.INFIRMARY) page = <Infirmary />;
  if (GameStatePage === GameStatePages.VISITOR_CENTER) page = <VisitorCenter />;
  if (GameStatePage === GameStatePages.HALL_OF_FAME) page = <HallOfFame />;
  if (GameStatePage === GameStatePages.SECOND_TOWN) page = <Second_Town />;
  if (GameStatePage === GameStatePages.DEN) page = <Den />;
  if (GameStatePage === GameStatePages.PET_SHOP) page = <PetShop />;

  if (!user)
    return (
      <div className="h-screen w-screen bg-cover bg-center">
        <RiveAnimation fit={Fit.Cover} url={"https://arweave.net/aV1siQE3OyrMZGJTjQoqslFAXn-kU6HZ5lAmoK5sewI"} />
        {/* Loading... */}
      </div>
    );
  // return <Combat />;
  // return <Infirmary />;
  return (
    <div className="game-cursor">
      {/* <GameProfile /> */}
      {/* <div className="mt-5 flex gap-5">
        <Button onClick={() => setGameStatePage(GameStatePages.HOME)}>Go Home</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.BANK)}>Go to Bank</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.SHOP)}>Go to Shop</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.GAME_MAP)}>Go to Game Map</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.COMBAT)}>Go to Combat</Button>
      </div> */}
      <QueryClientProvider client={queryClient}>
        {isSettingsOpen && <Settings setIsSettingsOpen={setIsSettingsOpen} />}
        {page}
        {/* <Combat /> */}
        {/* <RestArea /> */}
      </QueryClientProvider>
    </div>
  );
}
