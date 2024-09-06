import { useGameStore } from "@/store/useGameStore";

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
      <p>Gold: {user.gold_balance}</p>
      <p>Dumz: {user.dumz_balance}</p>
      <p>Inventory: {user.inventory.map((item) => item.item_id).join(", ")}</p>
    </div>
  );
}
