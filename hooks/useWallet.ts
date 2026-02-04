import { useState, useCallback, useEffect } from 'react';

// This interface helps ensure that the 'window' object can have an 'ethereum' property.
interface Window {
  ethereum?: any;
}
declare const window: Window;

export const useWallet = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);

  useEffect(() => {
    // Set provider status once on mount
    const provider = typeof window !== 'undefined' && !!window.ethereum;
    setHasProvider(provider);

    if (provider) {
        checkIfWalletIsConnected();
    } else {
        setLoading(false);
    }
  }, []); // Run only once

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) return; // Should not happen if hasProvider is true

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        setConnectedAccount(accounts[0]);
      }
    } catch (err) {
      setError("Failed to check for connected wallet.");
      console.error(err);
    } finally {
        setLoading(false);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (!hasProvider) {
        setError("MetaMask not found. Please install the browser extension.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setConnectedAccount(accounts[0]);
    } catch (err: any) {
        if (err.code === 4001) {
            setError("Connection rejected. Please approve the connection in MetaMask.");
        } else {
            setError("Failed to connect wallet.");
        }
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [hasProvider]);

  const disconnectWallet = useCallback(() => {
    setConnectedAccount(null);
  }, []);
  
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum?.on) {
        const handleAccountsChanged = (accounts: string[]) => {
            setConnectedAccount(accounts.length > 0 ? accounts[0] : null);
        };
        ethereum.on('accountsChanged', handleAccountsChanged);
        return () => {
            if (ethereum.removeListener) {
              ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        };
    }
  }, []);

  return { connectedAccount, loading, error, hasProvider, connectWallet, disconnectWallet };
};