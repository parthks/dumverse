import { useEffect, useRef } from 'react';
import audioManager from '../utils/audioManager';

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Start playing the background music
    audioRef.current = audioManager.playMusic(src);

    // Cleanup when component unmounts
    return () => {
      audioManager.stopMusic(audioRef.current);
      audioRef.current = null;
    };
  }, [src]); // Only re-run if the src changes

  return audioRef.current;
}
