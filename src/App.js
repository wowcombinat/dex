import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import './App.css';

const tokenList = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { symbol: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
  { symbol: 'SRM', address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt' },
  // Добавьте другие токены здесь
];

function App() {
  const { publicKey, signTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken, setToToken] = useState(tokenList[1]);
  const [amount, setAmount] = useState('');

  const handleSwap = async () => {
    if (!publicKey || !signTransaction) return;

    try {
      // Здесь должна быть реальная логика свапа
      // Это просто пример, и он не будет работать без дополнительной настройки
      const fromPublicKey = new PublicKey(fromToken.address);
      const toPublicKey = new PublicKey(toToken.address);

      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromPublicKey,
          toPublicKey,
          publicKey,
          [],
          amount * 10 ** 9 // предполагаем 9 десятичных знаков
        )
      );

      const signedTransaction = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      console.log(`Swapped ${amount} ${fromToken.symbol} to ${toToken.symbol}`);
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Solana DEX Swap</h1>
        {publicKey ? (
          <button className="wallet-button" onClick={disconnect}>Disconnect</button>
        ) : (
          <WalletMultiButton className="wallet-button" />
        )}
      </header>
      <main className="swap-container">
        <div className="input-container">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <select 
            value={fromToken.symbol} 
            onChange={(e) => setFromToken(tokenList.find(t => t.symbol === e.target.value))}
          >
            {tokenList.map(token => (
              <option key={token.address} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <button className="swap-button" onClick={() => {
          const temp = fromToken;
          setFromToken(toToken);
          setToToken(temp);
        }}>↑↓</button>
        <div className="input-container">
          <input type="text" value={(amount * 1.5).toFixed(2)} readOnly />
          <select 
            value={toToken.symbol} 
            onChange={(e) => setToToken(tokenList.find(t => t.symbol === e.target.value))}
          >
            {tokenList.map(token => (
              <option key={token.address} value={token.symbol}>{token.symbol}</option>
            ))}
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
