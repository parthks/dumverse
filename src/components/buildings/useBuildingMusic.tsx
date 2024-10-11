import { SOUNDS } from "@/lib/constants";
import { useEffect } from "react";

export default function useBuildingMusic({ getBuildingData }: { getBuildingData: () => Promise<void> }) {
  const shopEnterAudio = new Audio(SOUNDS.BUILDING_ENTER);
  const backgroundAudio = new Audio(SOUNDS.TOWN_AUDIO_IN_BUILDING);

  useEffect(() => {
    const getShopAndPlayAudio = async () => {
      await getBuildingData();
      shopEnterAudio.play();
    };
    getShopAndPlayAudio();
    backgroundAudio.loop = true;
    backgroundAudio.play();
    return () => {
      backgroundAudio.pause();
    };
  }, []);
}
