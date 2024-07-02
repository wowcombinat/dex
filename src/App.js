import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import './App.css';

// Расширенный список токенов (50 популярных токенов на Solana)
const tokenList = [
  { symbol: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { symbol: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  { symbol: 'RAY', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
  { symbol: 'SRM', address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt' },
  { symbol: 'MNGO', address: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac' },
  { symbol: 'ORCA', address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE' },
  { symbol: 'STEP', address: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT' },
  { symbol: 'SAMO', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU' },
  { symbol: 'FIDA', address: 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp' },
  { symbol: 'COPE', address: '8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh' },
  // Добавьте еще 40 токенов здесь
];

function App() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken, setToToken] = useState(tokenList[1]);
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [jupiter, setJupiter] = useState(null);

  useEffect(() => {
    const initJupiter = async () => {
      const jupiterInstance = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: publicKey,
      });
      setJupiter(jupiterInstance);
    };

    if (connected && publicKey) {
      initJupiter();
    }
  }, [connection, publicKey, connected]);

  useEffect(() => {
    const getEstimate = async () => {
      if (jupiter && amount) {
        try {
          const routes = await jupiter.computeRoutes({
            inputMint: new PublicKey(fromToken.address),
            outputMint: new PublicKey(toToken.address),
            amount: amount * 10 ** 9, // предполагаем 9 десятичных знаков
            slippageBps: 50, // 0.5% slippage
          });

          if (routes.routesInfos.length > 0) {
            setEstimatedAmount(routes.routesInfos[0].outAmount / 10 ** 9);
          }
        } catch (error) {
          console.error('Failed to get estimate:', error);
        }
      }
    };

    getEstimate();
  }, [jupiter, fromToken, toToken, amount]);

  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !jupiter) return;

    try {
      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(fromToken.address),
        outputMint: new PublicKey(toToken.address),
        amount: amount * 10 ** 9,
        slippageBps: 50,
      });

      const { transactions } = await jupiter.exchange({
        routeInfo: routes.routesInfos[0],
      });

      const txid = await transactions.execute();
      console.log(`Swapped ${amount} ${fromToken.symbol} to ${estimatedAmount} ${toToken.symbol}. Txid: ${txid}`);
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const addCustomToken = () => {
    if (customToken && !tokenList.some(token => token.address === customToken)) {
      const newToken = { symbol: 'Custom', address: customToken };
      tokenList.push(newToken);
      setFromToken(newToken);
      setCustomToken('');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Solana DEX Swap</h1>
        {connected ? (
          <button className="wallet-button" onClick={() => {}}>Change Wallet</button>
        ) : (
          <WalletMultiButton className="wallet-button">Connect Wallet</WalletMultiButton>
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
          <input type="text" value={estimatedAmount} readOnly />
          <select 
            value={toToken.symbol} 
            onChange={(e) => setToToken(tokenList.find(t => t.symbol === e.target.value))}
          >
            {tokenList.map(token => (
              <option key={token.address} value={token.symbol}>{token.symbol}</option>
            ))}
          </select>
        </div>
        <button className="swap-button main" onClick={handleSwap} disabled={!connected}>
          Swap
        </button>
        <div className="custom-token">
          <input 
            type="text" 
            value={customToken} 
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Custom token address"
          />
          <button onClick={addCustomToken}>Add Token</button>
        </div>
      </main>
    </div>
  );
}

export default App;
