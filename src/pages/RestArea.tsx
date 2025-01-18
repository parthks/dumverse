import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import ChatWindow from "@/components/chat/Chat";
import { InventoryBag } from "@/components/game/InventoryBag";
import PlayerOnlineList from "@/components/game/PlayerOnlineList";
import RestAreaBag from "@/components/game/RestAreaBag";
import ImgButton from "@/components/ui/imgButton";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { IMAGES, SOUNDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import React from "react";
import { useState } from "react";
import { calculatePositionAndSize } from "@/lib/utils";
import { Fit } from "@rive-app/react-canvas";
import { DailyGoldWishes } from "@/types/game";

// const RestAreaImages = {
//   0: "https://arweave.net/5nf-hjMD9CNJvVsyaR2N2JMhRgprTNrTXKJXTjXtMUw",
//   9: "https://arweave.net/F6Xd8uMyN78dh2Nrd9gSVCD0sEPY3BsAgd1PWJCyn4Q",
//   18: "https://arweave.net/wSgWaCQYk3DZbdp4Qm2fI-hGptYYaYwmDfm6ParVItQ",
//   27: "https://arweave.net/_ZixwsU3FTzyH0ddVB1pqMZEq-xG3UzqAVO3HoD0LFI",
// };

const RestAreaImages = {
  0: "https://arweave.net/5nf-hjMD9CNJvVsyaR2N2JMhRgprTNrTXKJXTjXtMUw",
  9: "https://arweave.net/Sa1M036SjBzwEnWyqRKfUO-_Iqs0wTtGFEG_yWHSxLs",
  18: "https://arweave.net/-kfQ41nBIJy39NR5iwlt-2aHMpbXTz2VTDcCcml44kY",
  27: "https://arweave.net/G8xvyj-KgEieJIi7C8s-_sv_NO-vvp9hzm0Rg47YGwM",
  36: "https://arweave.net/nlrX-3MaCfgpRP6gPjcsB6FWNtImdlLZUN_s-p-jXHY",
  45: "https://arweave.net/yVowdokmtYGqpchfqxO8y57J2HoGb03OopzRSEE_b6Q",
  54: "https://arweave.net/iPVHC5o2Gowb4P0tWoFPRNGAL-RSldG2Ds6G-FGsuMM",
  63: "https://arweave.net/NHq0gT__811VV8xylR7HsH8cVWitv5VtmqHU6Pz3PAQ",
  72: "https://arweave.net/bQ_aRguO1CZVty_w8chWmMAIUXcrrL7RkQ4NAhgVtns",
  81: "https://arweave.net/tdKq4FQpv0k2G08SsF2WGWKQAt4rfCiFB_83e5bt2-Q",
};

const ReturnToTown = React.memo(() => {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const current_spot = useGameStore((state) => state.user!.current_spot);

  return (
    <>
      {current_spot == 0 ? (
        <ImgButton
          src={"https://arweave.net/HyDiIRRNS5SdV3Q52RUNp-5YwKZjNwDIuOPLSUdvK7A"}
          onClick={() => {
            setGameStatePage(GameStatePages.TOWN);
          }}
          alt={"Return to Town"}
        />
      ) : (
        <ImgButton
          src={"https://arweave.net/-8KpNKO_poKty1r9xF2nyduC8tAFzgi0UPPZSUXFoGA"}
          onClick={() => {
            setGameStatePage(GameStatePages.GAME_MAP);
          }}
          alt={"Return to Map"}
        />
      )}
    </>
  );
});

function RestAreaPlayerStatsDisplay() {
  const user = useGameStore((state) => state.user!);
  const regenerateCountdown = useGameStore((state) => state.regenerateCountdown);

  const totalStamina = user.total_stamina;
  const filledStamina = user.stamina;
  return (
    <div className="relative w-80 h-[80px]">
      <img src="https://arweave.net/4S1TmPOXJcIQV64uf41n_spSqNPFeCBI2jYeXfHKByg" alt="Background" className="absolute inset-0 w-full h-full object-cover rounded-lg" />

      <div className="absolute inset-0 top-[-24px] left-[-12px] flex items-center justify-start">
        <div className="relative">
          <img src={"https://arweave.net/TztZ9vkeLpTvkVWjCEkV8HnJncb6i-6lo66kZN2r5Fg"} alt="Health" className="w-20" />
          <p
            style={{ textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000" }}
            className="absolute inset-0 flex items-center mb-5 justify-center text-white text-xl font-bold"
          >
            {user.health}/{user.total_health}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 top-0 flex flex-col gap-1 items-baseline justify-center pl-[69px]">
        <div className={`flex w-[255px] flex-wrap mt-1`}>
          {Array.from({ length: totalStamina }).map((_, index) => (
            <img className={`${totalStamina > 9 ? "h-6" : "h-10"} mr-1`} key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
          ))}
        </div>
        {/* convert regenerateCountdown to minutes and seconds */}
        <div className="flex gap-2">
          {totalStamina != filledStamina &&
            (regenerateCountdown ? <label className="text-[#66D7F8] text-xl font-bold">{Math.ceil(regenerateCountdown / 60)} min to next regen...</label> : null)}
        </div>
      </div>
    </div>
  );
}

export default function RestArea() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const setIsSettingsOpen = useGameStore((state) => state.setIsSettingsOpen);
  const current_spot = useGameStore((state) => state.user!.current_spot);
  const goldWishes = useGameStore((store)=>store.goldWishes);
  const [openBag, setOpenBag] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [wishStatus, setWishStatus] = useState<DailyGoldWishes | null >(null);
  if (!RestAreaImages[current_spot as keyof typeof RestAreaImages]) {
    return (
      <div>
        <p>Not a valid spot to rest</p>
        <div className="z-10 absolute top-4 right-4">
          <ReturnToTown />
        </div>
      </div>
    );
  }

  useBackgroundMusic(current_spot === 0 ? SOUNDS.TOWN_REST_AREA_AUDIO : SOUNDS.REST_AREA_AUDIO);

  async function making_wish() {
    const status: DailyGoldWishes | null= await goldWishes();
    setWishStatus(status);
}

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      {/* {current_spot === 0 ? <audio src={SOUNDS.TOWN_REST_AREA_AUDIO} autoPlay loop /> : <audio src={SOUNDS.REST_AREA_AUDIO} autoPlay loop />} */}

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      <div className="z-30 absolute top-0 left-1/2 transform -translate-x-[50%] w-[50%]">
        <PlayerOnlineList currentSpot={current_spot} />
      </div>

      {current_spot == 0 && (
        <div className="z-40 absolute bottom-[1%] right-[50%] transform translate-x-[35%]">
          {" "}
          <ImgButton
            // disabled={buyItemLoading || (alreadyOwned && ["WEAPON", "ARMOR"].includes(item.type))}
            src="https://arweave.net/uf3sDozFcxr__lRElB3rNQycrQ2JjWextSQedeor74M"
            alt={"Make Gold Wish"}
            onClick={making_wish}
          />{" "}
        </div>
      )}

      {wishStatus && (
        <div className="fixed inset-0 flex items-center justify-center text-white z-30">
          <div
            // bg-black bg-opacity-70
            className="relative shadow-lg rounded-lg p-4 "
            style={{
              backgroundImage:
                "url('https://arweave.net/VuvTMQrwAs5Pai_xzwuzl_1gnz3bCFyJ6a0OXJEW_ow')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              borderRadius: "30px",
              width: "50vw",
              height: "80vh",
              overflow: "hidden",
            }}
          >
            {/* Close button */}
            {/* <button
        className="absolute top-4 right-4 text-4xl font-bold hover:text-gray-300"
        onClick={() => setWishStatus(null)}
      >
        &times;
      </button> */}
            <ImgButton
              className="absolute top-4 right-4 "
              src="https://arweave.net/d-XLB6fqEQsopfIvBAY_eeU5fu9dLhbWh2cipzJqqFM"
              alt="Close Chat"
              onClick={() => {
                setWishStatus(null);
              }}
            />

            <h1 className="text-4xl text-center underline mb-6">
              I Wish... I Wish...
            </h1>

            <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-thin scrollbar-thumb-[#B8860B]/80 scrollbar-track-black rounded-lg">
              {wishStatus.logs
                .slice()
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((val, index) => (
                  <h1 key={index} className="text-4xl text-center mb-10 ">
                    {val.message}
                  </h1>
                ))}
            </div>
          </div>
        </div>
      )}

      {!chatOpen && (
        <div className="z-30 absolute top-4 right-4">
          <ReturnToTown />
        </div>
      )}

      {!chatOpen && (
        <div className="z-30 absolute top-4 left-4">
          <RestAreaPlayerStatsDisplay />
        </div>
      )}

      {!chatOpen && (
        <>
          <div className="z-30 absolute bottom-4 left-4 flex flex-col gap-2 items-center">
            <InventoryBag />
            <ImgButton
              className="h-[65px]"
              src={
                "https://arweave.net/zBW0KWBAJLJWY0a3e6uY4Oq5iL1HVUhkOzWvRcC2LWY"
              }
              onClick={() => setOpenBag(!openBag)}
              alt={"Open Bag"}
            />
          </div>

          <div className="z-30 absolute bottom-4 right-4 flex gap-4 items-center justify-end">
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
        </>
      )}

      {openBag && (
        <div className="absolute z-30 top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <RestAreaBag onClose={() => setOpenBag(false)} />
        </div>
      )}

      <div className="relative w-full h-full">
        <div className={`absolute inset-0`}>
          {current_spot == 0 ? (
            <TownRestArea />
          ) : (
            <img
              src={RestAreaImages[current_spot as keyof typeof RestAreaImages]}
              alt="Rest Area Background"
              className="w-full h-full object-cover"
            />
          )}

          {current_spot != 0 && (
            <div className={`absolute inset-x-0 bottom-0 flex justify-center `}>
              {/* ${cn(current_spot === 18 && "translateX(13vw) translateY(4vh)")} */}
              <div
                style={{
                  width: current_spot === 27 ? "15vw" : "18vw",
                  height:
                    current_spot === 45 ||
                    current_spot === 54 ||
                    current_spot === 72
                      ? "45vh"
                      : "60vh",
                  transform: `
                ${cn(current_spot === 9 && "translateX(3vw)")}
                ${cn(current_spot === 18 && "translateX(13vw)")}
                ${cn(
                  current_spot === 27 && "translateX(25vw) translateY(-12vh)"
                )}
                ${cn(
                  current_spot === 36 && "translateX(32vw) translateY(-21vh)"
                )}
                ${cn(
                  current_spot === 45 && "translateX(-13vw) translateY(-1vh)"
                )}
                ${cn(
                  current_spot === 54 && "translateX(-11vw) translateY(-2vh)"
                )}
                ${cn(
                  current_spot === 63 && "translateX(-24vw) translateY(-12vh)"
                )}
                ${cn(
                  current_spot === 72 && "translateX(23vw) translateY(-1vh)"
                )}
                ${cn(
                  current_spot === 81 && "translateX(23vw) translateY(-1vh)"
                )}
                `,
                }}
              >
                <RiveAnimation
                  url={
                    "https://arweave.net/rrX4T8R7gZJuh3onSlujy7aeZO8y4ew8Hz_ML_9cE2k"
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TownRestArea() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute z-10 top-0 left-0 w-full"
        style={{ maxHeight: "26.5vh", height: "100%" }}
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
      {/* <div
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <RiveAnimation
          url="https://arweave.net/IE-dEphdGW5ipTcyvKbrO7aa5Ub1xVhx_dTi_9t9KOg"
          fit={Fit.Cover}
        />
      </div> */}
       <img
        src="https://arweave.net/V3z2O7IKsS8zBqaHFCkl0xdFssQtI-B9cS-bGybudiQ"
        alt="Town Sea"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <img
        src="https://arweave.net/FdV6gZmdcWf8k-6RIW1PWNjf7IqA4uQNftjaQeSiNnc"
        alt="Background Placeholder"
        className="absolute top-0 left-0 w-full h-full object-cover "
      />

      <img
        src="https://arweave.net/DE_Zc9BgwWB3aH9mltKROQIZWvVQGPtrZJvtmkqyu2s"
        alt="Dirt Road"
        className="absolute object-cover min-w-[250%] top-[12%] left-[-93%]"
        style={{}}
      />

      <img
        src="https://arweave.net/_g5O3cjj56K7xtCmO9WDYYovTrl88zZyALEjqSjJAVg"
        alt="Weapon Shop"
        className="absolute object-cover h-auto z-10"
        style={{
          ...calculatePositionAndSize(17, 12, 30),
        }}
      />
      <img
        src="https://arweave.net/0Re9EaNZ33_nlERxv6lrG7YLL9MAUnG9pEdehatEa0w"
        alt="Dumz Hall of Fame"
        className="absolute object-cover h-auto z-10"
        style={{
          ...calculatePositionAndSize(59, 1, 35),
        }}
      />
      <img
        src="https://arweave.net/J-iCcqONbJzGGvULWzi8-lujVTNMSuyCYkDnAQMme-k"
        alt="Bank"
        className="absolute object-cover h-auto z-10"
        style={{
          ...calculatePositionAndSize(88, 18, 30),
        }}
      />
      <img
        src="https://arweave.net/o95nmyTOa5irftkjrfb6DDwivxIHJaNHof7AKvUa7Hc"
        alt="Bakery"
        className="absolute object-cover h-auto z-10"
        style={{
          ...calculatePositionAndSize(108, 30, 30),
        }}
      />

      <div
        className="absolute inset-0 z-20"
        style={{
          aspectRatio: 1,
          ...calculatePositionAndSize(42, 68, 52),
        }}
      >
        <RiveAnimation url="https://arweave.net/7vwsUfbEdh3CXwbD763IpDjmlkE1rZkSRI-VOgXmtV0" />
      </div>
    </div>
  );
}