import React, { useState, useEffect } from "react";
import InteractiveMap from "@/components/InteractiveMap";
import LammaWalkingLeft from "@/assets/lamma_inf_walking_left.gif";
import LammaWalkingRight from "@/assets/lamma_inf_walking_right.gif";
import LammaStandRight from "@/assets/lamma_stand_right.png";
import LammaStandLeft from "@/assets/lamma_stand_left.png";
import { Input } from "../components/ui/input";

const GameMap = () => {
  const mapWidth = 1089; // original map width
  const mapHeight = 611; // original map height

  // TODO: Need the coordinates (in percentage of the map width and height) for all the black dots
  const interactivePoints = [
    { x: 79, y: 78, level: "1" },
    { x: 74.2, y: 79.6, level: "2" },
    { x: 69.4, y: 79.6, level: "3" },
    { x: 64.6, y: 77.9, level: "4" },
    { x: 60.6, y: 72.8, level: "5" },
  ];

  const [lammaPosition, setLammaPosition] = useState({
    x: 80,
    y: 70,
    src: LammaStandRight,
  });

  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("1");
  const [stepDistance, setStepDistance] = useState("0.5");
  const [stepTime, setStepTime] = useState("50");

  const lammaWidth = 6;
  const lammaHeight = 8.5;

  useEffect(() => {
    if (path.length > 0 && currentPathIndex < path.length) {
      const interval = setInterval(() => {
        setLammaPosition((prev) => {
          const targetPoint = path[currentPathIndex];
          const lammaBottomCenterX = prev.x + lammaWidth / 2;
          const lammaBottomCenterY = prev.y + lammaHeight;

          const dx = targetPoint.x - lammaBottomCenterX;
          const dy = targetPoint.y - lammaBottomCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 0.5) {
            if (currentPathIndex === path.length - 1) {
              clearInterval(interval);
            } else {
              setCurrentPathIndex(currentPathIndex + 1);
            }
            return {
              x: targetPoint.x - lammaWidth / 2,
              y: targetPoint.y - lammaHeight,
              src: dx >= 0 ? LammaStandRight : LammaStandLeft,
            };
          }

          const step = parseFloat(stepDistance);
          const ratio = Math.min(step / distance, 1);
          const newX = prev.x + dx * ratio;
          const newY = prev.y + dy * ratio;

          return {
            x: newX,
            y: newY,
            src: dx >= 0 ? LammaWalkingRight : LammaWalkingLeft,
          };
        });
      }, parseInt(stepTime));

      return () => clearInterval(interval);
    }
  }, [path, currentPathIndex]);

  const handleLevelSelect = (level: string) => {
    console.log(`Level ${level} selected`);
    const currentIndex = interactivePoints.findIndex((point) => point.level === currentLevel);
    const targetIndex = interactivePoints.findIndex((point) => point.level === level);

    if (currentIndex !== -1 && targetIndex !== -1) {
      let newPath;
      if (currentIndex < targetIndex) {
        // Moving forward
        newPath = interactivePoints.slice(currentIndex, targetIndex + 1);
      } else {
        // Moving backward
        newPath = interactivePoints.slice(targetIndex, currentIndex + 1).reverse();
      }

      setPath(newPath.map((point) => ({ x: point.x, y: point.y })));
      setCurrentPathIndex(0);
      setCurrentLevel(level);
    }
  };

  return (
    <div className="h-screen">
      <p className="text-sm text-red-500">Finetune the step distance and time to control the Lamma's movement.</p>
      <label>Step Distance (% of map width between 0-1)</label>
      <Input value={stepDistance} onChange={(e) => setStepDistance(e.target.value)} />
      <label>Step Time (in ms)</label>
      <Input value={stepTime} onChange={(e) => setStepTime(e.target.value)} />
      <InteractiveMap
        currentLevel={currentLevel}
        lammaPosition={lammaPosition}
        mapWidth={mapWidth}
        mapHeight={mapHeight}
        interactivePoints={interactivePoints}
        onLevelSelect={handleLevelSelect}
      />
    </div>
  );
};

export default GameMap;
