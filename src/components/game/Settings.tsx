import ImgButton from "../ui/imgButton";
import VolumeSlider from "./VolumeSlider";
import audioManager from "../../utils/audioManager";
import { useEffect, useState } from "react";

export default function Settings({ setIsSettingsOpen }: { setIsSettingsOpen: (value: boolean) => void }) {
  const [sfxVolume, setSfxVolume] = useState(audioManager.getSFXVolume());
  const [musicVolume, setMusicVolume] = useState(audioManager.getMusicVolume());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${882 * 1}px`,
            height: "600px",
            borderRadius: "20px",
            background: "white"
          }}
        >
          {/* Quest book background image */}
          {/* <img className="absolute inset-0 w-full h-full object-contain" src="https://arweave.net/PJAc8W9UEoqaYRbv0iuQ7AO35sLRQmzRhcpcxmMQhIY" alt="Settings" /> */}

          {/* Close button */}
          <ImgButton
            src="https://arweave.net/1r7IwcP8t-Cj3nZBbR8cPYVRNcIkglKW6IMf2ka4TYo"
            alt="Close Settings"
            className="absolute top-[3%] right-[3%] z-10 w-[32px] h-[32px]"
            onClick={() => setIsSettingsOpen(false)}
          />

          <div className="flex flex-col mt-24 absolute text-center w-full">
            <h1 className="text-black text-7xl font-bold mb-16">
              Volume
            </h1>
            <VolumeSlider 
              title="SFX"
              initialVolume={sfxVolume}
              onChange={(volume) => {
                setSfxVolume(volume);
                audioManager.setSFXVolume(volume);
              }}
              className="mx-auto"
            />
            <div className="my-8"></div>
            <VolumeSlider 
              title="Music"
              initialVolume={musicVolume}
              onChange={(volume) => {
                setMusicVolume(volume);
                audioManager.setMusicVolume(volume);
              }}
              className="mx-auto"
            />

            <ImgButton 
              src="https://arweave.net/N0HMTFZFf0oMnCKtjkzXPGlGCaIKcxNqjGtpht-YLI4"
              alt="Close Settings"
              className="w-[250px] mx-auto mt-16"
              onClick={() => setIsSettingsOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
