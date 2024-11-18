import { sleep } from "@/lib/time";
import ImgButton from "../ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import audioManager from "@/utils/audioManager";

export default function ExistToTownButton() {
  const goDirectlyToTownPage = useGameStore((state) => state.goDirectlyToTownPage);
  return (
    <ImgButton
      className="h-12"
      src={"https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"}
      onClick={async () => {
        audioManager.playSFX(SOUNDS.BUILDING_ENTER);
        await sleep(750);
        goDirectlyToTownPage();
      }}
      alt={"Return to Town"}
    />
  );
}
