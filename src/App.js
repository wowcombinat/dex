import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import './App.css';

function App() {
  const { publicKey } = useWallet();
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');

  const handleSwap = () => {
    console.log(`Swapping ${amount} ${fromToken} to ${toToken}`);
    // Здесь будет логика свапа
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Solana DEX Swap</h1>
        <WalletMultiButton />
      </header>
      <main className="swap-container">
        <div className="input-container">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
            {/* Добавьте другие токены по мере необходимости */}
          </select>
        </div>
        <button className="swap-button" onClick={() => {
          setFromToken(toToken);
          setToToken(fromToken);
        }}>↑↓</button>
        <div className="input-container">
          <input type="text" value={(amount * 1.5).toFixed(2)} readOnly />
          <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
            {/* Добавьте другие токены по мере необходимости */}
          </select>
        </div>
        <button className="swap-button main" onClick={handleSwap} disabled={!publicKey}>
          Swap
        </button>
      </main>
    </div>
  );
}

export default App;
