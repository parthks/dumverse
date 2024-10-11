import { sleep } from "@/lib/time";
import ImgButton from "../ui/imgButton";
import { SOUNDS } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";

export default function ExistToTownButton() {
  const shopEnterAudio = new Audio(SOUNDS.BUILDING_ENTER);
  const goDirectlyToTownPage = useGameStore((state) => state.goDirectlyToTownPage);
  return (
    <ImgButton
      className="h-12"
      src={"https://arweave.net/ntMzNaOgLJmd2PVTzgkczOndx5xPP6MlHRze0GwWgWk"}
      onClick={async () => {
        shopEnterAudio.play();
        await sleep(750);
        goDirectlyToTownPage();
      }}
      alt={"Return to Town"}
    />
  );
}
