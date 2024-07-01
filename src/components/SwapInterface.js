import React, { useState } from 'react';
import TokenSelector from './TokenSelector';

const SwapInterface = () => {
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');

  const tokens = [
    { address: 'address1', symbol: 'SOL' },
    { address: 'address2', symbol: 'USDC' },
    // Добавьте другие токены по мере необходимости
  ];

  const handleSwap = () => {
    // Здесь будет логика свапа
    console.log(`Swap ${amount} ${fromToken} to ${toToken}`);
  };

  return (
    <div>
      <h2>Swap Tokens</h2>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <TokenSelector
          tokens={tokens}
          selectedToken={fromToken}
          onSelect={setFromToken}
        />
      </div>
      <div>
        <TokenSelector
          tokens={tokens}
          selectedToken={toToken}
          onSelect={setToToken}
        />
      </div>
      <button onClick={handleSwap}>Swap</button>
    </div>
  );
};

export default SwapInterface;
