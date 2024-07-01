import React from 'react';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import WalletConnection from './components/WalletConnection';
import SwapInterface from './components/SwapInterface';

require('@solana/wallet-adapter-react-ui/styles.css');

const App = () => {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <div className="App">
          <h1>Solana DEX Swap</h1>
          <WalletConnection />
          <SwapInterface />
        </div>
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default App;
