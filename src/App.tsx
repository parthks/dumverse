import Login from "@/pages/Login";
import Game from "@/pages/Game";
import { useGameStore } from "@/store/useGameStore";

export default function App() {
  const { GameStatePage } = useGameStore();
  // Render pages based on GAME_STATE

  if (GameStatePage === null) {
    return <Login />;
  }
  return <Game />;
}
