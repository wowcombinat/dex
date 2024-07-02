import React, { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { JupiterProvider, useJupiter } from '@jup-ag/react-hook';
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

function SwapComponent() {
  const { connected, publicKey } = useWallet();
  const [fromToken, setFromToken] = useState(tokenList[0]);
  const [toToken, setToToken] = useState(tokenList[1]);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [customToken, setCustomToken] = useState('');

  const { exchange, routes, loading, error } = useJupiter({
    amount: parseFloat(amount) * (10 ** 9), // assuming 9 decimals
    inputMint: new PublicKey(fromToken.address),
    outputMint: new PublicKey(toToken.address),
    slippage,
    debounceTime: 250,
  });

  const handleSwap = async () => {
    if (!connected || !publicKey || !routes) return;

    try {
      const { txid } = await exchange();
      console.log('Swap executed successfully. Transaction ID:', txid);
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
    <div className="swap-container">
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
        <input type="text" value={routes && routes[0] ? routes[0].outAmount : ''} readOnly />
        <select 
          value={toToken.symbol} 
          onChange={(e) => setToToken(tokenList.find(t => t.symbol === e.target.value))}
        >
          {tokenList.map(token => (
            <option key={token.address} value={token.symbol}>{token.symbol}</option>
          ))}
        </select>
      </div>
      <button className="swap-button main" onClick={handleSwap} disabled={!connected || loading}>
        {loading ? 'Loading...' : 'Swap'}
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
      {error && <div className="error">{error.toString()}</div>}
    </div>
  );
}

function App() {
  const { connection } = useConnection();

  return (
    <JupiterProvider
      connection={connection}
      cluster="mainnet-beta"
      userPublicKey={null}
    >
      <div className="app">
        <header className="app-header">
          <h1>Solana DEX Swap</h1>
          <WalletMultiButton className="wallet-button" />
        </header>
        <SwapComponent />
      </div>
    </JupiterProvider>
  );
}

export default App;
