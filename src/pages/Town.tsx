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
import NewButton from "@/components/ui/NewButton";

export default function Town() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const goToGameMap = useGameStore((state) => state.goToGameMap);
  const setIsPopupOpen = useGameStore((state) => state.setIsPopupOpen);
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
    <div
      className="relative h-screen w-screen overflow-hidden inset-0 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(https://arweave.net/JV5-FpdcyzSE7GzczVmNavlnoh2dJapAIXPHPajxFY4)`,
      }}
    >
      <div
        className="absolute top-[60.8%] left-[86%] w-[23%] h-auto z-50
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.VISITOR_CENTER);
        }}
      >
        <img
          src="https://arweave.net/eXLQqI0-T3hdxS3sRtVlEO9MlO_vpmzFP0i3M8LhKPU"
          alt="Building 3 - Visitor Center"
        />
        <div className="invisible group-hover:visible absolute top-[43%] left-[-63%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          Visitor Center
        </div>
      </div>

      <div
        className="absolute top-[36%] left-[80.3%] w-[23%] h-auto z-40
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.BAKERY);
        }}
      >
        <img
          src="https://arweave.net/Jzct99MVnb3a9pkD3XeeGWtZ9WMtZT-_tRVmrjoEpPw"
          alt="Building 4 - Bakery"
        />
        <div className="invisible group-hover:visible absolute top-[63%] left-[-20%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          Bakery{" "}
        </div>
      </div>

      <div
        className="absolute top-[53%] left-[35%] w-[50%] h-auto z-30
                         "
      >
        <img
          src="https://arweave.net/uJYhuvHlTTo-UQyGsnieHgzf_DsxgiAoYD7QvBhKID0"
          alt="Upstairs"
        />
      </div>

      <div
        className="absolute top-[17%] left-[74.5%] w-[23%] h-auto z-20
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.BANK);
        }}
      >
        <img
          src="https://arweave.net/HtitNBYdIa5ywzu3g-t23fTlmEOe2-PkW_LKUqyIkWM"
          alt="Building 7 - Bank"
        />
        <div className="invisible group-hover:visible absolute top-[50%] left-[19%] text-4xl z-[1000] text-white px-2 py-1 rounded whitespace-nowrap">
          Bank{" "}
        </div>
      </div>

      <div
        className="absolute top-[10%] left-[52.5%] w-auto h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.HALL_OF_FAME);
        }}
      >
        <img
          src="https://arweave.net/zgFAbWHYyV0VO1DH04RUK12LxjuTScKZMHdtf1Ym9sY"
          alt="Building 8 - Dumz Hall of Fame"
        />
        <div className="invisible group-hover:visible absolute top-[40%] left-[12%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          Dumz Hall of Fame{" "}
        </div>
      </div>

      <div
        className="absolute top-[20.5%] left-[42.5%] w-auto h-auto z-20
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.WEAPON_SHOP);
        }}
      >
        <img
          src="https://arweave.net/2k1cPfb8NQGdTGKq39YR3HJnLWD8CYphKCjzDcatVsM"
          alt="Building 6 - Weapon Shop"
        />
        <div className="invisible group-hover:visible absolute top-[10%] left-[10%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          Weapon Shop{" "}
        </div>
      </div>

      <div
        className="absolute top-[25%] left-[30.5%] h-auto w-auto z-20 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.ARMORY);
        }}
      >
        <img
          src="https://arweave.net/gQLHGng3_wZSLtrXYJwW4PeCttHMOeSXlhLdEqYcCTM"
          alt="Building 5 - Armor Shop"
          className="w-auto"
        />
        <div className="invisible group-hover:visible absolute top-[13%] left-[15%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          Armor Shop{" "}
        </div>
      </div>

      <div
        className="absolute top-[33.5%] left-[17%] w-auto h-auto z-40
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.NFT_SHOP);
        }}
      >
        <img
          src="https://arweave.net/VlhBtkkHr0tG_fpmVB_DA00WG_4XASYvF3lhr7ILkLA"
          alt="Building 2 - NFT Shop"
        />
        <div className="invisible group-hover:visible absolute top-[97%] left-[57%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          NFT Shop{" "}
        </div>
      </div>

      <div
        className="absolute top-[42%] left-[2%] w-auto h-auto z-50
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
        onClick={() => {
          handleBuildingSelect(GameStatePages.SHOP);
        }}
      >
        <img
          src="https://arweave.net/B01HnXy0fpizs0-xs-94ghhbMlWo52sLL0hBg4JOUHM"
          alt="Building 1 - General Shop"
        />
        <div className="invisible group-hover:visible absolute top-[95%] left-[60%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
          General Shop{" "}
        </div>
      </div>

      <div className="absolute top-0 left-0 z-50 h-screen overflow-hidden">
        <img
          src="https://arweave.net/qHBs7hlEuGw3RFQcbdiB--rkrZhg2PoNe6oL4aID92Y"
          alt="side left"
          className="object-contain h-full w-auto"
        />
      </div>

      {/* <div
  className="absolute top-[70%] left-[48%] z-50 h-[25%] overflow-hidden"
>
  <img
    src="https://arweave.net/VXN3u5QkjXysPjGt_3ViTeOYpmq_HMB2f9cc6ESi3xU"
    alt="Fountain"
    className="object-contain h-full w-auto"
  />
</div> */}

      {/* <div className="relative">
  <img
    src="https://arweave.net/dX6bh-ptkYUXlDwJQpDliAIDiRRzCLnRZBDc2bgHWZM"
    alt="side left"
    className="object-contain h-screen z-[50] absolute"
    useMap="#map"
  />
  <map name="map">
    <area
      shape="rect"
      coords="110,110,150,250"
      alt="Clickable Area"
      href="https://www.youtube.com/"
    />
  </map>
</div> */}

      {/*            

      {/* Town Sky and 3 Clouds */}
      {/* <div
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
      </div> */}

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
      {/* <img
        src="https://arweave.net/OFkoongWDrs7jYtmSBKhHmG3S2QwQYJ7IbMsJFrTRgU"
        alt="Background"
        className="absolute top-0 left-0 w-full h-full"
      /> */}

      {/* Background image */}
      {/* <img
        src="https://arweave.net/rwkHG-PGdJH25cTH6zXiuxzuO0Tl3i4yacUKkdjXZog"
        alt="Background Placeholder"
        className="absolute top-0 left-0 w-full h-full object-cover mt-[3%]"
      /> */}
      {/* <audio src={SOUNDS.TOWN_AUDIO} autoPlay loop /> */}

      <div className="z-50 absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5">
        <PlayerOnlineList currentSpot={0} />
      </div>

      {/* {(user?.address == "yWEDs-sho-5Ka7ql_Ov71GNFdHqLspekxfhAo1bcqtU" ||
        user?.address == "9T6eBRHUSaoS4Dxi0iVdyaSroL6EaxGGKlgxBvMr6go" ||
        user?.address == "OGNCZwB71ZEP5ftJBKi2w1ueGaVh3KzBuzxvW6KqeDw" ||
        user?.address == "jddq2gt8n-F2KNO2I67qjDAR1dSeL6ZwYtd3GrmmpTg") && ( */}
      <div className="absolute w-[8%] h-[5%] top-[2vh] -right-[1.3vw] z-50">
        {/* <ImgButton
                        src="https://arweave.net/nYTjNe4X9GAQjhFIHgMZmkS2pvco7JTAUHb338TOsfo"
                        alt="Leaderboard"
                        // disabled={currentPage === 0}
                        // className="absolute bottom-[20%] left-[12%]"
                        onClick={() => console.log("afa")} 
                      /> */}

        <NewButton
          className="cursor-pointer text-xl w-full h-full"
          onClick={() => {
            handleBuildingSelect(GameStatePages.SECOND_TOWN);
          }}
          alt="East Side"
        />
      </div>

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      {/* bottom buttons bar */}
      {!chatOpen && (
        <div className="z-50 absolute bottom-1 w-full px-2 py-5">
          <div>
            <div className="relative w-[320px] bottom-2">
              <NewButton
                varient="blue"
                className="px-11 py-4 text-3xl left-1"
                src={
                  "https://arweave.net/Nuj6OhWo55MGJCPIa8RHFFQZ6wTdvzJg5rBipEjvuPA"
                }
                onClick={() => {
                  goToGameMap(true);
                  setIsPopupOpen(true);
                }}
                alt={"Leave Town"}
              />
            </div>
            <div className="absolute left-[60%] top-3 translate-x-[0%]">
              <NewButton
                varient="purple"
                className="px-24 py-4 text-3xl mr-3"
                src={
                  "https://arweave.net/kMD899AjEGS7EbSo9q4RLl2F0D9OH8eLm1Z_ERbVj4g"
                }
                onClick={() => {
                  handleBuildingSelect(GameStatePages.REST_AREA);
                }}
                alt={"Rest"}
              />
            </div>
            <div className="flex left-1/2 items-center justify-end">
              <NewButton
                varient="blue"
                className="px-24 py-4 text-3xl mr-3"
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

      {/* Town map container */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]"> */}
      {/* Town map image */}
      {/* <div
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
            </div> */}

      {/* Armory on the hill */}
      {/* <img
              src="https://arweave.net/jcrjRLjmbifAPy0nas_hHobjDIdKyMaRNmQjSD0UVvA"
              alt="Building 7"
              className="absolute top-[10%] left-[5.5%] w-[18%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105"
              onClick={() => {
                handleBuildingSelect(GameStatePages.ARMORY);
              }}
            /> */}

      {/* <div
              className="absolute top-[10%] left-[5.5%] w-[18%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.ARMORY);
              }}
            >
              <img
                src="https://arweave.net/jcrjRLjmbifAPy0nas_hHobjDIdKyMaRNmQjSD0UVvA"
                alt="Building 7 - Armor Shop"
              />
              <div className="invisible group-hover:visible absolute top-[90%] left-[16%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Armor Shop
              </div>
            </div> */}

      {/* Hall of Fame center building */}

      {/* <div
              className="absolute top-[10%] left-[51%] w-[18%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.HALL_OF_FAME);
              }}
            >
              <img
                src="https://arweave.net/mYFkdK6YrZdl4x6gi8BP2ZtfK1BArRCrw9_yDG3YhqE"
                alt="Building center - Hall of Fame"
              />
              <div className="invisible group-hover:visible absolute top-[92%] left-[-11%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Dumz Hall of Fame
              </div>
            </div> */}
      {/* Weapon Shop red building */}
      {/* <div
              className="absolute top-[14%] left-[37%] w-[15%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.WEAPON_SHOP);
              }}
            >
              <img
                src="https://arweave.net/SfNO5z6YsT6GEtyZw-y9vEpA082ziHsmROkUew73JuM"
                alt="Building 8 red - Weapon Shop"
              />
              <div className="invisible group-hover:visible absolute top-[75%] left-[9%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Weapon Shop
              </div>
            </div> */}

      {/* Building Bank */}

      {/* <div
              className="absolute top-[13%] left-[65%] w-[18%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.BANK);
              }}
            >
              <img
                src="https://arweave.net/x6Q-Gw9rs8R6aDpG9UdwxxzrJf-Rymorpg3msQQUQMw"
                alt="Building Bank"
              />
              <div className="invisible group-hover:visible absolute top-[75%] left-[40%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Bank
              </div>
            </div> */}

      {/* Bakery yellow building */}

      {/* <div
              className="absolute top-[15%] left-[83%] w-[15%] h-auto z-10
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.BAKERY);
              }}
            >
              <img
                src="https://arweave.net/uY3tPwvtedJbYBr6IZSobePo3DN9gVAa9FS5Hr27GU8"
                alt="Building yellow - Bakery"
              />
              <div className="invisible group-hover:visible absolute top-[85%] left-[5%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Bakery
              </div>
            </div> */}
      {/* General Shop blue building */}

      {/* <div
              className="absolute top-[50%] left-[0%] w-[24%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.SHOP);
              }}
            >
              <img
                src="https://arweave.net/dxDOLjfxH798ZpMtlGvX8jYu7vvL4OvR0UeR217InVM"
                alt="Building Shop - General Shop "
              />
              <div className="invisible group-hover:visible absolute top-[88%] left-[52%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                General Store
              </div>
            </div> */}
      {/* NFT Shop brown building */}

      {/* <div
              className="absolute top-[31%] left-[20%] w-[20%] h-auto
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.NFT_SHOP);
              }}
            >
              <img
                src="https://arweave.net/uuBM_S43jQAVv3ARTu4jB2RBTEYIZzw8tJxxxB42ozE"
                alt="Building 8 red - NFT Shop"
              />
              <div className="invisible group-hover:visible absolute top-[78%] left-[20%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                NFT Holder Shop
              </div>
            </div> */}
      {/* Visitor Center right bottom building */}

      {/* <div
              className="absolute top-[51%] left-[77%] w-[23%] h-auto 
                         cursor-pointer transition-all duration-300 ease-in-out
                         hover:brightness-125 hover:scale-105 group"
              onClick={() => {
                handleBuildingSelect(GameStatePages.VISITOR_CENTER);
              }}
            >
              <img
                src="https://arweave.net/1gclG49yFLU9R3cW-E590MPKfXmxEqR4E1zhE3-xIso"
                alt="Building 8 red - Visitor Center"
              />
              <div className="invisible group-hover:visible absolute top-[88%] left-[10%] text-4xl z-20 text-white px-2 py-1 rounded whitespace-nowrap">
                Visitor Center
              </div>
            </div> */}
      {/*            
          </div> */}
      {/* </div>
      </div> */}
    </div>
  );
}
