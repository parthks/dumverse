import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import ConnectButton from "@/components/wallet/ConnectButton";
// import useProfile from "./components/wallet/useProfile";
import { useAppStore } from "@/store/useAppStore";
import DUMDUM_ASSET_IDS from "@/lib/DumDumAssetIds";
import { shallow } from "zustand/shallow";

import DumDumPlainImage from "@/assets/dumdumz_plain.png";
import { useProfile } from "@/components/wallet/hooks";
import { useGameStore } from "@/store/useGameStore";
import { Button } from "@/components/ui/button";

export default function App() {
  const { walletAddressID, profileLoading, getGameProfiles, gameProfiles } = useAppStore();
  const { setUser } = useGameStore();
  const profileId = useProfile();

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
    if (walletAddressID) getGameProfiles();
  }, [walletAddressID]);

  return (
    <>
      <ConnectButton />
      {walletAddressID ? profileLoading ? <p>Fetching your profile...</p> : <RegistrationForm /> : <p>Connect to see your profile</p>}
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
      )}
    </>
  );
}

function RegistrationForm() {
  const { assets, profile, profileId, name, setName, selectedNFT, setSelectedNFT } = useAppStore();
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    await useGameStore.getState().registerNewUser();
    setLoading(false);
  }
  const dumdumAssets = useMemo(
    () =>
      assets
        .filter((asset) => DUMDUM_ASSET_IDS.find((id) => id.id === asset.Id))
        .map((asset) => ({
          ...asset,
          edition: DUMDUM_ASSET_IDS.find((id) => id.id === asset.Id)?.edition,
        })),
    [assets]
  );

  useEffect(() => {
    setName(profile?.UserName || "");
  }, [profile]);

  useEffect(() => {
    if (dumdumAssets.length > 0) setSelectedNFT(dumdumAssets[0].Id);
  }, [dumdumAssets]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white">
      {!profileId && <p>No bazzar profile ID found</p>}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="name" className="text-lg font-semibold text-purple-700 w-16 text-right">
            Name:
          </label>
          <div className="grow">
            <div className="relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none">
                <path d="M5,2 Q2,2 2,5 L2,35 Q2,38 5,38 L295,38 Q298,38 298,35 L298,5 Q298,2 295,2 Z" fill="none" stroke="black" strokeWidth="2" />
              </svg>
              <input value={name} onChange={handleNameChange} id="name" className="w-full p-2 bg-transparent relative z-10 text-center" style={{ outline: "none" }} />
            </div>
          </div>
        </div>

        <NFTSelector selectedNFT={selectedNFT} setSelectedNFT={setSelectedNFT} dumdumAssets={dumdumAssets} />

        <button
          onClick={handleRegister}
          className="w-full py-2 px-4 rounded-full text-white font-semibold text-lg"
          style={{
            background: "linear-gradient(to right, #e0e0ff, #c8a2ff, #e0e0ff)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          {loading ? "Registering..." : "Register New User"}
        </button>
      </div>
    </div>
  );
}

function NFTSelector({ selectedNFT, setSelectedNFT, dumdumAssets }: { selectedNFT: string | null; setSelectedNFT: (nft: string | null) => void; dumdumAssets: any[] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="space-x-2 flex items-center">
        <label htmlFor="nft" className="text-lg font-semibold text-purple-700 w-16 text-right">
          NFT:
        </label>
        <div className="grow">
          {selectedNFT ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 40" preserveAspectRatio="none">
                    <path d="M5,2 Q2,2 2,5 L2,35 Q2,38 5,38 L295,38 Q298,38 298,35 L298,5 Q298,2 295,2 Z" fill="none" stroke="black" strokeWidth="2" />
                  </svg>
                  <div className="relative p-2 z-10 w-full">
                    <p className="text-purple-700 font-semibold text-center w-full">#{dumdumAssets.find((asset) => asset.Id === selectedNFT)?.edition}</p>
                    <svg className="top-2 w-8 text-black absolute -right-10" viewBox="0 0 16 10" fill="currentColor">
                      <path d="M0 0l6 10 6-10H0z" />
                    </svg>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="grid">
                  {dumdumAssets.map((option) => (
                    <button
                      key={option.Id}
                      className="text-left p-2 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedNFT(option.Id);
                        setOpen(false);
                      }}
                    >
                      {option.edition}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <p>No NFTs found</p>
          )}
        </div>
      </div>

      <div className="space-x-2 flex items-center justify-center">
        {/* <div className="min-w-16"></div> */}
        <div className="w-full h-48 bg-blue-200 rounded-lg overflow-hidden">
          <img src={selectedNFT ? `https://arweave.net/${selectedNFT}` : DumDumPlainImage} alt="NFT Preview" className="w-full h-full object-contain" />
        </div>
      </div>
    </>
  );
}
