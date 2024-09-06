import { useGameStore } from "@/store/useGameStore";
import NumberTicker from "../magicui/number-ticker";

export default function GameProfile() {
  const { user } = useGameStore();
  if (!user) return null;
  return (
    <div>
      <h1 className="text-2xl font-bold">GameProfile</h1>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>NFT: {user.nft_address}</p>
      <p>Damage: {user.damage}</p>
      <p>Defense: {user.defense}</p>
      <p>Health: {user.health}</p>
      <p>Stamina: {user.stamina_balance}</p>

      <p>
        Gold: <NumberTicker value={user.gold_balance} />
      </p>
      <p>
        Dumz: <NumberTicker value={user.dumz_balance} />
      </p>
      <p>Inventory:</p>
      <div className="flex flex-col gap-2">
        {user.inventory.map((item) => {
          return (
            <div key={item.id}>
              {item.item_id} {item.equipped ? "equipped" : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}
