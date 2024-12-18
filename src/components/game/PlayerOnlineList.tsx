import { IMAGES } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import { GameUser } from "@/types/game";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";

export default function PlayerOnlineList({ currentSpot }: { currentSpot: number }) {
  const getAllPlayersAtLocation = useGameStore((state) => state.getAllPlayersAtLocation);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: playersAtLocation, isLoading } = useQuery({
    queryKey: ["playersAtLocation", currentSpot],
    queryFn: async () => {
      const players = await getAllPlayersAtLocation(currentSpot);
      console.log({ players });
      return players.filter((player) => Date.now() - new Date(player.last_updated_at).getTime() < 15000);
    },
    refetchInterval: 10000,
  });

  console.log({ playersAtLocation });

  const scroll = (direction: "left" | "right") => {
    console.log("scroll", direction, scrollPosition);
    const container = scrollContainerRef.current;
    if (container) {
      console.log("scroll", direction, scrollPosition);
      const scrollAmount = 220; // Adjust this value to control scroll distance
      const newPosition =
        direction === "left" ? Math.max(scrollPosition - scrollAmount, 0) : Math.min(scrollPosition + scrollAmount, container.scrollWidth - container.clientWidth);

      container.scrollTo({ left: newPosition, behavior: "smooth" });
      setScrollPosition(newPosition);
    }
  };

  if (!playersAtLocation) return <></>;

  return (
    <div className="fixed -top-4 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b-lg scale-100 lg:scale-75 lg:-top-4 md:scale-75 md:-top-4 sm:scale-50 sm:-top-6">
      <div className="flex items-center justify-between">
        {/* Left arrow */}
        <img src="https://arweave.net/IGYyjGQMAGEKgiG_jHjTL4mNPKpV5Gp2bimVH3bCtT4" alt="Left Arrow" className="w-8 h-8 cursor-pointer" onClick={() => scroll("left")} />
        <div className="flex-1 overflow-x-hidden mx-4" ref={scrollContainerRef}>
          <div className="flex space-x-6">
            {playersAtLocation.map((player, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={player.nft_address ? `https://arweave.net/${player.nft_address}` : IMAGES.DEFAULT_DUMDUM}
                  alt={player.name}
                  className="w-12 h-12 object-contain rounded-sm mb-1"
                />
                <span className="text-white text-xs">{player.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right arrow */}
        <img src="https://arweave.net/o7ECEKfF1B4f5UWF3TAlnFnU0nA4FbepQeDv3zf8JcI" alt="Right Arrow" className="w-8 h-8 cursor-pointer" onClick={() => scroll("right")} />
      </div>
    </div>
  );
}
