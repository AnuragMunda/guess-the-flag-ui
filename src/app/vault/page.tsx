'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowDown, ArrowUp, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import WalletConnectButton from "@/components/wallet-connect-button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Vault = () => {
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const router = useRouter();

    const handleDeposit = async () => {
        if (!connection || !publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            // await deposit(amount);
            setDepositAmount('');
            alert(`Successfully deposited ${amount} $GOR`);
        } catch (error) {
            alert('Deposit failed');
        }
        setIsLoading(false);
    };

    const handleWithdraw = async () => {
        if (!connection || !publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        // if (amount > vaultBalance) {
        //     alert('Insufficient vault balance');
        //     return;
        // }

        setIsLoading(true);
        // try {
        //     await withdraw(amount);
        //     setWithdrawAmount('');
        //     alert(`Successfully withdrew ${amount} $GOR`);
        // } catch (error) {
        //     alert('Withdrawal failed');
        // }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.replace('/')}
                            className="text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Coins className="w-8 h-8 text-yellow-500" />
                            <h1 className="text-3xl font-bold text-white">Vault</h1>
                        </div>
                    </div>
                    <WalletConnectButton />
                </div>

                {/* Vault Balance */}
                <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-400 mb-2">
                                {'--'}
                            </div>
                            <div className="text-slate-400">Your Vault Balance</div>
                        </div>
                    </CardContent>
                </Card>

                {!connection ? (
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                        <CardContent className="pt-6 text-center">
                            <Coins className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                            <p className="text-slate-400 mb-6">
                                You need to connect your wallet to deposit or withdraw $GOR tokens
                            </p>
                            <WalletConnectButton />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Deposit */}
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowDown className="w-5 h-5 text-emerald-400" />
                                    Deposit
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Amount ($GOR)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="bg-slate-800/50 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {[1, 5, 10, 25].map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDepositAmount(amount.toString())}
                                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                        >
                                            {amount}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleDeposit}
                                    disabled={isLoading || !depositAmount}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {isLoading ? 'Processing...' : 'Deposit'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Withdraw */}
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowUp className="w-5 h-5 text-red-400" />
                                    Withdraw
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Amount ($GOR)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        className="bg-slate-800/50 border-slate-600 text-white"
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setWithdrawAmount('0')}
                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                >
                                    Max:  $GOR
                                </Button>

                                <Button
                                    onClick={handleWithdraw}
                                    disabled={isLoading || !withdrawAmount}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    {isLoading ? 'Processing...' : 'Withdraw'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vault;
