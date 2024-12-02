import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import GifComponent from "@/components/Dialogue/Dialogue";
import { BUILDING_IMAGES } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

export default function HallOfFame() {
  useBuildingMusic({});

// -----------------------------------------------------------------

  return (
    <div className="h-screen relative">
      <div className="absolute bottom-[4vh] left-[4vw] z-10">
      <ExistToTownButton />
      </div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="absolute inset-0">
        <img src={"https://arweave.net/JGuoKPoYzOF3DJnEV4z7JURzu6as2Z_L99_a0DD5xZw"} alt="Hall of Fame Background" className="w-full h-full object-cover" />
      </div>

      <img
        src="https://arweave.net/3VaXHnefkV1QW875cuPZUkObeUw1OxXHNm_f9oSJz9k"
        alt="Poles"
        className="absolute"
        style={{ ...calculatePositionAndSize(50, 70, 85), transform: "translate(-50%, -50%)" }}
      />

      <div className="absolute w-full z-10 flex flex-col items-center justify-end" style={{
          width: "35vw",
          height: "30vh",
          bottom: "0vh",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
        {/* Shopkeeper and Table Group */}
        <div className="relative w-full flex flex-col items-center">
          {/* Shopkeeper */}
          <div
            className="relative "
            style={{
              maxWidth: "15vw",
              width: "15vw",
              aspectRatio: "1", // Ensures square dimensions
              top: "2vh",
            }}
          >
            <RiveAnimation url={BUILDING_IMAGES.VISITOR_CENTER_HALL_FAME_DUMDUM} />
          </div>
          <GifComponent className=" absolute h-[20vh] translate-x-[12vw] translate-y-[-5vh] " />

          {/* Shop Table */}
          <img src="https://arweave.net/TO0hx4HWRPaDyGyxaXbEsMAuyHlxo_cHQxO_rByNhQ4" alt="Shop Table" className=" w-full relative " style={{ height: "auto" }} />
        </div>
      </div>

      {/* <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 30), transform: "translate(-50%, -100%)" }}>
        <img src="https://arweave.net/g2i08NVCRWFbwGflpf4S7b6M2LwRwScnEK6N6chVCMM" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />
        <img
          src={BUILDING_IMAGES.GREEN_SHOPKEEPER}
          alt="Shop Keeper"
          className="absolute"
          style={{ left: "50%", width: "30%", height: "auto", transform: "translate(-50%, -202%)" }}
        />
      </div> */}

      <Frame index={1} />
      <Frame index={2} />
      <Frame index={3} />
    </div>
  );
}

function Frame({ index }: { index: number }) {
  const user = useGameStore((state) => state.user);

  // Calculate position based on index
  const topPosition = index === 1 ? "5%" : index === 2 ? "0%" : "5%";
  const leftPosition = index === 1 ? "2%" : index === 2 ? "50%" : "98%";
  const translateX = index === 1 ? "0" : index === 2 ? "-50%" : "-100%";

  return (
    <div className={`absolute top-[${topPosition}] `} style={{  width: "22vw",aspectRatio: "768 / 899", transform: `translateX(${translateX})`, left: leftPosition }}>
      {/* Frame background */}
      <img src="https://arweave.net/6swKthAqLMd_BmWScSz7Tm6en5IyKnJRa4bvQhlIMEQ" alt="Frame" className="absolute inset-0 w-full h-full z-10 object-cover" />

      {/* Container for the image inside the frame */}
      <div className="absolute top-[17%] left-[26%] w-[53%] h-[50%]">
        <img src={user?.nft_address ? `https://arweave.net/${user.nft_address}` : ""} alt="Content Image" className="w-full h-[120%] object-cover" />
      </div>

      {/* Container for the text in the bottom box */}
      <div
        className="absolute z-10 flex flex-col items-center justify-start text-center"
        style={{
          bottom: "12%",
          left: "50%",
          width: "40%",
          height: "12%",
          transform: "translateX(-50%)",
        }}
      >
        <p className="text-white text-xl font-bold">Username</p>
        <p className="text-white text-xl font-bold">1st in _______</p>
      </div>
    </div>
  );
}
