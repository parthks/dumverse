import InteractiveMap from "@/components/InteractiveMap";

const GameMap = () => {
  const mapWidth = 1082; // original map width
  const mapHeight = 1053; // original map height

  const interactivePoints = [
    { x: 35.3, y: 32.8, level: "1" },
    { x: 100, y: 30, level: "2" },
    // Add more points as needed
  ];

  const handleLevelSelect = (level: string) => {
    console.log(`Level ${level} selected`);
    // Add your level selection logic here
  };

  return (
    <div className="h-screen">
      <InteractiveMap mapWidth={mapWidth} mapHeight={mapHeight} interactivePoints={interactivePoints} onLevelSelect={handleLevelSelect} />
    </div>
  );
};

export default GameMap;
