import { useEffect, useState } from "react";
import ConnectButton from "./components/wallet/ConnectButton";
import useProfile from "./components/wallet/useProfile";
import { useAppStore } from "./store/useAppStore";
import { DUMDUM_ASSET_IDS } from "@/lib/constants";

export default function App() {
  const profileId = useProfile();
  const { assets, profile, walletAddressID } = useAppStore();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Hello world!");
    addEventListener("arweaveWalletLoaded", () => {
      console.log(`You are using the ${window.arweaveWallet.walletName} wallet.`);
      console.log(`Wallet version is ${window.arweaveWallet.walletVersion}`);
    });
  });

  const dumdumAssets = assets.filter((asset) => DUMDUM_ASSET_IDS.includes(asset.Id));

  const ProfileDetails = (
    <>
      {profile ? <p>Your profile ID is {profileId}</p> : null}

      <h2 className="text-2xl font-bold">Profileee</h2>
      {profile ? (
        <>
          <p>Username: {profile.UserName}</p>
          <p>Display Name: {profile.DisplayName}</p>
          <p>Description: {profile.Description}</p>
          <p>Profile Image: {profile.ProfileImage && <img className="w-32 h-32 rounded-full" src={profile.ProfileImage} alt="Profile" />}</p>
          <p>Cover Image: {profile.CoverImage && <img className="w-32 h-32" src={profile.CoverImage} alt="Profile" />}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}

      <h2 className="text-2xl font-bold">Your DumDum Assets</h2>
      <ul className="grid grid-cols-2 gap-4">
        {dumdumAssets.map((asset) => (
          <li
            key={asset.Id}
            className={`cursor-pointer transition-all duration-300 ${selectedAssetId === asset.Id ? "border-4 border-blue-500" : "hover:border-4 hover:border-gray-300"}`}
            onClick={() => setSelectedAssetId(asset.Id)}
          >
            <img alt="dum dum" className="w-96 h-96 object-cover" src={`https://arweave.net/${asset.Id}`} />
          </li>
        ))}
      </ul>
      {selectedAssetId && <p className="mt-4">Selected Asset ID: {selectedAssetId}</p>}
    </>
  );

  return (
    <>
      <h1 className="text-3xl font-bold">Hello world!</h1>
      <ConnectButton />
      {walletAddressID ? ProfileDetails : <p>Connect to see your profile</p>}
    </>
  );
}
