import ImgButton from "@/components/ui/imgButton";
import { useGameStore } from "@/store/useGameStore";

const RestAreaImages = {
  8: "https://arweave.net/F6Xd8uMyN78dh2Nrd9gSVCD0sEPY3BsAgd1PWJCyn4Q",
};

export default function RestArea() {
  const current_spot = 8; //useGameStore((state) => state.user!.current_spot);

  const onExit = () => {
    console.log("Exit");
  };

  return (
    <div className="h-screen" style={{ backgroundColor: "#EFECD5" }}>
      <div className="z-10 absolute bottom-4 left-4">
        <ImgButton src={"https://arweave.net/yzWJYKvAcgvbbH9SHJle6rgrPlE6Wsnjxwh20-w7cVQ"} onClick={onExit} alt={"Exit Bank Vault"} />
      </div>

      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <img src={RestAreaImages[current_spot]} alt="Rest Area Background" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}
