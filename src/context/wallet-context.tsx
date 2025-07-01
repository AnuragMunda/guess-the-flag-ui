'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
    isConnected: boolean;
    walletAddress: string | null;
    vaultBalance: number;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    deposit: (amount: number) => Promise<void>;
    withdraw: (amount: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [vaultBalance, setVaultBalance] = useState(0);

    const connectWallet = async () => {
        // Simulate wallet connection
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsConnected(true);
        setWalletAddress('0x1234...5678');
        console.log('Wallet connected');
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setWalletAddress(null);
        console.log('Wallet disconnected');
    };

    const deposit = async (amount: number) => {
        if (!isConnected) throw new Error('Wallet not connected');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVaultBalance(prev => prev + amount);
        console.log(`Deposited ${amount} $GOR`);
    };

    const withdraw = async (amount: number) => {
        if (!isConnected) throw new Error('Wallet not connected');
        if (amount > vaultBalance) throw new Error('Insufficient balance');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVaultBalance(prev => prev - amount);
        console.log(`Withdrew ${amount} $GOR`);
    };

    return (
        <WalletContext.Provider value={{
            isConnected,
            walletAddress,
            vaultBalance,
            connectWallet,
            disconnectWallet,
            deposit,
            withdraw
        }}>
            {children}
        </WalletContext.Provider>
    );
};
