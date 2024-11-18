import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { SOUNDS } from "@/lib/constants";
import audioManager from "@/utils/audioManager";
import { useEffect, useRef } from "react";

export default function useBuildingMusic({ getBuildingData }: { getBuildingData?: () => Promise<void> }) {
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  useBackgroundMusic(SOUNDS.TOWN_AUDIO_IN_BUILDING);

  useEffect(() => {
    const getShopAndPlayAudio = async () => {
      if (getBuildingData) await getBuildingData();
      audioManager.playSFX(SOUNDS.BUILDING_ENTER);
    };
    
    getShopAndPlayAudio();
    
    // Start background music
    // audioRef.current = audioManager.playMusic(SOUNDS.TOWN_AUDIO_IN_BUILDING);

    // Cleanup function
    // return () => {
    //   audioManager.stopMusic(audioRef.current);
    //   audioRef.current = null;
    // };
  }, []);
}
