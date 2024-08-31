import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

export default function ConnectButton() {
  const { setWalletAddressID, walletAddressID, setProfile, setAssets } = useAppStore();
  return (
    <Button
      onClick={async () => {
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
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {walletAddressID ? "Disconnect from " + walletAddressID : "Connect"}
    </Button>
  );
}
