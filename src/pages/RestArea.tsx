import ChatWindow from "@/components/chat/Chat";
import { InventoryBag } from "@/components/game/InventoryBag";
import PlayerOnlineList from "@/components/game/PlayerOnlineList";
import RestAreaBag from "@/components/game/RestAreaBag";
import ImgButton from "@/components/ui/imgButton";
import { IMAGES, SOUNDS } from "@/lib/constants";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import React from "react";
import { useState } from "react";

const RestAreaImages = {
  0: "https://arweave.net/5nf-hjMD9CNJvVsyaR2N2JMhRgprTNrTXKJXTjXtMUw",
  9: "https://arweave.net/F6Xd8uMyN78dh2Nrd9gSVCD0sEPY3BsAgd1PWJCyn4Q",
  18: "https://arweave.net/wSgWaCQYk3DZbdp4Qm2fI-hGptYYaYwmDfm6ParVItQ",
  27: "https://arweave.net/_ZixwsU3FTzyH0ddVB1pqMZEq-xG3UzqAVO3HoD0LFI",
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
          <p className="absolute inset-0 flex items-center mb-5 justify-center text-white text-xl font-bold">
            {user.health}/{user.total_health}
          </p>
        </div>
      </div>

      <div className="absolute inset-0 top-0 flex flex-col items-center justify-center pl-14">
        <div className="flex gap-1">
          {Array.from({ length: totalStamina }).map((_, index) => (
            <img className="h-10" key={index} src={index < filledStamina ? IMAGES.FILLED_STAMINA : IMAGES.EMPTY_STAMINA} alt="Stamina" />
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
  const current_spot = useGameStore((state) => state.user!.current_spot);
  const [openBag, setOpenBag] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      {current_spot === 0 ? <audio src={SOUNDS.TOWN_REST_AREA_AUDIO} autoPlay loop /> : <audio src={SOUNDS.REST_AREA_AUDIO} autoPlay loop />}

      <ChatWindow chatOpen={chatOpen} setChatOpen={setChatOpen} />

      <div className="z-10 absolute top-0 left-1/2 transform -translate-x-[50%] w-[50%]">
        <PlayerOnlineList currentSpot={current_spot} />
      </div>

      {!chatOpen && (
        <div className="z-10 absolute top-4 right-4">
          <ReturnToTown />
        </div>
      )}

      {!chatOpen && (
        <div className="z-10 absolute top-4 left-4">
          <RestAreaPlayerStatsDisplay />
        </div>
      )}

      {!chatOpen && (
        <>
          <div className="z-10 absolute bottom-4 left-4 flex flex-col gap-2 items-center">
            <InventoryBag />
            <ImgButton className="h-[65px]" src={"https://arweave.net/zBW0KWBAJLJWY0a3e6uY4Oq5iL1HVUhkOzWvRcC2LWY"} onClick={() => setOpenBag(!openBag)} alt={"Open Bag"} />
          </div>

          <div className="z-10 absolute bottom-4 right-4 flex gap-2 items-end">
            <ImgButton
              src={"https://arweave.net/fCgsiCsv1ZNCSljaXAtqIVX71EDOFbU5blXGjjkLj_k"}
              onClick={() => {
                setChatOpen(true);
              }}
              alt={"Chat"}
            />
          </div>
        </>
      )}

      {openBag && (
        <div className="absolute z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <RestAreaBag onClose={() => setOpenBag(false)} />
        </div>
      )}

      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={RestAreaImages[current_spot as keyof typeof RestAreaImages]} alt="Rest Area Background" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}
