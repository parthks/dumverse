import { Button } from "@/components/ui/button";
import GameProfile from "@/components/game/GameProfile";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import BankPage from "./Bank";
import Shop from "./Shop";
import GameMap from "./GameMap";
import Combat from "./Combat";
import Town from "./Town";

export default function Game() {
  const { GameStatePage, setGameStatePage, user } = useGameStore();
  let page = <div>Game</div>;
  if (GameStatePage === GameStatePages.BANK) page = <BankPage />;
  if (GameStatePage === GameStatePages.SHOP) page = <Shop />;
  if (GameStatePage === GameStatePages.GAME_MAP) page = <GameMap />;
  if (GameStatePage === GameStatePages.COMBAT) page = <Combat />;
  if (GameStatePage === GameStatePages.TOWN) page = <Town />;

  if (!user) return <div>Loading...</div>;
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
