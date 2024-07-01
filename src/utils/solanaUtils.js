import { Connection, PublicKey } from '@solana/web3.js';
import { Market } from '@project-serum/serum';

const SOLANA_NETWORK = 'devnet'; // или 'mainnet-beta' для основной сети
const connection = new Connection(SOLANA_NETWORK);

export const getMarket = async (marketAddress) => {
  const market = await Market.load(connection, new PublicKey(marketAddress), {}, new PublicKey('srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX'));
  return market;
};

// Добавьте другие функции для работы с Solana по мере необходимости
