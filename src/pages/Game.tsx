import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect } from "react";
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

const queryClient = new QueryClient();

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

    // TODO: check this logic if timer resets when in town or rest area
    // const inTownOrRestArea = user?.current_spot && REST_SPOTS.includes(user?.current_spot);

    if (user?.id && user?.stamina < user?.total_stamina) {
      // console.log("Regenerating energy interval started");
      interval = setInterval(async () => {
        // console.log("Regenerating energy");
        regenerateCountdownTickDown();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?.stamina, user?.total_stamina, GameStatePage, user?.current_spot]);

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
  if (GameStatePage === GameStatePages.DEN) page = <Den/>;

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
      <QueryClientProvider client={queryClient}>{page}</QueryClientProvider>
    </div>
  );
}
