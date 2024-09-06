import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";
import { useEffect } from "react";

export default function Shop() {
  const { shop, getShop, buyItem, buyItemLoading } = useGameStore();

  useEffect(() => {
    getShop();
  }, []);

  if (!shop) return <div>Loading...</div>;

  const items = shop.items ?? [];
  const weapons = items.filter((item) => item.type === "WEAPON");
  const armor = items.filter((item) => item.type === "ARMOR");

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
