import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCombatStore } from "@/store/useCombatStore";

export default function Combat() {
  const { loading, currentBattle, getOpenBattles, setCurrentBattle, enterNewBattle, userAttack, userRun } = useCombatStore();

  const BattleScreen = () => {
    if (!currentBattle) return <div>No battle found</div>;
    return (
      <div>
        <p className="text-2xl font-bold">Battle</p>
        {loading ? <p>Loading...</p> : ""}
        <div className="flex gap-2">
          <Button onClick={() => setCurrentBattle(currentBattle.id)}>Refresh</Button>
          <Button onClick={() => userAttack(currentBattle.npcs_alive[0])}>Attack NPC</Button>
          <Button onClick={() => userRun()}>Run</Button>
        </div>
        <p>Ended: {currentBattle.ended ? "Yes" : "No"}</p>
        <p>Winner: {currentBattle.winner ? currentBattle.winner : "No winner yet"}</p>
        <p>Created at: {new Date(currentBattle.created_at).toLocaleTimeString()}</p>
        <p>Players alive: {currentBattle.players_alive.join(", ")}</p>
        <p>NPCs alive: {currentBattle.npcs_alive.join(", ")}</p>
        <br />
        <div className="flex gap-32">
          <div className="flex flex-col gap-2">
            {Object.values(currentBattle.players).map((player) => (
              <div key={player.id}>
                <h2>Player Name: {player.name}</h2>
                <p>Health: {player.health}</p>
                <p>Armor: {player.defense}</p>
                <p>Damage: {player.damage}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {Object.values(currentBattle.npcs).map((npc) => (
              <div key={npc.id}>
                <h2>NPC Name: {npc.name}</h2>
                <p>Health: {npc.health}</p>
                <p>Damage: {npc.damage}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xl font-bold">Logs</p>
        <div className="flex flex-col gap-2">
          {currentBattle.log.map((log) => (
            <p key={log.timestamp + log.message}>
              {new Date(log.timestamp).toLocaleTimeString()} - {log.message}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <h1>Combat</h1>
      </div>
      <p className="text-red-500">Current Battle ID: {currentBattle?.id ? currentBattle.id : "No battle found"}</p>
      {!currentBattle?.id && <p className="text-red-500">Enter a new battle and then click get open battles</p>}
      <p>{loading ? "Loading..." : ""}</p>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => getOpenBattles()}>Get Open Battles</Button>
        <Button onClick={() => enterNewBattle(1)}>Enter new battle (level 1)</Button>
      </div>
      <div className="flex gap-2">
        <label>Enter battle ID</label>
        <Input className="w-64" type="number" placeholder="Enter battle ID" onChange={(e) => setCurrentBattle(Number(e.target.value))} />
      </div>
      {currentBattle && <BattleScreen />}
    </div>
  );
}
