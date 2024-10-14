import ChatWindow from "@/components/chat/Chat";
import ImgButton from "@/components/ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { useGameStore, GameStatePages } from "@/store/useGameStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Town() {
  const getAllPlayersAtLocation = useGameStore((state) => state.getAllPlayersAtLocation);
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const goToGameMap = useGameStore((state) => state.goToGameMap);

  const [chatOpen, setChatOpen] = useState(false);

  const handleBuildingSelect = (building: GameStatePages) => {
    setGameStatePage(building);
  };

  const { data: playersAtLocation } = useQuery({
    queryKey: ["playersAtLocation", 0],
    queryFn: () => getAllPlayersAtLocation(0),
  });
  console.log({ playersAtLocation });

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background image */}
      <img src="https://arweave.net/kr9vAhgWOI_OfA7LBGNuQxW1zAg9Eq_3vZaSebHN5HQ" alt="Background Placeholder" className="absolute top-0 left-0 w-full h-full object-cover" />
      <audio src={SOUNDS.TOWN_AUDIO} autoPlay loop />

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* bottom buttons bar */}
      {!chatOpen && (
        <div className="z-10 absolute bottom-0 w-full p-4">
          <div className="flex justify-between items-center relative">
            <ImgButton src={"https://arweave.net/Nuj6OhWo55MGJCPIa8RHFFQZ6wTdvzJg5rBipEjvuPA"} onClick={() => goToGameMap(true)} alt={"Return to Town"} />
            <div className="absolute left-[43%] translate-x-[0%]">
              <ImgButton
                src={"https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"}
                onClick={() => {
                  handleBuildingSelect(GameStatePages.REST_AREA);
                }}
                alt={"Enter Rest Area"}
              />
            </div>
            <ImgButton
              src={"https://arweave.net/fCgsiCsv1ZNCSljaXAtqIVX71EDOFbU5blXGjjkLj_k"}
              onClick={() => {
                setChatOpen(true);
              }}
              alt={"Chat"}
            />
          </div>
        </div>
      )}

      {/* Town map container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]">
          {/* Town map image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(https://arweave.net/JuWhXSF9_XkPJplzF5sX4ppKX2pGkbvrdQR6Skbz1JE)`,
            }}
          >
            {/* Armory on the hill */}
            <img
              src="https://arweave.net/PYIX9T90RmDl9QHm7ccxlG5LVlcodwDOyTbVR8dEsEs"
              alt="Building 7"
              className="absolute top-[10%] left-[5.5%] w-[18%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.ARMORY);
              }}
            />
            {/* Hall of Fame center building */}
            <img
              src="https://arweave.net/mYFkdK6YrZdl4x6gi8BP2ZtfK1BArRCrw9_yDG3YhqE"
              alt="Building center"
              className="absolute top-[10%] left-[51%] w-[18%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.HALL_OF_FAME);
              }}
            />
            {/* Weapon Shop red building */}
            <img
              src="https://arweave.net/SfNO5z6YsT6GEtyZw-y9vEpA082ziHsmROkUew73JuM"
              alt="Building 8 red"
              className="absolute top-[14%] left-[37%] w-[15%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.WEAPON_SHOP);
              }}
            />
            {/* Building Bank */}
            <img
              src="https://arweave.net/x6Q-Gw9rs8R6aDpG9UdwxxzrJf-Rymorpg3msQQUQMw"
              alt="Building Bank"
              className="absolute top-[13%] left-[65%] w-[18%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.BANK);
              }}
            />
            {/* Bakery yellow building */}
            <img
              src="https://arweave.net/uY3tPwvtedJbYBr6IZSobePo3DN9gVAa9FS5Hr27GU8"
              alt="Building yellow"
              className="absolute top-[15%] left-[83%] w-[15%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.BAKERY);
              }}
            />
            {/* General Shop blue building */}
            <img
              src="https://arweave.net/dxDOLjfxH798ZpMtlGvX8jYu7vvL4OvR0UeR217InVM"
              alt="Building Shop"
              className="absolute top-[50%] left-[0%] w-[24%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.SHOP);
              }}
            />
            {/* NFT Shop brown building */}
            <img
              src="https://arweave.net/uuBM_S43jQAVv3ARTu4jB2RBTEYIZzw8tJxxxB42ozE"
              alt="Building 8 red"
              className="absolute top-[31%] left-[20%] w-[20%] h-auto
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.NFT_SHOP);
              }}
            />
            {/* Visitor Center right bottom building */}
            <img
              src="https://arweave.net/1gclG49yFLU9R3cW-E590MPKfXmxEqR4E1zhE3-xIso"
              alt="Building 8 red"
              className="absolute top-[51%] left-[77%] w-[23%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.VISITOR_CENTER);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
