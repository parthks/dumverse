import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect } from "react";
import BankPage from "./Bank";
import Combat from "./Combat";
import GameMap from "./GameMap";
import Shop from "./Shop";
import RestArea from "./RestArea";
import Town from "./Town";

export default function Game() {
  const { GameStatePage, setGameStatePage, user, setRegenerateCountdown, regenerateCountdownTickDown } = useGameStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (GameStatePage === GameStatePages.COMBAT) {
      if (interval) {
        clearInterval(interval);
        setRegenerateCountdown(null);
      }
      return;
    }

    if (user?.id && user?.stamina < user?.total_stamina) {
      console.log("Regenerating energy interval started");
      interval = setInterval(async () => {
        console.log("Regenerating energy");
        regenerateCountdownTickDown();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?.stamina, user?.total_stamina, GameStatePage]);

  let page = <div>Game</div>;
  if (GameStatePage === GameStatePages.BANK) page = <BankPage />;
  if (GameStatePage === GameStatePages.SHOP) page = <Shop />;
  if (GameStatePage === GameStatePages.GAME_MAP) page = <GameMap />;
  if (GameStatePage === GameStatePages.COMBAT) page = <Combat />;
  if (GameStatePage === GameStatePages.TOWN) page = <Town />;
  if (GameStatePage === GameStatePages.REST_AREA) page = <RestArea />;
  if (!user)
    return (
      <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: "url('https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ')" }}>
        {/* Loading... */}
      </div>
    );
  // return <Combat />;
  // return <RestArea />;
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
      {page}
    </div>
  );
}
