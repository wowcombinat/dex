import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletConnection = () => {
  const { wallet } = useWallet();

  return (
    <div>
      <WalletMultiButton />
      {wallet && <p>Connected: {wallet.publicKey.toString()}</p>}
    </div>
  );
};

export default WalletConnection;
