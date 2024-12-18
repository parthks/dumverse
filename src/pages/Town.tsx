import ChatWindow from "@/components/chat/Chat";
import PlayerOnlineList from "@/components/game/PlayerOnlineList";
import ImgButton from "@/components/ui/imgButton";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { SOUNDS } from "@/lib/constants";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useState } from "react";
import { calculatePositionAndSize } from "@/lib/utils";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import { Fit } from "@rive-app/react-canvas";

export default function Town() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const goToGameMap = useGameStore((state) => state.goToGameMap);
  const setIsSettingsOpen = useGameStore((state) => state.setIsSettingsOpen);

  const [chatOpen, setChatOpen] = useState(false);

  const handleBuildingSelect = (building: GameStatePages) => {
    setGameStatePage(building);
  };

  useBackgroundMusic(SOUNDS.TOWN_AUDIO);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Town Sky and 3 Clouds */}
      <div
        className="absolute z-10 top-0 left-0 w-full"
        style={{ maxHeight: "22vh", height: "100%" }}
      >
        <div className="w-full h-full relative">
          <img
            src="https://arweave.net/08G6JU-Bk6qGns_uPELsWdtMLUfmGX6PsGNSjyK0isg"
            alt="Town Sky"
            className="w-full h-full object-cover absolute"
          />
          <img
            src="https://arweave.net/gRhLOEWYoinvbSwYqp-MIx3U9ac8Rd_0bLySUlPg_Vg"
            alt="Town Cloud 1"
            className="absolute"
            style={{
              ...calculatePositionAndSize(30, 50, 15),
            }}
          />
          <img
            src="https://arweave.net/gRhLOEWYoinvbSwYqp-MIx3U9ac8Rd_0bLySUlPg_Vg"
            alt="Town Cloud 2"
            className="absolute"
            style={{
              ...calculatePositionAndSize(90, 50, 12),
            }}
          />
          <img
            src="https://arweave.net/gRhLOEWYoinvbSwYqp-MIx3U9ac8Rd_0bLySUlPg_Vg"
            alt="Town Cloud 3"
            className="absolute"
            style={{
              ...calculatePositionAndSize(70, 30, 12),
            }}
          />
        </div>
      </div>

      {/* Animated Sea in Town */}
      {/* <div
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <RiveAnimation
          url="https://arweave.net/ZS6qAGG5J72dbZCsqnTCnk63R8sfYMpJV0MdcHpFtHs"
          fit={Fit.Cover}
        />
      </div> */}
      <img
        src="https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ"
        alt="Town Sea"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Background image */}
      <img
        src="https://arweave.net/rwkHG-PGdJH25cTH6zXiuxzuO0Tl3i4yacUKkdjXZog"
        alt="Background Placeholder"
        className="absolute top-0 left-0 w-full h-full object-cover mt-[3%]"
      />
      {/* <audio src={SOUNDS.TOWN_AUDIO} autoPlay loop /> */}

      <div className="z-10 absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5">
        <PlayerOnlineList currentSpot={0} />
      </div>

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* Bottom Buttons Bar */}
      {!chatOpen && (
        <div className="z-10 absolute bottom-0 w-full h-auto p-4">
          <div className="flex justify-around items-center w-full">
            
            <ImgButton
              src="https://arweave.net/Nuj6OhWo55MGJCPIa8RHFFQZ6wTdvzJg5rBipEjvuPA"
              onClick={() => goToGameMap(true)}
              alt="Return to Town"
              className="scale-100 lg:scale-100 md:scale-75 sm:scale-75"
            />

            <ImgButton
              src="https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"
              onClick={() => handleBuildingSelect(GameStatePages.REST_AREA)}
              alt="Enter Rest Area"
              className="scale-100 lg:scale-100 md:scale-75 sm:scale-75"
            />

            <ImgButton
              src="https://arweave.net/fCgsiCsv1ZNCSljaXAtqIVX71EDOFbU5blXGjjkLj_k"
              onClick={() => setChatOpen(true)}
              alt="Chat"
              className="scale-100 lg:scale-100 md:scale-75 sm:scale-75"
            />

            <ImgButton
              src="https://arweave.net/y7nAlT1Q93fiOeBqAbXuRv0Ufl96KbF823O4VNNvJR8"
              onClick={() => setIsSettingsOpen(true)}
              alt="Open Settings"
              className="scale-100 lg:scale-100 md:scale-75 sm:scale-50"
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
              backgroundImage: `url(https://arweave.net/gFbTgE71cSq3B0maUbkAEXUiLDBF92Dvm148QL67YtA)`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                aspectRatio: 1,
                ...calculatePositionAndSize(53, 70, 27),
              }}
            >
              <RiveAnimation url="https://arweave.net/7E9e7d3cx7eHObPOnuC2WJac7CqMgohsyjO9gnL4Qfs" />
            </div>

            {/* Armory on the hill */}
            <img
              src="https://arweave.net/jcrjRLjmbifAPy0nas_hHobjDIdKyMaRNmQjSD0UVvA"
              alt="Building 7"
              className="absolute top-[10%] left-[5.5%] w-[18%] h-auto z-10
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
              className="absolute top-[10%] left-[51%] w-[18%] h-auto z-10
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
              className="absolute top-[14%] left-[37%] w-[15%] h-auto z-10
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
              className="absolute top-[13%] left-[65%] w-[18%] h-auto z-10
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
              className="absolute top-[15%] left-[83%] w-[15%] h-auto z-10
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
            {/* <img
              src="https://arweave.net/jcrjRLjmbifAPy0nas_hHobjDIdKyMaRNmQjSD0UVvA"
              alt="Building 9 Den"
              className="absolute top-[36%] left-[43%] w-[18%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.DEN);
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
