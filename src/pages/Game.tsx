import GameProfile from "@/components/game/GameProfile";
import { useGameStore } from "@/store/useGameStore";

export default function Game() {
  return (
    <div className="m-5">
      <GameProfile />
    </div>
  );
}
