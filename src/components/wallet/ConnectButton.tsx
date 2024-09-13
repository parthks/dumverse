import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import ImgButton from "../ui/imgButton";

export default function ConnectButton({ className, onClickAction }: { className?: string; onClickAction?: () => void }) {
  const { setWalletAddressID, walletAddressID, setProfile, setAssets } = useAppStore();
  if (walletAddressID) return <div>Connected</div>;
  return (
    <ImgButton
      src={"https://arweave.net/3Bvp1vK2_SRYeeA2SCVxFip_98QqCt8lpdBacII0wMg"}
      alt="Connect with AOConnect Wallet"
      className={className}
      onClick={async () => {
        onClickAction?.();
        if (walletAddressID) {
          // disconnect from the extension
          await window.arweaveWallet.disconnect();
          setWalletAddressID(null);
          setProfile(null);
          setAssets([]);
          return;
        }
        // connect to the extension
        await window.arweaveWallet.connect(
          // request permissions to read the active address
          ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH"],
          // provide some extra info for our app
          {
            name: "Super Cool App",
            logo: "https://arweave.net/jAvd7Z1CBd8gVF2D6ESj7SMCCUYxDX_z3vpp5aHdaYk",
          }
        );
        const userAddress = await window.arweaveWallet.getActiveAddress();
        setWalletAddressID(userAddress);
        console.log(`Connected to ${userAddress}`);
      }}
    />
  );
}
