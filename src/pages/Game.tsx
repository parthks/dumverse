import { Button } from "@/components/ui/button";
import GameProfile from "@/components/game/GameProfile";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import BankPage from "./Bank";
import Shop from "./Shop";
import GameMap from "./GameMap";
import Combat from "./Combat";
import Town from "./Town";
import { useEffect } from "react";
import { useCombatStore } from "@/store/useCombatStore";

export default function Game() {
  const { GameStatePage, setGameStatePage, user } = useGameStore();
  const { getOpenBattles } = useCombatStore();

  useEffect(() => {
    //   Check for open battles once
    console.log("Checking for open battles once");
    getOpenBattles();
  }, []);

  let page = <div>Game</div>;
  if (GameStatePage === GameStatePages.BANK) page = <BankPage />;
  if (GameStatePage === GameStatePages.SHOP) page = <Shop />;
  if (GameStatePage === GameStatePages.GAME_MAP) page = <GameMap />;
  if (GameStatePage === GameStatePages.COMBAT) page = <Combat />;
  if (GameStatePage === GameStatePages.TOWN) page = <Town />;

  if (!user)
    return (
      <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: "url('https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ')" }}>
        {/* Loading... */}
      </div>
    );
  // return <Combat />;
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
