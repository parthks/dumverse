import { Button } from "@/components/ui/button";
import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useEffect } from "react";

export default function Shop() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();

  useEffect(() => {
    getShop();
  }, []);

  if (!shop) return <div>Loading...</div>;

  const items = shop.items ?? [];
  const weapons = items.filter((item) => item.type === "WEAPON");
  const armor = items.filter((item) => item.type === "ARMOR");

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.target instanceof SVGElement && event.target.classList.contains("item")) {
      const itemType = event.target.getAttribute("item-type");
      if (itemType) {
        console.log(itemType);
        // buyItem(itemType);
      }
    }
  };

  const imageWidth = 3840;
  const imageHeight = 2160;
  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 right-4">
        <ImgButton src={"https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"} onClick={() => setGameStatePage(GameStatePages.TOWN)} alt={"Return to Town"} />
      </div>
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          {/* <img src={MapImage} alt="Game Map" className="w-full h-full object-contain" /> */}
          <img src={"https://arweave.net/LOjcKJ0Kllg9Ai_oQkj6R-RLZd3n5oXbECqooKt09uE"} alt="Town Map" className="w-full h-full object-contain" />
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${imageWidth} ${imageHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-0"
            onClick={handleClick}
          ></svg>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <h1>Shop</h1>
      <h2 className="text-2xl font-bold">Weapons</h2>
      <div className="flex flex-wrap gap-4">
        {weapons.map((item) => (
          <div key={item.id}>
            <p>ID: {item.id}</p>
            <h2>Name: {item.name}</h2>
            <p>Type: {item.type}</p>
            <p>Gold Price: {item.gold_price}</p>
            <p>Dumz Price: {item.dumz_price}</p>
            <p>Damage: {item.damage}</p>
            <div className="flex gap-2">
              <Button onClick={() => buyItem(item, "GOLD")} disabled={buyItemLoading}>
                {buyItemLoading ? "Loading..." : "Buy with Gold"}
              </Button>
              <Button onClick={() => buyItem(item, "DUMZ")} disabled={buyItemLoading}>
                {buyItemLoading ? "Loading..." : "Buy with Dumz"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <br />
      <h2 className="text-2xl font-bold">Armor</h2>
      <div className="flex flex-wrap gap-4">
        {armor.map((item) => (
          <div key={item.id}>
            <h2>Name: {item.name}</h2>
            <p>Type: {item.type}</p>
            <p>Gold Price: {item.gold_price}</p>
            <p>Dumz Price: {item.dumz_price}</p>
            <p>Defense: {item.defense}</p>
            <div className="flex gap-2">
              <Button onClick={() => buyItem(item, "GOLD")} disabled={buyItemLoading}>
                {buyItemLoading ? "Loading..." : "Buy with Gold"}
              </Button>
              <Button onClick={() => buyItem(item, "DUMZ")} disabled={buyItemLoading}>
                {buyItemLoading ? "Loading..." : "Buy with Dumz"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
