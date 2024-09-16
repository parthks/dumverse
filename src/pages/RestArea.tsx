import { InventoryBag } from "@/components/game/InventoryBag";
import RestAreaBag from "@/components/game/RestAreaBag";
import ImgButton from "@/components/ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { useState } from "react";

// TODO: add town rest image
const RestAreaImages = {
  0: "https://arweave.net/5nf-hjMD9CNJvVsyaR2N2JMhRgprTNrTXKJXTjXtMUw",
  9: "https://arweave.net/F6Xd8uMyN78dh2Nrd9gSVCD0sEPY3BsAgd1PWJCyn4Q",
  18: "https://arweave.net/wSgWaCQYk3DZbdp4Qm2fI-hGptYYaYwmDfm6ParVItQ",
  27: "https://arweave.net/_ZixwsU3FTzyH0ddVB1pqMZEq-xG3UzqAVO3HoD0LFI",
};

export default function RestArea() {
  const setGameStatePage = useGameStore((state) => state.setGameStatePage);
  const current_spot = useGameStore((state) => state.user!.current_spot);
  console.log("current_spot", current_spot);
  const [openBag, setOpenBag] = useState(false);

  const ReturnToTown = () => {
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
  };

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
      <div className="z-10 absolute top-4 right-4">
        <ReturnToTown />
      </div>
      <div className="z-10 absolute bottom-4 left-4 flex gap-2 items-end">
        <InventoryBag />
        <ImgButton src={"https://arweave.net/RJfmhCUfHuvqp2I1D9rnJmlGvax4QZb20ss1SRwvXyw"} onClick={() => setOpenBag(!openBag)} alt={"Open Bag"} />
      </div>

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
