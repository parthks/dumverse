import { Button } from "@/components/ui/button";
import GameProfile from "@/components/game/GameProfile";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import Bank from "./Bank";
import Shop from "./Shop";

export default function Game() {
  const { GameStatePage, setGameStatePage, user } = useGameStore();
  let page = <div>Game</div>;
  if (GameStatePage === GameStatePages.BANK) page = <Bank />;
  if (GameStatePage === GameStatePages.SHOP) page = <Shop />;

  if (!user) return <div>Loading...</div>;
  return (
    <div className="m-5">
      <GameProfile />
      <div className="mt-5 flex gap-5">
        <Button onClick={() => setGameStatePage(GameStatePages.HOME)}>Go Home</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.BANK)}>Go to Bank</Button>
        <Button onClick={() => setGameStatePage(GameStatePages.SHOP)}>Go to Shop</Button>
      </div>
      {page}
    </div>
  );
}
