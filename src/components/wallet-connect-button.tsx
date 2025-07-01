
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { Wallet } from "lucide-react";

const WalletConnectButton = () => {
    const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();

    if (isConnected) {
        return (
            <Button
                variant="outline"
                onClick={disconnectWallet}
                className="bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30"
            >
                <Wallet className="w-4 h-4 mr-2" />
                {walletAddress}
            </Button>
        );
    }

    return (
        <Button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700"
        >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
        </Button>
    );
};

export default WalletConnectButton;
