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

export default function Second_Town() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const goToGameMap = useGameStore((state) => state.goToGameMap);
  const setIsSettingsOpen = useGameStore((state) => state.setIsSettingsOpen);
  const user = useGameStore((state) => state.user);

  const [chatOpen, setChatOpen] = useState(false);

  const handleBuildingSelect = (building: GameStatePages) => {
    if (building !== GameStatePages.NFT_SHOP) {
      setGameStatePage(building);
    } else {
      if (user?.nft_address) setGameStatePage(building);
    }
  };

  useBackgroundMusic(SOUNDS.TOWN_AUDIO);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <img
        src="https://arweave.net/E2jP3dyKEow52WuJTBfF9rg3KPw9eLI6k0qDAc-rMIw"
        alt="Second Town Sky"
        className="w-full h-full absolute top-0 left-0"
      />
      <img
        src="https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ"
        alt="Second Town Sea"
        className="absolute bottom-0 left-0 w-full h-[87vh] object-cover"
      />
      {/* Background image - Second Town */}
      <img
        src="https://arweave.net/R24uVvbN03jo6MQ3iUFcpD_D2H9v67SsaCIGfn63T04"
        alt="Background Placeholder - Second Town "
        className="absolute bottom-0 left-0 w-full h-[95%]"
      />
      {/* <audio src={SOUNDS.TOWN_AUDIO} autoPlay loop /> */}

      <div className="z-10 absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5">
        <PlayerOnlineList currentSpot={0} />
      </div>

      <div className="absolute w-[8%] h-[5%] top-[2vh] left-[1vw] z-10">
        <button
          className="text-white bg-blue-400 cursor-pointer border-2 w-full h-full rounded-lg border-white"
          onClick={() => {
            handleBuildingSelect(GameStatePages.TOWN);
          }}
        >
          Upper City{" "}
        </button>
      </div>

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* bottom buttons bar */}
      {!chatOpen && (
        <div className="z-20 absolute bottom-0 w-full p-4">
          <div className="flex justify-between items-center relative">
            <ImgButton
              src={
                "https://arweave.net/Nuj6OhWo55MGJCPIa8RHFFQZ6wTdvzJg5rBipEjvuPA"
              }
              onClick={() => goToGameMap(true)}
              alt={"Return to Town"}
            />
            <div className="absolute left-[43%] translate-x-[0%]">
              <ImgButton
                src={
                  "https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"
                }
                onClick={() => {
                  handleBuildingSelect(GameStatePages.REST_AREA);
                }}
                alt={"Enter Rest Area"}
              />
            </div>
            <div className="flex gap-4 items-center justify-end">
              <ImgButton
                src={
                  "https://arweave.net/fCgsiCsv1ZNCSljaXAtqIVX71EDOFbU5blXGjjkLj_k"
                }
                onClick={() => {
                  setChatOpen(true);
                }}
                alt={"Chat"}
              />
              <ImgButton
                src={
                  "https://arweave.net/y7nAlT1Q93fiOeBqAbXuRv0Ufl96KbF823O4VNNvJR8"
                }
                onClick={() => setIsSettingsOpen(true)}
                alt={"Open Settings"}
              />
            </div>
          </div>
        </div>
      )}

      {/* Second Town map container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]">
          {/*Second Town map image */}
          <div className="absolute inset-0 ">
            {/* <div
              className="absolute inset-0 z-20"
              style={{
                aspectRatio: 1,
                ...calculatePositionAndSize(66.7, 33, 8.5),
              }}
            >
              <RiveAnimation url="https://arweave.net/7E9e7d3cx7eHObPOnuC2WJac7CqMgohsyjO9gnL4Qfs" />
            </div>  */}

            {/* Back Building Old Town (Currently in Second Town)*/}
            <img
              className="absolute top-[3.5%] left-[1.5%] w-[100%] h-auto z-10"
              src="https://arweave.net/2v9L8uWOQYbCukBKfI62SM5qE5Q3NIWbwCjSIW1v3dQ"
              alt=" Back Building Old Town (Currently in Second Town)"
            />

            {/* Red Building in Second Town */}

            <div
              className="absolute top-[27%] left-[26%] w-[26%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                // handleBuildingSelect(GameStatePages.HALL_OF_FAME);
              }}
            >
              <img
                src="https://arweave.net/1kbFA8Qw4oKI7Fq0GJ5pQObbF54_ZDMgGxdWSp516ds"
                alt=" Red Building in Second Town"
              />
              <div className="invisible group-hover:visible absolute top-[92%] left-[-11%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap"></div>
            </div>

            {/* Den */}
            <div
              className="absolute top-[36.3%] left-[2%] w-[25%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.DEN);
              }}
            >
              <img
                src="https://arweave.net/jq81FvIwWgViBnBLAfA46zCTx_Jr9tf4KoJbOoVlkSs"
                alt="Den"
              />
              <div className="invisible group-hover:visible absolute top-[95%] left-[61%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Den
              </div>
            </div>

            {/* Orange Building in Second Town */}
            <div
              className="absolute top-[29%] left-[59%] w-[19%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                // handleBuildingSelect(GameStatePages.HALL_OF_FAME);
              }}
            >
              <img
                src="https://arweave.net/A_8MQY6kNXTuJo91Dl9kAslVbPZJOkN8sYXWcFuiamY"
                alt="Orange Building in Second Town"
              />
              <div className="invisible group-hover:visible absolute top-[95%] left-[61%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap"></div>
            </div>

            {/* Purple Building in Second Town */}
            <div
              className="absolute top-[42%] left-[81.5%] w-[18%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                // handleBuildingSelect(GameStatePages.HALL_OF_FAME);
              }}
            >
              <img
                src="https://arweave.net/LY-02EszzYJJLf9bi4otXMrIR2WRh3-84x0FWd_3mvQ"
                alt="Purple Building in Second Town"
              />
              <div className="invisible group-hover:visible absolute top-[95%] left-[61%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
