import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ConnectButton from "@/components/wallet/ConnectButton";
import React, { useEffect, useMemo, useState } from "react";
import DUMDUM_ASSET_IDS from "@/lib/DumDumAssetIds";
import { useAppStore } from "@/store/useAppStore";

import DumDumPlainImage from "@/assets/dumdumz_plain.png";
import ImgButton from "@/components/ui/imgButton";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/components/wallet/hooks";
import { useGameStore } from "@/store/useGameStore";

export default function App() {
  const { walletAddressID, profileLoading, getGameProfiles, gameProfiles } = useAppStore();
  useProfile();

  useEffect(() => {
    console.log("Hello world!");
    const handleWalletLoaded = () => {
      console.log(`You are using the ${window.arweaveWallet.walletName} wallet.`);
      console.log(`Wallet version is ${window.arweaveWallet.walletVersion}`);
    };
    addEventListener("arweaveWalletLoaded", handleWalletLoaded);
    return () => removeEventListener("arweaveWalletLoaded", handleWalletLoaded);
  }, []);

  useEffect(() => {
    if (walletAddressID) {
      getGameProfiles();
    }
  }, [walletAddressID]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video muted autoPlay loop className="absolute top-0 left-0 min-w-full min-h-full object-cover z-0">
        <source src={"https://arweave.net/VZ1nRp2_RZz99f70rR8irRfIxmP9FLp0pqz8Zml8chw"} type="video/mp4" />
      </video>
      <div className="relative z-10 h-full w-full">
        {!walletAddressID && (
          <div className="absolute top-4 right-4">
            <ConnectButton />
          </div>
        )}
        {walletAddressID && <LoginForm />}
      </div>
    </div>
  );
  {
    /* {walletAddressID ? profileLoading ? <p>Fetching your profile...</p> : <RegistrationForm /> : <p>Connect to see your profile</p>}
      {gameProfiles.length > 0 && (
        <div>
          <p>Found existing game profiles:</p>
          {gameProfiles.map((profile) => (
            <div className="flex flex-col items-center justify-center">
              <p>Name: {profile.name}</p>
              <p>NFT: {profile.nft_address}</p>
              <Button onClick={() => setUser(profile)}>Continue</Button>
            </div>
          ))}
        </div>
      )} */
  }
}

function LoginForm() {
  const [selectedOption, setSelectedOption] = useState<{ edition: number; Id: string; existingProfile: boolean } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const assets = useAppStore((state) => state.assets);
  const profile = useAppStore((state) => state.profile);
  const profileLoading = useAppStore((state) => state.profileLoading);
  const gameProfiles = useAppStore((state) => state.gameProfiles);
  const setUser = useGameStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  async function handleRegister() {
    setLoading(true);
    if (selectedOption?.existingProfile) {
      const gameProfile = gameProfiles.find((profile) => profile.nft_address === selectedOption.Id);
      if (!gameProfile) {
        console.error("Game profile not found");
        alert("Game profile not found");
        return;
      }
      await setUser(gameProfile);
    } else {
      await useGameStore.getState().registerNewUser(name, selectedOption?.Id);
    }
    setLoading(false);
  }
  const dumdumAssets = useMemo(
    () =>
      assets
        .filter((asset) => DUMDUM_ASSET_IDS.find((id) => id.id === asset.Id))
        .map((asset) => ({
          ...asset,
          edition: DUMDUM_ASSET_IDS.find((id) => id.id === asset.Id)?.edition,
          existingProfile: gameProfiles.find((profile) => profile.nft_address === asset.Id),
        })),
    [assets]
  );

  useEffect(() => {
    if (profile) setName(profile?.UserName || "");
  }, [profile]);

  useEffect(() => {
    if (profileLoading) return;
    if (dumdumAssets.length > 0) {
      // find the first asset that has an existing profile
      const existingAsset = dumdumAssets.find((asset) => asset.existingProfile);
      setSelectedOption(existingAsset ?? (dumdumAssets[0] as any));
    }
  }, [profileLoading, dumdumAssets]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  console.log("profileLoading", profileLoading);

  const FormData = () => {
    return (
      <form className="space-y-4 w-full m-16 flex flex-col gap-4 items-center">
        <div>
          <div className="relative flex gap-2 items-center">
            <label htmlFor="username" className="text-black font-semibold w-16 text-right">
              Name:{" "}
            </label>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              className="h-[37px] w-[153px] bg-no-repeat bg-left border-none focus-visible:ring-0"
              style={{
                width: "calc(153px * 1.3)",
                height: "calc(37px * 1.3)",
                backgroundImage: "url('https://arweave.net/kvrXn-DDzS5kypnpyPP_0OcbRv1I1UeZsZfRjWzDAgY')",
                backgroundSize: "100% 100%",
              }}
            />
          </div>
          <br className="m-8" />
          <div className="relative flex gap-2 items-center">
            <label htmlFor="select-option" className="text-black font-semibold w-16 text-right">
              NFT:
            </label>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <div className="relative flex justify-start gap-3">
                  <Input
                    type="text"
                    value={selectedOption?.edition ? "#" + selectedOption.edition : ""}
                    placeholder="Select an option"
                    readOnly
                    className="h-[37px] w-[153px] bg-no-repeat bg-left border-none focus-visible:ring-0 cursor-pointer"
                    style={{
                      width: "calc(153px * 1.3)",
                      height: "calc(37px * 1.3)",
                      backgroundImage: "url('https://arweave.net/kvrXn-DDzS5kypnpyPP_0OcbRv1I1UeZsZfRjWzDAgY')",
                      backgroundSize: "100% 100%",
                    }}
                  />
                  <button type="button" className="">
                    <img src="https://arweave.net/tzswubwQVSKwp6L5BZwhjdEnMk_ECBqiWCFOFvKxSuY" alt="Arrow" className="w-4 h-4" />
                  </button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="py-1">
                  {dumdumAssets.map((option) => (
                    <div key={option.Id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect(option)}>
                      <img src={`https://arweave.net/${option.Id}`} alt="NFT Preview" className="w-10 h-10 object-contain" />
                      {option.edition}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <img src={selectedOption?.Id ? `https://arweave.net/${selectedOption.Id}` : DumDumPlainImage} alt="NFT Preview" className="w-32 h-32 object-contain" />

        <div className="flex flex-col gap-2 justify-center items-center">
          {selectedOption?.existingProfile ? <p>Using existing profile</p> : <p>Registering new profile...</p>}
          <ImgButton
            disabled={loading}
            src="https://arweave.net/E7Gxj1lmYcYJ1iJfCIPAtx_MNAlaxVtX635pNYSNAqg"
            alt="Enter Dumverse"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Enter Dumverse");
              handleRegister();
            }}
          />
        </div>
      </form>
    );
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        className="w-[32rem] h-[32rem] bg-contain bg-center bg-no-repeat flex justify-center items-center"
        style={{ backgroundImage: "url('https://arweave.net/DXvJcyExlsRgwuQl5qbLdRs7rBfYCj9o4x3B-CqpmUk')" }}
      >
        {profileLoading ? <p>Loading...</p> : <FormData />}
      </div>
    </div>
  );
}
