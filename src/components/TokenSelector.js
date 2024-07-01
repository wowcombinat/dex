import React from 'react';

const TokenSelector = ({ tokens, selectedToken, onSelect }) => {
  return (
    <select value={selectedToken} onChange={(e) => onSelect(e.target.value)}>
      {tokens.map((token) => (
        <option key={token.address} value={token.address}>
          {token.symbol}
        </option>
      ))}
    </select>
  );
};

export default TokenSelector;
